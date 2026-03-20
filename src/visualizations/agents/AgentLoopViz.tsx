import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Step {
  phase: "observe" | "think" | "act" | "complete";
  observation?: string;
  thought?: string;
  action?: string;
  result?: string;
}

const DEMO_STEPS: Step[] = [
  { phase: "observe", observation: "User asks: 'What is NVDA trading at?'" },
  { phase: "think", thought: "I need to look up the current stock price for NVDA (NVIDIA). I should use the get_stock_price tool." },
  { phase: "act", action: "get_stock_price(symbol='NVDA')" },
  { phase: "observe", observation: "Tool returned: { price: 875.42, change: +2.3% }" },
  { phase: "think", thought: "I have the price. I can now respond to the user with this information." },
  { phase: "act", action: "respond('NVDA is trading at $875.42, up 2.3% today.')" },
  { phase: "complete", result: "Task completed successfully" },
];

export function AgentLoopViz() {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = DEMO_STEPS[stepIndex];

  const next = () => {
    if (stepIndex < DEMO_STEPS.length - 1) setStepIndex(stepIndex + 1);
  };

  const reset = () => setStepIndex(0);

  const phaseColors = {
    observe: { bg: "var(--color-teal-dim)", border: "var(--color-teal)", text: "var(--color-teal)" },
    think: { bg: "var(--color-amber-dim)", border: "var(--color-amber)", text: "var(--color-amber)" },
    act: { bg: "var(--color-accent-glow)", border: "var(--color-accent)", text: "var(--color-accent)" },
    complete: { bg: "var(--color-green-dim)", border: "var(--color-green)", text: "var(--color-green)" },
  };

  const colors = phaseColors[currentStep.phase];

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            ReAct Agent Loop — Observe → Think → Act
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Step {stepIndex + 1} of {DEMO_STEPS.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={next}
            disabled={stepIndex >= DEMO_STEPS.length - 1}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 transition-all"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Next Step
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loop visualization */}
      <div className="flex justify-center gap-4 mb-6">
        {["observe", "think", "act"].map((phase, i) => {
          const isActive = currentStep.phase === phase;
          const isPast = ["observe", "think", "act"].indexOf(currentStep.phase) > i ||
            currentStep.phase === "complete";
          const pColors = phaseColors[phase as keyof typeof phaseColors];

          return (
            <div key={phase} className="flex items-center">
              <motion.div
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                style={{
                  background: isActive ? pColors.bg : isPast ? pColors.bg : "var(--color-bg-primary)",
                  border: `2px solid ${isActive ? pColors.border : isPast ? pColors.border : "var(--color-border)"}`,
                }}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl">
                  {phase === "observe" ? "👁️" : phase === "think" ? "🧠" : "⚡"}
                </span>
                <span
                  className="text-[10px] font-medium uppercase mt-1"
                  style={{ color: isActive || isPast ? pColors.text : "var(--color-text-muted)" }}
                >
                  {phase}
                </span>
              </motion.div>
              {i < 2 && (
                <div
                  className="w-8 h-0.5 mx-2"
                  style={{
                    background: isPast ? "var(--color-text-muted)" : "var(--color-border)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Current step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-[var(--radius-md)] p-4"
          style={{
            background: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: colors.text }}
          >
            {currentStep.phase === "complete" ? "✓ Complete" : currentStep.phase}
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
          >
            {currentStep.observation || currentStep.thought || currentStep.action || currentStep.result}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          ReAct (Reason + Act) interleaves reasoning and action. The agent observes results,
          thinks about next steps, then acts. This loop continues until the task is complete.
        </p>
      </div>
    </div>
  );
}
