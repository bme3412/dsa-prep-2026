import { useState } from "react";
import { motion } from "framer-motion";

type PipelineMode = "batch" | "streaming";

interface DataPoint {
  id: number;
  x: number;
  stage: number;
}

const stages = {
  batch: [
    { name: "S3 Data Lake", icon: "📦", color: "var(--color-accent)" },
    { name: "Spark/EMR", icon: "⚡", color: "var(--color-teal)" },
    { name: "Transform", icon: "🔄", color: "var(--color-amber)" },
    { name: "Data Warehouse", icon: "🏢", color: "var(--color-green)" },
  ],
  streaming: [
    { name: "Kinesis Stream", icon: "🌊", color: "var(--color-accent)" },
    { name: "Lambda/Flink", icon: "⚡", color: "var(--color-teal)" },
    { name: "Transform", icon: "🔄", color: "var(--color-amber)" },
    { name: "Real-time DB", icon: "💾", color: "var(--color-green)" },
  ],
};

const characteristics = {
  batch: {
    latency: "Minutes to hours",
    throughput: "Very high",
    cost: "Lower (scheduled)",
    useCase: "Daily reports, model training",
    aws: "S3 → Glue/EMR → Redshift",
  },
  streaming: {
    latency: "Milliseconds to seconds",
    throughput: "Continuous",
    cost: "Higher (always-on)",
    useCase: "Real-time alerts, live dashboards",
    aws: "Kinesis → Lambda/Flink → DynamoDB",
  },
};

export function DataPipelineViz() {
  const [mode, setMode] = useState<PipelineMode>("batch");
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [nextId, setNextId] = useState(0);

  const currentStages = stages[mode];
  const currentChars = characteristics[mode];

  const runPipeline = () => {
    if (isRunning) return;
    setIsRunning(true);
    setDataPoints([]);

    const numPoints = mode === "batch" ? 5 : 1;
    const interval = mode === "batch" ? 200 : 800;

    let pointId = nextId;
    const points: DataPoint[] = [];

    // Create initial data points
    for (let i = 0; i < numPoints; i++) {
      setTimeout(() => {
        const newPoint: DataPoint = { id: pointId++, x: 5, stage: 0 };
        points.push(newPoint);
        setDataPoints([...points]);
        setNextId(pointId);
      }, i * interval);
    }

    // Move points through stages
    const totalDelay = numPoints * interval;
    const stageDelay = mode === "batch" ? 600 : 400;

    for (let stage = 1; stage <= 4; stage++) {
      setTimeout(() => {
        setDataPoints((prev) =>
          prev.map((p) => ({ ...p, stage: Math.min(stage, 4) }))
        );
      }, totalDelay + stage * stageDelay);
    }

    // Clear after completion
    setTimeout(() => {
      setDataPoints([]);
      setIsRunning(false);
    }, totalDelay + 5 * stageDelay);
  };

  const getPointX = (stage: number): number => {
    const positions = [10, 30, 50, 70, 90];
    return positions[Math.min(stage, 4)];
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] p-6 my-6"
      style={{ background: "var(--color-bg-tertiary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          Data Pipeline Architecture
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("batch")}
            className="text-xs px-3 py-1.5 rounded transition-colors"
            style={{
              background: mode === "batch" ? "var(--color-accent)" : "var(--color-bg-secondary)",
              color: mode === "batch" ? "white" : "var(--color-text-muted)",
            }}
          >
            Batch
          </button>
          <button
            onClick={() => setMode("streaming")}
            className="text-xs px-3 py-1.5 rounded transition-colors"
            style={{
              background: mode === "streaming" ? "var(--color-teal)" : "var(--color-bg-secondary)",
              color: mode === "streaming" ? "white" : "var(--color-text-muted)",
            }}
          >
            Streaming
          </button>
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="text-xs px-3 py-1.5 rounded transition-colors ml-2"
            style={{
              background: isRunning ? "var(--color-bg-secondary)" : "var(--color-green)",
              color: isRunning ? "var(--color-text-muted)" : "white",
            }}
          >
            {isRunning ? "Running..." : "Run Flow"}
          </button>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="relative h-32 mb-4">
        {/* Stage boxes */}
        {currentStages.map((stage, i) => (
          <div
            key={stage.name}
            className="absolute rounded-lg p-2 text-center"
            style={{
              left: `${15 + i * 22}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "80px",
              background: "var(--color-bg-secondary)",
              border: `2px solid ${stage.color}`,
            }}
          >
            <div className="text-lg mb-0.5">{stage.icon}</div>
            <div className="text-[9px] font-medium" style={{ color: stage.color }}>
              {stage.name}
            </div>
          </div>
        ))}

        {/* Arrows between stages */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {[0, 1, 2].map((i) => (
            <line
              key={i}
              x1={`${24 + i * 22}%`}
              y1="50%"
              x2={`${29 + i * 22}%`}
              y2="50%"
              stroke="var(--color-border)"
              strokeWidth="2"
              markerEnd="url(#arrow-pipe)"
            />
          ))}
          <defs>
            <marker id="arrow-pipe" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="var(--color-border)" />
            </marker>
          </defs>
        </svg>

        {/* Data points */}
        {dataPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: mode === "batch" ? "var(--color-accent)" : "var(--color-teal)",
              top: "50%",
              transform: "translateY(-50%)",
              boxShadow: `0 0 8px ${mode === "batch" ? "var(--color-accent)" : "var(--color-teal)"}`,
            }}
            animate={{ left: `${getPointX(point.stage)}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Characteristics comparison */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {[
          { label: "Latency", value: currentChars.latency },
          { label: "Throughput", value: currentChars.throughput },
          { label: "Cost", value: currentChars.cost },
          { label: "Use Case", value: currentChars.useCase },
          { label: "AWS Stack", value: currentChars.aws },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-md p-2"
            style={{ background: "var(--color-bg-secondary)" }}
          >
            <div className="text-[9px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--color-text-muted)" }}>
              {item.label}
            </div>
            <div className="text-[10px]" style={{ color: "var(--color-text-primary)" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <p className="text-[10px] mt-4 text-center" style={{ color: "var(--color-text-muted)" }}>
        Toggle between Batch and Streaming to compare architectures. "Run Flow" animates data movement.
      </p>
    </div>
  );
}
