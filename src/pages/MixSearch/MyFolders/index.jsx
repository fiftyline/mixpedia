import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";
import { useFolder } from "../../../context/FolderContext";
import MixTable from "../components/MixTable";
import MixDetail from "../components/detail/MixDetail";
import FolderInsights from "./FolderInsights";
import "../styles.css";

export default function MyFoldersPage() {
  const { folderIds, bulkFolder } = useFolder();
  const [selectedMix, setSelectedMix] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [insightIds, setInsightIds] = useState([]);

  const fetchFolders = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .post(`${endpoint}/bookmark/user_bookmark`)
      .then((res) => setResults(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("폴더 데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchFolders();
  }, [folderIds, fetchFolders]);

  const handleReset = async () => {
    if (!folderIds.size) return;
    setResetting(true);
    await bulkFolder([...folderIds], "remove");
    setConfirmReset(false);
    setResetting(false);
    fetchFolders();
  };

  if (showInsights) {
    return (
      <section className="mix-search-page">
        <FolderInsights
          mixIds={insightIds}
          onBack={() => setShowInsights(false)}
        />
      </section>
    );
  }

  if (selectedMix) {
    return (
      <section className="mix-search-page">
        <MixDetail
          mix={selectedMix}
          onBack={() => setSelectedMix(null)}
          onSelect={setSelectedMix}
        />
      </section>
    );
  }

  return (
    <section className="mix-search-page">
      <div className="page-header">
        <h1 className="page-title">내 폴더</h1>
        <p className="page-desc">
          폴더에 담은 미디어 믹스를 확인하고 분석합니다.
        </p>
      </div>

      <div className="bm-page-actions">
        <button
          className="bm-action-btn"
          onClick={() => {
            setConfirmReset(false);
            fetchFolders();
          }}
          disabled={loading}
        >
          <RefreshCw
            size={13}
            strokeWidth={2}
            className={loading ? "bm-spin" : ""}
          />
          새로고침
        </button>
        <button
          className="bm-action-btn bm-action-btn--danger"
          onClick={() => setConfirmReset(true)}
          disabled={!results.length || confirmReset}
        >
          <Trash2 size={13} strokeWidth={2} />
          폴더 초기화
        </button>
      </div>

      {confirmReset && (
        <div
          className="bm-modal-overlay"
          onClick={() => !resetting && setConfirmReset(false)}
        >
          <div className="bm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bm-modal-title">폴더 초기화</div>
            <p className="bm-modal-body">
              폴더 <strong>{folderIds.size}건</strong>을 모두 초기화하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="bm-modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setConfirmReset(false)}
                disabled={resetting}
              >
                취소
              </button>
              <button
                className="btn-primary bm-confirm-ok"
                onClick={handleReset}
                disabled={resetting}
              >
                {resetting ? "처리 중..." : "초기화"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error ? (
        <div className="state-msg state-msg--error">{error}</div>
      ) : loading ? (
        <div className="state-msg">불러오는 중...</div>
      ) : (
        <MixTable
          results={results}
          onSelect={setSelectedMix}
          onAnalyze={(ids) => {
            setInsightIds(ids);
            setShowInsights(true);
          }}
          hideAdd
        />
      )}
      <br />
      <br />
    </section>
  );
}
