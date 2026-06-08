import { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { ChevronLeft, CircleDot, Megaphone, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { endpoint } from "../../../config/config";
import MediaNetwork from "./MediaNetwork";
import {
  buildHistOption,
  buildGenderOption,
  buildAgeOption,
  parseAge,
} from "../utils/mediaDetailCharts";
import { getIndustryIcon } from "../utils/industryIcons";

/* ── 내부 컴포넌트 ── */

function AvgCard({ label, value, unit }) {
  return (
    <div className="ce-avg-card">
      <span className="cost-stat-label">{label}</span>
      <span className="ce-avg-number">
        <span className="cost-stat-value">{value ?? "—"}</span>
        {value != null && <span className="cost-stat-unit">{unit}</span>}
      </span>
    </div>
  );
}

function HistPlot({ label, option }) {
  return (
    <div className="ce-hist-plot">
      <div className="ce-hist-plot-hdr">
        <span className="ce-hist-plot-label">{label}</span>
      </div>
      <div className="ce-hist-plot-body">
        <ReactECharts option={option} style={{ height: 180 }} opts={{ renderer: "svg" }} />
      </div>
    </div>
  );
}

function StatSubSection({ avgCards, histPlots, emptyHistCount = 0 }) {
  return (
    <div className="ce-sub">
      <div className="ce-block">
        <div className="ce-avg-grid">
          <div className="ce-avg-col">
            <div className="ce-avg-cards">
              {avgCards}
              {emptyHistCount > 0 &&
                Array.from({ length: emptyHistCount }).map((_, i) => (
                  <div key={i} className="ce-avg-card ce-avg-card--empty" />
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="ce-block">
        <div className="ce-hist-grid">
          {histPlots}
          {emptyHistCount > 0 &&
            Array.from({ length: emptyHistCount }).map((_, i) => (
              <div key={i} className="ce-hist-plot ce-hist-plot--empty" />
            ))}
        </div>
      </div>
    </div>
  );
}

function CoMediaCard({ node, onClick }) {
  const logoSrc = node.logo_src ?? null;
  const accent = node.accent ?? "#64748b";
  const soft = node.soft ?? "#f1f5f9";
  return (
    <button
      type="button"
      className="co-media-card"
      style={{ "--media-accent": accent, "--media-soft": soft }}
      onClick={onClick}
    >
      <span className="co-media-card-top">
        <span className="media-card-icon">
          {logoSrc ? (
            <img src={logoSrc} alt="" className="media-card-logo" />
          ) : (
            <Megaphone size={15} strokeWidth={2} />
          )}
        </span>
        <ArrowUpRight className="media-card-arrow" size={13} strokeWidth={2} />
      </span>
      <span className="co-media-card-name">{node.id}</span>
      <span className="co-media-card-count">{node.count.toLocaleString()}건</span>
    </button>
  );
}


/* ── 메인 컴포넌트 ── */

export default function MediaDetail({ media, onBack, onSelectMix }) {
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const { data: microData, isLoading, isError } = useQuery({
    queryKey: ["media-micro", media.media, selectedIndustry],
    queryFn: () =>
      axios
        .post(`${endpoint}/get_media_micro/`, {
          media: media.media,
          industry: selectedIndustry || null,
        })
        .then((res) => (Array.isArray(res.data) ? res.data[0] : res.data)),
    enabled: !!media.media,
    staleTime: 5 * 60 * 1000,
  });

  const industryStats = useMemo(() => {
    const topInds = Array.isArray(media.top_inds) ? media.top_inds : [];
    const stats = topInds
      .map((item) => ({
        industry: item.industry,
        count: Number(
          item.industry_mix_cnt ?? item.count ?? item.mix_cnt ?? item.cnt ?? 0,
        ),
      }))
      .filter((item) => item.industry && item.count > 0);
    const total = stats.reduce((sum, item) => sum + item.count, 0);
    return stats
      .map((item) => ({ ...item, pct: total > 0 ? (item.count / total) * 100 : 0 }))
      .sort((a, b) => b.count - a.count || a.industry.localeCompare(b.industry));
  }, [media.top_inds]);

  useEffect(() => {
    setSelectedIndustry("");
  }, [media.media]);

  const targets = Array.isArray(microData?.target_demo_cnt)
    ? microData.target_demo_cnt
    : [];

  const { genderAgg, ageAgg } = useMemo(() => {
    const gMap = { F: "여성", M: "남성", P: "전체" };
    const genderAgg = {};
    const ageAgg = {};
    targets.forEach(({ target_demo, target_mix_cnt }) => {
      if (!target_demo) return;
      const gLabel = gMap[target_demo[0]] ?? target_demo[0];
      const ageCode = target_demo.slice(1);
      genderAgg[gLabel] = (genderAgg[gLabel] ?? 0) + (target_mix_cnt ?? 0);
      if (ageCode) {
        const aLabel = parseAge(ageCode);
        ageAgg[aLabel] = (ageAgg[aLabel] ?? 0) + (target_mix_cnt ?? 0);
      }
    });
    return { genderAgg, ageAgg };
  }, [targets]);

  const networkNodes = Array.isArray(microData?.media_network?.nodes)
    ? microData.media_network.nodes
    : [];
  const coMedia = networkNodes
    .filter((n) => n.id !== media.media)
    .sort((a, b) => b.count - a.count);

  const logoSrc = media.logo_src ?? null;
  const accent = media.accent ?? "#64748b";
  const soft = media.soft ?? "#f1f5f9";
  const fmtInt = (v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="media-detail">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        목록으로
      </button>

      {/* ── Hero ── */}
      <div className="mix-hero">
        <div className="mix-hero-name">
          <span
            className="media-detail-icon"
            style={{ "--media-accent": accent, "--media-soft": soft }}
          >
            {logoSrc ? (
              <img src={logoSrc} alt="" className="media-card-logo" />
            ) : (
              <Megaphone size={16} strokeWidth={2} />
            )}
          </span>
          {media.media}
        </div>
        <br />

        <div className="detail-industry-block">
          <div className="detail-industry-icons">
            <button
              className={`industry-chip detail-industry-chip${selectedIndustry === "" ? " selected" : ""}`}
              type="button"
              onClick={() => setSelectedIndustry("")}
              style={{ "--gauge": "100%" }}
              title={`전체 ${(media.mix_cnt ?? 0).toLocaleString()}건`}
            >
              <CircleDot size={15} strokeWidth={2.2} />
              <span className="industry-chip-name">전체</span>
              <span className="industry-chip-meta">
                {(media.mix_cnt ?? 0).toLocaleString()}건 · 100%
              </span>
            </button>

            {industryStats.map(({ industry, count, pct }) => {
              const Icon = getIndustryIcon(industry);
              return (
                <button
                  key={industry}
                  className={`industry-chip detail-industry-chip${selectedIndustry === industry ? " selected" : ""}`}
                  type="button"
                  onClick={() => setSelectedIndustry(industry)}
                  style={{ "--gauge": `${Math.max(pct, 3)}%` }}
                  title={`${industry} ${count.toLocaleString()}건 (${pct.toFixed(1)}%)`}
                >
                  <Icon size={15} strokeWidth={2.2} />
                  <span className="industry-chip-name">{industry}</span>
                  <span className="industry-chip-meta">
                    {count.toLocaleString()}건 · {pct.toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <br />

      {isError && <div className="state-msg state-msg--error">데이터를 불러오지 못했습니다.</div>}
      {isLoading && <div className="state-msg">데이터 불러오는 중...</div>}

      {!isLoading && !isError && (
        <div className="insight-grid">

          {/* ── 단가 및 효율 ── */}
          <div className="section section--full section--bare">
            <div className="ce-section-heading">
              <p className="ce-section-title">단가 및 효율</p>
              <p className="ce-section-sub">미디어믹스 기준</p>
            </div>
            <br />

            {/* 단가 지표: CPM / CPC / CPV */}
            <StatSubSection
              avgCards={[
                { key: "cpm", label: "e.CPM" },
                { key: "cpc", label: "e.CPC" },
                { key: "cpv", label: "e.CPV" },
              ].map(({ key, label }) => (
                <AvgCard
                  key={key}
                  label={`평균 ${label}`}
                  value={microData?.cost_stats?.[key]?.mean != null ? fmtInt(microData.cost_stats[key].mean) : null}
                  unit="원"
                />
              ))}
              histPlots={[
                { key: "cpm", label: "e.CPM" },
                { key: "cpc", label: "e.CPC" },
                { key: "cpv", label: "e.CPV" },
              ].map(({ key, label }) => (
                <HistPlot
                  key={key}
                  label={label}
                  option={buildHistOption(key, microData?.cost_stats, "원")}
                />
              ))}
            />

            {/* 효율 지표: CTR / VTR */}
            <StatSubSection
              emptyHistCount={1}
              avgCards={[
                { key: "ctr", label: "CTR", fmt: (v) => Number(v).toFixed(2) },
                { key: "vtr", label: "VTR", fmt: (v) => Number(v).toFixed(2) },
              ].map(({ key, label, fmt }) => (
                <AvgCard
                  key={key}
                  label={`평균 ${label}`}
                  value={microData?.cost_stats?.[key]?.mean != null ? fmt(microData.cost_stats[key].mean) : null}
                  unit="%"
                />
              ))}
              histPlots={[
                { key: "ctr", label: "CTR" },
                { key: "vtr", label: "VTR" },
              ].map(({ key, label }) => (
                <HistPlot
                  key={key}
                  label={label}
                  option={buildHistOption(key, microData?.cost_stats, "%")}
                />
              ))}
            />
          </div>

          {/* ── 예산 분배 ── */}
          <div className="section section--full section--bare">
            <div className="ce-section-heading">
              <p className="ce-section-title">예산 분배</p>
              <p className="ce-section-sub">미디어믹스 기준</p>
            </div>

            <StatSubSection
              emptyHistCount={1}
              avgCards={[
                {
                  key: "budget_krw",
                  label: "평균 예산",
                  unit: "원",
                  value: microData?.budget_stats?.budget_krw?.mean != null
                    ? fmtInt(microData.budget_stats.budget_krw.mean)
                    : null,
                },
                {
                  key: "budget_rat",
                  label: "믹스 내 비중",
                  unit: "%",
                  value: microData?.budget_stats?.budget_rat?.mean != null
                    ? (Number(microData.budget_stats.budget_rat.mean) * 100).toFixed(1)
                    : null,
                },
              ].map(({ key, label, unit, value }) => (
                <AvgCard key={key} label={label} value={value} unit={unit} />
              ))}
              histPlots={[
                { key: "budget_krw", label: "예산 규모", unit: "원" },
                { key: "budget_rat", label: "믹스 내 비중", unit: "%" },
              ].map(({ key, label, unit }) => (
                <HistPlot
                  key={key}
                  label={label}
                  option={buildHistOption(key, microData?.budget_stats, unit)}
                />
              ))}
            />
          </div>

          {/* ── 타겟 성별 ── */}
          <div className="section">
            <div className="section-hdr">
              <span className="section-title">타겟 성별</span>
              <span className="section-badge">미디어믹스 수 기준</span>
            </div>
            <div className="demo-target-chart">
              {Object.keys(genderAgg).length === 0 ? (
                <div className="rank-empty">데이터 없음</div>
              ) : (
                <ReactECharts
                  option={buildGenderOption(genderAgg)}
                  style={{ height: 210 }}
                  opts={{ renderer: "svg" }}
                />
              )}
            </div>
          </div>

          {/* ── 타겟 연령대 ── */}
          <div className="section">
            <div className="section-hdr">
              <span className="section-title">타겟 연령대</span>
              <span className="section-badge">미디어믹스 수 기준</span>
            </div>
            <div className="demo-target-chart">
              {Object.keys(ageAgg).length === 0 ? (
                <div className="rank-empty">데이터 없음</div>
              ) : (
                <ReactECharts
                  option={buildAgeOption(ageAgg)}
                  style={{ height: 210 }}
                  opts={{ renderer: "svg" }}
                />
              )}
            </div>
          </div>

          {/* ── 함께 사용된 매체 ── */}
          <div className="section section--span2">
            <div className="section-hdr">
              <span className="section-title">함께 사용된 매체</span>
              <span className="section-badge">Top 9 · 함께 사용된 믹스 수</span>
            </div>
            {coMedia.length === 0 ? (
              <div className="rank-empty">데이터 없음</div>
            ) : (
              <div className="co-media-grid">
                {coMedia.slice(0, 9).map((n) => (
                  <CoMediaCard
                    key={n.media_id ?? n.id}
                    node={n}
                    onClick={() =>
                      navigate(
                        `/media-insight/${encodeURIComponent(n.media_id ?? n.id)}`,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── 매체 관계 네트워크 (비활성화) ── */}
          {false &&
            Array.isArray(microData?.media_network?.nodes) &&
            microData.media_network.nodes.length > 0 && (
              <div className="section section--full">
                <div className="section-hdr">
                  <span className="section-title">매체 관계 네트워크</span>
                  <span className="section-badge">
                    업종 필터 기준 · 줌/패닝 가능 · 매개 중심성 높은 노드 보라색
                  </span>
                </div>
                <MediaNetwork
                  network={microData.media_network}
                  currentMedia={media.media}
                />
              </div>
            )}

        </div>
      )}
    </div>
  );
}
