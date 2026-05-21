import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";

const BADGE_MAP = {
  progress_complete: ["complete", "완료"],
  progress_in: ["progress", "분석 중"],
  progress_error: ["error", "오류"],
};

function badgeHtml(status) {
  const [cls, label] = BADGE_MAP[status] ?? ["other", "기타"];
  return `<span class="mmm-badge mmm-badge--${cls}">${label}</span>`;
}

function fmtDttm(val) {
  if (!val) return "-";
  return val.slice(0, 19).replace("T", " ");
}

const COLUMNS = [
  { name: "분석자", id: "input_username", width: "110px" },
  {
    name: "모델 ID",
    id: "model_id",
    width: "200px",
    formatter: (cell, row) => {
      const status = row.cells[5]?.data;
      if (status === "progress_complete") {
        return html(
          `<a class="mmm-grid-id-link" href="/mmm/my-mmm/${cell}">${cell}</a>`,
        );
      }
      return html(`<span class="mmm-grid-id">${cell}</span>`);
    },
  },
  { name: "모델명", id: "input_modelname" },
  {
    name: "모델 생성 시간",
    id: "model_dttm",
    width: "160px",
    formatter: (cell) =>
      html(`<span class="mmm-grid-dttm">${fmtDttm(cell)}</span>`),
  },
  {
    name: "상태 갱신 시간",
    id: "status_dttm",
    width: "160px",
    formatter: (cell) =>
      html(`<span class="mmm-grid-dttm">${fmtDttm(cell)}</span>`),
  },
  {
    name: "진행 상태",
    id: "status",
    width: "100px",
    formatter: (cell) => html(badgeHtml(cell)),
  },
  {
    name: "분석 결과",
    id: "_report",
    width: "110px",
    sort: false,
    formatter: (_, row) => {
      const status = row.cells[5]?.data;
      const modelId = row.cells[1]?.data;
      if (status === "progress_complete") {
        return html(
          `<a class="mmm-report-btn" href="/mmm/my-mmm/${modelId}">결과 보고서</a>`,
        );
      }
      return html(`<span class="mmm-grid-empty">—</span>`);
    },
  },
  {
    name: "삭제",
    id: "_delete",
    width: "100px",
    sort: false,
    formatter: (_, row) => {
      const modelId = row.cells[1]?.data;
      return html(
        `<button class="mmm-delete-btn" data-model-id="${modelId}">🗑 삭제</button>`,
      );
    },
  },
];

export default function MmmModelsGrid({ results, onDeleteClick }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const deleteCallbackRef = useRef(onDeleteClick);

  useEffect(() => {
    deleteCallbackRef.current = onDeleteClick;
  }, [onDeleteClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    gridRef.current = new Grid({
      columns: COLUMNS,
      data: [],
      pagination: { limit: 20 },
      width: "100%",
      language: {
        search: { placeholder: "검색..." },
        pagination: {
          previous: "이전",
          next: "다음",
          showing: "",
          results: () => "건",
        },
        noRecordsFound: "조회된 모델이 없습니다.",
        error: "오류가 발생했습니다.",
      },
    });

    gridRef.current.render(containerRef.current);

    const handleClick = (e) => {
      const btn = e.target.closest("[data-model-id]");
      if (btn) deleteCallbackRef.current?.(btn.dataset.modelId);
    };
    containerRef.current.addEventListener("click", handleClick);
    const el = containerRef.current;

    return () => {
      el.removeEventListener("click", handleClick);
      gridRef.current?.destroy();
      gridRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!gridRef.current || results === null) return;
    const rows = results.map((r) => ({
      input_username: r.input_username ?? "-",
      model_id: r.model_id ?? "-",
      input_modelname: r.input_modelname ?? "-",
      model_dttm: r.model_dttm ?? "",
      status_dttm: r.status_dttm ?? "",
      status: r.status ?? "",
      _report: r.model_id ?? "",
      _delete: r.model_id ?? "",
    }));
    gridRef.current.updateConfig({ data: rows }).forceRender();
  }, [results]);

  return <div ref={containerRef} className="gridjs-wrap" />;
}
