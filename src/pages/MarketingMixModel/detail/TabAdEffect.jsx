import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import ReactECharts from "echarts-for-react";
import { ROMA1, hexToRgba, TIMESEQ_LABEL } from "./chartUtils";

function buildAdstockOption(adstock, optionset) {
  const mediaList = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];
  const timeseq = TIMESEQ_LABEL[optionset?.timeseq] ?? "";
  const numCols = 2;
  const numRows = Math.ceil(mediaList.length / numCols);
  const gridHeight = 100 / numRows;

  const grids = [], xAxes = [], yAxes = [], series = [], titles = [];

  mediaList.forEach((media, i) => {
    const row = Math.floor(i / numCols);
    const col = i % numCols;
    const top = row * gridHeight;
    const left = col * 50;
    const gridIndex = i;
    const baseColor = ROMA1[i % ROMA1.length];
    const bandColor = hexToRgba(baseColor, 0.2);

    grids.push({
      top: `${top + 6}%`,
      left: `${left + 3}%`,
      width: "44%",
      height: `${gridHeight - 10}%`,
      containLabel: true,
    });

    xAxes.push({
      type: "value",
      gridIndex,
      min: 0,
      max: parseFloat(optionset?.maxlag ?? 0) + 0.1,
      axisLabel: { formatter: (v) => `${v}${timeseq}` },
    });

    yAxes.push({
      type: "value",
      gridIndex,
      min: 0,
      axisLabel: { formatter: (v) => `${(v * 100).toFixed(2)}%` },
    });

    const filtered = adstock.filter((d) => d.media === media);

    series.push(
      {
        name: `${media} UCL`,
        type: "line",
        data: filtered.map((d) => [parseFloat(d.seq), d.adstock_ucl]),
        xAxisIndex: gridIndex,
        yAxisIndex: gridIndex,
        lineStyle: { opacity: 0 },
        symbol: "none",
        areaStyle: { origin: "start", color: bandColor },
        z: 1,
        tooltip: { show: false },
      },
      {
        name: `${media} LCL`,
        type: "line",
        data: filtered.map((d) => [parseFloat(d.seq), d.adstock_lcl]),
        xAxisIndex: gridIndex,
        yAxisIndex: gridIndex,
        lineStyle: { opacity: 0 },
        symbol: "none",
        areaStyle: { origin: "start", color: "rgba(255,255,255,1)" },
        z: 2,
        tooltip: { show: false },
      },
      {
        name: media,
        type: "line",
        data: filtered.map((d) => [parseFloat(d.seq), d.adstock_med]),
        xAxisIndex: gridIndex,
        yAxisIndex: gridIndex,
        showSymbol: false,
        smooth: true,
        lineStyle: { color: baseColor },
        z: 3,
      },
    );

    titles.push({
      text: media,
      left: `${left + 6}%`,
      top: `${top - 1}%`,
      textStyle: { fontSize: 13, fontWeight: "bold" },
    });
  });

  return {
    color: ROMA1,
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    title: titles,
    legend: { show: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line" },
      confine: true,
      formatter: (params) => {
        const x = params[0]?.data?.[0];
        let result = `${x}${timeseq}<br/>`;
        for (const p of params) {
          if (!p.seriesName.includes(" UCL") && !p.seriesName.includes(" LCL")) {
            result += `${p.seriesName}: ${(p.data[1] * 100).toFixed(2)}%<br/>`;
          }
        }
        return result;
      },
    },
  };
}

