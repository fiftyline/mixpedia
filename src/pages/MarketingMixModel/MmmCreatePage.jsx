import { useState } from "react";
import axios from "axios";
import { endpoint } from "../../config/config";
import {
  emptyMedia,
  emptyMediaRf,
  emptyTrainset,
  makeModelId,
  getCurrentTimestamp,
} from "./mmmUtils";
import StepIndicator from "./components/StepIndicator";
import Alerts from "./components/Alerts";
import Step00Define from "./steps/Step00Define";
import Step01Upload from "./steps/Step01Upload";
import Step02Variables from "./steps/Step02Variables";
import Step03Settings from "./steps/Step03Settings";
import Step04Complete from "./steps/Step04Complete";
import "./styles.css";

export default function MmmCreatePage() {
  const [step, setStep] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* Step 00 */
  const [username, setUsername] = useState("");
  const [modelname, setModelname] = useState("");
  const [modelId, setModelId] = useState("");
  const [model_dttm, setModel_dttm] = useState("");

  /* Step 01 */
  const [trainset, setTrainset] = useState(emptyTrainset());
  const [uploadedFile, setUploadedFile] = useState(null);

  /* Step 02 */
  const [timeCol, setTimeCol] = useState("");
  const [kpiCol, setKpiCol] = useState("");
  const [kpiType, setKpiType] = useState("numeric");
  const [reachType, setReachType] = useState("reach_n");
  const [mediaRows, setMediaRows] = useState([emptyMedia()]);
  const [mediaRfRows, setMediaRfRows] = useState([emptyMediaRf()]);
  const [controlCols, setControlCols] = useState([""]);

  /* Step 03 */
  const [timeseq, setTimeseq] = useState("daily");
  const [maxlag, setMaxlag] = useState(10);
  const [useRoi, setUseRoi] = useState(true);
  const [roiValues, setRoiValues] = useState({});
  const [rfGender, setRfGender] = useState("P");
  const [rfAgeMin, setRfAgeMin] = useState(7);
  const [rfAgeMax, setRfAgeMax] = useState(79);
  const [useCoverage, setUseCoverage] = useState(true);
  const [coverageValues, setCoverageValues] = useState({});
  const [useOptfreq, setUseOptfreq] = useState(true);
  const [optfreqValues, setOptfreqValues] = useState({});

  /* Step 04 */
  const [createdId, setCreatedId] = useState("");
  const [createdName, setCreatedName] = useState("");

  /* ── helpers ── */
  const showAlert = (msg, type = "danger") => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message: msg, type }]);
    setTimeout(
      () => setAlerts((prev) => prev.filter((a) => a.id !== id)),
      4000,
    );
  };

  const dismissAlert = (id) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id));

  const validMedia = mediaRows.filter((r) => r.alias && r.type && r.value);
  const validMediaRf = mediaRfRows.filter(
    (r) => r.alias && r.type && r.reach && r.af,
  );
  const allMediaAliases = [
    ...validMediaRf.map((r) => r.alias),
    ...validMedia.map((r) => r.alias),
  ];
  const rfAliases = validMediaRf.map((r) => r.alias);

  /* ── step handlers ── */
  const handleNext00 = () => {
    setModelId(makeModelId());
    setModel_dttm(getCurrentTimestamp());
    setStep(1);
  };

  const handleNext02 = () => {
    const initRoi = { ...roiValues };
    const initCov = { ...coverageValues };
    const initOpt = { ...optfreqValues };
    allMediaAliases.forEach((a) => {
      if (!(a in initRoi)) initRoi[a] = 200;
      if (!(a in initCov)) initCov[a] = 95;
      if (!(a in initOpt)) initOpt[a] = 3;
    });
    setRoiValues(initRoi);
    setCoverageValues(initCov);
    setOptfreqValues(initOpt);
    setStep(3);
  };

  const handleCreate = async () => {
    setShowConfirm(false);
    setLoading(true);

    const input_set = {
      model_id: modelId,
      model_dttm,
      input_username: username,
      input_modelname: modelname,
      column_time: [timeCol],
      column_kpi: [kpiCol],
      column_control: controlCols.filter(Boolean),
      media_alias: validMedia.map((r) => r.alias),
      media_type: validMedia.map((r) => r.type),
      media_value: validMedia.map((r) => r.value),
      media_cost: validMedia.map((r) => r.cost || r.value),
      media_roi: useRoi
        ? validMedia.map((r) => (roiValues[r.alias] ?? 200) / 100)
        : [],
      media_rf_alias: validMediaRf.map((r) => r.alias),
      media_rf_type: validMediaRf.map((r) => r.type),
      media_rf_reach: validMediaRf.map((r) => r.reach),
      media_rf_af: validMediaRf.map((r) => r.af),
      media_rf_cost: validMediaRf.map((r) => r.cost || r.reach),
      media_rf_roi: useRoi
        ? validMediaRf.map((r) => (roiValues[r.alias] ?? 200) / 100)
        : [],
      media_rf_gender: rfGender,
      media_rf_agemin: rfAgeMin,
      media_rf_agemax: rfAgeMax,
      media_rf_coverage: useCoverage
        ? validMediaRf.map((r) => (coverageValues[r.alias] ?? 95) / 100)
        : validMediaRf.map(() => 0.95),
      media_rf_optfreq: useOptfreq
        ? validMediaRf.map((r) => optfreqValues[r.alias] ?? 3)
        : [],
      timeseq,
      maxlag: Number(maxlag),
      reach_type: reachType,
      kpi_type: kpiType === "ratio",
      use_roi: useRoi,
      use_coverage: useCoverage,
      use_optfreq: useOptfreq,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${endpoint}/mmm/create/`,
        { input_set, train_set: trainset },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setCreatedId(modelId);
      setCreatedName(modelname);
      setStep(4);
    } catch {
      showAlert("모델 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setUsername("");
    setModelname("");
    setModelId("");
    setModel_dttm("");
    setTrainset(emptyTrainset());
    setUploadedFile(null);
    setTimeCol("");
    setKpiCol("");
    setKpiType("numeric");
    setReachType("reach_n");
    setMediaRows([emptyMedia()]);
    setMediaRfRows([emptyMediaRf()]);
    setControlCols([""]);
    setRoiValues({});
    setCoverageValues({});
    setOptfreqValues({});
  };

  return (
    <div className="mmm-page">
      <div className="page-header">
        <h1 className="page-title">모델 생성</h1>
        <p className="page-desc">
          MMM 분석을 위한 데이터와 변수를 설정하고 모델을 생성합니다.
        </p>
      </div>

      <StepIndicator step={step} />
      <Alerts alerts={alerts} onDismiss={dismissAlert} />

      {step === 0 && (
        <Step00Define
          username={username}
          setUsername={setUsername}
          modelname={modelname}
          setModelname={setModelname}
          onNext={({ username: u, modelname: m }) => {
            setUsername(u);
            setModelname(m);
            handleNext00();
          }}
        />
      )}

      {step === 1 && (
        <Step01Upload
          trainset={trainset}
          setTrainset={setTrainset}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          showAlert={showAlert}
        />
      )}

      {step === 2 && (
        <Step02Variables
          trainset={trainset}
          timeCol={timeCol}
          setTimeCol={setTimeCol}
          kpiCol={kpiCol}
          setKpiCol={setKpiCol}
          kpiType={kpiType}
          setKpiType={setKpiType}
          reachType={reachType}
          setReachType={setReachType}
          mediaRows={mediaRows}
          setMediaRows={setMediaRows}
          mediaRfRows={mediaRfRows}
          setMediaRfRows={setMediaRfRows}
          controlCols={controlCols}
          setControlCols={setControlCols}
          onNext={handleNext02}
          onBack={() => setStep(1)}
          showAlert={showAlert}
        />
      )}

      {step === 3 && (
        <Step03Settings
          timeseq={timeseq}
          setTimeseq={setTimeseq}
          maxlag={maxlag}
          setMaxlag={setMaxlag}
          useRoi={useRoi}
          setUseRoi={setUseRoi}
          roiValues={roiValues}
          setRoiValues={setRoiValues}
          rfGender={rfGender}
          setRfGender={setRfGender}
          rfAgeMin={rfAgeMin}
          setRfAgeMin={setRfAgeMin}
          rfAgeMax={rfAgeMax}
          setRfAgeMax={setRfAgeMax}
          useCoverage={useCoverage}
          setUseCoverage={setUseCoverage}
          coverageValues={coverageValues}
          setCoverageValues={setCoverageValues}
          useOptfreq={useOptfreq}
          setUseOptfreq={setUseOptfreq}
          optfreqValues={optfreqValues}
          setOptfreqValues={setOptfreqValues}
          allMediaAliases={allMediaAliases}
          rfAliases={rfAliases}
          onConfirm={() => setShowConfirm(true)}
          onBack={() => setStep(2)}
          loading={loading}
        />
      )}

      {step === 4 && (
        <Step04Complete
          createdId={createdId}
          createdName={createdName}
          onReset={handleReset}
        />
      )}

      {/* ── Confirm Modal ── */}
      {showConfirm && (
        <div
          className="mmm-overlay"
          onClick={() => !loading && setShowConfirm(false)}
        >
          <div className="mmm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mmm-modal-title">모델을 생성하시겠습니까?</div>
            <div className="mmm-modal-body">
              MMM 분석이 시작되면 중단할 수 없으며,
              <br />
              모델 이름과 모델 ID를 통해 진행 상황/결과를 확인할 수 있습니다.
            </div>
            <ul className="mmm-confirm-list">
              <li>
                – <strong>모델명</strong>: {modelname}
              </li>
              <li>
                – <strong>모델 ID</strong>: {modelId}
              </li>
              <li>
                – <strong>KPI 변수</strong>: {kpiCol}
              </li>
              <li>
                – <strong>매체 변수</strong>:{" "}
                {validMedia.map((r) => r.alias).join(", ") || "-"} (
                {validMedia.length}개)
              </li>
              <li>
                – <strong>매체 도달 변수</strong>:{" "}
                {validMediaRf.map((r) => r.alias).join(", ") || "-"} (
                {validMediaRf.length}개)
              </li>
            </ul>
            <div className="mmm-modal-footer">
              <button
                className="mmm-btn"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                취소
              </button>
              <button
                className="mmm-btn mmm-btn--primary"
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? "생성 중..." : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
