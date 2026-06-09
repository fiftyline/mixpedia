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
    legend: { bottom: 0, textStyle: { color: "#9ca3bf", fontSize: 11 } },
    series: [
      {
        type: "pie",
        radius: ["40%", "68%"],
        center: ["50%", "44%"],
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
    grid: { left: 36, right: 12, top: 16, bottom: 32 },
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
  const sorted = [...rows].sort((a, b) => b.avg_budget_ratio - a.avg_budget_ratio);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) =>
        `<b>${p[0].name}</b><br/>평균 예산 비중: ${(p[0].value * 100).toFixed(1)}%`,
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
        data: sorted.map((r) => r.avg_budget_ratio),
        barMaxWidth: 28,
        itemStyle: { color: "#4f80e1", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "right",
          formatter: (p) => fmtBudget(sorted[p.dataIndex]?.avg_budget),
          color: "#9ca3bf",
          fontSize: 11,
        },
      },
    ],
    grid: { left: 100, right: 64, top: 12, bottom: 24 },
  };
}

export function mediaFreqOption(rows) {
  const sorted = [...rows].sort((a, b) => b.frequency - a.frequency);
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
