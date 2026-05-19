import { STEPS } from "../mmmUtils";

export default function StepIndicator({ step }) {
  return (
    <div className="mmm-steps">
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div
            className={`mmm-step${i === step ? " mmm-step--active" : i < step ? " mmm-step--done" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div className="mmm-step-circle">{i < step ? "✓" : i}</div>
            <span className="mmm-step-label">{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="mmm-step-sep" />}
        </div>
      ))}
    </div>
  );
}
