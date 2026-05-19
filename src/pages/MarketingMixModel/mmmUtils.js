export const MEDIA_TYPES = ["TV", "OOH/라디오", "디지털DA", "디지털VA", "검색광고", "기타"];
export const STEPS = ["모델 정의", "데이터 업로드", "변수 정의", "모델 설정", "완료"];

export const emptyMedia   = () => ({ alias: "", type: "", value: "", cost: "" });
export const emptyMediaRf = () => ({ alias: "", type: "", reach: "", af: "", cost: "" });

export const emptyTrainset = () => ({
  colnames: [], numericColnames: [], rows: [], rowCount: 0, colCount: 0,
});

export function makeModelId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `mmm-${yy}${mm}${dd}-${rand}`;
}

export function getCurrentTimestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
