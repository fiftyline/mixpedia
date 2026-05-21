import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import ReactECharts from "echarts-for-react";
import { MIXPEDIA, hexToRgba } from "./chartUtils";

const FONT_BODY = "DM Sans, sans-serif";

function mediaColor(i) {
  return MIXPEDIA[(i % (MIXPEDIA.length - 1)) + 1];
}

const BUDGET_COL_LABEL = {
  budget_origin: "현재",
  "budget_25%": "25%",
  "budget_50%": "50%",
  "budget_75%": "75%",
  "budget_100%": "100%",
  "budget_150%": "150%",
  "budget_200%": "200%",
};
const BUDGET_COL_ORDER = [
  "budget_origin",
  "budget_25%",
  "budget_50%",
  "budget_75%",
  "budget_100%",
  "budget_150%",
  "budget_200%",
];

function buildRescurveOption(rescurve, optcurve, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];

  const series = [];
  mediaList.forEach((media, i) => {
    const baseColor = mediaColor(i);

    const rawCurve = rescurve
      .filter((d) => d.media === media)
      .sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));

    const optRow = optcurve.find(
      (d) => d.media === media && d.budget === "budget_100%",
    );
    const optCostNum = optRow ? parseFloat(optRow.cost) : null;

    // 최적 포인트가 rescurve에 없으면 삽입 후 재정렬
    const allRows = [...rawCurve];
    if (
      optRow &&
      !rawCurve.some((d) => Math.abs(parseFloat(d.cost) - optCostNum) < 1)
    ) {
      allRows.push({
        media,
        cost: optRow.cost,
        incremental: optRow.incremental,
      });
      allRows.sort((a, b) => parseFloat(a.cost) - parseFloat(b.cost));
    }

    const curveData = allRows.map((d) => {
      const cost = parseFloat(d.cost);
      const isOpt = optCostNum !== null && Math.abs(cost - optCostNum) < 1;
      const isCur = d.media_times === 1;

      if (isOpt)
        return {
          value: [cost, d.incremental],
          symbol: "diamond",
          symbolSize: 16,
          itemStyle: { color: baseColor, borderColor: "#fff", borderWidth: 2 },
          label: {
            show: true,
            position: "top",
            formatter: "최적",
            fontFamily: FONT_BODY,
            fontSize: 10,
            fontWeight: 700,
            color: baseColor,
          },
        };
      if (isCur)
        return {
          value: [cost, d.incremental],
          symbol: "circle",
          symbolSize: 14,
          itemStyle: {
            color: "#fff",
            borderColor: baseColor,
            borderWidth: 2.5,
          },
          label: {
            show: true,
            position: "top",
            formatter: "현재",
            fontFamily: FONT_BODY,
            fontSize: 10,
            fontWeight: 600,
            color: baseColor,
          },
        };
      return { value: [cost, d.incremental], symbol: "none" };
    });

    series.push({
      name: media,
      type: "line",
      data: curveData,
      smooth: true,
      showSymbol: true,
      lineStyle: { color: baseColor, width: 2.5 },
      itemStyle: { color: baseColor },
    });
  });

  return {
    color: MIXPEDIA.slice(1),
    textStyle: { fontFamily: FONT_BODY },
    legend: {
      type: "scroll",
      selectedMode: "multiple",
      top: "top",
      data: mediaList,
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
    },
    graphic: [
      {
        type: "text",
        right: 20,
        bottom: 8,
        style: {
          text: "◆ 최적 예산    ○ 현재 예산",
          fontFamily: FONT_BODY,
          fontSize: 11,
          fill: "#8b90b0",
        },
      },
    ],
    tooltip: {
      trigger: "axis",
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (params) => {
        if (!params.length) return "";
        return params
          .map((p) => {
            const [cost, kpi] = p.value;
            return (
              `${p.marker}<span style="font-family:${FONT_BODY}"><b>${p.seriesName}</b><br/>` +
              `예산: ${parseFloat(cost).toLocaleString()}<br/>` +
              `기여 KPI: ${Math.round(kpi).toLocaleString()}</span>`
            );
          })
          .join("<br/><br/>");
      },
    },
    xAxis: {
      type: "value",
      name: "매체별 예산",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { fontFamily: FONT_BODY, fontSize: 11, color: "#8b90b0" },
      nameTextStyle: { fontFamily: FONT_BODY, color: "#4b5070" },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    yAxis: {
      type: "value",
      name: "매체 기여 KPI",
      nameGap: 100,
      nameLocation: "middle",
      min: 0,
      axisLabel: { fontFamily: FONT_BODY, fontSize: 11, color: "#8b90b0" },
      nameTextStyle: { fontFamily: FONT_BODY, color: "#4b5070" },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    grid: { left: 120, right: 20, top: 40, bottom: 40, containLabel: true },
    series,
  };
}

function buildOptimize2Option(optcurve, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const budgetList = [
    "budget_25%",
    "budget_50%",
    "budget_75%",
    "budget_100%",
    "budget_150%",
    "budget_200%",
  ];

  return {
    color: MIXPEDIA.slice(1),
    textStyle: { fontFamily: FONT_BODY },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (params) => {
        if (!params.length) return "";
        const label = params[0].axisValue;
        const total = params.reduce(
          (s, p) => s + (typeof p.value === "number" ? p.value : 0),
          0,
        );
        const items = params.map((p) => {
          const cost = typeof p.value === "number" ? p.value : 0;
          const ratio = total > 0 ? (cost / total) * 100 : 0;
          return `${p.marker} <span style="font-family:${FONT_BODY}">${p.seriesName}: ${cost.toLocaleString()} (${ratio.toFixed(2)}%)</span>`;
        });
        return `<span style="font-family:${FONT_BODY}">${label}</span><br/>${items.join("<br/>")}`;
      },
    },
    legend: {
      data: mediaList,
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
    },
    xAxis: {
      type: "category",
      data: [
        "현재 대비 25%",
        "현재 대비 50%",
        "현재 대비 75%",
        "현재 대비 100%",
        "현재 대비 150%",
        "현재 대비 200%",
      ],
      axisLabel: { fontSize: 11, fontFamily: FONT_BODY, color: "#8b90b0" },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontFamily: FONT_BODY, fontSize: 11, color: "#8b90b0" },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    grid: { left: 80, right: 20, top: 60, bottom: 40, containLabel: true },
    series: mediaList.map((media) => ({
      name: media,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: budgetList.map((b) => {
        const found = optcurve.find((d) => d.media === media && d.budget === b);
        return found ? found.cost : 0;
      }),
    })),
  };
}

