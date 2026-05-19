import { ChevronRight } from "lucide-react";

export default function Step00Define({ username, setUsername, modelname, setModelname, onNext }) {
  const handleNext = () => {
    if (!username.trim() || !modelname.trim()) {
      onNext(null, "분석자와 모델명을 모두 입력해주세요.");
      return;
    }
    onNext({ username: username.trim(), modelname: modelname.trim() });
  };

  return (
    <div className="mmm-card">
      <div className="mmm-card-title">Step 00 — 모델 정의</div>

      <div className="mmm-field">
        <label className="mmm-label">분석자</label>
        <input
          className="mmm-input"
          maxLength={10}
          placeholder="예: 김00 (최대 10자)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="mmm-field">
        <label className="mmm-label">모델명</label>
        <p className="mmm-desc" style={{ margin: "0 0 6px" }}>
          입력한 모델명으로 &apos;모델 확인&apos; 탭에서 결과를 조회할 수 있습니다.
        </p>
        <input
          className="mmm-input"
          maxLength={50}
          placeholder="예: MMM모델1 (최대 50자)"
          value={modelname}
          onChange={(e) => setModelname(e.target.value)}
        />
      </div>

      <div className="mmm-nav" style={{ justifyContent: "flex-end" }}>
        <button className="mmm-btn mmm-btn--primary" onClick={handleNext}>
          다음 <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
