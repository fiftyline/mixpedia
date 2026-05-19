import { useEffect, useRef, useState, useMemo } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import axios from "axios";
import { endpoint } from "../../../config/config";

function tagHtml(text, type) {
  return type === "target"
    ? `<span style="display:inline-flex;align-items:center;padding:2px 7px;margin:1px 2px;background:var(--accent-muted);border:1px solid #c7d2fe;font-size:0.72rem;color:var(--accent);white-space:nowrap">${text}</span>`
    : `<span style="display:inline-flex;align-items:center;padding:2px 7px;margin:1px 2px;background:var(--surface-raised);border:1px solid var(--border);font-size:0.72rem;color:var(--text-secondary);white-space:nowrap">${text}</span>`;
}

const COLUMNS = [
  {
    name: "매체",
    id: "media",
    formatter: (cell) =>
      html(`<span style="font-weight:600;color:var(--text)">${cell}</span>`),
  },
  {
    name: "매체 포함 믹스 수",
    id: "mix_cnt",
    width: "160px",
    formatter: (cell) => (cell ?? 0).toLocaleString(),
  },
  {
    name: "매체 사용 주요 업종 (Top 5)",
    id: "top_inds",
    sort: false,
    formatter: (cell) => {
      if (!cell) return "-";
      const names = cell.split(",").filter(Boolean);
      if (!names.length) return "-";
      return html(
        `<div style="display:flex;flex-wrap:wrap;gap:2px">${names.map((i) => tagHtml(i, "ind")).join("")}</div>`,
      );
    },
  },
];

function toRow(item) {
  const targets = Array.isArray(item.top_targets)
    ? item.top_targets
        .slice(0, 5)
        .map((t) => t.target_demo)
        .join(",")
    : "";
  const inds = Array.isArray(item.top_inds)
    ? item.top_inds
        .slice(0, 5)
        .map((i) => i.industry)
        .join(",")
    : "";
  return {
    media: item.media,
    mix_cnt: item.mix_cnt,
    top_targets: targets,
    top_inds: inds,
  };
}

export default function MediaTable({ onSelect }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const allDataRef = useRef([]);
  const onSelectRef = useRef(onSelect);

  const [allData, setAllData] = useState([]);
  const [filterMedia, setFilterMedia] = useState("");
  const [filterInd, setFilterInd] = useState("");
  const [availableInds, setAvailableInds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current) return;

    gridRef.current = new Grid({
      columns: COLUMNS,
      data: [],
      pagination: { limit: 50 },
      sort: true,
      width: "100%",
      language: {
        pagination: {
          previous: "이전",
          next: "다음",
          showing: "",
          results: () => "건",
        },
        noRecordsFound: "매체 데이터가 없습니다.",
        error: "오류가 발생했습니다.",
      },
    });

    gridRef.current.render(containerRef.current);

    const container = containerRef.current;
    const handleClick = (e) => {
      const row = e.target.closest(".gridjs-tbody tr");
      if (!row) return;
      const firstCell = row.querySelector("td:first-child");
      if (!firstCell) return;
      const mediaName = firstCell.textContent.trim();
      const item = allDataRef.current.find((d) => d.media === mediaName);
      if (item) onSelectRef.current?.(item);
    };
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
      gridRef.current?.destroy();
      gridRef.current = null;
    };
  }, []);

  useEffect(() => {
    axios
      .post(`${endpoint}/get_media_macro/`, {})
      .then((res) => {
        const raw = res.data;
        const data = Array.isArray(raw) ? raw : [];
        allDataRef.current = data;
        setAllData(data);

        const indSet = new Set();
        data.forEach((item) => {
          if (Array.isArray(item.top_inds)) {
            item.top_inds.forEach((ind) => {
              if (ind.industry) indSet.add(ind.industry);
            });
          }
        });
        setAvailableInds([...indSet].sort());
        setLoading(false);
      })
      .catch((err) => {
        console.error("매체 데이터 로드 실패:", err);
        setError("데이터를 불러오지 못했습니다.");
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const mediaMatch =
        !filterMedia ||
        item.media.toLowerCase().includes(filterMedia.toLowerCase());
      const indMatch =
        !filterInd ||
        (Array.isArray(item.top_inds) &&
          item.top_inds.some((i) => i.industry === filterInd));
      return mediaMatch && indMatch;
    });
  }, [allData, filterMedia, filterInd]);

  useEffect(() => {
    if (!gridRef.current) return;
    gridRef.current
      .updateConfig({ data: filteredData.map(toRow) })
      .forceRender();
  }, [filteredData]);

  const isFiltered = filterMedia || filterInd;

  return (
    <div className="media-table-wrap">
      <div className="media-table-header">
        <span className="media-table-title">매체 목록</span>
        <span className="media-table-hint">
          {loading
            ? "데이터 불러오는 중..."
            : (error ?? "행을 클릭하면 상세 인사이트를 확인할 수 있습니다")}
        </span>
      </div>

      <div className="media-table-filter">
        <div className="mtf-item">
          <label className="mtf-label">매체</label>
          <input
            className="mtf-input"
            type="text"
            placeholder="매체명 검색"
            value={filterMedia}
            onChange={(e) => setFilterMedia(e.target.value)}
          />
        </div>
        <div className="mtf-item">
          <label className="mtf-label">업종</label>
          <select
            className="mtf-select"
            value={filterInd}
            onChange={(e) => setFilterInd(e.target.value)}
          >
            <option value="">전체</option>
            {availableInds.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
        {isFiltered && (
          <button
            className="mtf-reset"
            onClick={() => {
              setFilterMedia("");
              setFilterInd("");
            }}
          >
            초기화
          </button>
        )}
        {!loading && !error && (
          <span className="mtf-count">
            {filteredData.length.toLocaleString()}개
          </span>
        )}
      </div>

      <div ref={containerRef} className="gridjs-wrap" />
    </div>
  );
}
