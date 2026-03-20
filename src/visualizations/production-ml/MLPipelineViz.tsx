import { useState } from "react";
import { motion } from "framer-motion";

interface PipelineStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  { id: "ingest", name: "Data Ingestion", icon: "📥", description: "Raw data from sources", color: "var(--color-teal)" },
  { id: "validate", name: "Validation", icon: "✓", description: "Schema & quality checks", color: "var(--color-green)" },
  { id: "transform", name: "Transform", icon: "⚙️", description: "Feature engineering", color: "var(--color-accent)" },
  { id: "train", name: "Training", icon: "🧠", description: "Model fitting", color: "var(--color-coral)" },
  { id: "evaluate", name: "Evaluate", icon: "📊", description: "Metrics & validation", color: "var(--color-amber)" },
  { id: "deploy", name: "Deploy", icon: "🚀", description: "Serve predictions", color: "var(--color-green)" },
];

export function MLPipelineViz() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const runPipeline = () => {
    setIsRunning(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= PIPELINE_STAGES.length - 1) {
          clearInterval(interval);
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 800);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            ML Pipeline — Training to Serving
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Click stages to explore, or run the full pipeline
          </p>
        </div>
        <button
          onClick={runPipeline}
          disabled={isRunning}
          className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors"
          style={{
            background: isRunning ? "var(--color-bg-tertiary)" : "var(--color-accent)",
            color: isRunning ? "var(--color-text-muted)" : "white",
            cursor: isRunning ? "not-allowed" : "pointer",
          }}
        >
          {isRunning ? "Running..." : "Run Pipeline"}
        </button>
      </div>

      {/* Pipeline visualization */}
      <div className="flex items-center justify-between gap-2 py-4">
        {PIPELINE_STAGES.map((stage, idx) => (
          <div key={stage.id} className="flex items-center">
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setActiveStage(stage.id)}
              onMouseLeave={() => setActiveStage(null)}
              animate={{
                scale: activeStage === stage.id || currentStep === idx ? 1.1 : 1,
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                style={{
                  background: currentStep >= idx ? stage.color : "var(--color-bg-tertiary)",
                  border: `2px solid ${activeStage === stage.id ? stage.color : "transparent"}`,
                }}
                animate={{
                  boxShadow: currentStep === idx ? `0 0 20px ${stage.color}` : "none",
                }}
              >
                {stage.icon}
              </motion.div>
              <p
                className="text-[10px] mt-2 text-center max-w-[60px]"
                style={{
                  color: currentStep >= idx ? "var(--color-text-primary)" : "var(--color-text-muted)",
                  fontWeight: activeStage === stage.id ? 600 : 400,
                }}
              >
                {stage.name}
              </p>
            </motion.div>

            {idx < PIPELINE_STAGES.length - 1 && (
              <motion.div
                className="w-8 h-0.5 mx-1"
                style={{
                  background: currentStep > idx ? "var(--color-accent)" : "var(--color-border)",
                }}
                animate={{
                  scaleX: currentStep > idx ? 1 : 0.5,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Stage details */}
      {activeStage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-[var(--radius-md)]"
          style={{ background: "var(--color-bg-tertiary)" }}
        >
          {(() => {
            const stage = PIPELINE_STAGES.find((s) => s.id === activeStage);
            if (!stage) return null;
            return (
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: stage.color }}
                >
                  {stage.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{stage.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{stage.description}</p>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-accent-glow)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-accent)" }}>Key insight:</strong>{" "}
          Production ML pipelines separate training (batch, expensive) from serving (real-time, cheap).
          Feature stores bridge the gap by providing consistent features for both.
        </p>
      </div>
    </div>
  );
}
