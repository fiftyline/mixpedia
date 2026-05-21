import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export default function MultiSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.toLowerCase()),
  );

  const toggle = (val) => {
    onChange(
      value.includes(val) ? value.filter((v) => v !== val) : [...value, val],
    );
  };

  const removeTag = (val, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  return (
    <div className="ms-container" ref={containerRef}>
      <div
        className={`ms-control ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <div className="ms-tags">
          {value.length === 0 && (
            <span className="ms-placeholder">{placeholder}</span>
          )}
          {value.map((v) => (
            <span key={v} className="ms-tag">
              {v}
              <button
                className="ms-tag-remove"
                onClick={(e) => removeTag(v, e)}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
        <ChevronDown
          size={13}
          className={`ms-chevron ${open ? "rotated" : ""}`}
        />
      </div>

      {open && (
        <div className="ms-dropdown">
          <input
            className="ms-search"
            placeholder="검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <div className="ms-list">
            {filtered.length === 0 ? (
              <div className="ms-empty">결과 없음</div>
            ) : (
              filtered.map((opt) => (
                <label
                  key={opt.value}
                  className={`ms-option ${value.includes(opt.value) ? "checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                  />
                  {opt.label}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
