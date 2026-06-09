import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";

export default function CreateFolderModal({ folders, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) { setErrorMsg("폴더 이름을 입력해 주세요."); return; }
    if (folders.find((f) => f.folder_name === trimmed)) {
      setErrorMsg(`"${trimmed}" 폴더가 이미 존재합니다.`);
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const userId = localStorage.getItem("user_id") ?? "";
      const now = new Date();
      const ts =
        now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, "0") +
        String(now.getDate()).padStart(2, "0") +
        String(now.getHours()).padStart(2, "0") +
        String(now.getMinutes()).padStart(2, "0") +
        String(now.getSeconds()).padStart(2, "0");
      const res = await axios.post(`${endpoint}/bookmark/create`, {
        folder_id: `${userId}_${ts}`,
        folder_name: trimmed,
      });
      if (res.data?.status !== "success") {
        setStatus("error");
        setErrorMsg("폴더 생성에 실패했습니다.");
        return;
      }
      setStatus("success");
      onCreated();
      setTimeout(onClose, 1000);
    } catch {
      setStatus("error");
      setErrorMsg("오류가 발생했습니다.");
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal folder-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <span className="edit-modal-title">새 폴더 만들기</span>
          <button className="edit-modal-close" onClick={onClose}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>
        <div className="edit-modal-body">
          <input
            className="folder-modal-input"
            type="text"
            placeholder="폴더 이름"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrorMsg(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
            autoFocus
            disabled={status === "loading" || status === "success"}
          />
          {errorMsg && <p className="folder-modal-error">{errorMsg}</p>}
        </div>
        <div className="edit-modal-footer folder-modal-footer">
          {status === "success" && (
            <span className="edit-modal-status edit-modal-status--ok">폴더가 생성되었습니다.</span>
          )}
          <div className="folder-modal-actions">
            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "생성 중..." : "만들기"}
            </button>
            <button className="btn-secondary" onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}
