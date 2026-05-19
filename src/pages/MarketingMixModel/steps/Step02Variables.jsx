import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { MEDIA_TYPES } from "../mmmUtils";

function SectionHeader({ num, title, tag, tagOpt }) {
  return (
    <div className="mmm-section-hdr">
      <span className="mmm-section-num">{num}</span>
      <span className="mmm-section-hdr-title">{title}</span>
      {tag && (
        <span
          className={`mmm-section-tag${tagOpt ? " mmm-section-tag--opt" : ""}`}
        >
          {tag}
        </span>
      )}
    </div>
  );
}

function ToggleRadio({ name, options, value, onChange }) {
  return (
    <div className="mmm-toggle-group">
      {options.map(([val, label]) => (
        <label
          key={val}
          className={`mmm-toggle-btn${value === val ? " mmm-toggle-btn--active" : ""}`}
        >
          <input
            type="radio"
            name={name}
            value={val}
            checked={value === val}
            onChange={() => onChange(val)}
            style={{ display: "none" }}
          />
          {label}
        </label>
      ))}
    </div>
  );
}

export default function Step02Variables({
  trainset,
  timeCol,
  setTimeCol,
  kpiCol,
  setKpiCol,
  kpiType,
  setKpiType,
  reachType,
  setReachType,
  mediaRows,
  setMediaRows,
  mediaRfRows,
  setMediaRfRows,
  controlCols,
  setControlCols,
  onNext,
  onBack,
  showAlert,
}) {
  const updateMedia = (i, key, val) =>
    setMediaRows((p) =>
      p.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)),
    );
  const updateMediaRf = (i, key, val) =>
    setMediaRfRows((p) =>
      p.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)),
    );

  const handleNext = () => {
    if (!timeCol) {
      showAlert("시간 변수를 선택해주세요.");
      return;
    }
    if (!kpiCol) {
      showAlert("KPI 변수를 선택해주세요.");
      return;
    }

    const validMedia = mediaRows.filter((r) => r.alias && r.type && r.value);
    const validMediaRf = mediaRfRows.filter(
      (r) => r.alias && r.type && r.reach && r.af,
    );

    if (!validMedia.length && !validMediaRf.length) {
      showAlert("매체 변수 또는 매체 도달 변수 중 하나 이상을 입력해주세요.");
      return;
    }

    const allAliases = [
      ...validMedia.map((r) => r.alias),
      ...validMediaRf.map((r) => r.alias),
    ];
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
        <b>
          MMM 분석에 사용할 변수를 정의하는 단계입니다. 각 변수의 의미와 유형을
          정확히 입력해주세요.
        </b>
      </p>
      <br></br>

      {/* ── ① 필수 기본 변수 ── */}
      <SectionHeader num="①" title="필수 기본 변수" tag="필수" />
      <div className="mmm-var-cards">
        <div className="mmm-var-card">
          <div className="mmm-var-card-label">시간 변수</div>
          <div className="mmm-var-card-desc">
            <b>날짜 / 주차 / 월 등의 시간 단위 · 1개</b>
          </div>
          <select
            className="mmm-select mmm-var-card-select"
            value={timeCol}
            onChange={(e) => setTimeCol(e.target.value)}
          >
            <option value="">-- 선택 --</option>
            {trainset.colnames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="mmm-var-card">
          <div className="mmm-var-card-label">KPI 변수</div>
          <div className="mmm-var-card-desc">
            <b>매출, 전환수 등 분석 대상 KPI · 1개 · 수치형만</b>
          </div>
          <select
            className="mmm-select mmm-var-card-select"
            value={kpiCol}
            onChange={(e) => setKpiCol(e.target.value)}
          >
            <option value="">-- 선택 --</option>
            {trainset.numericColnames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <br></br>
      <div className="mmm-hr" />
      <br></br>
      {/* ── ② KPI 지표 유형 ── */}
      <SectionHeader num="②" title="KPI 지표 유형" tag="필수" />
      <div className="mmm-kpi-type-wrap">
        <ToggleRadio
          name="kpiType"
          options={[
            ["numeric", "수량형 지표"],
            ["ratio", "비율형 지표"],
          ]}
          value={kpiType}
          onChange={setKpiType}
        />
        <div className="mmm-toggle-descs">
          <span
            className={
              kpiType === "numeric"
                ? "mmm-toggle-desc--active"
                : "mmm-toggle-desc"
            }
          >
            매출, 전환 수 등 0 이상의 값을 가지는 지표
          </span>
          <span
            className={
              kpiType === "ratio"
                ? "mmm-toggle-desc--active"
                : "mmm-toggle-desc"
            }
          >
            브랜드 인지도 등 0~1 사이의 비율 지표
          </span>
        </div>
      </div>

      <br></br>
      <div className="mmm-hr" />
      <br></br>

      {/* ── ③ 매체 변수 ── */}
      <SectionHeader
        num="③"
        title="매체 변수"
        tag="매체 또는 ④ 중 1개 이상 필수"
      />
      <p className="mmm-desc" style={{ marginTop: 6 }}>
        <b>매체별 노출수·클릭수 등 KPI 기여분을 측정할 매체 요인 변수입니다.</b>
        <br />
        지표 변수와 예산 변수를 함께 입력하세요. 예산 변수 미입력 시 지표 변수가
        예산으로 간주됩니다.
      </p>
      <div className="mmm-example-box">
        <strong>`구글` 매체 변수 입력 예시</strong><br />
        - <strong>매체명:</strong> <code>구글</code> (사용자 직접 입력)<br />
        - <strong>유형:</strong>{" "}
        <code>디지털DA</code> (['TV', 'OOH/라디오/검색광고', '디지털DA', '디지털 VA', '기타'] 중 매체의 유형을 선택)<br />
        - <strong>지표:</strong> <code>google_imp</code> (데이터 내 <code>구글</code>의 노출량을 의미하는 컬럼 선택)<br />
        - <strong>예산:</strong>{" "}
        <code>google_cost</code>  (데이터 내 <code>구글</code>의 예산을 의미하는 컬럼 선택)
      </div>
      <div className="mmm-media-wrap">
        <table className="mmm-media-table">
          <thead>
            <tr>
              <th>#</th>
              <th>매체명</th>
              <th>매체 유형</th>
              <th>매체 지표 변수</th>
              <th>매체 예산 변수</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mediaRows.map((row, i) => (
              <tr key={i}>
                <td
                  style={{
                    textAlign: "center",
                    color: "var(--text-tertiary)",
                    fontSize: "0.78rem",
                    width: 32,
                  }}
                >
                  {i + 1}
                </td>
                <td>
                  <input
                    className="mmm-input"
                    placeholder="매체명 입력"
                    value={row.alias}
                    onChange={(e) => updateMedia(i, "alias", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.type}
                    onChange={(e) => updateMedia(i, "type", e.target.value)}
                  >
                    <option value="">-- 선택 --</option>
                    {MEDIA_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.value}
                    onChange={(e) => updateMedia(i, "value", e.target.value)}
                  >
                    <option value="">-- 선택 --</option>
                    {trainset.numericColnames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.cost}
                    onChange={(e) => updateMedia(i, "cost", e.target.value)}
                  >
                    <option value="">
                      -- 선택 (미입력 시 지표변수 사용) --
                    </option>
                    {trainset.numericColnames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="mmm-del-btn"
                    onClick={() =>
                      setMediaRows((p) => p.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mmm-add-row-btn"
        onClick={() =>
          setMediaRows((p) => [
            ...p,
            { alias: "", type: "", value: "", cost: "" },
          ])
        }
      >
        <Plus size={12} /> 행 추가
      </button>

      <br></br>
      <div className="mmm-hr" />
      <br></br>

      {/* ── ④ 매체 도달 변수 ── */}
      <SectionHeader num="④" title="매체 도달 변수" tag="선택" tagOpt />
      <p className="mmm-desc" style={{ marginTop: 6 }}>
        <b>도달/빈도를 모두 알고 있는 매체에 적용합니다. 도달 변수·빈도 변수·예산</b>
        변수를 함께 입력하세요.
      </p>
      <div className="mmm-example-box">
        <strong>`TV` 매체 변수 입력 예시</strong><br/>
        - <strong>매체명:</strong> <code>TV OOO채널</code> (사용자 직접 입력)<br/>
        - <strong>유형:</strong>{" "}
        <code>TV</code> (['TV', 'OOH/라디오/검색광고', '디지털DA', '디지털 VA', '기타'] 중 매체의 유형을 선택)<br/>
        - <strong>도달:</strong> <code>tv_reach</code> (데이터 내 'TV OOO채널'의 도달률/도달수를 의미하는 컬럼 선택)<br/>
        - <strong>빈도:</strong> <code>tv_af</code> (데이터 내 'TV OOO채널'의 평균빈도를 의미하는 컬럼 선택)<br/>
        - <strong>예산:</strong> <code>tv_cost</code> (데이터 내 'TV OOO채널'의 예산을 의미하는 컬럼 선택 · 미입력 시 도달×빈도로 간주)
      </div>
      <div className="mmm-rf-reach-row">
        <span className="mmm-label" style={{ alignSelf: "center" }}>
          도달 지표 유형
        </span>
        <ToggleRadio
          name="reachType"
          options={[
            ["reach_n", "도달수"],
            ["reach_p", "도달률"],
          ]}
          value={reachType}
          onChange={setReachType}
        />
      </div>
      <div className="mmm-media-wrap" style={{ marginTop: 10 }}>
        <table className="mmm-media-table">
          <thead>
            <tr>
              <th>#</th>
              <th>매체명</th>
              <th>매체 유형</th>
              <th>도달 변수</th>
              <th>빈도 변수</th>
              <th>예산 변수</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mediaRfRows.map((row, i) => (
              <tr key={i}>
                <td
                  style={{
                    textAlign: "center",
                    color: "var(--text-tertiary)",
                    fontSize: "0.78rem",
                    width: 32,
                  }}
                >
                  {i + 1}
                </td>
                <td>
                  <input
                    className="mmm-input"
                    placeholder="매체명 입력"
                    value={row.alias}
                    onChange={(e) => updateMediaRf(i, "alias", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.type}
                    onChange={(e) => updateMediaRf(i, "type", e.target.value)}
                  >
                    <option value="">-- 선택 --</option>
                    {MEDIA_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.reach}
                    onChange={(e) => updateMediaRf(i, "reach", e.target.value)}
                  >
                    <option value="">-- 선택 --</option>
                    {trainset.numericColnames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.af}
                    onChange={(e) => updateMediaRf(i, "af", e.target.value)}
                  >
                    <option value="">-- 선택 --</option>
                    {trainset.numericColnames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="mmm-select"
                    value={row.cost}
                    onChange={(e) => updateMediaRf(i, "cost", e.target.value)}
                  >
                    <option value="">-- 선택 (미입력 시 도달×빈도) --</option>
                    {trainset.numericColnames.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="mmm-del-btn"
                    onClick={() =>
                      setMediaRfRows((p) => p.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mmm-add-row-btn"
        onClick={() =>
          setMediaRfRows((p) => [
            ...p,
            { alias: "", type: "", reach: "", af: "", cost: "" },
          ])
        }
      >
        <Plus size={12} /> 행 추가
      </button>

      <br></br>
      <div className="mmm-hr" />
      <br></br>

      {/* ── ⑤ 기타 변수 ── */}
      <SectionHeader num="⑤" title="기타 (통제) 변수" tag="선택" tagOpt />
      <p className="mmm-desc" style={{ marginTop: 6 }}>
        <b>매체를 제외하고 KPI 변동을 유발할 수 있는 비매체 요인들을 (예: 프로모션 여부, 경쟁사 매출)을 선택해주세요</b>
      </p>
      <div className="mmm-control-list">
        {controlCols.map((col, i) => (
          <div key={i} className="mmm-control-row">
            <select
              className="mmm-select"
              value={col}
              onChange={(e) =>
                setControlCols((p) =>
                  p.map((c, idx) => (idx === i ? e.target.value : c)),
                )
              }
            >
              <option value="">-- 변수 선택 --</option>
              {trainset.colnames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              className="mmm-del-btn"
              onClick={() =>
                setControlCols((p) => p.filter((_, idx) => idx !== i))
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
      <button
        className="mmm-add-row-btn"
        onClick={() => setControlCols((p) => [...p, ""])}
      >
        <Plus size={12} /> 변수 추가
      </button>

      <div className="mmm-nav">
        <button className="mmm-btn" onClick={onBack}>
          <ChevronLeft size={14} /> 이전
        </button>
        <button className="mmm-btn mmm-btn--primary" onClick={handleNext}>
          다음 <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
