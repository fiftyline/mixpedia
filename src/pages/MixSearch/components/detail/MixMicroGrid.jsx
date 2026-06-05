import { toArr, GENDER_LABEL } from "../../../../utils/mixUtils";

function fmtNumber(value) {
  const number = Number(value);
  return value != null && !Number.isNaN(number) ? number.toLocaleString() : "-";
}

function fmtDate(value) {
  return value?.slice(0, 10) || "-";
}

export default function MixMicroGrid({ items }) {
  if (!items.length) {
    return <div className="state-msg">데이터가 없습니다.</div>;
  }

  return (
    <div className="mix-micro-table-wrap">
      <table className="mix-micro-table">
        <thead>
          <tr>
            <th>매체</th>
            <th>타겟팅 유형</th>
            <th>성별</th>
            <th>최소연령</th>
            <th>최대연령</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>
              예산<br />
              <span className="mix-micro-table-note">(GROSS, MARKET COST)</span>
            </th>
            <th>노출</th>
            <th>클릭</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id ?? item.micro_id ?? index}>
              <td>
                <span className="mix-tag">
                  {item.media_mapped || item.media || "-"}
                </span>
              </td>
              <td>
                <div className="mix-micro-targets">
                  {toArr(item.targeting_type).map((target) => (
                    <span key={target} className="mix-micro-target">
                      {target.split("(")[0]}
                    </span>
                  ))}
                </div>
              </td>
              <td>{GENDER_LABEL[item.target_gender] || item.target_gender || "-"}</td>
              <td>{item.target_age_min ?? "-"}</td>
              <td>{item.target_age_max ?? "-"}</td>
              <td>{fmtDate(item.dt_start)}</td>
              <td>{fmtDate(item.dt_end)}</td>
              <td>{fmtNumber(item.budget_krw)}</td>
              <td>{fmtNumber(item.impressions)}</td>
              <td>{fmtNumber(item.clicks)}</td>
              <td>{fmtNumber(item.views)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
