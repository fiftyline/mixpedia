import { useEffect, useReducer, useState, useMemo } from "react";
import {
  CircleDollarSign,
  BookmarkCheck,
  BriefcaseBusiness,
  Car,
  ChevronLeft,
  CircleDot,
  GraduationCap,
  HeartPulse,
  Home,
  MonitorSmartphone,
  Plane,
  Shirt,
  ShoppingBag,
  Sparkles,
  Utensils,
  Gamepad2
} from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { useBookmark } from "../../../context/BookmarkContext";
import { toArr, fmtBudget } from "../../../utils/mixUtils";
import MediaNetwork from "./MediaNetwork";

function RankBar({ label, count, max, type }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="rank-row">
      <span className="rank-label">{label}</span>
      <div className="rank-bar-wrap">
        <div
          className={`rank-bar ${type === "target" ? "rank-bar--target" : "rank-bar--ind"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="rank-count">{count.toLocaleString()}</span>
    </div>
  );
}

const INDUSTRY_ICON_RULES = [
  { keys: ["금융", "보험", "은행", "카드", "증권"], Icon: CircleDollarSign },
  { keys: ["자동차", "차량", "모빌리티"], Icon: Car },
  { keys: ["식품", "음료", "외식", "푸드", "주류"], Icon: Utensils },
  { keys: ["의료", "건강", "제약", "헬스"], Icon: HeartPulse },
  { keys: ["여행", "항공", "숙박", "레저"], Icon: Plane },
  { keys: ["가전", "IT", "통신", "모바일", "전자"], Icon: MonitorSmartphone },
  { keys: ["패션", "의류", "뷰티", "화장품"], Icon: Shirt },
  { keys: ["유통", "쇼핑", "커머스", "마트"], Icon: ShoppingBag },
  { keys: ["주거", "부동산", "건설", "인테리어"], Icon: Home },
  { keys: ["교육", "학습", "학교"], Icon: GraduationCap },
  { keys: ["게임"], Icon: Gamepad2 },
  { keys: ["엔터", "문화", "게임", "콘텐츠"], Icon: Sparkles },
  { keys: ["기업", "B2B", "서비스"], Icon: BriefcaseBusiness },
];

function getIndustryIcon(industry) {
  const normalized = String(industry ?? "").toLowerCase();
  const matched = INDUSTRY_ICON_RULES.find(({ keys }) =>
    keys.some((key) => normalized.includes(key.toLowerCase())),
  );
  return matched?.Icon ?? CircleDot;
}

function microReducer(state, action) {
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

function getPayload(data) {
  return Array.isArray(data) ? data[0] : data;
}

export default function MediaDetail({ media, onBack, onSelectMix }) {
  const { bookmarkedIds } = useBookmark();
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const [{ data: microData, loading, error }, dispatch] = useReducer(
    microReducer,
    { data: null, loading: false, error: null },
  );

  const industryStats = useMemo(() => {
    const topInds = Array.isArray(media.top_inds) ? media.top_inds : [];
    const stats = topInds
      .map((item) => {
        const count = Number(
          item.industry_mix_cnt ??
          item.count ??
          item.mix_cnt ??
          item.cnt ??
          0,
        );
        return {
          industry: item.industry,
          count: count,
        };
      })
      .filter((item) => item.industry && item.count > 0);

    const total = stats.reduce((sum, item) => sum + item.count, 0);
    return stats
      .map((item) => ({
        ...item,
        pct: total > 0 ? (item.count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count || a.industry.localeCompare(b.industry));
  }, [media.top_inds]);

  useEffect(() => {
    setSelectedIndustry("");
  }, [media.media]);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "start" });
    axios
      .post(`${endpoint}/get_media_micro/`, {
        media: media.media,
        industry: selectedIndustry || null,
      })
      .then((res) => {
        if (cancelled) return;

        const payload = getPayload(res.data);
        dispatch({ type: "success", payload });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[get_media_micro] 오류:", err);
        dispatch({ type: "error", payload: "데이터를 불러오지 못했습니다." });
      });

    return () => {
      cancelled = true;
    };
  }, [media.media, selectedIndustry]);

  const targets = Array.isArray(microData?.target_demo_cnt)
    ? microData.target_demo_cnt
    : [];
  const maxTarget = targets[0]?.target_mix_cnt || 0;

  const networkNodes = Array.isArray(microData?.media_network?.nodes)
    ? microData.media_network.nodes
    : [];
  const coMedia = networkNodes
    .filter((n) => n.id !== media.media)
    .sort((a, b) => b.count - a.count);
  const maxCoMedia = coMedia[0]?.count || 0;

  return (
    <div className="media-detail">
      <button className="mix-back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        목록으로
      </button>

      <div className="mix-hero">
        <div className="mix-hero-name">{media.media}</div>
        <br />

        <div className="detail-industry-block">
          <div className="detail-industry-icons">
            <button
              className={`industry-chip detail-industry-chip ${selectedIndustry === "" ? "selected" : ""
                }`}
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
                  className={`industry-chip detail-industry-chip ${selectedIndustry === industry ? "selected" : ""
                    }`}
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

      {error && (
        <div className="mix-micro-state mix-micro-state--error">{error}</div>
      )}

      {loading && <div className="mix-micro-state">데이터 불러오는 중...</div>}

      {!loading && !error && (
        <div className="insight-grid">
          <div className="mix-detail-section">
            <div className="mix-detail-section-hdr">
              <span className="mix-detail-section-title">
                업종 내 주요 데모 타겟
              </span>
              <span className="mix-detail-section-badge">
                Top 10 · 미디어믹스 수 기준
              </span>
            </div>
            <div className="rank-list">
              {targets.length === 0 ? (
                <div className="rank-empty">데이터 없음</div>
              ) : (
                targets
                  .slice(0, 10)
                  .map((t, i) => (
                    <RankBar
                      key={i}
                      label={t.target_demo}
                      count={t.target_mix_cnt}
                      max={maxTarget}
                      type="target"
                    />
                  ))
              )}
            </div>
          </div>

          <div className="mix-detail-section">
            <div className="mix-detail-section-hdr">
              <span className="mix-detail-section-title">함께 사용된 매체</span>
              <span className="mix-detail-section-badge">
                Top 10 · 함께 사용된 믹스 수
              </span>
            </div>
            <div className="rank-list">
              {coMedia.length === 0 ? (
                <div className="rank-empty">데이터 없음</div>
              ) : (
                coMedia
                  .slice(0, 10)
                  .map((n, i) => (
                    <RankBar
                      key={i}
                      label={n.id}
                      count={n.count}
                      max={maxCoMedia}
                      type="ind"
                    />
                  ))
              )}
            </div>
          </div>
          {Array.isArray(microData?.media_network?.nodes) &&
            microData.media_network.nodes.length > 0 && (
              <div className="mix-detail-section insight-section--full">
                <div className="mix-detail-section-hdr">
                  <span className="mix-detail-section-title">
                    매체 관계 네트워크
                  </span>
                  <span className="mix-detail-section-badge">
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

      {!loading &&
        !error &&
        Array.isArray(microData?.macro_data) &&
        microData.macro_data.length > 0 && (
          <>
            <br />
            <div className="mix-micro-wrap">
              <div className="mix-detail-section-hdr">
                <span className="mix-detail-section-title">
                  이 매체가 포함된 믹스
                </span>
              </div>
              <div className="similar-grid">
                {microData.macro_data.map((item, i) => {
                  const cardId = Number(item.file_id);
                  const cardBm = bookmarkedIds.has(cardId);
                  return (
                    <div
                      key={i}
                      className="similar-card"
                      onClick={() => onSelectMix?.(item)}
                    >
                      {cardBm && (
                        <span className="similar-card-bm">
                          <BookmarkCheck size={13} strokeWidth={2} />
                        </span>
                      )}
                      <div className="similar-card-name">
                        {item.file_path || item.file_name || item.file_id || "-"}
                      </div>
                      <div className="similar-card-tags">
                        {toArr(item.medias).map((m) => (
                          <span
                            key={m}
                            className={`mix-tag${m === media.media ? " mix-tag--current" : ""}`}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                      <div className="similar-card-stats">
                        <div>
                          <span className="similar-stat-label">
                            예산 (Gross, Market Cost)
                          </span>
                          <span className="similar-stat-value">
                            {fmtBudget(item.budget_sum)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
    </div>
  );
}
