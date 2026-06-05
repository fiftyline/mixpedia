import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import { BookmarkPlus, BarChart2 } from "lucide-react";
import { toArr, GENDER_LABEL } from "../../../utils/mixUtils";
import { useBookmark } from "../../../context/BookmarkContext";
import { notify } from "../../../utils/notify";
import MixInlineDetail from "./detail/MixInlineDetail";

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
    file_path: item.file_path || "-",
    medias: toArr(item.medias),
    ind_depth1: toArr(item.ind_depth1),
    target_gender: GENDER_LABEL[item.target_gender] || item.target_gender || "-",
    age_range: `${item.target_age_min ?? "-"} ~ ${item.target_age_max ?? "-"}`,
    budget_sum:
      item.budget_sum != null ? Number(item.budget_sum).toLocaleString() : "-",
  };
}

export default function ResultTable({
  results,
  onSelect,
  onAnalyze,
  hideAdd,
  selectedMix,
  selectedRowId,
}) {
  const { pendingIds, bulkBookmark } = useBookmark();
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const resultsRef = useRef(results);
  const onSelectRef = useRef(onSelect);
  const selectedIdsRef = useRef(new Set());
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [detailHost, setDetailHost] = useState(null);

  useEffect(() => { resultsRef.current = results; }, [results]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

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
        name: html('<input type="checkbox" class="cb-all" title="전체 선택/해제" />'),
        id: "_sel",
        width: "60px",
        sort: false,
        formatter: (cell) =>
          html(
            `<input type="checkbox" class="cb-row" data-fid="${cell}" ${selectedIdsRef.current.has(Number(cell)) ? "checked" : ""} />`,
          ),
      },
      {
        name: "미디어믹스 파일명",
        id: "file_path",
        sort: true,
        formatter: (cell) =>
          html(`<span style="font-weight:600;color:var(--text)">${cell}</span>`),
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
        name: html('<span>예산<br/><span style="font-weight:400;font-size:11px;color:var(--text-secondary)">(GROSS, MARKET COST)</span></span>'),
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

    const handleChange = (e) => {
      if (e.target.classList.contains("cb-all")) {
        const checked = e.target.checked;
        const allIds = (resultsRef.current || []).map((r) => Number(r.file_id));
        if (checked) allIds.forEach((id) => selectedIdsRef.current.add(id));
        else selectedIdsRef.current.clear();
        container.querySelectorAll(".cb-row").forEach((cb) => {
          cb.checked = checked;
        });
        setSelectedIds(new Set(selectedIdsRef.current));
        return;
      }
      if (e.target.classList.contains("cb-row")) {
        const fid = Number(e.target.dataset.fid);
        if (e.target.checked) selectedIdsRef.current.add(fid);
        else selectedIdsRef.current.delete(fid);
        syncHeaderCb();
        setSelectedIds(new Set(selectedIdsRef.current));
      }
    };
    container.addEventListener("change", handleChange, true);

    const handleClick = (e) => {
      if (
        e.target.classList.contains("cb-all") ||
        e.target.classList.contains("cb-row")
      )
        return;

      if (!onSelectRef.current) return;
      const row = e.target.closest(".gridjs-tbody tr");
      if (!row || row.closest(".mix-inline-row")) return;

      const clickedTd = e.target.closest("td");
      if (clickedTd) {
        const colIndex = Array.from(row.children).indexOf(clickedTd);
        if (colIndex === 0) return;
      }

      const cbRow = row.querySelector(".cb-row");
      const fileId = cbRow ? Number(cbRow.dataset.fid) : null;
      if (!fileId) return;
      const item = resultsRef.current?.find((r) => Number(r.file_id) === fileId);
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
    queueMicrotask(() => setSelectedIds(new Set()));
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

  // 인라인 상세 행 주입
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const removeInlineRow = () => {
      container.querySelector(".mix-inline-row")?.remove();
      container.querySelector(".mix-row--active")?.classList.remove("mix-row--active");
      container.classList.remove("has-selection");
      setDetailHost(null);
    };

    const mountInlineRow = () => {
      if (!selectedMix || selectedRowId == null) {
        removeInlineRow();
        return;
      }

      const checkbox = Array.from(container.querySelectorAll(".cb-row")).find(
        (cb) => String(cb.dataset.fid) === String(selectedRowId),
      );
      const row = checkbox?.closest("tr");
      if (!row) {
        removeInlineRow();
        return;
      }

      const currentInlineRow = container.querySelector(".mix-inline-row");
      container.querySelector(".mix-row--active")?.classList.remove("mix-row--active");
      row.classList.add("mix-row--active");
      container.classList.add("has-selection");

      if (currentInlineRow?.previousElementSibling === row) return;
      currentInlineRow?.remove();

      const detailRow = document.createElement("tr");
      detailRow.className = "mix-inline-row";
      const detailCell = document.createElement("td");
      detailCell.colSpan = row.children.length;
      detailCell.className = "mix-inline-cell";
      detailRow.appendChild(detailCell);
      row.insertAdjacentElement("afterend", detailRow);
      setDetailHost(detailCell);
    };

    mountInlineRow();
    const observer = new MutationObserver(mountInlineRow);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      removeInlineRow();
    };
  }, [selectedMix, selectedRowId]);

  return (
    <div className="result-section">
      <div className="result-header">
        <h2 className="result-title">Media Mix</h2>
        <span className="result-hint">클릭 시, 상세 내용을 확인할 수 있습니다.</span>
        {(() => {
          const selIds = [...selectedIds];
          const isBusy = selIds.some((id) => pendingIds.has(id));
          return (
            <>
              {selectedIds.size > 0 && (
                <span className="result-selected">
                  {selectedIds.size.toLocaleString()}건 선택됨
                </span>
              )}
              {!hideAdd && (
                <button
                  className="bulk-bm-btn"
                  disabled={isBusy}
                  onClick={() => {
                    if (!selIds.length) {
                      notify.error("믹스를 선택해주세요.");
                      return;
                    }
                    bulkBookmark(selIds, "add");
                  }}
                >
                  <BookmarkPlus size={13} />
                  북마크 추가
                </button>
              )}
              {onAnalyze && (
                <button
                  className="bulk-bm-btn bulk-bm-btn--analyze"
                  onClick={() => {
                    if (!selIds.length) {
                      notify.error("믹스를 선택해주세요.");
                      return;
                    }
                    onAnalyze(selIds);
                  }}
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
      {detailHost &&
        selectedMix &&
        createPortal(<MixInlineDetail mix={selectedMix} />, detailHost)}
    </div>
  );
}
