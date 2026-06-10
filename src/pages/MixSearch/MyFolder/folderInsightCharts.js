const PALETTE = [
  "#6366f1",
  "#4f80e1",
  "#4fc98f",
  "#f5a623",
  "#e15f4f",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
];

const GENDER_COLORS = {
  전체: "#9ca3af",
  P: "#9ca3af",
  남성: "#4f80e1",
  M: "#4f80e1",
  여성: "#f472b6",
  F: "#f472b6",
};

function fmtBudget(v) {
  if (v == null) return "-";
  const n = Number(v);
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}억`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(0)}만`;
  return n.toLocaleString();
}

/* my-folder 작성단가 및 효율 차트 유틸 비활성화
function fmtHistEdge(val, unit = "") {
  if (val == null) return "";
  const n = Number(val);
  if (unit === "%") return `${n.toFixed(n < 10 ? 2 : 1)}%`;
  return `${fmtBudget(n)}${unit}`;
}

export function performanceHistOption(stat, unit = "") {
  const counts = stat?.hist?.counts ?? [];
  const edges = stat?.hist?.edges ?? [];
  const labels = counts.map(
    (_, i) => `${fmtHistEdge(edges[i], unit)}~${fmtHistEdge(edges[i + 1], unit)}`,
  );

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    dataZoom: [{ type: "inside", xAxisIndex: 0 }],
    xAxis: {
      type: "category",
      data: labels,
      axisLabel: {
        color: "#9ca3bf",
        fontSize: 10,
        rotate: 30,
        interval: 0,
      },
    },
    yAxis: { type: "value", axisLabel: { color: "#9ca3bf" } },
    series: [
      {
        type: "bar",
        data: counts,
        barMaxWidth: 36,
        itemStyle: { color: "#6366f1", borderRadius: [3, 3, 0, 0] },
      },
    ],
    grid: { left: 36, right: 12, top: 16, bottom: 54 },
  };
}

*/
export function budgetDistOption({ buckets, mean }) {
  const { counts, bin_edges } = buckets;
  const keys = counts.map(
    (_, i) => `${fmtBudget(bin_edges[i])}~${fmtBudget(bin_edges[i + 1])}`,
  );
  return {
    tooltip: {
      trigger: "axis",
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    xAxis: {
      type: "category",
      data: keys,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    yAxis: {
      type: "value",
      name: "믹스 수",
      nameTextStyle: { color: "#9ca3bf" },
      axisLabel: { color: "#9ca3bf" },
    },
    series: [
      {
        type: "bar",
        data: counts,
        barMaxWidth: 48,
        itemStyle: { color: "#6366f1", borderRadius: [3, 3, 0, 0] },
        markLine: {
          silent: true,
          data: [{ type: "average" }],
          lineStyle: { color: "#f5a623", type: "dashed" },
          label: {
            formatter: `평균 ${fmtBudget(mean)}`,
            color: "#f5a623",
            fontSize: 11,
            position: "insideStartTop",
          },
        },
      },
    ],
    grid: { left: 40, right: 20, top: 24, bottom: 32 },
  };
}

export function genderOption(gender) {
  const data = Object.entries(gender).map(([name, value], i) => ({
    name,
    value,
    itemStyle: { color: GENDER_COLORS[name] ?? PALETTE[i] },
  }));
  return {
    tooltip: { trigger: "item", formatter: "<b>{b}</b>: {c}건 ({d}%)" },
    legend: { bottom: 4, textStyle: { color: "#9ca3bf", fontSize: 11 } },
    series: [
      {
        type: "pie",
        radius: ["40%", "68%"],
        center: ["50%", "50%"],
        label: {
          show: true,
          fontSize: 11,
          color: "#9ca3bf",
          formatter: "{b}\n{d}%",
        },
        data,
      },
    ],
  };
}

export function ageOption(age_group) {
  const keys = Object.keys(age_group);
  const vals = Object.values(age_group);
  return {
    tooltip: {
      trigger: "axis",
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    xAxis: {
      type: "category",
      data: keys,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    yAxis: { type: "value", axisLabel: { color: "#9ca3bf" } },
    series: [
      {
        type: "bar",
        data: vals,
        barMaxWidth: 40,
        itemStyle: { color: "#4fc98f", borderRadius: [3, 3, 0, 0] },
      },
    ],
    grid: { left: 36, right: 12, top: 42, bottom: 42 },
  };
}

export function industryOption(dist) {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    xAxis: { type: "value", axisLabel: { color: "#9ca3bf" } },
    yAxis: {
      type: "category",
      data: sorted.map(([k]) => k),
      inverse: true,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map(([, v]) => v),
        barMaxWidth: 28,
        itemStyle: { color: "#e15f4f", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "right",
          color: "#9ca3bf",
          fontSize: 11,
        },
      },
    ],
    grid: { left: 80, right: 40, top: 12, bottom: 24 },
  };
}

export function mediaBudgetOption(rows) {
  const sorted = [...rows].sort(
    (a, b) =>
      (b.mix_count ?? 0) - (a.mix_count ?? 0) ||
      (b.median_budget_ratio ?? b.avg_budget_ratio ?? 0) -
        (a.median_budget_ratio ?? a.avg_budget_ratio ?? 0),
  ).slice(0, 20);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) => {
        const row = sorted[p[0].dataIndex];
        return `<b>${p[0].name}</b><br/>예산 비중 중앙값: ${(p[0].value * 100).toFixed(1)}%<br/>포함 믹스: ${(row?.mix_count ?? 0).toLocaleString()}건`;
      },
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: (v) => `${(v * 100).toFixed(0)}%`,
        color: "#9ca3bf",
      },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.media_mapped),
      inverse: true,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((r) => r.median_budget_ratio ?? r.avg_budget_ratio),
        barMaxWidth: 28,
        itemStyle: { color: "#4f80e1", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "right",
          formatter: (p) => `${(p.value * 100).toFixed(1)}%`,
          color: "#9ca3bf",
          fontSize: 11,
        },
      },
    ],
    grid: { left: 100, right: 64, top: 12, bottom: 24 },
  };
}

export function mediaFreqOption(rows) {
  const sorted = [...rows]
    .sort((a, b) => b.mix_count - a.mix_count)
    .slice(0, 20);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) =>
        `<b>${p[0].name}</b><br/>${p[0].value}개 믹스에 포함 (${(sorted[p[0].dataIndex].frequency * 100).toFixed(0)}%)`,
    },
    xAxis: {
      type: "value",
      name: "믹스 수",
      nameTextStyle: { color: "#9ca3bf" },
      axisLabel: { color: "#9ca3bf" },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.media_mapped),
      inverse: true,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((r) => r.mix_count),
        barMaxWidth: 28,
        itemStyle: { color: "#9b59b6", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "inside",
          formatter: (p) => `${p.value}건`,
          color: "#ffffff",
          fontSize: 11,
          fontWeight: "bold",
        },
      },
    ],
    grid: { left: 100, right: 56, top: 12, bottom: 32 },
  };
}
