import { useEffect, useReducer } from "react";
import { ChevronLeft } from "lucide-react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import MediaNetwork from "../../MediaInsight/components/MediaNetwork";

const PALETTE = [
  "#6366f1",
  "#4f80e1",
  "#4fc98f",
  "#f5a623",
  "#e15f4f",
  "#9b59b6",
  "#1abc9c",
  "#e67e22",
];

function fmtBudget(v) {
  if (v == null) return "-";
  const n = Number(v);
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)}억`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(0)}만`;
  return n.toLocaleString();
}

function reducer(state, action) {
  switch (action.type) {
    case "start":
      return { data: null, loading: true, error: null };
    case "success":
      return { data: action.payload, loading: false, error: null };
    case "error":
      return { data: null, loading: false, error: action.payload };
    default:
      return state;
  }
}

/* ── 차트 옵션 빌더 ── */

function budgetDistOption({ buckets, mean }) {
  const { counts, bin_edges } = buckets;
  const keys = counts.map(
    (_, i) => `${fmtBudget(bin_edges[i])}~${fmtBudget(bin_edges[i + 1])}`,
  );
  const vals = counts;
  return {
    tooltip: {
      trigger: "axis",
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    xAxis: {
      type: "category",
      data: keys,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    yAxis: {
      type: "value",
      name: "믹스 수",
      nameTextStyle: { color: "#9ca3bf" },
      axisLabel: { color: "#9ca3bf" },
    },
    series: [
      {
        type: "bar",
        data: vals,
        barMaxWidth: 48,
        itemStyle: { color: "#6366f1", borderRadius: [3, 3, 0, 0] },
        markLine: {
          silent: true,
          data: [{ type: "average" }],
          lineStyle: { color: "#f5a623", type: "dashed" },
          label: {
            formatter: `평균 ${fmtBudget(mean)}`,
            color: "#f5a623",
            fontSize: 11,
            position: "insideStartTop",
          },
        },
      },
    ],
    grid: { left: 40, right: 20, top: 24, bottom: 32 },
  };
}

const GENDER_COLORS = {
  전체: "#9ca3af",
  P: "#9ca3af",
  남성: "#4f80e1",
  M: "#4f80e1",
  여성: "#f472b6",
  F: "#f472b6",
};

function genderOption(gender) {
  const data = Object.entries(gender).map(([name, value], i) => ({
    name,
    value,
    itemStyle: { color: GENDER_COLORS[name] ?? PALETTE[i] },
  }));
  return {
    tooltip: { trigger: "item", formatter: "<b>{b}</b>: {c}건 ({d}%)" },
    legend: { bottom: 0, textStyle: { color: "#9ca3bf", fontSize: 11 } },
    series: [
      {
        type: "pie",
        radius: ["40%", "68%"],
        center: ["50%", "44%"],
        label: {
          show: true,
          fontSize: 11,
          color: "#9ca3bf",
          formatter: "{b}\n{d}%",
        },
        data,
      },
    ],
  };
}

function ageOption(age_group) {
  const keys = Object.keys(age_group);
  const vals = Object.values(age_group);
  return {
    tooltip: {
      trigger: "axis",
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    xAxis: {
      type: "category",
      data: keys,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    yAxis: { type: "value", axisLabel: { color: "#9ca3bf" } },
    series: [
      {
        type: "bar",
        data: vals,
        barMaxWidth: 40,
        itemStyle: { color: "#4fc98f", borderRadius: [3, 3, 0, 0] },
      },
    ],
    grid: { left: 36, right: 12, top: 16, bottom: 32 },
  };
}

function industryOption(dist) {
  const sorted = Object.entries(dist).sort((a, b) => b[1] - a[1]);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) => `<b>${p[0].name}</b><br/>${p[0].value}건`,
    },
    xAxis: { type: "value", axisLabel: { color: "#9ca3bf" } },
    yAxis: {
      type: "category",
      data: sorted.map(([k]) => k),
      inverse: true,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map(([, v]) => v),
        barMaxWidth: 28,
        itemStyle: { color: "#e15f4f", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "right",
          color: "#9ca3bf",
          fontSize: 11,
        },
      },
    ],
    grid: { left: 80, right: 40, top: 12, bottom: 24 },
  };
}

function mediaBudgetOption(rows) {
  const sorted = [...rows].sort(
    (a, b) => b.avg_budget_ratio - a.avg_budget_ratio,
  );
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) =>
        `<b>${p[0].name}</b><br/>평균 예산 비중: ${(p[0].value * 100).toFixed(1)}%`,
    },
    xAxis: {
      type: "value",
      axisLabel: {
        formatter: (v) => `${(v * 100).toFixed(0)}%`,
        color: "#9ca3bf",
      },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.media_mapped),
      inverse: true,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((r) => r.avg_budget_ratio),
        barMaxWidth: 28,
        itemStyle: { color: "#4f80e1", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "right",
          formatter: (p) => fmtBudget(sorted[p.dataIndex]?.avg_budget),
          color: "#9ca3bf",
          fontSize: 11,
        },
      },
    ],
    grid: { left: 100, right: 64, top: 12, bottom: 24 },
  };
}

