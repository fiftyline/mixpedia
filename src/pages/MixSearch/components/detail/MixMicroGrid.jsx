import { useEffect, useRef } from "react";
import { Grid, html } from "gridjs";
import "gridjs/dist/theme/mermaid.min.css";
import { toArr, GENDER_LABEL } from "../../../../utils/mixUtils";

const TAG_STYLE =
  "display:inline-block;padding:2px 6px;margin:1px 2px;" +
  "background:var(--surface-raised);border:1px solid var(--border);" +
  "font-size:0.65rem;color:var(--text-secondary);white-space:nowrap";

const COLUMNS = [
  {
    name: "매체",
    id: "media_mapped",
    width: "250px",
    formatter: (cell) =>
      cell
        ? html(`<span class="mix-tag">${cell}</span>`)
        : html('<span style="color:var(--text-tertiary)">-</span>'),
  },
  {
    name: "타겟팅 유형",
    id: "targeting_type",
    sort: false,
    formatter: (cell) =>
      html(
        toArr(cell)
          .map((t) => `<span style="${TAG_STYLE}">${t.split("(")[0]}</span>`)
          .join(""),
      ),
  },
  {
    name: "성별",
    id: "target_gender",
    width: "80px",
    formatter: (cell) => GENDER_LABEL[cell] || cell || "-",
  },
  { name: "최소연령", id: "target_age_min", width: "90px" },
  { name: "최대연령", id: "target_age_max", width: "90px" },
  {
    name: "시작일",
    id: "dt_start",
    width: "110px",
    formatter: (cell) => cell?.slice(0, 10) || "-",
  },
  {
    name: "종료일",
    id: "dt_end",
    width: "110px",
    formatter: (cell) => cell?.slice(0, 10) || "-",
  },
  {
    name: html(
      '<span>예산<br/><span style="font-size:0.62rem;font-weight:400;color:var(--text-tertiary)">(Gross, Market Cost 기준)</span></span>',
    ),
    id: "budget_krw",
    width: "200px",
    formatter: (cell) => {
      const n = Number(cell);
      return cell != null && !isNaN(n)
        ? n.toLocaleString()
        : String(cell ?? "-");
    },
  },
  {
    name: "노출",
    id: "impressions",
    width: "100px",
    formatter: (cell) => cell?.toLocaleString() ?? "-",
  },
  {
    name: "클릭",
    id: "clicks",
    width: "100px",
    formatter: (cell) => cell?.toLocaleString() ?? "-",
  },
  {
    name: "조회수",
    id: "views",
    width: "100px",
    formatter: (cell) => cell?.toLocaleString() ?? "-",
  },
];

function toRow(m) {
  return {
    media_mapped: m.media_mapped || m.media || "-",
    targeting_type: toArr(m.targeting_type),
    target_gender: m.target_gender,
    target_age_min: m.target_age_min ?? "-",
    target_age_max: m.target_age_max ?? "-",
    dt_start: m.dt_start,
    dt_end: m.dt_end,
    budget_krw: m.budget_krw,
    impressions: m.impressions,
    clicks: m.clicks,
    views: m.views,
  };
}

export default function MixMicroGrid({ items }) {
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    gridRef.current?.destroy();
    gridRef.current = null;
    if (!containerRef.current || !items.length) return;

    gridRef.current = new Grid({
      columns: COLUMNS,
      data: items.map(toRow),
      sort: true,
      width: "100%",
      language: {
        noRecordsFound: "데이터가 없습니다.",
        error: "오류가 발생했습니다.",
      },
    });
    gridRef.current.render(containerRef.current);

    return () => {
      gridRef.current?.destroy();
      gridRef.current = null;
    };
  }, [items]);

  return <div ref={containerRef} className="gridjs-wrap" />;
}
