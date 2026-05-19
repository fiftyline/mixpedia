export const MEDIA_TYPES = ["TV", "OOH/라디오", "디지털DA", "디지털VA", "검색광고", "기타"];
export const STEPS = ["모델 정의", "데이터 업로드", "변수 정의", "모델 설정", "완료"];

export const emptyMedia   = () => ({ alias: "", type: "", value: "", cost: "" });
export const emptyMediaRf = () => ({ alias: "", type: "", reach: "", af: "", cost: "" });

export const emptyTrainset = () => ({
  colnames: [], numericColnames: [], rows: [], rowCount: 0, colCount: 0,
});

export async function makeModelId(modelname, username) {
  const str = modelname + username + Date.now() + Math.random();
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 20);
}

export function getCurrentTimestamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
