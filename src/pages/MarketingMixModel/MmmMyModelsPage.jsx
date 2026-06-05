import { useEffect, useState } from "react";
import axios from "axios";
import { endpoint } from "../../config/config";
import MmmFilterCard from "./components/MmmFilterCard";
import MmmModelsGrid from "./components/MmmModelsGrid";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import "./styles.css";

function initFilters() {
  const fmt = (d) => d.toISOString().slice(0, 10);
  const to = new Date();
  const from = new Date(to);
  from.setMonth(from.getMonth() - 3);
  return {
    dateFrom: fmt(from),
    dateTo: fmt(to),
    input_username: "",
    input_modelname: "",
    model_id: "",
  };
}

export default function MmmMyModelsPage() {
  const [filters, setFilters] = useState(initFilters);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // modelId | null
  const [deleteLoading, setDeleteLoading] = useState(false);

  const setFilter = (key, val) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v === "") return;
        if (k === "dateFrom") params.append(k, v + "T00:00:00");
        else if (k === "dateTo") params.append(k, v + "T23:59:59");
        else params.append(k, v);
      });
      const res = await axios.get(`${endpoint}/mmm/progress/`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = res.data?.data ?? res.data;
      setResults(Array.isArray(raw) ? raw : []);
    } catch {
      setError("모델 목록을 불러오지 못했습니다.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (modelId) => setDeleteTarget(modelId);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${endpoint}/mmm/delete/`, {
        params: { model_id: deleteTarget },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTarget(null);
      handleQuery();
    } catch {
      setError("모델 삭제에 실패했습니다.");
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => { handleQuery(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mmm-page">
      {deleteTarget && (
        <DeleteConfirmModal
          modelId={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      <div className="page-header">
        <h1 className="page-title">모델 확인</h1>
        <p className="page-desc">
          생성된 MMM 모델의 진행 상황과 분석 결과를 확인합니다.
        </p>
      </div>

      <MmmFilterCard
        filters={filters}
        setFilter={setFilter}
        loading={loading}
        onQuery={handleQuery}
      />

      {error && (
        <div className="state-msg state-msg--error">{error}</div>
      )}

      <div
        className="mmm-card"
        style={{ display: results !== null && !error ? undefined : "none" }}
      >
        <div className="mmm-card-title">
          모델 목록
          <span
            style={{
              fontSize: "0.8rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              marginLeft: 8,
            }}
          >
            {(results ?? []).length.toLocaleString()}건
          </span>
        </div>
        <MmmModelsGrid results={results} onDeleteClick={handleDelete} />
      </div>
    </div>
  );
}
