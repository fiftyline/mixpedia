import { ChevronLeft } from "lucide-react";

const TIME_UNITS = [
  ["daily",   "일 (Daily)"],
  ["weekly",  "주 (Weekly)"],
  ["monthly", "월 (Monthly)"],
  ["yearly",  "년 (Yearly)"],
];

function timeLabel(timeseq) {
  return TIME_UNITS.find(([v]) => v === timeseq)?.[1] ?? "일 (Daily)";
}

function RoiTable({ aliases, values, onChange }) {
  if (!aliases.length) return <p className="mmm-desc">Step 02에서 입력된 매체가 없습니다.</p>;
  return (
    <table className="mmm-roi-table">
      <thead><tr><th>매체</th><th>ROI (%)</th></tr></thead>
      <tbody>
        {aliases.map((alias) => (
          <tr key={alias}>
            <td className="mmm-roi-alias">{alias}</td>
            <td>
              <input
                type="number" className="mmm-number-input"
                min={1} max={2000} step={1}
                value={values[alias] ?? 200}
                onChange={(e) => onChange(alias, Number(e.target.value))}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NumericTable({ aliases, values, onChange, colLabel }) {
  if (!aliases.length) return null;
  return (
    <table className="mmm-roi-table">
      <thead><tr><th>매체</th><th>{colLabel}</th></tr></thead>
      <tbody>
        {aliases.map((alias) => (
          <tr key={alias}>
            <td className="mmm-roi-alias">{alias}</td>
            <td>
              <input
                type="number" className="mmm-number-input"
                min={1} max={100} step={0.1}
                value={values[alias] ?? (colLabel.includes("커버리지") ? 95 : 3)}
                onChange={(e) => onChange(alias, Number(e.target.value))}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Step03Settings({
  timeseq, setTimeseq,
  maxlag, setMaxlag,
  useRoi, setUseRoi,
  roiValues, setRoiValues,
  rfGender, setRfGender,
  rfAgeMin, setRfAgeMin,
  rfAgeMax, setRfAgeMax,
  useCoverage, setUseCoverage,
  coverageValues, setCoverageValues,
  useOptfreq, setUseOptfreq,
  optfreqValues, setOptfreqValues,
  allMediaAliases,
  rfAliases,
  onConfirm, onBack, loading,
}) {
  const setRoi      = (alias, val) => setRoiValues((p) => ({ ...p, [alias]: val }));
  const setCoverage = (alias, val) => setCoverageValues((p) => ({ ...p, [alias]: val }));
  const setOptfreq  = (alias, val) => setOptfreqValues((p) => ({ ...p, [alias]: val }));

  return (
    <div className="mmm-card">
      <div className="mmm-card-title">Step 03 — 모델 설정</div>
      <p className="mmm-desc">
        MMM을 위한 설정을 입력합니다. 캠페인 및 광고 효과와 관련하여 사전에 알고 있는 지식이나 경험적으로 습득한 정보를 입력해주세요.
      </p>

      {/* 광고 이월 기간 */}
      <div className="mmm-section-title">광고 이월 기간</div>
      <div className="mmm-field">
        <label className="mmm-label">데이터의 시간 단위</label>
        <div className="mmm-radio-group">
          {TIME_UNITS.map(([val, label]) => (
            <label key={val} className="mmm-radio-label">
              <input type="radio" name="timeseq" value={val} checked={timeseq === val} onChange={() => setTimeseq(val)} />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="mmm-field">
        <label className="mmm-label">
          매체 광고 효과는 평균적으로 몇 <strong>{timeLabel(timeseq).split(" ")[0]}</strong> 동안 지속된다고 생각하나요?
        </label>
        <input
          type="number" className="mmm-number-input"
          min={1} max={500} step={1}
          value={maxlag}
          onChange={(e) => setMaxlag(e.target.value)}
        />
      </div>

      <div className="mmm-hr" />

      {/* 매체별 ROI */}
      <div className="mmm-section-title">매체별 ROI</div>
      <p className="mmm-desc">
        경험/직관을 통해 알게 된 입력 매체들의 평균 광고 효율 [ROI(%)]이 있으신가요?
      </p>
      <div className="mmm-radio-group" style={{ marginBottom: 14 }}>
        <label className="mmm-radio-label">
          <input type="radio" name="roiYn" checked={useRoi} onChange={() => setUseRoi(true)} /> 알고 있음
        </label>
        <label className="mmm-radio-label">
          <input type="radio" name="roiYn" checked={!useRoi} onChange={() => setUseRoi(false)} /> 알지 못함
        </label>
      </div>
      {useRoi && <RoiTable aliases={allMediaAliases} values={roiValues} onChange={setRoi} />}

      {/* 도달 & 빈도 (RF 매체 있을 때만) */}
      {rfAliases.length > 0 && (
        <>
          <div className="mmm-hr" />
          <div className="mmm-section-title">도달 & 빈도</div>

          <div className="mmm-field">
            <label className="mmm-label">도달 지표의 기준 성/연령 타겟</label>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div>
                <label className="mmm-label" style={{ fontSize: "0.72rem" }}>성별</label>
                <select className="mmm-select" value={rfGender} onChange={(e) => setRfGender(e.target.value)}>
                  <option value="P">P (전체)</option>
                  <option value="M">M (남성)</option>
                  <option value="F">F (여성)</option>
                </select>
              </div>
              <div>
                <label className="mmm-label" style={{ fontSize: "0.72rem" }}>연령 최소</label>
                <input type="number" className="mmm-number-input" min={7} max={79} value={rfAgeMin} onChange={(e) => setRfAgeMin(Number(e.target.value))} />
              </div>
              <div>
                <label className="mmm-label" style={{ fontSize: "0.72rem" }}>연령 최대</label>
                <input type="number" className="mmm-number-input" min={7} max={79} value={rfAgeMax} onChange={(e) => setRfAgeMax(Number(e.target.value))} />
              </div>
            </div>
          </div>

          <p className="mmm-desc">커버리지 (MAU 비율)를 알고 있나요?</p>
          <div className="mmm-radio-group" style={{ marginBottom: 12 }}>
            <label className="mmm-radio-label">
              <input type="radio" name="coverageYn" checked={useCoverage} onChange={() => setUseCoverage(true)} /> 알고 있음
            </label>
            <label className="mmm-radio-label">
              <input type="radio" name="coverageYn" checked={!useCoverage} onChange={() => setUseCoverage(false)} /> 알지 못함
            </label>
          </div>
          {useCoverage && (
            <NumericTable aliases={rfAliases} values={coverageValues} onChange={setCoverage} colLabel="커버리지 (%)" />
          )}

          <div style={{ height: 14 }} />

          <p className="mmm-desc">적정 빈도가 있나요?</p>
          <div className="mmm-radio-group" style={{ marginBottom: 12 }}>
            <label className="mmm-radio-label">
              <input type="radio" name="optfreqYn" checked={useOptfreq} onChange={() => setUseOptfreq(true)} /> 알고 있음
            </label>
            <label className="mmm-radio-label">
              <input type="radio" name="optfreqYn" checked={!useOptfreq} onChange={() => setUseOptfreq(false)} /> 알지 못함
            </label>
          </div>
          {useOptfreq && (
            <NumericTable aliases={rfAliases} values={optfreqValues} onChange={setOptfreq} colLabel="적정 빈도" />
          )}
        </>
      )}

      <div className="mmm-nav">
        <button className="mmm-btn" onClick={onBack}><ChevronLeft size={14} /> 이전</button>
        <button className="mmm-btn mmm-btn--primary" onClick={onConfirm} disabled={loading}>
          {loading ? "생성 중..." : "모델 생성"}
        </button>
      </div>
    </div>
  );
}
