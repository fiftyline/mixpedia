const TIME_UNIT = { daily: "일", weekly: "주", monthly: "월", yearly: "년" };

function AssessmentBadge({ text }) {
  if (!text) return <span className="mmm-detail-stat-stext">—</span>;
  const lower = text.toLowerCase();
  const cls = lower.includes("높") ? "good"
    : lower.includes("낮") ? "warn"
    : "neutral";
  return <span className={`mmm-detail-assess mmm-detail-assess--${cls}`}>{text}</span>;
}

export default function MmmDetailHeader({ data }) {
  const { optionset, overviewCmt } = data;
  const cmt = overviewCmt?.[0] ?? {};
  const aliases = [
    ...(optionset?.media_alias ?? []),
    ...(optionset?.media_rf_alias ?? []),
  ];

  return (
    <div className="mmm-card">
      <div className="mmm-card-title">모델 정보</div>

      {/* Stat strip — key metrics at a glance */}
      <div className="mmm-detail-stat-strip">
        <div className="mmm-detail-stat-cell">
          <span className="mmm-detail-stat-slabel">R²</span>
          <span className="mmm-detail-stat-sbig">
            {cmt.model_r2 != null ? `${cmt.model_r2}%` : "—"}
          </span>
        </div>
        <div className="mmm-detail-stat-cell">
          <span className="mmm-detail-stat-slabel">MAPE</span>
          <span className="mmm-detail-stat-sbig">
            {cmt.model_mape != null ? `${cmt.model_mape}%` : "—"}
          </span>
        </div>
        <div className="mmm-detail-stat-cell">
          <span className="mmm-detail-stat-slabel">모델 평가</span>
          <AssessmentBadge text={cmt.overview_comment} />
        </div>
        <div className="mmm-detail-stat-cell">
          <span className="mmm-detail-stat-slabel">KPI 변수</span>
          <span className="mmm-detail-stat-stext">{cmt.kpi_vars ?? "—"}</span>
        </div>
        <div className="mmm-detail-stat-cell">
          <span className="mmm-detail-stat-slabel">분석 기간</span>
          <span className="mmm-detail-stat-stext mmm-detail-mono" style={{ fontSize: "0.8rem" }}>
            {cmt.time_range ?? "—"}
          </span>
        </div>
      </div>

      {/* Detail meta grid */}
      <div className="mmm-detail-meta-grid">
        <div className="mmm-detail-meta-item">
          <span className="mmm-detail-meta-label">모델 ID</span>
          <span className="mmm-detail-meta-value mmm-detail-mono">{data.modelid}</span>
        </div>
        <div className="mmm-detail-meta-item">
          <span className="mmm-detail-meta-label">모델명</span>
          <span className="mmm-detail-meta-value">{data.modelname}</span>
        </div>
        <div className="mmm-detail-meta-item">
          <span className="mmm-detail-meta-label">분석자</span>
          <span className="mmm-detail-meta-value">{data.username}</span>
        </div>
        <div className="mmm-detail-meta-item">
          <span className="mmm-detail-meta-label">완료 시간</span>
          <span className="mmm-detail-meta-value mmm-detail-mono">
            {data.statusTime?.slice(0, 19).replace("T", " ") ?? "—"}
          </span>
        </div>
        <div className="mmm-detail-meta-item">
          <span className="mmm-detail-meta-label">관측 수</span>
          <span className="mmm-detail-meta-value mmm-detail-mono">
            {cmt.time_no != null
              ? `${cmt.time_no} ${TIME_UNIT[cmt.time_type] ?? ""}`
              : "—"}
          </span>
        </div>
        <div className="mmm-detail-meta-item">
          <span className="mmm-detail-meta-label">매체 수</span>
          <span className="mmm-detail-meta-value mmm-detail-mono">
            {(cmt.media_no ?? 0) + (cmt.media_rf_no ?? 0)}개
          </span>
        </div>
        <div className="mmm-detail-meta-item mmm-detail-meta-item--wide">
          <span className="mmm-detail-meta-label">매체 목록</span>
          <span className="mmm-detail-meta-value mmm-detail-tags">
            {aliases.map((a) => (
              <span key={a} className="mmm-detail-tag">{a}</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
