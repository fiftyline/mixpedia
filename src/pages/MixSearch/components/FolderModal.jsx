import { useState } from "react";
import { X, Folder, FolderPlus } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { useBookmark } from "../../../context/BookmarkContext";

export default function FolderModal({ mixIds, onClose, onSuccess }) {
  const { folders, foldersLoading, refreshFolders } = useBookmark();
  const [mode, setMode] = useState("existing");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");

    if (mode === "new") {
      if (!newFolderName.trim()) {
        setErrorMsg("폴더 이름을 입력해 주세요.");
        return;
      }
      const duplicate = folders.find((f) => f.folder_name === newFolderName.trim());
      if (duplicate) {
        setErrorMsg(`"${newFolderName.trim()}" 폴더가 이미 존재합니다. 다른 이름을 사용하거나 기존 폴더에 추가해 주세요.`);
        return;
      }
    } else {
      if (!selectedFolderId) {
        setErrorMsg("폴더를 선택해 주세요.");
        return;
      }
    }

    setStatus("loading");
    try {
      let folderId = selectedFolderId;

      if (mode === "new") {
        const userId = localStorage.getItem("user_id") ?? "";
        const now = new Date();
        const ts =
          now.getFullYear().toString() +
          String(now.getMonth() + 1).padStart(2, "0") +
          String(now.getDate()).padStart(2, "0") +
          String(now.getHours()).padStart(2, "0") +
          String(now.getMinutes()).padStart(2, "0") +
          String(now.getSeconds()).padStart(2, "0");
        folderId = `${userId}_${ts}`;

        const createRes = await axios.post(`${endpoint}/bookmark/create`, {
          folder_id: folderId,
          folder_name: newFolderName.trim(),
        });
        if (createRes.data?.status !== "success") {
          setStatus("error");
          setErrorMsg("폴더 생성에 실패했습니다.");
          return;
        }
        refreshFolders();
      }

      await axios.post(`${endpoint}/bookmark/add`, {
        folder_id: folderId,
        file_ids: mixIds,
      });
      refreshFolders();

      setStatus("success");
      onSuccess?.();
      setTimeout(onClose, 1200);
    } catch {
      setStatus("error");
      setErrorMsg("오류가 발생했습니다.");
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div
        className="edit-modal folder-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edit-modal-header">
          <span className="edit-modal-title">폴더에 추가</span>
          <button className="edit-modal-close" onClick={onClose}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="edit-modal-body">
          <p className="folder-modal-hint">
            {mixIds.length.toLocaleString()}개의 믹스를 추가할 폴더를 선택하세요.
          </p>

          <div className="folder-modal-tabs">
            <button
              type="button"
              className={`folder-modal-tab${mode === "existing" ? " folder-modal-tab--active" : ""}`}
              onClick={() => { setMode("existing"); setErrorMsg(""); }}
            >
              <Folder size={13} strokeWidth={2} />
              기존 폴더
            </button>
            <button
              type="button"
              className={`folder-modal-tab${mode === "new" ? " folder-modal-tab--active" : ""}`}
              onClick={() => { setMode("new"); setErrorMsg(""); }}
            >
              <FolderPlus size={13} strokeWidth={2} />
              새 폴더
            </button>
          </div>

          {mode === "existing" ? (
            foldersLoading ? (
              <div className="folder-modal-state">폴더 목록 불러오는 중...</div>
            ) : folders.length === 0 ? (
              <div className="folder-modal-state">
                폴더가 없습니다. 새 폴더를 만들어 주세요.
              </div>
            ) : (
              <select
                className="folder-modal-select"
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
              >
                <option value="">폴더를 선택하세요</option>
                {folders.map((f) => (
                  <option key={f.folder_id} value={f.folder_id}>
                    {f.folder_name} ({f.file_cnt ?? 0}건)
                  </option>
                ))}
              </select>
            )
          ) : (
            <input
              className="folder-modal-input"
              type="text"
              placeholder="새 폴더 이름"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              autoFocus
              disabled={status === "loading" || status === "success"}
            />
          )}

          {errorMsg && <p className="folder-modal-error">{errorMsg}</p>}
        </div>

        <div className="edit-modal-footer folder-modal-footer">
          {status === "success" && (
            <span className="edit-modal-status edit-modal-status--ok">
              폴더에 추가되었습니다.
            </span>
          )}
          {status === "error" && !errorMsg && (
            <span className="edit-modal-status edit-modal-status--err">
              오류가 발생했습니다.
            </span>
          )}
          <div className="folder-modal-actions">
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "추가 중..." : "폴더에 추가"}
            </button>
            <button className="btn-secondary" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
