import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../config/config";
import { parseDetailContext } from "./mmmUtils";
import MmmDetailHeader from "./detail/MmmDetailHeader";
import TabOverview from "./detail/TabOverview";
import TabAdEffect from "./detail/TabAdEffect";
import TabOptimize from "./detail/TabOptimize";
import "./styles.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "adeffect", label: "Ad-Effect" },
  { id: "optimize", label: "Optimize" },
];

export default function MmmDetailPage() {
  const { model_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${endpoint}/mmm/result/`, {
          params: { model_id },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const raw = res.data?.data ?? res.data;
        setData(parseDetailContext(raw));
      } catch (e) {
        setError(
          e.response?.status === 404
            ? "결과를 찾을 수 없습니다."
            : "데이터를 불러오지 못했습니다.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [model_id]);

  return (
    <div className="mmm-page">
      <div>
        <button className="mmm-back-btn" onClick={() => navigate("/mmm/my-mmm")}>
          <ChevronLeft size={14} /> 목록으로
        </button>
      </div>

      {loading && <div className="mix-micro-state">데이터를 불러오는 중...</div>}
      {error && <div className="mix-micro-state mix-micro-state--error">{error}</div>}

      {data && (
        <>
          <MmmDetailHeader data={data} />

          <div className="mmm-tab-bar">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`mmm-tab-btn${tab === t.id ? " mmm-tab-btn--active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && <TabOverview data={data} />}
          {tab === "adeffect" && <TabAdEffect data={data} />}
          {tab === "optimize" && <TabOptimize data={data} />}
        </>
      )}
    </div>
  );
}
