import { useState } from "react";
import { motion } from "framer-motion";

interface Guardrail {
  name: string;
  type: "cost" | "approval" | "scope" | "rate";
  check: string;
  status: "pass" | "fail" | "pending";
}

const DEMO_ACTION = {
  action: "execute_trade",
  params: { symbol: "NVDA", quantity: 1000, side: "buy" },
};

const GUARDRAILS: Guardrail[] = [
  { name: "Cost Budget", type: "cost", check: "API cost < $10/request", status: "pass" },
  { name: "Rate Limit", type: "rate", check: "< 100 requests/minute", status: "pass" },
  { name: "Scope Check", type: "scope", check: "Action in allowed list", status: "pass" },
  { name: "Human Approval", type: "approval", check: "Trade > $10,000 requires approval", status: "pending" },
];

export function GuardrailsViz() {
  const [currentCheck, setCurrentCheck] = useState(0);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runChecks = () => {
    setIsRunning(true);
    setCurrentCheck(0);
    setApproved(null);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentCheck(i);
      if (i >= GUARDRAILS.length - 1) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 600);
  };

  const reset = () => {
    setCurrentCheck(0);
    setApproved(null);
    setIsRunning(false);
  };

  const handleApproval = (approve: boolean) => {
    setApproved(approve);
    setCurrentCheck(GUARDRAILS.length);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Guardrails & Human-in-the-Loop
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Safety checks before agent actions execute
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={runChecks}
            disabled={isRunning || currentCheck > 0}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 transition-all"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Run Checks
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

      {/* Proposed action */}
      <div
        className="rounded-[var(--radius-md)] p-3 mb-4"
        style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-xs text-[var(--color-text-muted)] mb-1">Proposed Agent Action</p>
        <pre className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
          {JSON.stringify(DEMO_ACTION, null, 2)}
        </pre>
      </div>

      {/* Guardrails checklist */}
      <div className="space-y-2 mb-4">
        {GUARDRAILS.map((guardrail, i) => {
          const isChecked = i < currentCheck || (i === currentCheck && !isRunning);
          const isActive = i === currentCheck && isRunning;
          const isPending = guardrail.status === "pending" && isChecked && approved === null;
          const finalStatus = isPending ? "pending" : guardrail.status;

          return (
            <motion.div
              key={guardrail.name}
              className="flex items-center gap-3 p-3 rounded-[var(--radius-md)]"
              style={{
                background: isActive
                  ? "var(--color-amber-dim)"
                  : isChecked && finalStatus === "pass"
                  ? "var(--color-green-dim)"
                  : isChecked && finalStatus === "pending"
                  ? "var(--color-amber-dim)"
                  : isChecked && finalStatus === "fail"
                  ? "var(--color-coral-dim)"
                  : "var(--color-bg-primary)",
                border: `1px solid ${
                  isActive
                    ? "var(--color-amber)"
                    : isChecked && finalStatus === "pass"
                    ? "var(--color-green)"
                    : isChecked && finalStatus === "pending"
                    ? "var(--color-amber)"
                    : isChecked && finalStatus === "fail"
                    ? "var(--color-coral)"
                    : "var(--color-border)"
                }`,
              }}
              animate={{ scale: isActive ? 1.02 : 1 }}
            >
              <span className="text-lg">
                {isActive ? "⏳" : isChecked && finalStatus === "pass" ? "✅" : isChecked && finalStatus === "pending" ? "⏸️" : isChecked && finalStatus === "fail" ? "❌" : "⬜"}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{guardrail.name}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{guardrail.check}</p>
              </div>
              {isPending && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(true)}
                    className="px-3 py-1 text-xs rounded-[var(--radius-sm)]"
                    style={{ background: "var(--color-green)", color: "white" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(false)}
                    className="px-3 py-1 text-xs rounded-[var(--radius-sm)]"
                    style={{ background: "var(--color-coral)", color: "white" }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Final result */}
      {approved !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[var(--radius-md)] p-3"
          style={{
            background: approved ? "var(--color-green-dim)" : "var(--color-coral-dim)",
            border: `1px solid ${approved ? "var(--color-green)" : "var(--color-coral)"}`,
          }}
        >
          <p className="text-sm font-medium" style={{ color: approved ? "var(--color-green)" : "var(--color-coral)" }}>
            {approved ? "✓ Action approved and executed" : "✗ Action rejected by human reviewer"}
          </p>
        </motion.div>
      )}

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-coral-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-coral)" }}>Key insight:</strong>{" "}
          Guardrails enforce safety before actions execute. Combine automatic checks
          (cost, rate limits, scope) with human-in-the-loop approval for high-stakes decisions.
        </p>
      </div>
    </div>
  );
}
