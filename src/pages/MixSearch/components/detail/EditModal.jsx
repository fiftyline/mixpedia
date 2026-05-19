import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../../config/config";

export default function EditModal({ fileId, filePath, onClose }) {
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setStatus("loading");
    try {
      await axios.post(`${endpoint}/data_edit/`, {
        file_id: fileId,
        user_id: localStorage.getItem("user_id"),
        edit_comment: comment,
      });
      setStatus("success");
      setTimeout(() => {
        onClose();
        setComment("");
        setStatus(null);
      }, 1500);
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    onClose();
    setComment("");
    setStatus(null);
  };

  return (
    <div className="edit-modal-overlay" onClick={handleClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <span className="edit-modal-title">데이터 수정 요청</span>
          <button className="edit-modal-close" onClick={handleClose}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>
        <div className="edit-modal-body">
          <p className="edit-modal-file">{filePath || "-"}</p>
          <textarea
            className="edit-modal-textarea"
            placeholder="수정이 필요한 내용을 입력해 주세요.&#10;예) 업종 분류 수정 필요 → 패션 > 스포츠웨어"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={status === "loading" || status === "success"}
          />
        </div>
        <div className="edit-modal-footer">
          {status === "success" && (
            <span className="edit-modal-status edit-modal-status--ok">
              요청이 접수되었습니다.
            </span>
          )}
          {status === "error" && (
            <span className="edit-modal-status edit-modal-status--err">
              오류가 발생했습니다.
            </span>
          )}
          <button className="btn-secondary" onClick={handleClose}>
            취소
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={
              !comment.trim() || status === "loading" || status === "success"
            }
          >
            {status === "loading" ? "요청 중..." : "요청 보내기"}
          </button>
        </div>
      </div>
    </div>
  );
}
