import { useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../config/config";
import "./styles.css";

const STATUS_OPTIONS = [
  { value: "progress_all",      label: "전체" },
  { value: "progress_in",       label: "분석 중" },
  { value: "progress_error",    label: "오류 발생" },
  { value: "progress_complete", label: "완료" },
];

function StatusBadge({ status }) {
  const map = {
    progress_complete: ["complete", "완료"],
    progress_in:       ["progress", "분석 중"],
    progress_error:    ["error",    "오류"],
  };
  const [cls, label] = map[status] ?? ["other", "기타"];
  return <span className={`mmm-badge mmm-badge--${cls}`}>{label}</span>;
}

export default function MmmMyModelsPage() {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    username: "",
    modelname: "",
    modelid: "",
    status: "progress_all",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setFilter = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${endpoint}/mmm/models`, filters);
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("모델 목록을 불러오지 못했습니다.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mmm-page">
      <div className="page-header">
        <h1 className="page-title">모델 확인</h1>
        <p className="page-desc">생성된 MMM 모델의 진행 상황과 분석 결과를 확인합니다.</p>
      </div>

      {/* Filter */}
      <div className="mmm-card">
        <div className="mmm-card-title">조회 조건</div>
        <div className="mmm-filter-grid">
          <div className="mmm-filter-field">
            <label className="mmm-label">생성 날짜 (시작)</label>
            <input
              type="date"
              className="mmm-input"
              style={{ maxWidth: "100%" }}
              value={filters.dateFrom}
              onChange={(e) => setFilter("dateFrom", e.target.value)}
            />
          </div>
          <div className="mmm-filter-field">
            <label className="mmm-label">생성 날짜 (종료)</label>
            <input
              type="date"
              className="mmm-input"
              style={{ maxWidth: "100%" }}
              value={filters.dateTo}
              onChange={(e) => setFilter("dateTo", e.target.value)}
            />
          </div>
          <div className="mmm-filter-field">
            <label className="mmm-label">분석자</label>
            <input
              className="mmm-input"
              style={{ maxWidth: "100%" }}
              placeholder="분석자"
              maxLength={10}
              value={filters.username}
              onChange={(e) => setFilter("username", e.target.value)}
            />
          </div>
          <div className="mmm-filter-field">
            <label className="mmm-label">모델명</label>
            <input
              className="mmm-input"
              style={{ maxWidth: "100%" }}
              placeholder="모델명"
              maxLength={50}
              value={filters.modelname}
              onChange={(e) => setFilter("modelname", e.target.value)}
            />
          </div>
          <div className="mmm-filter-field">
            <label className="mmm-label">모델 ID</label>
            <input
              className="mmm-input"
              style={{ maxWidth: "100%" }}
              placeholder="모델 ID"
              maxLength={24}
              value={filters.modelid}
              onChange={(e) => setFilter("modelid", e.target.value)}
            />
          </div>
          <div className="mmm-filter-field">
            <label className="mmm-label">진행 상황</label>
            <select
              className="mmm-select"
              style={{ width: "100%" }}
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="mmm-query-btn" onClick={handleQuery} disabled={loading}>
          <Search size={14} />
          {loading ? "조회 중..." : "조회"}
        </button>
      </div>

      {/* Results */}
      {error && (
        <div className="mix-micro-state mix-micro-state--error">{error}</div>
      )}

      {results !== null && !error && (
        <div className="mmm-card">
          <div className="mmm-card-title">
            모델 목록
            <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--text-secondary)", marginLeft: 8 }}>
              {results.length.toLocaleString()}건
            </span>
          </div>

          {results.length === 0 ? (
            <div className="mix-micro-state">조회된 모델이 없습니다.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="mmm-models-table">
                <thead>
                  <tr>
                    <th>분석자</th>
                    <th>모델 ID</th>
                    <th>모델명</th>
                    <th>모델 생성 시간</th>
                    <th>상태 갱신 시간</th>
                    <th>진행 상태</th>
                    <th>분석 결과</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.modelid}>
                      <td>{row.input_username}</td>
                      <td>
                        {row.status === "progress_complete" ? (
                          <a className="mmm-link" href={`/mmm/detail/${row.modelid}`}>{row.modelid}</a>
                        ) : (
                          <span style={{ fontFamily: "var(--font-data)", fontSize: "0.8rem" }}>{row.modelid}</span>
                        )}
                      </td>
                      <td>{row.input_modelname}</td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{row.modeltime}</td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{row.status_time}</td>
                      <td><StatusBadge status={row.status} /></td>
                      <td>
                        {row.status === "progress_complete" ? (
                          <a className="mmm-link" href={`/mmm/detail/${row.modelid}`}>결과 보고서</a>
                        ) : (
                          <span style={{ color: "var(--text-tertiary)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
