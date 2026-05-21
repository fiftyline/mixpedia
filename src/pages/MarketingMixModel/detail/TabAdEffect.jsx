import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import ReactECharts from "echarts-for-react";
import { MIXPEDIA, hexToRgba, TIMESEQ_LABEL } from "./chartUtils";

const FONT_BODY = "DM Sans, sans-serif";

// MIXPEDIA[0] is slate (baseline neutral) — skip it for media series
function mediaColor(i) {
  return MIXPEDIA[(i % (MIXPEDIA.length - 1)) + 1];
}

function buildSingleAdstockOption(filtered, colorIdx, timeseq, xMax) {
  const baseColor = mediaColor(colorIdx);
  const sorted = [...filtered].sort(
    (a, b) => parseFloat(a.seq) - parseFloat(b.seq),
  );
  return {
    textStyle: { fontFamily: FONT_BODY },
    grid: { top: 16, right: 16, bottom: 32, left: 10, containLabel: true },
    xAxis: {
      type: "value",
      min: 0,
      max: xMax,
      axisLabel: {
        formatter: (v) => `${v}${timeseq}`,
        fontFamily: FONT_BODY,
        fontSize: 11,
        color: "#8b90b0",
      },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    yAxis: {
      type: "value",
      min: 0,
      axisLabel: {
        formatter: (v) => `${(v * 100).toFixed(0)}%`,
        fontFamily: FONT_BODY,
        fontSize: 11,
        color: "#8b90b0",
      },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    tooltip: {
      trigger: "axis",
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (params) => {
        const p = params.find((s) => s.seriesName === "추정값 (MED)");
        if (!p) return "";
        return (
          `<b style="font-family:${FONT_BODY}">${p.data[0]}${timeseq}</b><br/>` +
          `<span style="font-family:${FONT_BODY}">매체 잔존 효과: <b>${(p.data[1] * 100).toFixed(1)}%</b></span>`
        );
      },
    },
    series: [
      // CI 폴리곤: seq 정렬된 UCL→LCL 다각형 (그리드선 미가림)
      {
        name: "ci_band",
        type: "custom",
        renderItem: (_params, api) => {
          const upper = sorted.map((d) =>
            api.coord([parseFloat(d.seq), d.adstock_ucl]),
          );
          const lower = [...sorted]
            .reverse()
            .map((d) => api.coord([parseFloat(d.seq), d.adstock_lcl]));
          return {
            type: "polygon",
            shape: { points: [...upper, ...lower] },
            style: { fill: hexToRgba(baseColor, 0.2), stroke: "none" },
            silent: true,
          };
        },
        data: [[0, 0]],
        tooltip: { show: false },
        z: 1,
      },
      // UCL 경계선 (실제 ucl 값)
      {
        name: "신뢰 상한 (UCL)",
        type: "line",
        data: sorted.map((d) => [parseFloat(d.seq), d.adstock_ucl]),
        symbol: "none",
        lineStyle: { color: baseColor, width: 1, type: "dashed", opacity: 0.5 },
        tooltip: { show: false },
        z: 2,
      },
      // LCL 경계선 (실제 lcl 값)
      {
        name: "신뢰 하한 (LCL)",
        type: "line",
        data: sorted.map((d) => [parseFloat(d.seq), d.adstock_lcl]),
        symbol: "none",
        lineStyle: { color: baseColor, width: 1, type: "dashed", opacity: 0.5 },
        tooltip: { show: false },
        z: 2,
      },
      // 추정값 중앙선
      {
        name: "추정값 (MED)",
        type: "line",
        data: sorted.map((d) => [parseFloat(d.seq), d.adstock_med]),
        symbol: "none",
        lineStyle: { color: baseColor, width: 2.5 },
        z: 3,
      },
    ],
  };
}

function buildSingleSaturationOption(
  media,
  filteredHist,
  filteredFreq,
  optionset,
  colorIdx,
) {
  const baseColor = mediaColor(colorIdx);
  const sortedFreq = [...filteredFreq].sort(
    (a, b) => parseFloat(a.af) - parseFloat(b.af),
  );
  const sortedHist = [...filteredHist].sort(
    (a, b) => parseFloat(a.af) - parseFloat(b.af),
  );
  const scaledEffect = sortedFreq.map((d) => [
    parseFloat(d.af),
    d.scaled_effect,
  ]);
  const histY = sortedHist.map((d) => [parseFloat(d.af), d.hist_y]);
  const shadedArea = scaledEffect.map(([x, y]) => [x, y >= 0.975 ? y : null]);

  return {
    textStyle: { fontFamily: FONT_BODY },
    grid: { top: 16, right: 16, bottom: 32, left: 10, containLabel: true },
    xAxis: {
      type: "value",
      min: 1,
      max: parseFloat(optionset?.maxlag ?? 10) + 0.1,
      axisLabel: {
        formatter: (v) => `${v}회`,
        fontFamily: FONT_BODY,
        fontSize: 11,
        color: "#8b90b0",
      },
      splitLine: { lineStyle: { color: "#eef0f8" } },
    },
    yAxis: [
      {
        type: "value",
        min: 0,
        max: 1,
        axisLine: { show: false },
        axisLabel: {
          formatter: (v) => `${(v * 100).toFixed(0)}%`,
          fontFamily: FONT_BODY,
          fontSize: 11,
          color: "#8b90b0",
        },
        splitLine: { lineStyle: { color: "#eef0f8" } },
      },
      {
        type: "value",
        min: 0,
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          fontFamily: FONT_BODY,
          fontSize: 10,
          color: "#8b90b0",
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: `${media}_effect`,
        type: "line",
        data: scaledEffect,
        yAxisIndex: 0,
        showSymbol: false,
        smooth: true,
        lineStyle: { color: baseColor, width: 2.5 },
        z: 2,
      },
      {
        name: `${media}_hist`,
        type: "bar",
        data: histY,
        yAxisIndex: 1,
        barWidth: "80%",
        itemStyle: { color: hexToRgba("#94a3b8", 0.4) },
        z: 1,
      },
      {
        name: `${media}_highlight`,
        type: "line",
        data: shadedArea,
        yAxisIndex: 0,
        lineStyle: { opacity: 0 },
        showSymbol: false,
        areaStyle: { color: baseColor, opacity: 0.28 },
        z: 0.5,
      },
    ],
    legend: { show: false },
    tooltip: {
      trigger: "axis",
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (params) => {
        const p = params.find((s) => s.seriesName === `${media}_effect`);
        if (!p) return "";
        const af = parseFloat(p.value[0]).toFixed(1);
        const effect = (p.value[1] * 100).toFixed(1);
        return `<span style="font-family:${FONT_BODY}"><b>${media}</b><br/>${af}회 : 빈도 평가 지수 <b>${effect}%</b></span>`;
      },
    },
  };
}

export default function TabAdEffect({ data }) {
  const { adstock, freqhist, optfreq, optionset } = data;
  const tableRef = useRef(null);
  const gridRef = useRef(null);

  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const timeseq = TIMESEQ_LABEL[optionset?.timeseq] ?? "";
  const hasAdstock = adstock?.length > 0;
  const hasRF = (optionset?.media_rf_alias?.length ?? 0) > 0;

  useEffect(() => {
    if (!tableRef.current || !hasAdstock) return;

    const integerRows = adstock.filter((d) => Number.isInteger(d.seq));
    const uniqueSeqs = [...new Set(integerRows.map((d) => d.seq))].sort(
      (a, b) => a - b,
    );

    const columns = [
      {
        name: "매체",
        id: "media",
        formatter: (v) =>
          html(
            `<span style="font-family:var(--font-body);font-size:13px">${v}</span>`,
          ),
      },
      ...uniqueSeqs.map((seq) => ({
        name: `${seq}${timeseq}`,
        id: String(seq),
        formatter: (v) =>
          html(
            `<span style="font-family:var(--font-body);font-size:13px">${v ?? "-"}</span>`,
          ),
      })),
    ];

    const tableData = mediaList.map((media) => {
      const row = { media };
      uniqueSeqs.forEach((seq) => {
        const found = integerRows.find(
          (d) => d.media === media && d.seq === seq,
        );
        row[String(seq)] = found
          ? `${(found.adstock_med * 100).toFixed(1)}%`
          : "-";
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
  }, [adstock, hasAdstock]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Carry Over ── */}
      {hasAdstock && (
        <div className="mmm-card">
          <div className="mmm-card-title">Channel Carry Over</div>
          <div className="mmm-chart-sub-label">채널별 이월 효과</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 24px",
            }}
          >
            {mediaList.map((media, i) => {
              const filtered = adstock
                .filter((d) => d.media === media)
                .sort((a, b) => parseFloat(a.seq) - parseFloat(b.seq));
              const xMax = parseFloat(optionset?.maxlag ?? 0) + 0.1;
              return (
                <div key={media}>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#4b5070",
                      marginBottom: 4,
                      paddingLeft: 2,
                    }}
                  >
                    {media}
                  </div>
                  <ReactECharts
                    option={buildSingleAdstockOption(
                      filtered,
                      i,
                      timeseq,
                      xMax,
                    )}
                    style={{ height: 220 }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              );
            })}
          </div>
          <hr className="mmm-hr" />
          <div className="gridjs-wrap" ref={tableRef} />
        </div>
      )}

      {/* ── Saturation ── */}
      {hasRF && freqhist?.length > 0 && (
        <div className="mmm-card">
          <div className="mmm-card-title">Channel Saturation</div>
          <div className="mmm-chart-sub-label">
            채널별 포화 효과 (적정 빈도)
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px 24px",
            }}
          >
            {(optionset?.media_rf_alias ?? []).map((media, i) => {
              const filteredFreq = optfreq.filter((d) => d.media === media);
              const filteredHist = freqhist.filter((d) => d.media === media);
              return (
                <div key={media}>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#4b5070",
                      marginBottom: 4,
                      paddingLeft: 2,
                    }}
                  >
                    {media}
                  </div>
                  <ReactECharts
                    option={buildSingleSaturationOption(
                      media,
                      filteredHist,
                      filteredFreq,
                      optionset,
                      i,
                    )}
                    style={{ height: 220 }}
                    opts={{ renderer: "svg" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <br />
    </div>
  );
}
