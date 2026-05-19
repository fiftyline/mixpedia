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

function SectionHeader({ num, title, tag, tagOpt }) {
  return (
    <div className="mmm-section-hdr">
      <span className="mmm-section-num">{num}</span>
      <span className="mmm-section-hdr-title">{title}</span>
      {tag && (
        <span className={`mmm-section-tag${tagOpt ? " mmm-section-tag--opt" : ""}`}>{tag}</span>
      )}
    </div>
  );
}

function SubSectionHeader({ title }) {
  return <div className="mmm-subsection-hdr">{title}</div>;
}

function ToggleRadio({ name, options, value, onChange }) {
  return (
    <div className="mmm-toggle-group">
      {options.map(([val, label]) => (
        <label key={val} className={`mmm-toggle-btn${value === val ? " mmm-toggle-btn--active" : ""}`}>
          <input type="radio" name={name} value={val} checked={value === val} onChange={() => onChange(val)} style={{ display: "none" }} />
          {label}
        </label>
      ))}
    </div>
  );
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
        <b>MMM을 위한 설정을 입력합니다. 캠페인 및 광고 효과와 관련하여 사전에 알고 있는 지식이나 경험적으로 습득한 정보를 입력해주세요.</b>
      </p>

      <br />

      {/* ── ① 광고 이월 기간 ── */}
      <SectionHeader num="①" title="광고 이월 기간" tag="필수" />

      <div className="mmm-lag-layout">
        <div className="mmm-lag-block">
          <div className="mmm-label" style={{ marginBottom: 8 }}>데이터의 시간 단위</div>
          <ToggleRadio
            name="timeseq"
            options={TIME_UNITS}
            value={timeseq}
            onChange={setTimeseq}
          />
        </div>

        <div className="mmm-lag-block">
          <div className="mmm-label" style={{ marginBottom: 8 }}>
            광고 효과 지속 기간 <span className="mmm-lag-unit">({timeLabel(timeseq)} 단위)</span>
          </div>
          <div className="mmm-lag-input-row">
            <input
              type="number" className="mmm-number-input"
              min={1} max={500} step={1}
              value={maxlag}
              onChange={(e) => setMaxlag(e.target.value)}
            />
            <span className="mmm-lag-suffix">{timeLabel(timeseq)}</span>
          </div>
          <p className="mmm-desc" style={{ marginTop: 6, fontSize: "0.76rem" }}>
            <b>매체 광고 효과가 평균적으로 몇 {timeLabel(timeseq)} 동안 지속된다고 생각하시나요?</b>
          </p>
        </div>
      </div>

      <br/>
      <div className="mmm-hr" />
      <br/>

      {/* ── ② 매체별 ROI ── */}
      <SectionHeader num="②" title="매체별 ROI" tag="선택" tagOpt />
      <p className="mmm-desc">
        <b>경험/직관을 통해 알게 된 입력 매체들의 평균 광고 효율 [ROAS(%)]이 있으신가요?</b> (예: 과거 유사 캠페인에서의 ROAS, 매체의 평균 ROAS 등)
      </p>
      <ToggleRadio
        name="roiYn"
        options={[["yes", "알고 있음"], ["no", "알지 못함"]]}
        value={useRoi ? "yes" : "no"}
        onChange={(v) => setUseRoi(v === "yes")}
      />
      {useRoi && (
        <div style={{ marginTop: 14 }}>
          <RoiTable aliases={allMediaAliases} values={roiValues} onChange={setRoi} />
        </div>
      )}

      {/* ── ③ 도달 & 빈도 (RF 매체 있을 때만) ── */}
      {rfAliases.length > 0 && (
        <>
          <br/>
          <div className="mmm-hr" />
          <br/>
          <SectionHeader num="③" title="도달 & 빈도" tag="RF 매체 전용" tagOpt />

          {/* RF 타겟 */}
          <SubSectionHeader title="도달 지표 기준 타겟" />
          <div className="mmm-rf-target-grid">
            <div className="mmm-var-card" style={{ gridColumn: "span 1" }}>
              <div className="mmm-var-card-label">성별</div>
              <div className="mmm-var-card-desc">도달 지표의 타겟 성별</div>
              <select className="mmm-select" style={{ width: "100%" }} value={rfGender} onChange={(e) => setRfGender(e.target.value)}>
                <option value="P">P (전체)</option>
                <option value="M">M (남성)</option>
                <option value="F">F (여성)</option>
              </select>
            </div>
            <div className="mmm-var-card">
              <div className="mmm-var-card-label">연령 최소</div>
              <div className="mmm-var-card-desc">타겟 연령 하한</div>
              <input type="number" className="mmm-number-input" style={{ width: "100%" }} min={7} max={79} value={rfAgeMin} onChange={(e) => setRfAgeMin(Number(e.target.value))} />
            </div>
            <div className="mmm-var-card">
              <div className="mmm-var-card-label">연령 최대</div>
              <div className="mmm-var-card-desc">타겟 연령 상한</div>
              <input type="number" className="mmm-number-input" style={{ width: "100%" }} min={7} max={79} value={rfAgeMax} onChange={(e) => setRfAgeMax(Number(e.target.value))} />
            </div>
          </div>

          <br/>

          {/* 커버리지 */}
          <SubSectionHeader title="커버리지 (MAU 비율) : 입력한 매체들의 타겟에 대한 인구 커버리지 (MAU 비율)을 알고 있나요?" />
          <ToggleRadio
            name="coverageYn"
            options={[["yes", "알고 있음"], ["no", "알지 못함"]]}
            value={useCoverage ? "yes" : "no"}
            onChange={(v) => setUseCoverage(v === "yes")}
          />
          {useCoverage && (
            <div style={{ marginTop: 14 }}>
              <NumericTable aliases={rfAliases} values={coverageValues} onChange={setCoverage} colLabel="커버리지 (%)" />
            </div>
          )}

          <br/>
          {/* 적정 빈도 */}
          <SubSectionHeader title={`경험 / 직관을 통해 알게된, 입력한 매체들의 "${timeLabel(timeseq)}" 별 적정 빈도가 있나요?`} />
          <ToggleRadio
            name="optfreqYn"
            options={[["yes", "알고 있음"], ["no", "알지 못함"]]}
            value={useOptfreq ? "yes" : "no"}
            onChange={(v) => setUseOptfreq(v === "yes")}
          />
          {useOptfreq && (
            <div style={{ marginTop: 14 }}>
              <NumericTable aliases={rfAliases} values={optfreqValues} onChange={setOptfreq} colLabel="적정 빈도" />
            </div>
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
