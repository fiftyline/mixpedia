import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Step04Complete({ createdId, createdName, onReset }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(createdId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mmm-card">
      <div className="mmm-complete-box">
        <div className="mmm-complete-icon">
          <CheckCircle2 size={56} strokeWidth={1.5} />
        </div>
        <div className="mmm-complete-title">모델 생성 완료</div>
        <p className="mmm-complete-desc">
          MMM 분석이 시작되었습니다. 분석 시간은 최대 1시간까지 소요될 수 있습니다.<br />
          진행 상황 및 결과는 <strong>모델 확인</strong> 탭에서 확인할 수 있습니다.
        </p>

        <div className="mmm-complete-info">
          <div className="mmm-complete-info-row">
            <span className="mmm-complete-info-label">모델명</span>
            <span className="mmm-complete-info-value">{createdName}</span>
          </div>
          <div className="mmm-complete-info-divider" />
          <div className="mmm-complete-info-row">
            <span className="mmm-complete-info-label">모델 ID</span>
            <span className="mmm-complete-model-id">{createdId}</span>
            <button className="mmm-copy-btn" onClick={handleCopy} title="복사">
              {copied ? <Check size={13} color="#4fc98f" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <div className="mmm-complete-actions">
          <button className="mmm-btn" onClick={onReset}>새 모델 생성</button>
          <button className="mmm-btn mmm-btn--primary" onClick={() => navigate("/mmm/my-models")}>
            모델 확인으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
