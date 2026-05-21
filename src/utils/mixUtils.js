export const GENDER_LABEL = { P: "전체", M: "남성", F: "여성" };

export function toArr(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}

export function fmtBudget(val) {
  return val != null ? `${Number(val).toLocaleString()}원` : "-";
}
