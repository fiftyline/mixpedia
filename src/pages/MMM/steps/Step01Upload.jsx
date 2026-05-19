import { useState } from "react";
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import axios from "axios";
import { endpoint } from "../../../config/config";

export default function Step01Upload({ trainset, setTrainset, uploadedFile, setUploadedFile, onNext, onBack, showAlert }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
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
      const res = await axios.post(`${endpoint}/mmm/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { colnames, colnames_numeric, row_count, col_count, data } = res.data;
      setTrainset({ colnames, numericColnames: colnames_numeric, rows: data, rowCount: row_count, colCount: col_count });
    } catch {
      showAlert("파일 업로드에 실패했습니다. 서버 상태를 확인해주세요.");
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    if (!uploadedFile || trainset.rowCount < 5) {
      showAlert("MMM 분석에 데이터가 충분하지 않습니다. 데이터를 확인해주세요.");
      return;
    }
    onNext();
  };

  return (
    <div className="mmm-card">
      <div className="mmm-card-title">Step 01 — 데이터 업로드</div>

      <p className="mmm-desc">
        MMM 분석을 진행할 <strong>.xlsx</strong> 형태의 데이터를 업로드해주세요.
        <br />
        데이터 형태: 시간단위별 KPI 및 매체 비용/지표가 열로 전개
      </p>

      {/* Sample table */}
      <div className="mmm-sample-wrap">
        <table className="mmm-sample-table">
          <thead>
            <tr>
              <th style={{ color: "#e15f4f" }}>KPI (매출 등)</th>
              <th style={{ color: "#9b59b6" }}>날짜</th>
              <th style={{ color: "#4f80e1" }}>프로모션 여부</th>
              <th style={{ color: "#4fc98f" }}>매체1 집행비</th>
              <th style={{ color: "#4fc98f" }}>매체1 노출수</th>
              <th style={{ color: "#f5a623" }}>매체2 집행비</th>
              <th style={{ color: "#f5a623" }}>매체2 도달수</th>
              <th>...</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>33,523,000</td><td>2023-04-19</td><td>FALSE</td><td>835,795</td><td>58,590</td><td>4,855,768</td><td>352,697</td><td>...</td></tr>
            <tr><td>29,707,600</td><td>2023-04-20</td><td>FALSE</td><td>1,444,607</td><td>100,560</td><td>6,312,923</td><td>412,384</td><td>...</td></tr>
            <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ height: 16 }} />

      {/* Upload area */}
      <div className="mmm-upload-area">
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <Upload size={28} color="var(--text-tertiary)" style={{ display: "block", margin: "0 auto 8px" }} />
        <p className="mmm-upload-text">
          <strong>클릭하여 파일 선택</strong>
          <br />xlsx 파일만 지원합니다
        </p>
      </div>

      {uploading && <p className="mmm-desc" style={{ marginTop: 8 }}>업로드 중...</p>}

      {uploadedFile && !uploading && (
        <div className="mmm-file-info">
          <span>파일:</span>
          <span className="mmm-file-name">{uploadedFile.name}</span>
        </div>
      )}

      {/* Data preview */}
      {trainset.rowCount > 0 && (
        <>
          <p className="mmm-shape-label">
            데이터의 행: {trainset.rowCount} / 열: {trainset.colCount}
          </p>
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
