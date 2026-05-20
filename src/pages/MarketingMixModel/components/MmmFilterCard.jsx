import { Search } from "lucide-react";

export default function MmmFilterCard({ filters, setFilter, loading, onQuery }) {
  return (
    <div className="mmm-card">
      <div className="mmm-filter-row-label">분석 일자</div>
      <div className="mmm-filter-date-range">
        <input
          type="date"
          className="mmm-input"
          value={filters.dateFrom}
          onChange={(e) => setFilter("dateFrom", e.target.value)}
        />
        <span className="mmm-filter-date-sep">~</span>
        <input
          type="date"
          className="mmm-input"
          value={filters.dateTo}
          onChange={(e) => setFilter("dateTo", e.target.value)}
        />
      </div>

      <div className="mmm-filter-divider" />

      <div className="mmm-filter-row-label">식별 조건</div>
      <div className="mmm-filter-grid">
        <div className="mmm-filter-field">
          <label className="mmm-label">분석자</label>
          <input
            className="mmm-input"
            style={{ maxWidth: "100%" }}
            placeholder="분석자"
            maxLength={10}
            value={filters.input_username}
            onChange={(e) => setFilter("input_username", e.target.value)}
          />
        </div>
        <div className="mmm-filter-field">
          <label className="mmm-label">모델명</label>
          <input
            className="mmm-input"
            style={{ maxWidth: "100%" }}
            placeholder="모델명"
            maxLength={50}
            value={filters.input_modelname}
            onChange={(e) => setFilter("input_modelname", e.target.value)}
          />
        </div>
        <div className="mmm-filter-field">
          <label className="mmm-label">모델 ID</label>
          <input
            className="mmm-input"
            style={{ maxWidth: "100%" }}
            placeholder="모델 ID"
            maxLength={24}
            value={filters.model_id}
            onChange={(e) => setFilter("model_id", e.target.value)}
          />
        </div>
      </div>

      <button className="mmm-query-btn" onClick={onQuery} disabled={loading}>
        <Search size={14} />
        {loading ? "조회 중..." : "조회"}
      </button>
    </div>
  );
}
