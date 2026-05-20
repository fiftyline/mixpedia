import { Fragment } from "react";
import { STEPS } from "../mmmUtils";

export default function StepIndicator({ step }) {
  return (
    <div className="mmm-steps">
      {STEPS.map((label, i) => (
        <Fragment key={i}>
          <div className={`mmm-step${i === step ? " mmm-step--active" : i < step ? " mmm-step--done" : ""}`}>
            <div className="mmm-step-circle">{i < step ? "✓" : i}</div>
            <span className="mmm-step-label">{label}</span>
          </div>
          {i < STEPS.length - 1 && <div className="mmm-step-sep" />}
        </Fragment>
      ))}
    </div>
  );
}
