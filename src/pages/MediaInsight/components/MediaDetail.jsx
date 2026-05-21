import { useEffect, useReducer, useRef, useState } from "react";
import { ChevronLeft, BookmarkCheck } from "lucide-react";
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

function extractInds(macroData) {
  const count = {};
  (macroData ?? []).forEach((row) => {
    const inds = Array.isArray(row.ind_depth1)
      ? row.ind_depth1
      : row.ind_depth1
        ? [row.ind_depth1]
        : [];
    inds.forEach((ind) => {
      count[ind] = (count[ind] || 0) + 1;
    });
  });
  return Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .map(([ind]) => ind);
}

export default function MediaDetail({ media, onBack, onSelectMix }) {
  const { bookmarkedIds } = useBookmark();
  const [availableInds, setAvailableInds] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const initializedRef = useRef(false);

  const [{ data: microData, loading, error }, dispatch] = useReducer(
    microReducer,
    { data: null, loading: false, error: null },
  );

  useEffect(() => {
    dispatch({ type: "start" });
    axios
      .post(`${endpoint}/get_media_micro/`, {
        media: media.media,
        industry: selectedIndustry || null,
      })
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data[0] : res.data;
        dispatch({ type: "success", payload });

        if (!initializedRef.current && Array.isArray(payload?.macro_data)) {
          const inds = extractInds(payload.macro_data);
          initializedRef.current = true;
          setAvailableInds(inds);
          if (inds.length > 0) setSelectedIndustry(inds[0]);
        }
      })
      .catch((err) => {
        console.error("[get_media_micro] 오류:", err);
        dispatch({ type: "error", payload: "데이터를 불러오지 못했습니다." });
      });
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

        <div className="mix-hero-body">
          <div className="mix-hero-info">
            <div className="mix-info-row">
              <span className="mix-info-label">업종</span>
              <select
                className="hero-ind-select"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                disabled={availableInds.length === 0}
              >
                <option value="">전체</option>
                {availableInds.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
            <div className="mix-info-row">
              <span className="mix-info-label">
                업종 내 매체 포함 미디어믹스 수
              </span>
              <span className="mix-info-value">
                {loading ? "-" : (microData?.mix_cnt ?? 0).toLocaleString()}
              </span>
            </div>
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