function buildSaturationOption(freqhist, optfreq, optionset) {
  const mediaList = optionset?.media_rf_alias ?? [];
  const numCols = 2;
  const numRows = Math.ceil(mediaList.length / numCols);
  const gridHeight = 100 / numRows;

  const grids = [], xAxes = [], yAxes = [], series = [], titles = [];

  mediaList.forEach((media, i) => {
    const row = Math.floor(i / numCols);
    const col = i % numCols;
    const top = row * gridHeight;
    const left = col * 50;
    const gridIndex = i;
    const baseColor = ROMA1[i % ROMA1.length];
    const bandColor = hexToRgba(baseColor, 0.2);
    const yAxisStartIndex = yAxes.length;

    grids.push({
      top: `${top + 6}%`,
      left: `${left + 3}%`,
      width: "44%",
      height: `${gridHeight - 10}%`,
      containLabel: true,
    });

    xAxes.push({
      type: "value",
      gridIndex,
      min: 1,
      max: parseFloat(optionset?.maxlag ?? 10) + 0.1,
      axisLabel: { formatter: (v) => `${v}회` },
    });

    yAxes.push(
      {
        type: "value",
        gridIndex,
        min: 0,
        max: 1,
        axisLine: { show: false },
        axisLabel: { formatter: (v) => `${(v * 100).toFixed(0)}%` },
      },
      {
        type: "value",
        gridIndex,
        min: 0,
        position: "right",
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: true },
        splitLine: { show: false },
      },
    );

    const filteredFreq = optfreq.filter((d) => d.media === media);
    const scaledEffect = filteredFreq.map((d) => [parseFloat(d.af), d.scaled_effect]);
    const filteredHist = freqhist.filter((d) => d.media === media);
    const histY = filteredHist.map((d) => [parseFloat(d.af), d.hist_y]);
    const shadedArea = scaledEffect.map(([x, y]) => [x, y >= 0.975 ? y : null]);

    series.push(
      {
        name: `${media}_effect`,
        type: "line",
        data: scaledEffect,
        xAxisIndex: gridIndex,
        yAxisIndex: yAxisStartIndex,
        showSymbol: false,
        smooth: true,
        lineStyle: { color: baseColor },
        z: 2,
      },
      {
        name: `${media}_hist`,
        type: "bar",
        data: histY,
        xAxisIndex: gridIndex,
        yAxisIndex: yAxisStartIndex + 1,
        barWidth: "80%",
        itemStyle: { color: bandColor },
        z: 1,
      },
      {
        name: `${media}_highlight`,
        type: "line",
        data: shadedArea,
        xAxisIndex: gridIndex,
        yAxisIndex: yAxisStartIndex,
        lineStyle: { opacity: 0 },
        showSymbol: false,
        areaStyle: { color: baseColor, opacity: 0.1 },
        z: 0.5,
      },
    );

    titles.push({
      text: media,
      left: `${left + 6}%`,
      top: `${top - 1}%`,
      textStyle: { fontSize: 13, fontWeight: "bold" },
    });
  });

  return {
    color: ROMA1,
    grid: grids,
    xAxis: xAxes,
    yAxis: yAxes,
    series,
    title: titles,
    legend: { show: false },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const effectSeries = params.filter((p) => p.seriesName.endsWith("_effect"));
        if (!effectSeries.length) return "";
        const p = effectSeries[0];
        const mediaName = p.seriesName.replace(/_effect$/, "");
        const af = parseFloat(p.value[0]).toFixed(1);
        const effect = (p.value[1] * 100).toFixed(2);
        return `${mediaName} : ${af}회<br/>빈도 평가 지수 : ${effect}%`;
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
  const numRows = Math.ceil(mediaList.length / 2);
  const adstockHeight = Math.max(numRows * 150, 200);
  const rfRows = Math.ceil((optionset?.media_rf_alias?.length ?? 1) / 2);
  const satHeight = Math.max(rfRows * 150, 200);

  useEffect(() => {
    if (!tableRef.current || !hasAdstock) return;

    const integerRows = adstock.filter((d) => Number.isInteger(d.seq));
    const uniqueSeqs = [...new Set(integerRows.map((d) => d.seq))].sort((a, b) => a - b);

    const columns = [
      { name: "매체", id: "media" },
      ...uniqueSeqs.map((seq) => ({
        name: `${seq}${timeseq}`,
        id: String(seq),
        formatter: (v) =>
          html(`<span style="font-family:var(--font-data);font-size:11px">${v ?? "-"}</span>`),
      })),
    ];

    const tableData = mediaList.map((media) => {
      const row = { media };
      uniqueSeqs.forEach((seq) => {
        const found = integerRows.find((d) => d.media === media && d.seq === seq);
        row[String(seq)] = found ? `${(found.adstock_med * 100).toFixed(2)}%` : "-";
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
          <div className="mmm-card-title">Carry Over</div>
          <div className="mmm-chart-sub-label">광고 이월 효과</div>
          <ReactECharts
            option={buildAdstockOption(adstock, optionset)}
            style={{ height: adstockHeight }}
            opts={{ renderer: "svg" }}
          />
          <hr className="mmm-hr" />
          <div className="mmm-gridjs-wrap" ref={tableRef} />
        </div>
      )}

      {/* ── Saturation ── */}
      {hasRF && freqhist?.length > 0 && (
        <div className="mmm-card">
          <div className="mmm-card-title">Saturation</div>
          <div className="mmm-chart-sub-label">매체별 포화도 곡선</div>
          <ReactECharts
            option={buildSaturationOption(freqhist, optfreq, optionset)}
            style={{ height: satHeight }}
            opts={{ renderer: "svg" }}
          />
        </div>
      )}

    </div>
  );
}
