import {
  Calendar,
  TrendingUp,
  BarChart2,
  Users,
  Settings2,
} from "lucide-react";

const TIME_UNIT = { daily: "일", weekly: "주", monthly: "월", yearly: "년" };

function InfoCard({ icon: Icon, iconBg, label, value, sub, tags, count }) {
  return (
    <div className="mmm-info-card">
      <div className="mmm-info-card-icon" style={{ background: iconBg }}>
        <Icon size={18} color="#fff" strokeWidth={1.8} />
      </div>
      <div className="mmm-info-card-body">
        <div className="mmm-info-card-label-row">
          <span className="mmm-info-card-label">{label}</span>
          {count != null && <span className="mmm-icard-count">{count}</span>}
        </div>
        {value && <div className="mmm-info-card-value">{value}</div>}
        {sub && <div className="mmm-info-card-sub">{sub}</div>}
        {tags?.length > 0 ? (
          <div className="mmm-icard-tags">
            {tags.map((t) => (
              <span key={t} className="mmm-icard-tag">
                {t}
              </span>
            ))}
          </div>
        ) : (
          !value && <div className="mmm-info-card-value">—</div>
        )}
      </div>
    </div>
  );
}

export default function MmmDetailHeader({ data }) {
  const { optionset, overviewCmt } = data;
  const cmt = overviewCmt?.[0] ?? {};
  const timeUnit = TIME_UNIT[cmt.time_type] ?? "";
  const mediaAliases = optionset?.media_alias ?? [];
  const rfAliases = optionset?.media_rf_alias ?? [];
  const controlCols = optionset?.column_control ?? [];

  return (
    <div className="mmm-detail-header-wrap">
      <div className="mmm-detail-band">
        <div className="mmm-detail-band-title">
          <span className="mmm-detail-band-modelname">
            {data.modelname ?? "—"}
          </span>
          <span className="mmm-detail-band-modelid">{data.modelid ?? "—"}</span>
        </div>
        <div className="mmm-detail-band-meta">
          <div className="mmm-detail-band-chip">
            <span className="mmm-detail-band-chip-k">분석자</span>
            <span className="mmm-detail-band-chip-v">
              {data.username ?? "—"}
            </span>
          </div>
          <div className="mmm-detail-band-divider" />
          <div className="mmm-detail-band-chip">
            <span className="mmm-detail-band-chip-k">분석 완료</span>
            <span className="mmm-detail-band-chip-v mmm-detail-mono">
              {data.statusTime?.slice(0, 19).replace("T", " ") ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mmm-info-cards">
        <InfoCard
          icon={Calendar}
          iconBg="#6366f1"
          label="분석 데이터 기간"
          value={cmt.time_range ?? "—"}
          sub={cmt.time_no != null ? `${cmt.time_no}${timeUnit}` : undefined}
        />
        <InfoCard
          icon={TrendingUp}
          iconBg="#f59e0b"
          label="KPI 변수"
          tags={cmt.kpi_vars ? [cmt.kpi_vars] : []}
        />
        <InfoCard
          icon={BarChart2}
          iconBg="#0ea5e9"
          label="매체 변수"
          count={`${cmt.media_no ?? mediaAliases.length}개 매체변수`}
          tags={mediaAliases}
        />
        <InfoCard
          icon={Users}
          iconBg="#10b981"
          label="매체 도달 변수"
          count={`${cmt.media_rf_no ?? rfAliases.length}개 도달변수`}
          tags={rfAliases}
        />
        <InfoCard
          icon={Settings2}
          iconBg="#64748b"
          label="기타 변수"
          count={`${controlCols.length}개 기타변수`}
          tags={controlCols}
        />
      </div>
    </div>
  );
}
