import { Search } from "lucide-react";
import MultiSelect from "./MultiSelect";

const GENDER_OPTIONS = [
  { val: "P", label: "전체" },
  { val: "M", label: "남성" },
  { val: "F", label: "여성" },
];

export default function SearchPanel({
  filters,
  setFilters,
  onSearch,
  onReset,
  loading,
  mediaOptions,
  industryOptions,
}) {
  const update = (key, val) => setFilters((prev) => ({ ...prev, [key]: val }));

  const handleAgeInput = (key, raw) => {
    if (raw === "") {
      update(key, null);
      return;
    }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0) update(key, num);
  };

  return (
    <div className="search-panel">
      <div className="filter-row filter-row--search">
        <div className="filter-item filter-item--full">
          <label className="filter-label-search">미디어믹스 검색</label>
          <div className="search-input-wrap">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-text-input"
              value={filters.search_text}
              onChange={(e) => update("search_text", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && onSearch()}
              placeholder="검색어를 입력하세요"
            />
          </div>
        </div>
      </div>

      <div className="filter-row filter-row--2col">
        <div className="filter-item">
          <label className="filter-label">매체 필터</label>
          <MultiSelect
            options={mediaOptions}
            value={filters.media}
            onChange={(v) => update("media", v)}
            placeholder="매체 선택"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">업종 필터</label>
          <MultiSelect
            options={industryOptions}
            value={filters.industry}
            onChange={(v) => update("industry", v)}
            placeholder="업종 선택"
          />
        </div>
      </div>

      <div className="filter-row filter-row--3col">
        <div className="filter-item">
          <label className="filter-label">타겟 성별</label>
          <select
            className="filter-input filter-select"
            value={filters.target_gender}
            onChange={(e) => update("target_gender", e.target.value)}
          >
            {GENDER_OPTIONS.map((g) => (
              <option key={g.val} value={g.val}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">연령 최솟값</label>
          <input
            type="number"
            className="filter-input"
            value={filters.target_age_min ?? ""}
            onChange={(e) => handleAgeInput("target_age_min", e.target.value)}
            min={0}
            placeholder="최소"
          />
        </div>

        <div className="filter-item">
          <label className="filter-label">연령 최댓값</label>
          <input
            type="number"
            className="filter-input"
            value={filters.target_age_max ?? ""}
            onChange={(e) => handleAgeInput("target_age_max", e.target.value)}
            min={0}
            placeholder="최대"
          />
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn-secondary" onClick={onReset} type="button">
          초기화
        </button>
        <button
          className="btn-primary"
          onClick={onSearch}
          disabled={loading}
          type="button"
        >
          {loading ? "조회 중..." : "조회"}
        </button>
      </div>
    </div>
  );
}
