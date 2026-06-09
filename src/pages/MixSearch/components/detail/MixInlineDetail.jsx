import { useMemo, useState } from "react";
import { Pencil, SquareArrowOutUpRight, FileSpreadsheet } from "lucide-react";
import { toArr, fmtBudget } from "../../../../utils/mixUtils";
import EditModal from "./EditModal";
import MixMicroGrid from "./MixMicroGrid";

const STORAGE_PREFIX = "mixpedia:mix-detail:";

function openMixDetail(item) {
  localStorage.setItem(
    `${STORAGE_PREFIX}${item.file_id}`,
    JSON.stringify(item),
  );
  window.open(`/mix-search/detail/${item.file_id}`, "_blank", "noopener");
}

export default function MixInlineDetail({ mix }) {
  const [editOpen, setEditOpen] = useState(false);

  const microItems = useMemo(
    () => (mix?.micro_data || []).filter(Boolean),
    [mix?.micro_data],
  );

  const mixSheets = toArr(mix?.mixSheets);

  return (
    <div className="mix-inline-detail">
      {editOpen && (
        <EditModal
          fileId={mix.file_id}
          filePath={mix.file_path}
          onClose={() => setEditOpen(false)}
        />
      )}

      <div className="mix-inline-top-actions">
        <button
          className="mix-inline-open-tab"
          type="button"
          onClick={() => openMixDetail(mix)}
        >
          <SquareArrowOutUpRight size={13} strokeWidth={2} />
          새탭으로 열기
        </button>
      </div>

      <div className="mix-inline-body">
        <div className="section">
          <div className="section-hdr mix-inline-section-hdr">
            <span className="section-title">Media Mix</span>
            <div className="mix-inline-actions">
              {mixSheets.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mix-pdf-link mix-inline-action-btn"
                >
                  <FileSpreadsheet size={14} strokeWidth={1.8} />
                  원본 파일
                </a>
              ))}
              <button
                className="mix-edit-req-btn mix-inline-action-btn"
                onClick={() => setEditOpen(true)}
              >
                <Pencil size={13} strokeWidth={2} />
                데이터 수정 요청
              </button>
            </div>
          </div>
          <MixMicroGrid items={microItems} />
        </div>
      </div>
    </div>
  );
}
