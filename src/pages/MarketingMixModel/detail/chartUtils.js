export const ROMA = [
  "#003f5c",
  "#ffa600",
  "#2f4b7c",
  "#f95d6a",
  "#665191",
  "#ff7c43",
  "#a05195",
  "#d45087",
  "#bc5090",
  "#ff6361",
  "#58508d",
  "#2ca02c",
  "#1f77b4",
  "#ffbb78",
  "#98df8a",
  "#c5b0d5",
  "#17becf",
];

export const ROMA1 = ROMA.slice(1);

// Mixpedia design-system palette — slate first (baseline/neutral), then indigo-led
export const MIXPEDIA = [
  "#94a3b8", // slate   — 비마케팅 요인 (neutral baseline)
  "#6366f1", // indigo  — system primary
  "#0ea5e9", // sky
  "#10b981", // emerald
  "#f59e0b", // amber
  "#f43f5e", // rose
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#34d399", // emerald-400
  "#38bdf8", // sky-400
  "#fbbf24", // amber-400
  "#fb7185", // rose-400
  "#a78bfa", // violet-400
  "#22d3ee", // cyan-400
  "#84cc16", // lime
  "#f472b6", // pink
];

export function hexToRgba(hex, alpha = 0.2) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const TIMESEQ_LABEL = {
  weekly: "주",
  monthly: "월",
  daily: "일",
  yearly: "년",
};
