import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Upload, FileSpreadsheet, Info, Download } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";

const REQUIREMENTS = [
  { text: "날짜/시간 컬럼", required: true,  desc: "분석 기간을 나타내는 날짜 컬럼",                    color: "#9b59b6" },
  { text: "KPI 컬럼",       required: true,  desc: "매출, 방문자 수, 구매 건수 등 목표 지표",            color: "#e15f4f" },
  { text: "매체 비용·지표 컬럼", required: true, desc: "매체별 집행 비용 또는 노출·도달 지표 컬럼",      color: "#4fc98f" },
  { text: "외부 요인 컬럼", required: false, desc: "프로모션, 시즌성 등 통제 변수 (선택)",               color: "#4f80e1" },
];

const TIPS = [
  { color: "#9b59b6", text: "날짜 컬럼은 YYYY-MM-DD 문자열 또는 날짜 형식 모두 지원합니다" },
  { color: "#e15f4f", text: "KPI·매체 변수는 수치형 컬럼만 지정할 수 있습니다" },
  { color: "#f5a623", text: "결측값이 있으면 모델 품질에 영향을 줄 수 있습니다" },
];

function fmtSize(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

export default function Step01Upload({ trainset, setTrainset, uploadedFile, setUploadedFile, onNext, onBack, showAlert }) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".xlsx")) {
      showAlert("xlsx 파일만 업로드할 수 있습니다.");
      return;
    }
    setUploadedFile(file);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const token = localStorage.getItem("token");
      const res = await axios.post(`${endpoint}/mmm/upload/`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { colnames, colnames_numeric, row_count, col_count, data } = res.data;
      setTrainset({ colnames, numericColnames: colnames_numeric, rows: data, rowCount: row_count, colCount: col_count });
    } catch {
      showAlert("파일 업로드에 실패했습니다. 서버 상태를 확인해주세요.");
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, [setUploadedFile, setTrainset, showAlert]);

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleNext = () => {
    if (!uploadedFile || trainset.rowCount < 5) {
      showAlert("MMM 분석에 데이터가 충분하지 않습니다. 데이터를 확인해주세요.");
      return;
    }
    onNext();
  };

  const isDone = uploadedFile && trainset.rowCount > 0 && !uploading;

  return (
    <div className="mmm-card">
      <div className="mmm-card-title">Step 01 — 데이터 업로드</div>

      <div className="mmm-upload-layout">
        {/* ── 왼쪽: 요구사항 + 업로드 영역 ── */}
        <div className="mmm-upload-left">
          <div className="mmm-req-box">
            <div className="mmm-req-title">
              <Info size={13} style={{ marginRight: 6, flexShrink: 0 }} />
              데이터 요구사항
            </div>
            <ul className="mmm-req-list">
              {REQUIREMENTS.map(({ text, required, desc, color }) => (
                <li key={text} className="mmm-req-item">
                  <span className="mmm-req-color-dot" style={{ background: color }} />
                  <div>
                    <span className="mmm-req-label">
                      {text}
                      <span
                        className="mmm-req-badge"
                        style={
                          required
                            ? { color, background: `${color}1a` }
                            : { color: "var(--text-tertiary)", background: "var(--surface)", border: "1px solid var(--border)" }
                        }
                      >
                        {required ? "필수" : "선택"}
                      </span>
                    </span>
                    <span className="mmm-req-desc">{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 업로드 영역 ── */}
          <div
            className={[
              "mmm-upload-area",
              dragging ? "mmm-upload-area--drag" : "",
              isDone ? "mmm-upload-area--done" : "",
            ].join(" ")}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <input type="file" accept=".xlsx" onChange={handleFileChange} disabled={uploading} />

            {uploading ? (
              <div className="mmm-upload-loading">
                <div className="mmm-spinner" />
                <p className="mmm-upload-text">업로드 중...</p>
              </div>
            ) : isDone ? (
              <div className="mmm-upload-success">
                <FileSpreadsheet size={32} color="#4fc98f" />
                <p className="mmm-upload-filename">{uploadedFile.name}</p>
                <div className="mmm-upload-stats">
                  <span>{fmtSize(uploadedFile.size)}</span>
                  <span className="mmm-upload-stats-sep">·</span>
                  <span>{trainset.rowCount}행 × {trainset.colCount}열</span>
                </div>
                <p className="mmm-upload-hint">다시 클릭하면 파일 교체</p>
              </div>
            ) : (
              <>
                <Upload
                  size={32}
                  color={dragging ? "var(--accent)" : "var(--text-tertiary)"}
                  style={{ display: "block", margin: "0 auto 10px" }}
                />
                <p className="mmm-upload-text">
                  <strong>클릭하거나 파일을 드래그</strong>
                  <br />
                  <span style={{ fontSize: "0.78rem" }}>.xlsx 파일만 지원 · 최소 5행 이상</span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── 오른쪽: 샘플 테이블 ── */}
        <div className="mmm-upload-right">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div className="mmm-req-title" style={{ fontSize: "0.85rem", marginBottom: 0 }}>데이터 예시</div>
            <a
              href="/mmm_sample_data.xlsx"
              download="mmm_sample_data.xlsx"
              className="mmm-sample-download-btn"
            >
              <Download size={12} />
              샘플 파일 다운로드
            </a>
          </div>
          <div className="mmm-sample-wrap">
            <table className="mmm-sample-table">
              <thead>
                {/* 그룹 헤더: 왼쪽 요구사항 색상과 1:1 대응 */}
                <tr className="mmm-sample-group-row">
                  <th style={{ color: "#9b59b6", borderBottom: "2px solid #9b59b6", background: "#9b59b610" }}>날짜/시간</th>
                  <th style={{ color: "#e15f4f", borderBottom: "2px solid #e15f4f", background: "#e15f4f10" }}>KPI</th>
                  <th style={{ color: "#4f80e1", borderBottom: "2px solid #4f80e1", background: "#4f80e110" }}>외부 요인</th>
                  <th colSpan={4} style={{ color: "#4fc98f", borderBottom: "2px solid #4fc98f", background: "#4fc98f10", textAlign: "center" }}>매체 비용·지표</th>
                  <th style={{ color: "var(--text-tertiary)", borderBottom: "2px solid var(--border)" }}></th>
                </tr>
                {/* 컬럼 헤더 */}
                <tr>
                  <th style={{ color: "#9b59b6" }}>날짜</th>
                  <th style={{ color: "#e15f4f" }}>KPI (매출 등)</th>
                  <th style={{ color: "#4f80e1" }}>프로모션 여부</th>
                  <th style={{ color: "#4fc98f" }}>매체1 집행비</th>
                  <th style={{ color: "#4fc98f" }}>매체1 노출수</th>
                  <th style={{ color: "#4fc98f" }}>매체2 집행비</th>
                  <th style={{ color: "#4fc98f" }}>매체2 도달수</th>
                  <th>...</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>2023-04-19</td><td>33,523,000</td><td>FALSE</td><td>835,795</td><td>58,590</td><td>4,855,768</td><td>352,697</td><td>...</td></tr>
                <tr><td>2023-04-20</td><td>29,707,600</td><td>FALSE</td><td>1,444,607</td><td>100,560</td><td>6,312,923</td><td>412,384</td><td>...</td></tr>
                <tr><td>2023-04-21</td><td>31,250,000</td><td>TRUE</td><td>2,012,400</td><td>143,200</td><td>5,891,200</td><td>389,000</td><td>...</td></tr>
                <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
              </tbody>
            </table>
          </div>

          <div className="mmm-upload-tips" style={{ marginTop: 12 }}>
            {TIPS.map(({ color, text }) => (
              <div key={text} className="mmm-upload-tip">
                <span className="mmm-upload-tip-dot" style={{ background: color }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 데이터 미리보기 ── */}
      {isDone && (
        <>
          <hr className="mmm-hr" />
          <p className="mmm-shape-label">데이터 미리보기 — 상위 5행</p>
          <div className="mmm-preview-wrap">
            <table className="mmm-preview-table">
              <thead>
                <tr>{trainset.colnames.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {trainset.rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {trainset.colnames.map((c) => <td key={c}>{row[c] ?? ""}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mmm-nav">
        <button className="mmm-btn" onClick={onBack}>
          <ChevronLeft size={14} /> 이전
        </button>
        <button className="mmm-btn mmm-btn--primary" onClick={handleNext} disabled={uploading}>
          다음 <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
