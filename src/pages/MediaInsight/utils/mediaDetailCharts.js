export const FONT_BODY = "'DM Sans', sans-serif";
export const FONT_DATA = "'JetBrains Mono', monospace";

function fmtEdge(val, isPct) {
  if (val == null) return "";
  if (isPct) return `${Number(val).toFixed(1)}%`;
  const fmt = (n) => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1));
  if (Math.abs(val) >= 100_000_000) return `${fmt(val / 100_000_000)}억`;
  if (Math.abs(val) >= 10_000) return `${fmt(val / 10_000)}만`;
  if (Math.abs(val) >= 1_000) return `${fmt(val / 1_000)}천`;
  return String(Math.round(val));
}

export function buildHistOption(key, stats, unit = "") {
  const stat = stats?.[key];
  const counts = stat?.hist?.counts ?? [];
  const edges = stat?.hist?.edges ?? [];
  const mean = stat?.mean ?? null;
  if (counts.length === 0) return {};

  const isPct = key === "ctr" || key === "vtr";
  const isRat = key === "budget_rat";

  const step = edges.length >= 2 ? Math.abs(edges[1] - edges[0]) : 1;
  const smartDec = (s) => (s > 0 ? Math.max(0, Math.ceil(-Math.log10(s))) : 2);

  const edgeFmt = (val) => {
    if (isRat) return `${(val * 100).toFixed(smartDec(step * 100))}%`;
    if (isPct) return `${Number(val).toFixed(smartDec(step))}%`;
    return `${fmtEdge(val, false)}${unit}`;
  };

  const labels = counts.map(
    (_, i) => `${edgeFmt(edges[i])}~${edgeFmt(edges[i + 1])}`,
  );

  let meanBinIdx = counts.length - 1;
  if (mean != null) {
    for (let i = 0; i < edges.length - 1; i++) {
      if (mean >= edges[i] && mean < edges[i + 1]) {
        meanBinIdx = i;
        break;
      }
    }
  }

  return {
    grid: { top: 12, right: 12, bottom: 54, left: 40 },
    dataZoom: [{ type: "inside", xAxisIndex: 0 }],
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (params) => {
        const p = params[0];
        return `${p.name}<br/>${p.value.toLocaleString()}건`;
      },
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        fontSize: 9,
        rotate: 30,
        fontFamily: FONT_BODY,
        color: "#8b90b0",
        interval: 0,
      },
      axisLine: { lineStyle: { color: "#dde1ef" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontSize: 9, fontFamily: FONT_DATA, color: "#8b90b0" },
      splitLine: { lineStyle: { color: "#dde1ef", type: "dashed" } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: counts,
        barMaxWidth: 32,
        itemStyle: { color: "#6366f1", opacity: 0.65 },
        markLine: {
          silent: true,
          symbol: ["none", "none"],
          data: [{ xAxis: meanBinIdx }],
          lineStyle: { color: "#f97316", width: 1.5, type: "dashed" },
          label: { show: false },
        },
      },
    ],
  };
}

const GENDER_COLORS = {
  전체: "#9ca3af",
  P: "#9ca3af",
  남성: "#4f80e1",
  M: "#4f80e1",
  여성: "#f472b6",
  F: "#f472b6",
};

export function parseAge(code) {
  if (!code || code.length < 2) return code;
  if (code.length === 4) {
    const lo = code.slice(0, 2);
    const hi = code.slice(2);
    if (hi === "99") return `${lo}세+`;
    return `${lo}~${hi}세`;
  }
  return code;
}

export function buildGenderOption(genderData) {
  const data = Object.entries(genderData).map(([name, value]) => ({
    name,
    value,
    itemStyle: { color: GENDER_COLORS[name] ?? "#6366f1" },
  }));
  return {
    tooltip: {
      trigger: "item",
      formatter: "<b>{b}</b>: {c}건 ({d}%)",
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
    },
    legend: {
      bottom: 0,
      textStyle: { color: "#9ca3bf", fontSize: 11, fontFamily: FONT_BODY },
    },
    series: [
      {
        type: "pie",
        radius: ["38%", "65%"],
        center: ["50%", "44%"],
        label: {
          show: true,
          fontSize: 11,
          color: "#9ca3bf",
          fontFamily: FONT_BODY,
          formatter: "{b}\n{d}%",
        },
        data,
      },
    ],
  };
}

export function buildAgeOption(ageData) {
  const keys = Object.keys(ageData);
  const vals = Object.values(ageData);
  return {
    tooltip: {
      trigger: "axis",
      textStyle: { fontFamily: FONT_BODY, fontSize: 12 },
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    dataZoom: [{ type: "inside", xAxisIndex: 0 }],
    xAxis: {
      type: "category",
      data: keys,
      axisLabel: {
        color: "#8b90b0",
        fontSize: 10,
        fontFamily: FONT_BODY,
        fontWeight: "bold",
      },
      axisLine: { lineStyle: { color: "#dde1ef" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#8b90b0", fontSize: 9, fontFamily: FONT_DATA },
      splitLine: { lineStyle: { color: "#dde1ef", type: "dashed" } },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        data: vals,
        barMaxWidth: 40,
        itemStyle: { color: "#4fc98f", borderRadius: [3, 3, 0, 0] },
      },
    ],
    grid: { left: 36, right: 12, top: 16, bottom: 32 },
  };
}
