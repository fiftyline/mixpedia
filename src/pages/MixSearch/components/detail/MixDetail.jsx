import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ExternalLink,
  Pencil,
  Folder,
  FolderCheck,
  Loader,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { endpoint } from "../../../../config/config";
import { useFolder } from "../../../../context/FolderContext";
import { toArr, fmtBudget, GENDER_LABEL } from "../../../../utils/mixUtils";
import DonutChart from "./DonutChart";
import EditModal from "./EditModal";
import MixMicroGrid from "./MixMicroGrid";

function pdfLabel(url) {
  try {
    return decodeURIComponent(url.split("/").pop());
  } catch {
    return "파일 보기";
  }
}

export default function MixDetail({ mix, onBack, onSelect }) {
  const { folderIds, pendingIds, toggleFolder } = useFolder();
  const bmId = Number(mix.file_id);
  const isInFolder = folderIds.has(bmId);
  const isPending = pendingIds.has(bmId);

  const [editOpen, setEditOpen] = useState(false);

  const {
    data: microData,
    isLoading: microLoading,
    isError: microIsError,
  } = useQuery({
    queryKey: ["mix-micro", mix.file_id],
    queryFn: () =>
      axios
        .post(`${endpoint}/search_micro/`, { file_id: String(mix.file_id) })
        .then((res) => res.data),
    enabled: !!mix.file_id,
    staleTime: 5 * 60 * 1000,
  });

  const microError = microIsError ? "데이터를 불러오지 못했습니다." : null;

  const mediaBudget = useMemo(() => {
    if (!microData?.file_micro) return [];
    const agg = {};
    microData.file_micro.forEach(({ m }) => {
      const media = m.media_mapped || m.media || "기타";
      agg[media] = (agg[media] || 0) + (Number(m.budget_krw) || 0);
    });
    const total = Object.values(agg).reduce((s, v) => s + v, 0);
    if (total === 0) return [];
    return Object.entries(agg)
      .map(([name, value]) => ({ name, value, pct: value / total }))
      .sort((a, b) => b.value - a.value);
  }, [microData]);

  const industries = toArr(mix.ind_depth1);
  const mixSheets = toArr(mix.mixSheets);
  const gender = GENDER_LABEL[mix.target_gender] || mix.target_gender || "-";
  const ageRange =
    mix.target_age_min != null || mix.target_age_max != null
      ? `${mix.target_age_min ?? "-"} ~ ${mix.target_age_max ?? "-"}`
      : "-";
  const budget =
    mix.budget_sum != null
      ? `${Number(mix.budget_sum).toLocaleString()}원`
      : "-";
  const microItems = (microData?.file_micro || []).map(({ m }) => m);
  const similarMixes = (microData?.similar_top || []).map(({ t }) => t);
  const hasMicro = microData != null;

  return (
    <div className="mix-detail">
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={14} strokeWidth={2} />
        목록으로
      </button>

      {editOpen && (
        <EditModal
          fileId={mix.file_id}
          filePath={mix.file_path}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Hero */}
      <div className="mix-hero">
        <div className="mix-hero-actions">
          <button
            className={`mix-folder-btn${isInFolder ? " mix-folder-btn--on" : ""}${isPending ? " mix-folder-btn--pending" : ""}`}
            onClick={() => toggleFolder(mix.file_id)}
            disabled={isPending}
          >
            {isPending ? (
              <Loader size={13} strokeWidth={2} className="bm-spin" />
            ) : isInFolder ? (
              <FolderCheck size={13} strokeWidth={2} />
            ) : (
              <Folder size={13} strokeWidth={2} />
            )}
            {isPending ? "처리 중..." : isInFolder ? "폴더에 있음" : "폴더"}
          </button>
          <button
            className="mix-edit-req-btn"
            onClick={() => setEditOpen(true)}
          >
            <Pencil size={13} strokeWidth={2} />
            데이터 수정 요청
          </button>
        </div>

        <div className="mix-hero-name">{mix.file_path || "-"}</div>
        <br />

        <div className="mix-hero-body">
          <div className="mix-hero-info">
            <div className="mix-info-row">
              <span className="mix-info-label">
                예산 (Gross, Market Cost 기준)
              </span>
              <span className="mix-info-value">{budget}</span>
            </div>
            <div className="mix-info-row mix-info-row--tags">
              <span className="mix-info-label">업종</span>
              <span className="mix-info-value">
                {industries.length > 0 ? (
                  <span className="mix-info-tags">
                    {industries.map((i) => (
                      <span key={i} className="mix-tag mix-tag--ind">
                        {i}
                      </span>
                    ))}
                  </span>
                ) : (
                  "-"
                )}
              </span>
            </div>
            <div className="mix-info-row">
              <span className="mix-info-label">타겟 성별</span>
              <span className="mix-info-value">{gender}</span>
            </div>
            <div className="mix-info-row">
              <span className="mix-info-label">타겟 연령</span>
              <span className="mix-info-value">{ageRange}</span>
            </div>
            {mixSheets.length > 0 && (
              <div className="mix-info-row mix-info-row--files">
                <span className="mix-info-label">원본 파일 보기</span>
                <span className="mix-info-files">
                  {mixSheets.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mix-pdf-link"
                    >
                      <ExternalLink size={12} strokeWidth={1.8} />
                      {pdfLabel(url)}
                    </a>
                  ))}
                </span>
              </div>
            )}
          </div>

          <div className="mix-hero-chart">
            <div className="mix-hero-chart-title">
              매체 구성별 예산 비중
              <span className="mix-info-label-note">
                Gross, Market Cost 기준
              </span>
            </div>
            {microLoading && (
              <div className="mix-chart-placeholder">집계 중...</div>
            )}
            {!microLoading && mediaBudget.length > 0 && (
              <DonutChart data={mediaBudget} />
            )}
            {!microLoading && hasMicro && mediaBudget.length === 0 && (
              <div className="mix-chart-placeholder">예산 데이터 없음</div>
            )}
            {!microLoading && !hasMicro && !microError && (
              <div className="mix-chart-placeholder">
                데이터를 불러오는 중...
              </div>
            )}
          </div>
        </div>
      </div>

      {microError && (
        <div className="state-msg state-msg--error">
          {microError}
        </div>
      )}

      <br />

      {/* 상세 집행 내역 */}
      {hasMicro && (
        <div className="section">
          <div className="section-hdr">
            <span className="section-title">Media Mix</span>
          </div>
          <MixMicroGrid items={microItems} />
        </div>
      )}

      <br />

      {/* 유사 미디어믹스 */}
      {hasMicro && similarMixes.length > 0 && (
        <div className="mix-micro-wrap">
          <div className="section-hdr">
            <span className="section-title">
              이 믹스와 유사한 믹스
            </span>
          </div>
          <div className="similar-grid">
            {similarMixes.map((item, i) => {
              const cardId = Number(item.file_id);
              const cardInFolder = folderIds.has(cardId);
              return (
                <div
                  key={i}
                  className="similar-card"
                  onClick={() => onSelect?.(item)}
                >
                  {cardInFolder && (
                    <span className="similar-card-bm">
                      <FolderCheck size={13} strokeWidth={2} />
                    </span>
                  )}
                  <div className="similar-card-name">{item.file_path || "-"}</div>
                  <div className="similar-card-tags">
                    {toArr(item.medias).map((m) => (
                      <span key={m} className="mix-tag">
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
      )}

      <br />
      <hr />
      <br />
    </div>
  );
}
