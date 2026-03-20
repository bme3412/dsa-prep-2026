import { useState } from "react";
import { motion } from "framer-motion";

interface RAGStep {
  id: string;
  label: string;
  detail: string;
}

const RAG_STEPS: RAGStep[] = [
  { id: "query", label: "User Query", detail: "\"What's our refund policy?\"" },
  { id: "embed", label: "Embed Query", detail: "[0.23, -0.45, 0.12, ...]" },
  { id: "retrieve", label: "Vector Search", detail: "Top-k similar chunks" },
  { id: "context", label: "Build Context", detail: "Query + retrieved docs" },
  { id: "generate", label: "LLM Generate", detail: "Grounded response" },
];

const SAMPLE_CHUNKS = [
  { id: 1, text: "Refunds within 30 days...", score: 0.92 },
  { id: 2, text: "Return shipping is free...", score: 0.87 },
  { id: 3, text: "Contact support for...", score: 0.71 },
];

export function RAGFlowViz() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAnimation = () => {
    setIsPlaying(true);
    setStep(0);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= RAG_STEPS.length) {
        clearInterval(interval);
        setIsPlaying(false);
      } else {
        setStep(current);
      }
    }, 1000);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            RAG Flow — Retrieval-Augmented Generation
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Query → Embed → Retrieve → Context → Generate
          </p>
        </div>
        <button
          onClick={playAnimation}
          disabled={isPlaying}
          className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium"
          style={{
            background: isPlaying ? "var(--color-bg-tertiary)" : "var(--color-teal)",
            color: isPlaying ? "var(--color-text-muted)" : "white",
          }}
        >
          {isPlaying ? "Running..." : "Play Flow"}
        </button>
      </div>

      {/* Flow steps */}
      <div className="flex items-center justify-between mb-6">
        {RAG_STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center">
            <motion.div
              className="flex flex-col items-center"
              animate={{
                opacity: step >= idx ? 1 : 0.4,
                scale: step === idx ? 1.1 : 1,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono"
                style={{
                  background: step >= idx ? "var(--color-teal)" : "var(--color-bg-tertiary)",
                  color: step >= idx ? "white" : "var(--color-text-muted)",
                }}
              >
                {idx + 1}
              </div>
              <p className="text-[10px] mt-1 text-center max-w-[70px]" style={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </p>
            </motion.div>
            {idx < RAG_STEPS.length - 1 && (
              <motion.div
                className="w-6 h-0.5 mx-1"
                style={{ background: step > idx ? "var(--color-teal)" : "var(--color-border)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current step detail */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 rounded-[var(--radius-md)]"
          style={{ background: "var(--color-bg-tertiary)" }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--color-teal)" }}>
            {RAG_STEPS[step].label}
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--color-text-secondary)" }}>
            {RAG_STEPS[step].detail}
          </p>
        </motion.div>

        {/* Retrieved chunks (visible at step 2+) */}
        <motion.div
          animate={{ opacity: step >= 2 ? 1 : 0.3 }}
          className="p-3 rounded-[var(--radius-md)]"
          style={{ background: "var(--color-bg-tertiary)" }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
            Retrieved Chunks
          </p>
          <div className="space-y-1">
            {SAMPLE_CHUNKS.map((chunk, idx) => (
              <motion.div
                key={chunk.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: step >= 2 ? 1 : 0.3, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between text-[10px]"
              >
                <span className="truncate max-w-[120px]" style={{ color: "var(--color-text-secondary)" }}>
                  {chunk.text}
                </span>
                <span
                  className="font-mono"
                  style={{ color: chunk.score > 0.85 ? "var(--color-green)" : "var(--color-text-muted)" }}
                >
                  {chunk.score.toFixed(2)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          RAG grounds LLM responses in retrieved documents, reducing hallucination.
          Quality depends on chunking strategy, embedding model, and retrieval (k, threshold).
        </p>
      </div>
    </div>
  );
}
