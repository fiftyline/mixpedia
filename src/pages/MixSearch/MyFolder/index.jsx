import { useState, useReducer, useCallback } from "react";
import { ChevronLeft, RefreshCw, Folder, FolderPlus, Trash2, X } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { useBookmark } from "../../../context/BookmarkContext";
import { notify } from "../../../utils/notify";
import MixTable from "../components/MixTable";
import FolderInsights from "./FolderInsights";
import CreateFolderModal from "./CreateFolderModal";
import FolderNameEditor from "./FolderNameEditor";
import "../styles.css";

function mixesReducer(state, action) {
  switch (action.type) {
    case "start": return { data: [], loading: true, error: null };
    case "success": return { data: action.payload, loading: false, error: null };
    case "error": return { data: [], loading: false, error: action.payload };
    default: return state;
  }
}

function fmtDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function MyFolderPage() {
  const { folders, foldersLoading, refreshFolders } = useBookmark();

  const [view, setView] = useState("folders"); // "folders" | "mixes" | "insights"
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeFolderName, setActiveFolderName] = useState("");
  const [selectedMix, setSelectedMix] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [insightFileIds, setInsightFileIds] = useState([]);

  const handleSelect = useCallback((item) => {
    const fid = item?.file_id;
    if (fid != null && String(fid) === String(selectedRowId)) {
      setSelectedMix(null);
      setSelectedRowId(null);
    } else {
      setSelectedMix(item);
      setSelectedRowId(fid ?? null);
    }
  }, [selectedRowId]);

  const [{ data: mixes, loading: mixesLoading, error: mixesError }, dispatch] =
    useReducer(mixesReducer, { data: [], loading: false, error: null });

  const loadFolderMixes = (folder) => {
    setActiveFolder(folder);
    setActiveFolderName(folder.folder_name);
    setSelectedMix(null);
    setSelectedRowId(null);
    dispatch({ type: "start" });
    axios
      .post(`${endpoint}/bookmark/macro`, { folder_id: folder.folder_id })
      .then((res) => dispatch({ type: "success", payload: Array.isArray(res.data) ? res.data : [] }))
      .catch(() => dispatch({ type: "error", payload: "믹스 데이터를 불러오지 못했습니다." }));
    setView("mixes");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axios.post(`${endpoint}/bookmark/delete`, { folder_id: deleteTarget.folder_id });
      notify.success(`"${deleteTarget.folder_name}" 폴더가 삭제되었습니다.`);
      setDeleteTarget(null);
      refreshFolders();
    } catch {
      notify.error("폴더 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const handleRemove = async (fileIds) => {
    try {
      await axios.post(`${endpoint}/bookmark/remove`, {
        folder_id: activeFolder.folder_id,
        file_ids: fileIds,
      });
      notify.success(`${fileIds.length}건이 폴더에서 제거되었습니다.`);
      loadFolderMixes(activeFolder);
      refreshFolders();
    } catch {
      notify.error("제거 중 오류가 발생했습니다.");
    }
  };

  if (view === "insights") {
    return (
      <section className="mix-search-page">
        <FolderInsights
          folderId={activeFolder?.folder_id}
          fileIds={insightFileIds}
          folderName={activeFolderName}
          onBack={() => setView("mixes")}
        />
      </section>
    );
  }

  if (view === "mixes") {
    return (
      <section className="mix-search-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => setView("folders")}>
            <ChevronLeft size={14} strokeWidth={2} />
            폴더 목록으로
          </button>
          <div style={{ marginTop: 8 }}>
            <FolderNameEditor
              folder={{ folder_id: activeFolder?.folder_id, folder_name: activeFolderName }}
              onSaved={(name) => { setActiveFolderName(name); refreshFolders(); }}
            />
          </div>
        </div>

        {mixesError ? (
          <div className="state-msg state-msg--error">{mixesError}</div>
        ) : mixesLoading ? (
          <div className="state-msg">불러오는 중...</div>
        ) : (
          <MixTable
            results={mixes}
            onSelect={handleSelect}
            selectedMix={selectedMix}
            selectedRowId={selectedRowId}
            onAnalyze={(ids) => { setInsightFileIds(ids); setView("insights"); }}
            onRemove={handleRemove}
            hideAdd
          />
        )}
        <br /><br />
      </section>
    );
  }

  /* ── 폴더 목록 ── */
  return (
    <section className="mix-search-page">
      <div className="page-header">
        <h1 className="page-title">내 폴더</h1>
        <p className="page-desc">폴더를 선택해 믹스를 확인하고 분석합니다.</p>
      </div>

      <div className="bm-page-actions">
        <button className="bm-action-btn" onClick={refreshFolders} disabled={foldersLoading}>
          <RefreshCw size={13} strokeWidth={2} className={foldersLoading ? "bm-spin" : ""} />
          새로고침
        </button>
        <button className="bm-action-btn bm-action-btn--primary" onClick={() => setCreateModalOpen(true)}>
          <FolderPlus size={13} strokeWidth={2} />
          새 폴더
        </button>
      </div>

      {createModalOpen && (
        <CreateFolderModal
          folders={folders}
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => { notify.success("폴더가 생성되었습니다."); refreshFolders(); }}
        />
      )}

      {deleteTarget && (
        <div className="edit-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="edit-modal folder-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <span className="edit-modal-title">폴더 삭제</span>
              <button className="edit-modal-close" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                <X size={15} strokeWidth={2} />
              </button>
            </div>
            <div className="edit-modal-body">
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                <strong style={{ fontFamily: "var(--font-body)" }}>&ldquo;{deleteTarget.folder_name}&rdquo;</strong> 폴더를 삭제하시겠습니까?<br />
                <span style={{ color: "var(--color-text-muted)", fontSize: 12 }}>폴더가 삭제되어도 믹스 데이터는 유지됩니다.</span>
              </p>
            </div>
            <div className="edit-modal-footer folder-modal-footer">
              <div className="folder-modal-actions">
                <button
                  className="bulk-bm-btn bulk-bm-btn--danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "삭제 중..." : "삭제"}
                </button>
                <button className="btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>취소</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {foldersLoading ? (
        <div className="state-msg">폴더 목록 불러오는 중...</div>
      ) : folders.length === 0 ? (
        <div className="state-msg">폴더가 없습니다. 미디어믹스 조회에서 폴더를 만들어 보세요.</div>
      ) : (
        <div className="folder-card-grid">
          {folders.map((f) => (
            <div key={f.folder_id} className="folder-card" onClick={() => loadFolderMixes(f)}>
              <button
                className="folder-card-delete"
                title="폴더 삭제"
                onClick={(e) => { e.stopPropagation(); setDeleteTarget(f); }}
              >
                <Trash2 size={13} strokeWidth={2} />
              </button>
              <span className="folder-card-icon">
                <Folder size={20} strokeWidth={1.8} />
              </span>
              <span className="folder-card-name">{f.folder_name}</span>
              <span className="folder-card-meta">{(f.file_cnt ?? 0).toLocaleString()}개 미디어믹스</span>
              <span className="folder-card-meta" style={{ marginTop: 4 }}>최근 수정일 : {fmtDate(f.update_dttm)}</span>
            </div>
          ))}
        </div>
      )}
      <br /><br />
    </section>
  );
}
