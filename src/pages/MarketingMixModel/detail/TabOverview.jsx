import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import ReactECharts from "echarts-for-react";
import { ROMA } from "./chartUtils";

function buildKpiOption(bytime) {
  const f = (m) => bytime.filter((d) => d.metric === m);
  const times = f("kpi_pred").map((d) => d.time_index);
  return {
    color: ROMA,
    tooltip: { trigger: "axis", axisPointer: { type: "line" } },
    legend: { data: ["실제 KPI", "MMM 예측 KPI"], top: "top" },
    grid: { left: 80, right: 20, top: 40, bottom: 20, containLabel: true },
    xAxis: { type: "category", data: times },
    yAxis: { type: "value", min: 0 },
    series: [
      {
        name: "MMM 예측 KPI",
        type: "line",
        data: f("kpi_pred").map((d) => d.value),
        smooth: true,
      },
      {
        name: "실제 KPI",
        type: "line",
        data: f("kpi_true").map((d) => d.value),
        smooth: true,
      },
      {
        name: "신뢰구간",
        type: "line",
        data: f("kpi_pred_ucl").map((d) => d.value),
        lineStyle: { opacity: 0 },
        symbol: "none",
        areaStyle: { origin: "start", color: "rgba(128,128,128,0.3)" },
        tooltip: { show: false },
      },
      {
        name: "신뢰구간",
        type: "line",
        data: f("kpi_pred_lcl").map((d) => d.value),
        lineStyle: { opacity: 0 },
        symbol: "none",
        areaStyle: { origin: "start", color: "rgba(255,255,255,1)" },
        tooltip: { show: false },
      },
    ],
  };
}

function buildStackOption(bytime, optionset) {
  const aliases = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const baseline = bytime.filter((d) => d.metric === "incremental_kpi_BASELINE");
  const times = baseline.map((d) => d.time_index);
  return {
    color: ROMA,
    tooltip: { trigger: "axis", axisPointer: { type: "line" } },
    legend: { data: ["비마케팅 요인", ...aliases], top: "top" },
    grid: { left: 80, right: 20, top: 40, bottom: 20, containLabel: true },
    xAxis: { type: "category", data: times },
    yAxis: { type: "value", min: 0 },
    series: [
      {
        name: "비마케팅 요인",
        type: "line",
        stack: "Total",
        showSymbol: false,
        data: baseline.map((d) => d.value),
        smooth: true,
        lineStyle: { width: 0 },
        emphasis: { focus: "series" },
        areaStyle: { opacity: 0.6 },
      },
      ...aliases.map((m) => ({
        name: m,
        type: "line",
        stack: "Total",
        showSymbol: false,
        data: bytime
          .filter((d) => d.metric === `incremental_kpi_${m}`)
          .map((d) => d.value),
        smooth: true,
        lineStyle: { width: 0 },
        emphasis: { focus: "series" },
        areaStyle: { opacity: 0.8 },
      })),
    ],
  };
}

