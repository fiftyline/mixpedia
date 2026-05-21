import { useEffect, useMemo, useRef, useState } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import { BookmarkPlus, BookmarkMinus, BarChart2 } from "lucide-react";
import { toArr, GENDER_LABEL } from "../../../utils/mixUtils";
import { useBookmark } from "../../../context/BookmarkContext";

const ICON_OFF = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const ICON_ON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#6366f1" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
const ICON_LOADING = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bm-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

function renderTags(arr, cls) {
  if (!arr.length)
    return html('<span style="color:var(--text-tertiary)">-</span>');
  return html(
    `<div class="cell-tags">${arr.map((v) => `<span class="${cls}">${v}</span>`).join("")}</div>`,
  );
}

function toRow(item) {
  return {
    _sel: item.file_id ?? "",
    _bm: item.file_id ?? "",
    file_path: item.file_path || "-",
    medias: toArr(item.medias),
    ind_depth1: toArr(item.ind_depth1),
    target_gender:
      GENDER_LABEL[item.target_gender] || item.target_gender || "-",
    age_range: `${item.target_age_min ?? "-"} ~ ${item.target_age_max ?? "-"}`,
    budget_sum:
      item.budget_sum != null ? Number(item.budget_sum).toLocaleString() : "-",
  };
}

export default function ResultTable({ results, onSelect, onAnalyze, hideAdd }) {
  const { bookmarkedIds, pendingIds, toggleBookmark, bulkBookmark } =
    useBookmark();
  const toggleBookmarkRef = useRef(toggleBookmark);
  useEffect(() => {
    toggleBookmarkRef.current = toggleBookmark;
  }, [toggleBookmark]);
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const resultsRef = useRef(results);
  const onSelectRef = useRef(onSelect);
  const bookmarkedIdsRef = useRef(bookmarkedIds);
  const selectedIdsRef = useRef(new Set());
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);
  useEffect(() => {
    bookmarkedIdsRef.current = bookmarkedIds;
    containerRef.current?.querySelectorAll(".bm-btn").forEach((btn) => {
      if (btn.disabled) return;
      const fid = Number(btn.dataset.fid);
      const isOn = bookmarkedIds.has(fid);
      btn.classList.toggle("bm-btn--on", isOn);
      btn.innerHTML = isOn ? ICON_ON : ICON_OFF;
    });
  }, [bookmarkedIds]);

  const syncHeaderCb = () => {
    const headerCb = containerRef.current?.querySelector(".cb-all");
    if (!headerCb) return;
    const allIds = (resultsRef.current || []).map((r) => Number(r.file_id));
    const allChecked =
      allIds.length > 0 && allIds.every((id) => selectedIdsRef.current.has(id));
    const someChecked = allIds.some((id) => selectedIdsRef.current.has(id));
    headerCb.checked = allChecked;
    headerCb.indeterminate = !allChecked && someChecked;
  };

  const columns = useMemo(
    () => [
      {
        name: html(
          '<input type="checkbox" class="cb-all" title="전체 선택/해제" />',
        ),
        id: "_sel",
        width: "60px",
        sort: false,
        formatter: (cell) =>
          html(
            `<input type="checkbox" class="cb-row" data-fid="${cell}" ${selectedIdsRef.current.has(Number(cell)) ? "checked" : ""} />`,
          ),
      },
      {
        name: "",
        id: "_bm",
        width: "60px",
        sort: false,
        formatter: (cell) => {
          const isOn = bookmarkedIdsRef.current.has(Number(cell));
          return html(
            `<button class="bm-btn${isOn ? " bm-btn--on" : ""}" data-fid="${cell}" title="북마크">${isOn ? ICON_ON : ICON_OFF}</button>`,
          );
        },
      },
      {
        name: "미디어믹스 파일명",
        id: "file_path",
        sort: true,
        formatter: (cell) =>
          html(
            `<span style="font-weight:600;color:var(--text)">${cell}</span>`,
          ),
      },
      {
        name: "매체",
        id: "medias",
        width: "360px",
        sort: false,
        formatter: (cell) => renderTags(cell, "mix-tag"),
      },
      {
        name: "업종",
        id: "ind_depth1",
        width: "160px",
        sort: false,
        formatter: (cell) => renderTags(cell, "mix-tag mix-tag--ind"),
      },
      { name: "타겟 성별", id: "target_gender", width: "120px", sort: true },
      { name: "타겟 연령구간", id: "age_range", width: "120px", sort: false },
      {
        name: html(
          '<span>예산<br/><span style="font-size:0.8em;font-weight:400;color:var(--text-tertiary)">(Gross, Market Cost 기준)</span></span>',
        ),
        id: "budget_sum",
        width: "200px",
        sort: true,
      },
    ],
    [],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    gridRef.current = new Grid({
      columns,
      data: [],
      pagination: { limit: 50 },
      width: "100%",
      language: {
        search: { placeholder: "검색..." },
        pagination: {
          previous: "이전",
          next: "다음",
          showing: "",
          results: () => "건",
        },
        noRecordsFound: "조회된 미디어믹스가 없습니다.",
        error: "오류가 발생했습니다.",
      },
    });

    gridRef.current.render(containerRef.current);

    const container = containerRef.current;

    // capture 모드: gridjs가 thead click을 가로채기 전에 체크박스 change를 처리
    const handleChange = (e) => {
      if (e.target.classList.contains("cb-all")) {
        const checked = e.target.checked;
        const allIds = (resultsRef.current || []).map((r) => Number(r.file_id));
        if (checked) allIds.forEach((id) => selectedIdsRef.current.add(id));
        else selectedIdsRef.current.clear();
        container.querySelectorAll(".cb-row").forEach((cb) => {
          cb.checked = checked;
        });
        setSelectedCount(selectedIdsRef.current.size);
        return;
      }
      if (e.target.classList.contains("cb-row")) {
        const fid = Number(e.target.dataset.fid);
        if (e.target.checked) selectedIdsRef.current.add(fid);
        else selectedIdsRef.current.delete(fid);
        syncHeaderCb();
        setSelectedCount(selectedIdsRef.current.size);
      }
    };
    container.addEventListener("change", handleChange, true);

    const handleClick = (e) => {
      if (
        e.target.classList.contains("cb-all") ||
        e.target.classList.contains("cb-row")
      )
        return;

      const bmBtn = e.target.closest(".bm-btn");
      if (bmBtn) {
        e.stopPropagation();
        if (bmBtn.disabled) return;
        const fileId = Number(bmBtn.dataset.fid);
        const wasOn = bmBtn.classList.contains("bm-btn--on");
        bmBtn.disabled = true;
        bmBtn.innerHTML = ICON_LOADING;
        bmBtn.classList.remove("bm-btn--on");
        toggleBookmarkRef.current(fileId).then((success) => {
          bmBtn.disabled = false;
          const nowOn = success !== false ? !wasOn : wasOn;
          bmBtn.classList.toggle("bm-btn--on", nowOn);
          bmBtn.innerHTML = nowOn ? ICON_ON : ICON_OFF;
        });
        return;
      }
      if (!onSelectRef.current) return;
      const row = e.target.closest(".gridjs-tbody tr");
      if (!row) return;

      // 체크박스(0)·북마크(1) 열 클릭은 네비게이션 무시
      const clickedTd = e.target.closest("td");
      if (clickedTd) {
        const colIndex = Array.from(row.children).indexOf(clickedTd);
        if (colIndex === 0 || colIndex === 1) return;
      }

      const filePathCell = row.querySelector("td:nth-child(3)");
      if (!filePathCell) return;
      const file_path = filePathCell.textContent.trim();
      const item = resultsRef.current?.find(
        (r) => (r.file_path || "-") === file_path,
      );
      if (item) onSelectRef.current(item);
    };
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("change", handleChange, true);
      container.removeEventListener("click", handleClick);
      gridRef.current?.destroy();
      gridRef.current = null;
    };
  }, [columns]);

  useEffect(() => {
    selectedIdsRef.current.clear();
    setSelectedCount(0);
    const headerCb = containerRef.current?.querySelector(".cb-all");
    if (headerCb) {
      headerCb.checked = false;
      headerCb.indeterminate = false;
    }
    if (!gridRef.current) return;
    gridRef.current
      .updateConfig({ data: (results || []).map(toRow) })
      .forceRender();
  }, [results]);

  return (
    <div className="result-section">
      <div className="result-header">
        <h2 className="result-title">미디어믹스 목록</h2>
        <span className="result-hint">
          행을 클릭하면 상세를 확인할 수 있습니다
        </span>
        {selectedCount > 0 &&
          (() => {
            const selIds = [...selectedIdsRef.current];
            const isBusy = selIds.some((id) => pendingIds.has(id));
            return (
              <>
                <span className="result-selected">
                  {selectedCount.toLocaleString()}건 선택됨
                </span>
                {!hideAdd && (
                  <button
                    className="bulk-bm-btn"
                    disabled={isBusy}
                    onClick={() => bulkBookmark(selIds, "add")}
                  >
                    <BookmarkPlus size={13} />
                    북마크 추가
                  </button>
                )}
                <button
                  className="bulk-bm-btn bulk-bm-btn--remove"
                  disabled={isBusy}
                  onClick={() => bulkBookmark(selIds, "remove")}
                >
                  <BookmarkMinus size={13} />
                  북마크 해제
                </button>
                {onAnalyze && (
                  <button
                    className="bulk-bm-btn bulk-bm-btn--analyze"
                    onClick={() => onAnalyze([...selectedIdsRef.current])}
                  >
                    <BarChart2 size={13} />
                    북마크 분석하기
                  </button>
                )}
              </>
            );
          })()}
        <span className="result-count">
          {(results || []).length.toLocaleString()}건
        </span>
      </div>
      <div ref={containerRef} className="gridjs-wrap" />
    </div>
  );
}
