import { STEPS, getStepIndex } from "../utils/status";

export default function StatusStepper({ status }) {
  const activeIndex = getStepIndex(status);

  return (
    <div className="stepper">
      {STEPS.map((step, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <div className={`stepper-item stepper-${state}`} key={step.label}>
            <div className="stepper-track">
              <span className="stepper-dot" />
              {i < STEPS.length - 1 && <span className="stepper-line" />}
            </div>
            <span className="stepper-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
