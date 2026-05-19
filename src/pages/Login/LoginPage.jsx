import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { endpoint } from "../../config/config";
import "./styles.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${endpoint}/auth/login`, {
        user_id: userId,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user_id", userId);
      navigate("/mix-search", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* 왼쪽 다크 패널 */}
      <div className="login-panel">
        <div className="login-brand">
          <div className="login-brand-logo">
            <img src="/logo.svg" alt="Mixpedia" />
            <span className="login-brand-name">MIXPEDIA</span>
          </div>
        </div>

        <div className="login-panel-tagline">
          <p className="login-panel-headline">
            미디어플래닝을 위한
            <br />
            <em>통합 솔루션</em>
          </p>
          <p className="login-panel-desc">
            미디어믹스 탐색부터 매체 인사이트,
            <br />
            마케팅 믹스 모델링 (MMM)까지.
            <br />
            <strong>데이터 기반 플래닝의 전 과정을 한곳에서.</strong>
          </p>
        </div>

        <div className="login-panel-footer">
          <img src="/dmclogo2.png" alt="DMC미디어" className="login-dmc-logo" />
          <p className="login-panel-team">[D.Match - Team. 광삼데이]</p>
        </div>
      </div>

      {/* 오른쪽 폼 영역 */}
      <div className="login-form-area">
        <div className="login-card">
          <div className="login-header">
            <span className="login-title">로그인</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">아이디</label>
              <input
                className="login-input"
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="login-field">
              <label className="login-label">비밀번호</label>
              <input
                className="login-input"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