function mediaFreqOption(rows) {
  const sorted = [...rows].sort((a, b) => b.frequency - a.frequency);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (p) =>
        `<b>${p[0].name}</b><br/>${p[0].value}개 믹스에 포함 (${(sorted[p[0].dataIndex].frequency * 100).toFixed(0)}%)`,
    },
    xAxis: {
      type: "value",
      name: "믹스 수",
      nameTextStyle: { color: "#9ca3bf" },
      axisLabel: { color: "#9ca3bf" },
    },
    yAxis: {
      type: "category",
      data: sorted.map((r) => r.media_mapped),
      inverse: true,
      axisLabel: { color: "#9ca3bf", fontSize: 11, fontWeight: "bold" },
    },
    series: [
      {
        type: "bar",
        data: sorted.map((r) => r.mix_count),
        barMaxWidth: 28,
        itemStyle: { color: "#9b59b6", borderRadius: [0, 3, 3, 0] },
        label: {
          show: true,
          position: "inside",
          formatter: (p) => `${p.value}건`,
          color: "#ffffff",
          fontSize: 11,
          fontWeight: "bold",
        },
      },
    ],
    grid: { left: 100, right: 56, top: 12, bottom: 32 },
  };
}

/* ── 섹션 래퍼 ── */
function Section({ title, badge, children, full }) {
  return (
    <div
      className={`section${full ? " section--full" : ""}`}
    >
      <div className="section-hdr">
        <span className="section-title">{title}</span>
        {badge && <span className="section-badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function BookmarkInsights({ mixIds, onBack }) {
  const [{ data, loading, error }, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: "start" });
    axios
      .post(`${endpoint}/bookmark/insights`, { mix_ids: mixIds })
      .then((res) => dispatch({ type: "success", payload: res.data }))
      .catch(() =>
        dispatch({
          type: "error",
          payload: "분석 데이터를 불러오지 못했습니다.",
        }),
      );
  }, [mixIds]);

  const macro = data?.macro;
  const micro = data?.micro;
  const network = data?.network;
  const hasNetwork = Array.isArray(network?.nodes) && network.nodes.length > 0;

  return (
    <div className="mix-detail">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        북마크 목록으로
      </button>

      <div className="mix-hero">
        <div className="mix-hero-name">북마크 분석</div>
        <br></br>
        <hr></hr>
        {macro && (
          <div className="bm-insight-summary">
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">분석 대상 믹스</span>
              <span className="bm-insight-kpi-value">{macro.mix_cnt}건</span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">예산 평균</span>
              <span className="bm-insight-kpi-value">
                {fmtBudget(macro.budget_distribution?.mean)}
              </span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">예산 중앙값</span>
              <span className="bm-insight-kpi-value">
                {fmtBudget(macro.budget_distribution?.median)}
              </span>
            </div>
            <div className="bm-insight-kpi-divider" />
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">최소 예산</span>
              <span className="bm-insight-kpi-value">
                {fmtBudget(macro.budget_distribution?.buckets?.min)}
              </span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">최대 예산</span>
              <span className="bm-insight-kpi-value">
                {fmtBudget(macro.budget_distribution?.buckets?.max)}
              </span>
            </div>
          </div>
        )}
      </div>

      <br />

      {loading && <div className="state-msg">분석 중...</div>}
      {error && (
        <div className="state-msg state-msg--error">{error}</div>
      )}

      {!loading && !error && macro && (
        <>
          {/* ── 예산 & 타겟 ── */}
          <div className="insight-grid">
            <Section title="예산 분포" badge="Gross · Market Cost 기준">
              <ReactECharts
                option={budgetDistOption(macro.budget_distribution)}
                style={{ height: 220 }}
                opts={{ renderer: "svg" }}
              />
            </Section>

            <Section title="업종 분포">
              <ReactECharts
                option={industryOption(macro.industry_distribution)}
                style={{ height: 220 }}
                opts={{ renderer: "svg" }}
              />
            </Section>

            <Section title="타겟 성별">
              <ReactECharts
                option={genderOption(macro.target_demo.gender)}
                style={{ height: 220 }}
                opts={{ renderer: "svg" }}
              />
            </Section>

            <Section title="타겟 연령대">
              <ReactECharts
                option={ageOption(macro.target_demo.age_group)}
                style={{ height: 220 }}
                opts={{ renderer: "svg" }}
              />
            </Section>
          </div>

          <br />

          {/* ── 매체 분석 ── */}
          {micro && (
            <div className="insight-grid">
              <Section
                title="매체별 평균 예산 비중"
                badge="북마크 믹스 기준"
                full={false}
              >
                <ReactECharts
                  option={mediaBudgetOption(micro.media_budget_ratio)}
                  style={{
                    height: Math.max(
                      180,
                      micro.media_budget_ratio.length * 28 + 48,
                    ),
                  }}
                  opts={{ renderer: "svg" }}
                />
              </Section>

              <Section
                title="매체 출현 빈도"
                badge="북마크 내 포함 믹스 수"
                full={false}
              >
                <ReactECharts
                  option={mediaFreqOption(micro.media_frequency)}
                  style={{
                    height: Math.max(
                      180,
                      micro.media_frequency.length * 28 + 48,
                    ),
                  }}
                  opts={{ renderer: "svg" }}
                />
              </Section>
            </div>
          )}

          <br />

          {/* ── 네트워크 ── */}
          {hasNetwork && (
            <Section
              title="매체 관계 네트워크"
              badge="북마크 기준 · 줌/패닝 가능"
              full
            >
              <MediaNetwork network={network} currentMedia={null} />
            </Section>
          )}
        </>
      )}

      <br />
      <br />
    </div>
  );
}