function buildOptimize1Option(optcurve, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const budgetList = ["budget_origin", "budget_100%"];

  return {
    color: MIXPEDIA.slice(1),
    textStyle: { fontFamily: FONT_BODY },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (params) => {
        if (!params.length) return "";
        const label = params[0].axisValue;
        const total = params.reduce(
          (s, p) => s + (typeof p.value === "number" ? p.value : 0),
          0,
        );
        const items = params.map((p) => {
          const cost = typeof p.value === "number" ? p.value : 0;
          const ratio = total > 0 ? (cost / total) * 100 : 0;
          return `${p.marker} <span style="font-family:${FONT_BODY}">${p.seriesName}: ${cost.toLocaleString()} (${ratio.toFixed(2)}%)</span>`;
        });
        return `<span style="font-family:${FONT_BODY}">${label}</span><br/>${items.join("<br/>")}`;
      },
    },
    xAxis: {
      type: "category",
      data: ["현재 예산 비율", "현재 예산 대비\n100%"],
      axisLabel: { fontSize: 11, fontFamily: FONT_BODY, color: "#8b90b0" },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontFamily: FONT_BODY, fontSize: 11, color: "#8b90b0" },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    grid: { left: 80, right: 20, top: 20, bottom: 40, containLabel: true },
    series: mediaList.map((media) => ({
      name: media,
      type: "bar",
      stack: "total",
      emphasis: { focus: "series" },
      data: budgetList.map((b) => {
        const found = optcurve.find((d) => d.media === media && d.budget === b);
        return found ? found.cost : 0;
      }),
    })),
  };
}

