export const ROMA = [
  "#003f5c", "#ffa600", "#2f4b7c", "#f95d6a", "#665191",
  "#ff7c43", "#a05195", "#d45087", "#bc5090", "#ff6361",
  "#58508d", "#2ca02c", "#1f77b4", "#ffbb78", "#98df8a",
  "#c5b0d5", "#17becf",
];

export const ROMA1 = ROMA.slice(1);

export function hexToRgba(hex, alpha = 0.2) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export const TIMESEQ_LABEL = {
  weekly: "주", monthly: "월", daily: "일", yearly: "년",
};
