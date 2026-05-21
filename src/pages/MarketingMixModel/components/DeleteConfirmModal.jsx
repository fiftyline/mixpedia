import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({ modelId, loading, onConfirm, onCancel }) {
  return (
    <div className="mmm-modal-overlay" onClick={onCancel}>
      <div className="mmm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mmm-modal-close" onClick={onCancel} disabled={loading}>
          <X size={16} />
        </button>

        <div className="mmm-modal-icon">
          <AlertTriangle size={28} color="#f43f5e" strokeWidth={1.8} />
        </div>

        <div className="mmm-modal-title">모델 삭제</div>
        <div className="mmm-modal-body">
          <p>아래 모델을 삭제하시겠습니까?</p>
          <code className="mmm-modal-model-id">{modelId}</code>
          <p className="mmm-modal-warn">이 작업은 되돌릴 수 없습니다.</p>
        </div>

        <div className="mmm-modal-actions">
          <button className="mmm-modal-btn mmm-modal-btn--cancel" onClick={onCancel} disabled={loading}>
            취소
          </button>
          <button className="mmm-modal-btn mmm-modal-btn--delete" onClick={onConfirm} disabled={loading}>
            {loading ? "삭제 중…" : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