export default function TabOptimize({ data }) {
  const { rescurve, optcurve, optcurveDf, optionset } = data;
  const tableRef = useRef(null);
  const gridRef = useRef(null);

  const hasCurve = rescurve?.length > 0;
  const hasOptcurve = optcurve?.length > 0;
  const hasDf = optcurveDf?.length > 0;

  useEffect(() => {
    if (!tableRef.current || !hasDf) return;

    const dfCols = BUDGET_COL_ORDER.filter((c) => c in optcurveDf[0]);

    const TOTAL_LABELS = new Set(["예산 총합", "매체 기여 KPI 총합", "ROI"]);
    const totalAttr = (_cell, row) => {
      if (TOTAL_LABELS.has(row?.cells?.[0]?.data)) {
        return {
          style:
            "background:rgba(99,102,241,0.05);border-top:2px solid rgba(99,102,241,0.3);font-weight:600;",
        };
      }
    };

    const columns = [
      {
        name: "매체 / 지표",
        id: "media",
        width: "160px",
        attributes: totalAttr,
        formatter: (v) => {
          const isBold = TOTAL_LABELS.has(v);
          return html(
            isBold
              ? `<strong style="font-family:var(--font-body);font-size:13px">${v}</strong>`
              : `<span style="font-family:var(--font-body);font-size:13px">${v}</span>`,
          );
        },
      },
      ...dfCols.map((col) => ({
        name: BUDGET_COL_LABEL[col] ?? col,
        id: col,
        width: "90px",
        attributes: totalAttr,
        formatter: (v) => {
          if (v == null) {
            return html(
              `<span style="font-family:var(--font-body);font-size:13px">-</span>`,
            );
          }
          const formatted =
            typeof v === "number"
              ? v < 1
                ? `${(v * 100).toFixed(2)}%`
                : v.toLocaleString(undefined, { maximumFractionDigits: 0 })
              : v;
          return html(
            `<span style="font-family:var(--font-body);font-size:13px">${formatted}</span>`,
          );
        },
      })),
    ];

    const tableData = optcurveDf.map((r) => {
      const row = { media: r.media };
      dfCols.forEach((c) => {
        row[c] = r[c];
      });
      return row;
    });

    gridRef.current = new Grid({
      columns,
      data: tableData,
      width: "100%",
      language: { noRecordsFound: "데이터 없음" },
    });
    gridRef.current.render(tableRef.current);
    return () => {
      gridRef.current?.destroy();
      gridRef.current = null;
    };
  }, [optcurveDf, hasDf]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Curve ── */}
      {hasCurve && hasOptcurve && (
        <div className="mmm-card">
          <div className="mmm-card-title">Curve</div>
          <ReactECharts
            option={buildRescurveOption(rescurve, optcurve, optionset)}
            style={{ height: 400 }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

      {/* ── Optimize ── */}
      {hasOptcurve && (
        <div className="mmm-card">
          <div className="mmm-card-title">Optimize</div>
          <div className="mmm-chart-sub-label">예산 배분 최적화</div>
          <div className="mmm-two-col-charts">
            <ReactECharts
              option={buildOptimize2Option(optcurve, optionset)}
              style={{ height: 400 }}
              opts={{ renderer: "svg" }}
            />
            <ReactECharts
              option={buildOptimize1Option(optcurve, optionset)}
              style={{ height: 400 }}
              opts={{ renderer: "svg" }}
            />
          </div>
          {hasDf && (
            <div
              className="gridjs-wrap"
              ref={tableRef}
              style={{ marginTop: 20 }}
            />
          )}
        </div>
      )}
      <br />
    </div>
  );
}
