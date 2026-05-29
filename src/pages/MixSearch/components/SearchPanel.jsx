import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import MultiSelect from "../../../components/MultiSelect";

const GENDER_OPTIONS = [
  { val: "P", label: "전체" },
  { val: "M", label: "남성" },
  { val: "F", label: "여성" },
];

function GenderSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = GENDER_OPTIONS.find((g) => g.val === value) ?? GENDER_OPTIONS[0];

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const select = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="ss-container" ref={containerRef}>
      <button
        className={`ss-control ${open ? "open" : ""}`}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="ss-value">{selected.label}</span>
        <ChevronDown
          size={13}
          className={`ss-chevron ${open ? "rotated" : ""}`}
        />
      </button>

      {open && (
        <div className="ss-dropdown">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.val}
              className={`ss-option ${value === g.val ? "selected" : ""}`}
              type="button"
              onClick={() => select(g.val)}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <label className="filter-label-search">미디어믹스 검색</label>

      <div className="search-panel-body">
        <div className="filter-row filter-row--search">
          <div className="filter-item filter-item--full">
            <div className="search-input-wrap">
              <Search size={14} className="search-icon" />
              <textarea
                className="search-text-input"
                value={filters.search_text}
                onChange={(e) => update("search_text", e.target.value)}
                onKeyDown={(e) =>
                  (e.ctrlKey || e.metaKey) &&
                  e.key === "Enter" &&
                  !loading &&
                  onSearch()
                }
                placeholder="검색어를 입력하세요"
              />
            </div>
          </div>
        </div>

        <div className="filter-stack">
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
              <GenderSelect
                value={filters.target_gender}
                onChange={(v) => update("target_gender", v)}
              />
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
