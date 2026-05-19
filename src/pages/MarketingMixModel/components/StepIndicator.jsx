import { STEPS } from "../mmmUtils";

export default function StepIndicator({ step }) {
  return (
    <div className="mmm-steps">
      {STEPS.map((label, i) => (
        <>
          <div
            key={i}
            className={`mmm-step${i === step ? " mmm-step--active" : i < step ? " mmm-step--done" : ""}`}
          >
            <div className="mmm-step-circle">{i < step ? "✓" : i}</div>
            <span className="mmm-step-label">{label}</span>
          </div>
          {i < STEPS.length - 1 && <div key={`sep-${i}`} className="mmm-step-sep" />}
        </>
      ))}
    </div>
  );
}
