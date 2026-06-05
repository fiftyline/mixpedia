import { useEffect, useState, useMemo } from "react";
import {
  ChevronLeft,
  Folder, CircleDot,
  CircleDollarSign, Landmark, Hospital,
  Hammer, BriefcaseBusiness,
  Car, Ship, Plane, Bus,
  GraduationCap, Baby,
  MonitorSmartphone, Earth,
  Shirt, SoapDispenserDroplet, ShoppingBasket,
  SquareStar, MicVocal,
  Gamepad2, Volleyball,
  Utensils,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { toArr } from "../../../utils/mixUtils";
import MediaNetwork from "./MediaNetwork";
import { getMediaPresentation } from "../utils/mediaPresentation";

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
  { keys: ["전체"], Icon: Folder },
  { keys: ["금융", "보험", "은행", "카드", "증권"], Icon: CircleDollarSign },
  { keys: ["자동차", "차량", "모빌리티"], Icon: Car },
  { keys: ["정유", "수송"], Icon: Ship },
  { keys: ["건설", "부동산"], Icon: Hammer },
  { keys: ["식품", "음료", "외식", "푸드", "주류"], Icon: Utensils },
  { keys: ["의료", "건강", "제약", "헬스"], Icon: Hospital },
  { keys: ["항공", "숙박"], Icon: Plane },
  { keys: ["여행", "교통"], Icon: Bus },
  { keys: ["결혼", "출산", "육아"], Icon: Baby },
  { keys: ["가전", "IT", "통신", "모바일", "전자"], Icon: MonitorSmartphone },
  { keys: ["미용", "화장품"], Icon: SoapDispenserDroplet },
  { keys: ["패션", "의류"], Icon: Shirt },
  { keys: ["교육", "학습", "학교"], Icon: GraduationCap },
  { keys: ["스포츠"], Icon: Volleyball },
  { keys: ["게임"], Icon: Gamepad2 },
  { keys: ["엔터", "문화", "콘텐츠"], Icon: SquareStar },
  { keys: ["공연"], Icon: MicVocal },
  { keys: ["기업", "B2B", "비즈니스"], Icon: BriefcaseBusiness },
  { keys: ["공공"], Icon: Landmark },
  { keys: ["ICT"], Icon: Earth },
  { keys: ["유통", "쇼핑", "커머스", "마트"], Icon: ShoppingBasket },
];

function getIndustryIcon(industry) {
  const normalized = String(industry ?? "").toLowerCase();
  const matched = INDUSTRY_ICON_RULES.find(({ keys }) =>
    keys.some((key) => normalized.includes(key.toLowerCase())),
  );
  return matched?.Icon ?? CircleDot;
}

export default function MediaDetail({ media, onBack, onSelectMix }) {
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const {
    data: microData,
    isLoading: loading,
    isError,
  } = useQuery({
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

  const error = isError ? "데이터를 불러오지 못했습니다." : null;

  const industryStats = useMemo(() => {
    const topInds = Array.isArray(media.top_inds) ? media.top_inds : [];
    const stats = topInds
      .map((item) => ({
        industry: item.industry,
        count: Number(item.industry_mix_cnt ?? item.count ?? item.mix_cnt ?? item.cnt ?? 0),
      }))
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

  const targets = Array.isArray(microData?.target_demo_cnt) ? microData.target_demo_cnt : [];
  const maxTarget = targets[0]?.target_mix_cnt || 0;

  const networkNodes = Array.isArray(microData?.media_network?.nodes)
    ? microData.media_network.nodes
    : [];
  const coMedia = networkNodes
    .filter((n) => n.id !== media.media)
    .sort((a, b) => b.count - a.count);
  const maxCoMedia = coMedia[0]?.count || 0;

  const { Icon, brandIcon, letterIcon, logoSrc, accent, soft } =
    getMediaPresentation(media.media);

  return (
    <div className="media-detail">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        목록으로
      </button>

      <div className="mix-hero">
        <div className="mix-hero-name">
          <span
            className="media-detail-icon"
            style={{ "--media-accent": accent, "--media-soft": soft }}
          >
            {logoSrc ? (
              <img src={logoSrc} alt="" className="media-card-logo" />
            ) : brandIcon ? (
              <FontAwesomeIcon icon={brandIcon} />
            ) : letterIcon ? (
              <span className="media-card-letter-icon">{letterIcon}</span>
            ) : (
              <Icon size={16} strokeWidth={2} />
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

      {error && (
        <div className="state-msg state-msg--error">{error}</div>
      )}

      {loading && <div className="state-msg">데이터 불러오는 중...</div>}

      {!loading && !error && (
        <div className="insight-grid">
          <div className="section">
            <div className="section-hdr">
              <span className="section-title">주요 데모 타겟</span>
              <span className="section-badge">
                Top 10 · 미디어믹스 수 기준
              </span>
            </div>
            <div className="rank-list">
              {targets.length === 0 ? (
                <div className="rank-empty">데이터 없음</div>
              ) : (
                targets.slice(0, 10).map((t, i) => (
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

          <div className="section">
            <div className="section-hdr">
              <span className="section-title">함께 사용된 매체</span>
              <span className="section-badge">
                Top 10 · 함께 사용된 믹스 수
              </span>
            </div>
            <div className="rank-list">
              {coMedia.length === 0 ? (
                <div className="rank-empty">데이터 없음</div>
              ) : (
                coMedia.slice(0, 10).map((n, i) => (
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
