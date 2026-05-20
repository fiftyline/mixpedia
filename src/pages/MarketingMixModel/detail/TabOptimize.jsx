import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import ReactECharts from "echarts-for-react";
import { ROMA, ROMA1 } from "./chartUtils";

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
  "budget_origin", "budget_25%", "budget_50%", "budget_75%",
  "budget_100%", "budget_150%", "budget_200%",
];

function buildRescurveOption(rescurve, optcurve, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];

  const series = [];
  mediaList.forEach((media, i) => {
    const baseColor = ROMA1[i % ROMA1.length];
    const mediaCurve = rescurve
      .filter((d) => d.media === media)
      .map((d) => [parseFloat(d.cost), d.incremental]);
    const currentPoint = rescurve
      .filter((d) => d.media === media && d.media_times === 1)
      .map((d) => [parseFloat(d.cost), d.incremental]);
    const optPoint = optcurve
      .filter((d) => d.media === media && d.budget === "budget_100%")
      .map((d) => [parseFloat(d.cost), d.incremental]);

    series.push(
      {
        name: media,
        type: "line",
        data: mediaCurve,
        smooth: true,
        showSymbol: false,
        itemStyle: { color: baseColor },
      },
      {
        name: `${media} 최적 예산`,
        type: "scatter",
        data: optPoint,
        symbol: "diamond",
        symbolSize: 14,
        itemStyle: { color: baseColor, borderColor: "#fff", borderWidth: 1 },
        legend: { show: false },
      },
      {
        name: `${media} 현재 예산`,
        type: "scatter",
        data: currentPoint,
        symbol: "circle",
        symbolSize: 14,
        itemStyle: { color: baseColor, borderColor: "#fff", borderWidth: 1 },
        legend: { show: false },
      },
    );
  });

  return {
    color: ROMA,
    legend: { type: "scroll", selectedMode: "multiple", top: "top", data: mediaList },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      formatter: (params) => {
        if (!params.length) return "";
        return params
          .map((p) => {
            const [cost, kpi] = p.value;
            return `${p.marker} ${p.seriesName}<br/>예산: ${cost.toLocaleString()}<br/>기여 KPI: ${Math.round(kpi).toLocaleString()}`;
          })
          .join("<br/><br/>");
      },
    },
    xAxis: { type: "value", name: "매체별 예산", nameLocation: "middle", nameGap: 30 },
    yAxis: { type: "value", name: "매체 기여 KPI", nameGap: 100, nameLocation: "middle", min: 0 },
    grid: { left: 120, right: 20, top: 40, bottom: 40, containLabel: true },
    series,
  };
}

function buildOptimize1Option(optcurve, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const budgetList = ["budget_origin", "budget_100%"];

  return {
    color: ROMA1,
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
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
          return `${p.marker} ${p.seriesName}: ${cost.toLocaleString()} (${ratio.toFixed(2)}%)`;
        });
        return `${label}<br/>${items.join("<br/>")}`;
      },
    },
    xAxis: {
      type: "category",
      data: ["현재 예산 비율", "현재 예산 대비\n100%"],
      axisLabel: { fontSize: 10, fontWeight: "bold" },
    },
    yAxis: { type: "value" },
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

function buildOptimize2Option(optcurve, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const budgetList = [
    "budget_25%", "budget_50%", "budget_75%",
    "budget_100%", "budget_150%", "budget_200%",
  ];

  return {
    color: ROMA1,
    title: {
      text: "최적 예산 비율",
      top: "top",
      textStyle: { fontSize: 14, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
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
          return `${p.marker} ${p.seriesName}: ${cost.toLocaleString()} (${ratio.toFixed(2)}%)`;
        });
        return `${label}<br/>${items.join("<br/>")}`;
      },
    },
    legend: { data: mediaList },
    xAxis: {
      type: "category",
      data: [
        "현재 대비 25%", "현재 대비 50%", "현재 대비 75%",
        "현재 대비 100%", "현재 대비 150%", "현재 대비 200%",
      ],
      axisLabel: { fontSize: 10, fontWeight: "bold" },
    },
    yAxis: { type: "value" },
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

    const columns = [
      {
        name: "매체 / 지표",
        id: "media",
        width: "160px",
        formatter: (v) => {
          const isBold = ["예산 총합", "매체 기여 KPI 총합", "ROI"].includes(v);
          return html(isBold ? `<strong>${v}</strong>` : v);
        },
      },
      ...dfCols.map((col) => ({
        name: BUDGET_COL_LABEL[col] ?? col,
        id: col,
        width: "90px",
        formatter: (v) => {
          if (v == null) {
            return html(`<span style="font-family:var(--font-data);font-size:11px">-</span>`);
          }
          const formatted =
            typeof v === "number"
              ? v < 1
                ? `${(v * 100).toFixed(2)}%`
                : v.toLocaleString(undefined, { maximumFractionDigits: 0 })
              : v;
          return html(
            `<span style="font-family:var(--font-data);font-size:11px">${formatted}</span>`,
          );
        },
      })),
    ];

    const tableData = optcurveDf.map((r) => {
      const row = { media: r.media };
      dfCols.forEach((c) => { row[c] = r[c]; });
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
      {hasCurve && hasOptcurve && (
        <div className="mmm-card">
          <div className="mmm-card-title mmm-card-title--section">반응 곡선 (Response Curve)</div>
          <ReactECharts
            option={buildRescurveOption(rescurve, optcurve, optionset)}
            style={{ height: 400 }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

      {hasOptcurve && (
        <div className="mmm-card">
          <div className="mmm-card-title mmm-card-title--section">현재 vs 100% 예산 배분</div>
          <ReactECharts
            option={buildOptimize1Option(optcurve, optionset)}
            style={{ height: 360 }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

      {hasOptcurve && (
        <div className="mmm-card">
          <div className="mmm-card-title mmm-card-title--section">예산 배율별 최적 배분</div>
          <ReactECharts
            option={buildOptimize2Option(optcurve, optionset)}
            style={{ height: 400 }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

      {hasDf && (
        <div className="mmm-card">
          <div className="mmm-card-title mmm-card-title--section">예산 시나리오별 배분 비율</div>
          <div className="mmm-gridjs-wrap" ref={tableRef} />
        </div>
      )}
    </div>
  );
}
