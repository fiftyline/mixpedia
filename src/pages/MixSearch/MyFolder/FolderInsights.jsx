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
  // performanceHistOption,
  industryOption,
  mediaBudgetOption,
  mediaFreqOption,
} from "./folderInsightCharts";

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

function Section({ title, badge, children, full }) {
  return (
    <div className={`section folder-insight-section${full ? " section--full" : ""}`}>
      <div className="section-hdr">
        <span className="section-title">{title}</span>
        {badge && <span className="section-badge">{badge}</span>}
      </div>
      <div className="folder-insight-chart">{children}</div>
    </div>
  );
}

function SectionGroup({ title, children, variant = "two" }) {
  return (
    <div className="folder-insight-group">
      <div className="folder-insight-group-hdr">
        <span className="folder-insight-group-title">{title}</span>
      </div>
      <div className={`folder-insight-grid folder-insight-grid--${variant}`}>
        {children}
      </div>
    </div>
  );
}

function chartHeight(rows, min = 180) {
  return Math.max(min, Math.min(rows?.length ?? 0, 20) * 28 + 48);
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
      .catch(() =>
        dispatch({ type: "error", payload: "분석 데이터를 불러오지 못했습니다." }),
      );
  }, [folderId, fileIds]);

  const macro = data?.macro;
  const micro = data?.micro;
  // const performance = data?.performance ?? {};
  const network = data?.network;
  const hasNetwork = Array.isArray(network?.nodes) && network.nodes.length > 0;
  const mediaBudgetRows = micro?.media_budget_ratio_median ?? micro?.media_budget_ratio ?? [];

  return (
    <div className="mix-detail folder-insights">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        폴더 목록으로
      </button>

      <div className="mix-hero">
        <div className="mix-hero-name">{folderName || "폴더 분석"}</div>
        {macro && (
          <div className="bm-insight-summary">
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">분석 대상 믹스</span>
              <span className="bm-insight-kpi-value">{macro.mix_cnt}건</span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">예산 평균</span>
              <span className="bm-insight-kpi-value">
                {macro.budget_distribution?.mean != null
                  ? `${Number(macro.budget_distribution.mean).toLocaleString()}원`
                  : "-"}
              </span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">예산 중앙값</span>
              <span className="bm-insight-kpi-value">
                {macro.budget_distribution?.median != null
                  ? `${Number(macro.budget_distribution.median).toLocaleString()}원`
                  : "-"}
              </span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">최소 예산</span>
              <span className="bm-insight-kpi-value">
                {macro.budget_distribution?.buckets?.min != null
                  ? `${Number(macro.budget_distribution.buckets.min).toLocaleString()}원`
                  : "-"}
              </span>
            </div>
            <div className="bm-insight-kpi">
              <span className="bm-insight-kpi-label">최대 예산</span>
              <span className="bm-insight-kpi-value">
                {macro.budget_distribution?.buckets?.max != null
                  ? `${Number(macro.budget_distribution.buckets.max).toLocaleString()}원`
                  : "-"}
              </span>
            </div>
          </div>
        )}
      </div>

      {loading && <div className="state-msg">분석 중...</div>}
      {error && <div className="state-msg state-msg--error">{error}</div>}

      {!loading && !error && macro && (
        <>
          <SectionGroup title="특성" variant="four">
            <Section title="업종">
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

            <Section title="예산분포" badge="Gross · Market Cost 기준">
              <ReactECharts
                option={budgetDistOption(macro.budget_distribution)}
                style={{ height: 220 }}
                opts={{ renderer: "svg" }}
              />
            </Section>
          </SectionGroup>

          {/* my-folder 작성단가 및 효율 섹션 비활성화
          <SectionGroup title="작성 단가 및 효율" variant="three">
            {[
              { key: "cpm", label: "e.CPM", unit: "원" },
              { key: "cpc", label: "e.CPC", unit: "원" },
              { key: "cpv", label: "e.CPV", unit: "원" },
              { key: "ctr", label: "e.CTR", unit: "%" },
              { key: "vtr", label: "e.VTR", unit: "%" },
            ].map(({ key, label, unit }) => (
              <Section key={key} title={label}>
                <ReactECharts
  // option={performanceHistOption(performance[key], unit)}
                  style={{ height: 220 }}
                  opts={{ renderer: "svg" }}
                />
              </Section>
            ))}
          </SectionGroup>
          */}

          {micro && (
            <SectionGroup title="매체" variant="two">
              <Section title="사용매체" badge="Top 20 · 믹스 개수 기준">
                <ReactECharts
                  option={mediaFreqOption(micro.media_frequency)}
                  style={{ height: chartHeight(micro.media_frequency) }}
                  opts={{ renderer: "svg" }}
                />
              </Section>

              <Section title="매체 예산 비중" badge="믹스별 비중 중앙값">
                <ReactECharts
                  option={mediaBudgetOption(mediaBudgetRows)}
                  style={{ height: chartHeight(mediaBudgetRows) }}
                  opts={{ renderer: "svg" }}
                />
              </Section>

              {hasNetwork && (
                <Section title="매체 관계 네트워크" badge="폴더 기준 · 중심 노드식 가중" full>
                  <MediaNetwork network={network} currentMedia={null} />
                </Section>
              )}
            </SectionGroup>
          )}
        </>
      )}
    </div>
  );
}
