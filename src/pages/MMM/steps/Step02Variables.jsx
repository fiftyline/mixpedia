import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { MEDIA_TYPES } from "../mmmUtils";

export default function Step02Variables({
  trainset,
  timeCol, setTimeCol,
  kpiCol, setKpiCol,
  kpiType, setKpiType,
  reachType, setReachType,
  mediaRows, setMediaRows,
  mediaRfRows, setMediaRfRows,
  controlCols, setControlCols,
  onNext, onBack, showAlert,
}) {
  const updateMedia   = (i, key, val) => setMediaRows((p) => p.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  const updateMediaRf = (i, key, val) => setMediaRfRows((p) => p.map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  const handleNext = () => {
    if (!timeCol) { showAlert("시간 변수를 선택해주세요."); return; }
    if (!kpiCol)  { showAlert("KPI 변수를 선택해주세요."); return; }

    const validMedia   = mediaRows.filter((r) => r.alias && r.type && r.value);
    const validMediaRf = mediaRfRows.filter((r) => r.alias && r.type && r.reach && r.af);

    if (!validMedia.length && !validMediaRf.length) {
      showAlert("매체 변수 또는 매체 도달 변수 중 하나 이상을 입력해주세요.");
      return;
    }

    const allAliases = [...validMedia.map((r) => r.alias), ...validMediaRf.map((r) => r.alias)];
    if (new Set(allAliases).size !== allAliases.length) {
      showAlert("매체 명이 중복되어 있습니다. 확인해주세요.");
      return;
    }

    onNext();
  };

  return (
    <div className="mmm-card">
      <div className="mmm-card-title">Step 02 — 변수 정의</div>
      <p className="mmm-desc">
        업로드한 데이터의 각 컬럼들이 어떤 정보를 담고 있는지 정의해주세요.
      </p>

      {/* 필수 기본 변수 */}
      <div className="mmm-section-title">필수 기본 변수</div>
      <table className="mmm-var-table">
        <thead>
          <tr>
            <th>변수 구분</th>
            <th>변수 설명</th>
            <th>선택 여부</th>
            <th>변수 선택</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="mmm-td-label">시간 변수</td>
            <td className="mmm-td-desc">날짜 / 주차 / 월 등의 시간 단위</td>
            <td className="mmm-td-desc" style={{ textAlign: "center" }}>필수 / 1개</td>
            <td className="mmm-td-input">
              <select className="mmm-select" value={timeCol} onChange={(e) => setTimeCol(e.target.value)}>
                <option value="">-- 선택 --</option>
                {trainset.colnames.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </td>
          </tr>
          <tr>
            <td className="mmm-td-label">KPI 변수</td>
            <td className="mmm-td-desc">매출, 전환수 등 MMM 분석 대상 KPI</td>
            <td className="mmm-td-desc" style={{ textAlign: "center" }}>필수 / 1개</td>
            <td className="mmm-td-input">
              <select className="mmm-select" value={kpiCol} onChange={(e) => setKpiCol(e.target.value)}>
                <option value="">-- 선택 --</option>
                {trainset.numericColnames.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mmm-hr" />

      {/* KPI 유형 */}
      <div className="mmm-section-title">KPI 지표 유형</div>
      <p className="mmm-desc">
        - <strong>수량형 지표</strong>: 매출, 전환 수 등 0 이상의 값을 가지는 지표<br />
        - <strong>비율형 지표</strong>: 브랜드 인지도 등 0~1 사이의 비율 지표
      </p>
      <div className="mmm-radio-group">
        {[["numeric", "수량형 지표"], ["ratio", "비율형 지표"]].map(([val, label]) => (
          <label key={val} className="mmm-radio-label">
            <input type="radio" name="kpiType" value={val} checked={kpiType === val} onChange={() => setKpiType(val)} />
            {label}
          </label>
        ))}
      </div>

      <div className="mmm-hr" />

      {/* 매체 변수 */}
      <div className="mmm-section-title">매체 변수</div>
      <p className="mmm-desc">
        매체별 노출수, 클릭수 등 KPI에 대한 기여분을 측정하고 싶은 매체 요인 변수<br />
        - 매체 지표 변수와 매체 예산 변수가 함께 포함되어야 합니다.<br />
        - 예산 변수 미입력 시 지표 변수가 예산으로 간주됩니다.
      </p>
      <div className="mmm-example-box">
        <strong>`구글`</strong> 매체 변수 입력 예시 ·{" "}
        매체명: <code>구글</code> · 매체 유형: <code>디지털DA</code> · 지표 변수: <code>google_imp</code> · 예산 변수: <code>google_cost</code>
      </div>
      <div className="mmm-media-wrap">
        <table className="mmm-media-table">
          <thead>
            <tr>
              <th>#</th><th>매체명 (직접 입력)</th><th>매체 유형</th>
              <th>매체 지표 변수</th><th>매체 예산 변수</th><th></th>
            </tr>
          </thead>
          <tbody>
            {mediaRows.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: "0.78rem", width: 32 }}>{i + 1}</td>
                <td><input className="mmm-input" placeholder="매체명" value={row.alias} onChange={(e) => updateMedia(i, "alias", e.target.value)} /></td>
                <td>
                  <select className="mmm-select" value={row.type} onChange={(e) => updateMedia(i, "type", e.target.value)}>
                    <option value="">-- 선택 --</option>
                    {MEDIA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td>
                  <select className="mmm-select" value={row.value} onChange={(e) => updateMedia(i, "value", e.target.value)}>
                    <option value="">-- 선택 --</option>
                    {trainset.numericColnames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td>
                  <select className="mmm-select" value={row.cost} onChange={(e) => updateMedia(i, "cost", e.target.value)}>
                    <option value="">-- 선택 (미입력 시 지표변수 사용) --</option>
                    {trainset.numericColnames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td>
                  <button className="mmm-del-btn" onClick={() => setMediaRows((p) => p.filter((_, idx) => idx !== i))}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mmm-add-row-btn" onClick={() => setMediaRows((p) => [...p, { alias: "", type: "", value: "", cost: "" }])}>
        <Plus size={12} /> 행 추가
      </button>

      <div className="mmm-hr" />

      {/* 매체 도달 변수 */}
      <div className="mmm-section-title">매체 도달 변수</div>
      <p className="mmm-desc">
        매체의 도달/빈도를 모두 알고 있는 경우 입력할 수 있는 매체 요인 변수<br />
        - 도달 변수, 빈도 변수, 예산 변수가 함께 포함되어야 합니다.
      </p>
      <div className="mmm-example-box">
        <strong>`TV`</strong> 매체 도달 변수 입력 예시 ·{" "}
        매체명: <code>TV</code> · 유형: <code>TV</code> · 도달: <code>tv_reach</code> · 빈도: <code>tv_af</code> · 예산: <code>tv_cost</code>
      </div>
      <div className="mmm-radio-group" style={{ marginBottom: 10 }}>
        <span className="mmm-label" style={{ alignSelf: "center" }}>도달 지표 유형:</span>
        {[["reach_n", "도달수"], ["reach_p", "도달률"]].map(([val, label]) => (
          <label key={val} className="mmm-radio-label">
            <input type="radio" name="reachType" value={val} checked={reachType === val} onChange={() => setReachType(val)} />
            {label}
          </label>
        ))}
      </div>
      <div className="mmm-media-wrap">
        <table className="mmm-media-table">
          <thead>
            <tr>
              <th>#</th><th>매체명 (직접 입력)</th><th>매체 유형</th>
              <th>도달 변수</th><th>빈도 변수</th><th>예산 변수</th><th></th>
            </tr>
          </thead>
          <tbody>
            {mediaRfRows.map((row, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center", color: "var(--text-tertiary)", fontSize: "0.78rem", width: 32 }}>{i + 1}</td>
                <td><input className="mmm-input" placeholder="매체명" value={row.alias} onChange={(e) => updateMediaRf(i, "alias", e.target.value)} /></td>
                <td>
                  <select className="mmm-select" value={row.type} onChange={(e) => updateMediaRf(i, "type", e.target.value)}>
                    <option value="">-- 선택 --</option>
                    {MEDIA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td>
                  <select className="mmm-select" value={row.reach} onChange={(e) => updateMediaRf(i, "reach", e.target.value)}>
                    <option value="">-- 선택 --</option>
                    {trainset.numericColnames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td>
                  <select className="mmm-select" value={row.af} onChange={(e) => updateMediaRf(i, "af", e.target.value)}>
                    <option value="">-- 선택 --</option>
                    {trainset.numericColnames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td>
                  <select className="mmm-select" value={row.cost} onChange={(e) => updateMediaRf(i, "cost", e.target.value)}>
                    <option value="">-- 선택 (미입력 시 도달×빈도) --</option>
                    {trainset.numericColnames.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td>
                  <button className="mmm-del-btn" onClick={() => setMediaRfRows((p) => p.filter((_, idx) => idx !== i))}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="mmm-add-row-btn" onClick={() => setMediaRfRows((p) => [...p, { alias: "", type: "", reach: "", af: "", cost: "" }])}>
        <Plus size={12} /> 행 추가
      </button>

      <div className="mmm-hr" />

      {/* 기타 변수 */}
      <div className="mmm-section-title">기타 변수</div>
      <p className="mmm-desc">
        매체를 제외하고 KPI 변동을 유발할 수 있는 비매체 요인 (예: 프로모션 여부, 경쟁사 매출)
      </p>
      {controlCols.map((col, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
          <select
            className="mmm-select"
            style={{ minWidth: 200 }}
            value={col}
            onChange={(e) => setControlCols((p) => p.map((c, idx) => idx === i ? e.target.value : c))}
          >
            <option value="">-- 변수 선택 --</option>
            {trainset.colnames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button className="mmm-del-btn" onClick={() => setControlCols((p) => p.filter((_, idx) => idx !== i))}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button className="mmm-add-row-btn" onClick={() => setControlCols((p) => [...p, ""])}>
        <Plus size={12} /> 변수 추가
      </button>

      <div className="mmm-nav">
        <button className="mmm-btn" onClick={onBack}><ChevronLeft size={14} /> 이전</button>
        <button className="mmm-btn mmm-btn--primary" onClick={handleNext}>다음 <ChevronRight size={14} /></button>
      </div>
    </div>
  );
}