function buildWaterfallOption(bytime, optionset) {
  const aliases = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const baseSum = bytime
    .filter((d) => d.metric === "incremental_kpi_BASELINE")
    .reduce((s, d) => s + d.value, 0);

  const assists = [0];
  const values = [baseSum];
  const colors = ["#3949AB"];
  let cumulative = baseSum;

  for (const m of aliases) {
    const sum = bytime
      .filter((d) => d.metric === `incremental_kpi_${m}`)
      .reduce((s, d) => s + d.value, 0);
    assists.push(cumulative);
    values.push(sum);
    colors.push("#125001");
    cumulative += sum;
  }

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) => {
        const real = params[1];
        return `${real.name}<br/>기여 KPI: ${real.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      },
    },
    legend: { show: false },
    grid: { left: 80, right: 20, top: 20, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: ["비마케팅 요인", ...aliases],
      axisLabel: { rotate: 45 },
    },
    yAxis: { type: "value", min: 0 },
    series: [
      {
        name: "누적 KPI",
        type: "bar",
        stack: "total",
        itemStyle: { color: "transparent" },
        data: assists,
      },
      {
        name: "기여 KPI",
        type: "bar",
        stack: "total",
        itemStyle: { color: (p) => colors[p.dataIndex] },
        label: {
          show: true,
          position: "top",
          formatter: (p) =>
            p.value.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        },
        data: values,
      },
    ],
  };
}

function buildRoiBarOption(summary) {
  const data = summary.slice(0, -1);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params) =>
        params.map((p) => `${p.seriesName}: ${(p.value * 100).toFixed(2)}%`).join("<br>"),
    },
    legend: { data: ["집행 예산 비율(%)", "매체 기여 KPI 비율(%)"], top: "top" },
    grid: { left: 80, right: 20, top: 40, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((d) => d.media_alias),
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 1,
      axisLabel: { formatter: (v) => `${(v * 100).toFixed(0)}%` },
    },
    series: [
      {
        name: "집행 예산 비율(%)",
        type: "bar",
        data: data.map((d) => d.cost_ratio),
        itemStyle: { color: "#3949AB" },
        label: {
          show: true,
          position: "top",
          formatter: (v) => `${(v.value * 100).toFixed(2)}%`,
          color: "#3949AB",
        },
      },
      {
        name: "매체 기여 KPI 비율(%)",
        type: "bar",
        data: data.map((d) => d.incremental_kpi_ratio),
        itemStyle: { color: "#6C8AE6" },
        label: {
          show: true,
          position: "top",
          formatter: (v) => `${(v.value * 100).toFixed(2)}%`,
          color: "#6C8AE6",
        },
      },
    ],
  };
}

function buildRoiCiOption(summary) {
  const data = summary.slice(0, -1);
  const maxUcl = Math.max(...data.map((d) => d.roi_ucl));
  return {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const d = data[params[0].dataIndex];
        return (
          `<b>${d.media_alias}</b><br/>` +
          `ROI: ${(d.roi * 100).toFixed(2)}%<br/>` +
          `95% 신뢰구간: ${(d.roi_lcl * 100).toFixed(2)}% ~ ${(d.roi_ucl * 100).toFixed(2)}%`
        );
      },
    },
    grid: { left: 80, right: 20, top: 20, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((d) => d.media_alias),
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: maxUcl * 1.1,
      axisLabel: { formatter: (v) => `${(v * 100).toFixed(2)}%` },
    },
    series: [
      {
        name: "ROI",
        type: "bar",
        data: data.map((d) => d.roi),
        itemStyle: { color: "#6C8AE6" },
        label: {
          show: true,
          position: "top",
          formatter: (v) => `${(v.value * 100).toFixed(1)}%`,
          color: "#6C8AE6",
        },
      },
      {
        name: "ci_95",
        type: "custom",
        z: 10,
        renderItem: (params, api) => {
          const xValue = api.value(0);
          const roi = api.value(1);
          const high = api.value(2);
          const low = api.value(3);
          const x = api.coord([xValue, roi])[0];
          const yHigh = api.coord([xValue, roi + high])[1];
          const yLow = api.coord([xValue, roi - low])[1];
          const lw = 8;
          return {
            type: "group",
            children: [
              { type: "line", shape: { x1: x, y1: yLow, x2: x, y2: yHigh }, style: { stroke: "black", lineWidth: 1.5 } },
              { type: "line", shape: { x1: x - lw, y1: yHigh, x2: x + lw, y2: yHigh }, style: { stroke: "black", lineWidth: 1.5 } },
              { type: "line", shape: { x1: x - lw, y1: yLow, x2: x + lw, y2: yLow }, style: { stroke: "black", lineWidth: 1.5 } },
            ],
          };
        },
        encode: { x: 0, y: 1 },
        data: data.map((d, idx) => [idx, d.roi, d.roi_ucl - d.roi, d.roi - d.roi_lcl]),
      },
    ],
  };
}

export default function TabOverview({ data }) {
  const { attributionByTime, attributionSummary, optionset, overviewCmt } = data;
  const cmt = overviewCmt?.[0] ?? {};
  const tableRef = useRef(null);
  const gridRef = useRef(null);

  const hasBytime = attributionByTime?.length > 0;
  const hasSummary = attributionSummary?.length > 0;

  useEffect(() => {
    if (!tableRef.current || !hasSummary) return;

    const columns = [
      { name: "매체", id: "media_alias" },
      {
        name: "집행 비용",
        id: "cost",
        formatter: (v) =>
          html(`<span style="font-family:var(--font-data);font-size:11px">${
            typeof v === "number"
              ? v.toLocaleString(undefined, { maximumFractionDigits: 0 })
              : (v ?? "-")
          }</span>`),
      },
      {
        name: "집행 비율(%)",
        id: "cost_ratio",
        formatter: (v) =>
          html(`<span style="font-family:var(--font-data);font-size:11px">${
            typeof v === "number" ? `${(v * 100).toFixed(2)}%` : (v ?? "-")
          }</span>`),
      },
      {
        name: "매체 기여 KPI",
        id: "incremental_kpi",
        formatter: (v) =>
          html(`<span style="font-family:var(--font-data);font-size:11px">${
            typeof v === "number"
              ? v.toLocaleString(undefined, { maximumFractionDigits: 0 })
              : (v ?? "-")
          }</span>`),
      },
      {
        name: "매체 기여 KPI 비율(%)",
        id: "incremental_kpi_ratio",
        formatter: (v) =>
          html(`<span style="font-family:var(--font-data);font-size:11px">${
            typeof v === "number" ? `${(v * 100).toFixed(2)}%` : (v ?? "-")
          }</span>`),
      },
      {
        name: "ROI(%)",
        id: "roi",
        formatter: (v) =>
          html(`<span style="font-family:var(--font-data);font-size:11px">${
            typeof v === "number" ? `${(v * 100).toFixed(2)}%` : (v ?? "-")
          }</span>`),
      },
    ];

    gridRef.current = new Grid({
      columns,
      data: attributionSummary.map((r) => ({
        media_alias: r.media_alias,
        cost: r.cost,
        cost_ratio: r.cost_ratio,
        incremental_kpi: r.incremental_kpi,
        incremental_kpi_ratio: r.incremental_kpi_ratio,
        roi: r.roi,
      })),
      width: "100%",
      language: { noRecordsFound: "데이터 없음" },
    });
    gridRef.current.render(tableRef.current);
    return () => {
      gridRef.current?.destroy();
      gridRef.current = null;
    };
  }, [attributionSummary, hasSummary]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Section 1: 모델 성능 ── */}
      {hasBytime && (
        <div className="mmm-card">
          <div className="mmm-overview-perf-layout">
            <div>
              <table className="mmm-perf-table">
                <thead>
                  <tr>
                    <th>R² Score</th>
                    <th>MAPE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{cmt.model_r2 != null ? `${cmt.model_r2}%` : "—"}</td>
                    <td>{cmt.model_mape != null ? `${cmt.model_mape}%` : "—"}</td>
                  </tr>
                </tbody>
              </table>
              {cmt.overview_comment && (
                <p
                  className="mmm-perf-desc"
                  dangerouslySetInnerHTML={{ __html: cmt.overview_comment }}
                />
              )}
            </div>
            <ReactECharts
              option={buildKpiOption(attributionByTime)}
              style={{ height: 300 }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </div>
      )}

      {/* ── Section 2: Summary ── */}
      {hasSummary && (
        <div className="mmm-card">
          <div className="mmm-card-title">Summary</div>
          <div className="mmm-gridjs-wrap" ref={tableRef} />
        </div>
      )}

      {/* ── Section 3: Media ── */}
      {hasBytime && (
        <div className="mmm-card">
          <div className="mmm-card-title">Media</div>
          <div className="mmm-two-col-charts">
            <div>
              <div className="mmm-chart-sub-label">매체별 기여 KPI (시간)</div>
              <ReactECharts
                option={buildStackOption(attributionByTime, optionset)}
                style={{ height: 340 }}
                opts={{ renderer: "svg" }}
              />
            </div>
            <div>
              <ReactECharts
                option={buildWaterfallOption(attributionByTime, optionset)}
                style={{ height: 340 }}
                opts={{ renderer: "svg" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Section 4: ROI ── */}
      {hasSummary && (
        <div className="mmm-card">
          <div className="mmm-card-title">ROI</div>
          <div className="mmm-chart-sub-label">매체별 ROI</div>
          <div className="mmm-two-col-charts">
            <ReactECharts
              option={buildRoiBarOption(attributionSummary)}
              style={{ height: 340 }}
              opts={{ renderer: "svg" }}
            />
            <ReactECharts
              option={buildRoiCiOption(attributionSummary)}
              style={{ height: 340 }}
              opts={{ renderer: "svg" }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
