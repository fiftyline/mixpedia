import { Calendar, TrendingUp, BarChart2, Users, Settings2 } from "lucide-react";

const TIME_UNIT = { daily: "일", weekly: "주", monthly: "월", yearly: "년" };

function InfoCard({ icon: Icon, iconBg, label, value, sub }) {
  return (
    <div className="mmm-info-card">
      <div className="mmm-info-card-icon" style={{ background: iconBg }}>
        <Icon size={20} color="#fff" strokeWidth={1.8} />
      </div>
      <div className="mmm-info-card-body">
        <div className="mmm-info-card-label">{label}</div>
        <div className="mmm-info-card-value">{value || "—"}</div>
        {sub && <div className="mmm-info-card-sub">{sub}</div>}
      </div>
    </div>
  );
}

export default function MmmDetailHeader({ data }) {
  const { optionset, overviewCmt } = data;
  const cmt = overviewCmt?.[0] ?? {};
  const timeUnit = TIME_UNIT[cmt.time_type] ?? "";
  const controlCount = (optionset?.column_control ?? []).length;

  return (
    <div className="mmm-detail-header-wrap">
      <div className="mmm-detail-meta-line">
        <span><span className="mmm-detail-meta-key">분석자</span>{data.username}</span>
        <span><span className="mmm-detail-meta-key">모델명</span>{data.modelname}</span>
        <span><span className="mmm-detail-meta-key">모델 ID</span><span className="mmm-detail-mono">{data.modelid}</span></span>
        <span><span className="mmm-detail-meta-key">분석 완료</span><span className="mmm-detail-mono">{data.statusTime?.slice(0, 19).replace("T", " ") ?? "—"}</span></span>
      </div>

      <div className="mmm-info-cards">
        <InfoCard
          icon={Calendar}
          iconBg="#7c6af7"
          label="분석 데이터 기간"
          value={cmt.time_range ?? "—"}
          sub={cmt.time_no != null ? `(${cmt.time_no} ${timeUnit})` : undefined}
        />
        <InfoCard
          icon={TrendingUp}
          iconBg="#e96060"
          label="KPI 변수"
          value={cmt.kpi_vars ?? "—"}
        />
        <InfoCard
          icon={BarChart2}
          iconBg="#38b2ac"
          label={`${cmt.media_no ?? 0}개 매체 변수`}
          value={(optionset?.media_alias ?? []).join(", ")}
        />
        <InfoCard
          icon={Users}
          iconBg="#48bb78"
          label={`${cmt.media_rf_no ?? 0}개 매체 도달 변수`}
          value={(optionset?.media_rf_alias ?? []).join(", ")}
        />
        <InfoCard
          icon={Settings2}
          iconBg="#a0aec0"
          label={`${controlCount}개 기타 변수`}
          value={(optionset?.column_control ?? []).join(", ")}
        />
      </div>
    </div>
  );
}
