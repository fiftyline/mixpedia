import { useEffect, useReducer } from "react";
import { ChevronLeft } from "lucide-react";
import ReactECharts from "echarts-for-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import MediaNetwork from "../../MediaInsight/components/MediaNetwork";
import {
  budgetDistOption,
  genderOption,
  ageOption,
  industryOption,
  mediaBudgetOption,
  mediaFreqOption,
} from "./folderInsightCharts";

function reducer(state, action) {
  switch (action.type) {
    case "start": return { data: null, loading: true, error: null };
    case "success": return { data: action.payload, loading: false, error: null };
    case "error": return { data: null, loading: false, error: action.payload };
    default: return state;
  }
}

function Section({ title, badge, children, full }) {
  return (
    <div className={`section${full ? " section--full" : ""}`}>
      <div className="section-hdr">
        <span className="section-title">{title}</span>
        {badge && <span className="section-badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

export default function FolderInsights({ folderId, fileIds, folderName, onBack }) {
  const [{ data, loading, error }, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    dispatch({ type: "start" });
    axios
      .post(`${endpoint}/analysis/insights`, { folder_id: folderId, file_ids: fileIds })
      .then((res) => dispatch({ type: "success", payload: res.data }))
      .catch(() => dispatch({ type: "error", payload: "분석 데이터를 불러오지 못했습니다." }));
  }, [folderId, fileIds]);

  const macro = data?.macro;
  const micro = data?.micro;
  const network = data?.network;
  const hasNetwork = Array.isArray(network?.nodes) && network.nodes.length > 0;

  return (
    <div className="mix-detail">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        폴더 목록으로
      </button>

      <div className="mix-hero">
        <div className="mix-hero-name">{folderName || "폴더 분석"}</div>
        <br />
        <hr />
        {macro && (
          <div className="bm-insight-summary">
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">분석 대상 믹스</span>
              <span className="bm-insight-kpi-value">{macro.mix_cnt}건</span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">예산 평균</span>
              <span className="bm-insight-kpi-value">{macro.budget_distribution?.mean != null ? `${Number(macro.budget_distribution.mean).toLocaleString()}원` : "-"}</span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">예산 중앙값</span>
              <span className="bm-insight-kpi-value">{macro.budget_distribution?.median != null ? `${Number(macro.budget_distribution.median).toLocaleString()}원` : "-"}</span>
            </div>
            <div className="bm-insight-kpi-divider" />
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">최소 예산</span>
              <span className="bm-insight-kpi-value">{macro.budget_distribution?.buckets?.min != null ? `${Number(macro.budget_distribution.buckets.min).toLocaleString()}원` : "-"}</span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">최대 예산</span>
              <span className="bm-insight-kpi-value">{macro.budget_distribution?.buckets?.max != null ? `${Number(macro.budget_distribution.buckets.max).toLocaleString()}원` : "-"}</span>
            </div>
          </div>
        )}
      </div>

      <br />

      {loading && <div className="state-msg">분석 중...</div>}
      {error && <div className="state-msg state-msg--error">{error}</div>}

      {!loading && !error && macro && (
        <>
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

          {micro && (
            <div className="insight-grid">
              <Section title="매체별 평균 예산 비중" badge="폴더 믹스 기준">
                <ReactECharts
                  option={mediaBudgetOption(micro.media_budget_ratio)}
                  style={{ height: Math.max(180, micro.media_budget_ratio.length * 28 + 48) }}
                  opts={{ renderer: "svg" }}
                />
              </Section>

              <Section title="매체 출현 빈도" badge="폴더 내 포함 믹스 수">
                <ReactECharts
                  option={mediaFreqOption(micro.media_frequency)}
                  style={{ height: Math.max(180, micro.media_frequency.length * 28 + 48) }}
                  opts={{ renderer: "svg" }}
                />
              </Section>
            </div>
          )}

          <br />

          {hasNetwork && (
            <Section title="매체 관계 네트워크" badge="폴더 기준 · 줌/패닝 가능" full>
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
