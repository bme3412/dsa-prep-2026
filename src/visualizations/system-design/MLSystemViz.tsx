import { useState } from "react";
import { motion } from "framer-motion";

type Component = "gateway" | "inference" | "feature" | "model" | "cache" | "monitor" | null;

const componentInfo: Record<Exclude<Component, null>, {
  title: string;
  description: string;
  aws: string;
  details: string[];
}> = {
  gateway: {
    title: "API Gateway",
    description: "Entry point for inference requests with authentication and rate limiting",
    aws: "API Gateway + Lambda Authorizer",
    details: [
      "Request validation and throttling",
      "JWT/API key authentication",
      "Request/response transformation",
      "Usage plans for billing",
    ],
  },
  inference: {
    title: "Inference Service",
    description: "Scalable model serving with auto-scaling based on demand",
    aws: "SageMaker Endpoints / Lambda",
    details: [
      "Horizontal scaling on demand",
      "GPU/CPU instance selection",
      "Batch vs real-time inference",
      "A/B testing and canary deployments",
    ],
  },
  feature: {
    title: "Feature Store",
    description: "Centralized repository for ML features with online and offline stores",
    aws: "SageMaker Feature Store / DynamoDB",
    details: [
      "Online store: sub-ms latency lookups",
      "Offline store: S3 for training",
      "Feature versioning and lineage",
      "Point-in-time correctness",
    ],
  },
  model: {
    title: "Model Registry",
    description: "Version-controlled storage of trained models with metadata",
    aws: "SageMaker Model Registry / S3",
    details: [
      "Model versioning and lineage",
      "Approval workflows for production",
      "A/B test traffic allocation",
      "Rollback capabilities",
    ],
  },
  cache: {
    title: "Prediction Cache",
    description: "Cache frequent predictions to reduce latency and cost",
    aws: "ElastiCache (Redis) / DAX",
    details: [
      "Cache by feature hash",
      "TTL based on prediction staleness",
      "Cache hit rates 40-80%",
      "Cost savings on inference",
    ],
  },
  monitor: {
    title: "ML Monitoring",
    description: "Track model performance, data drift, and system health",
    aws: "CloudWatch + SageMaker Model Monitor",
    details: [
      "Prediction distribution drift",
      "Feature drift detection",
      "Latency and error tracking",
      "Alerting on degradation",
    ],
  },
};

export function MLSystemViz() {
  const [selected, setSelected] = useState<Component>(null);
  const [requestFlow, setRequestFlow] = useState(false);

  const runRequestFlow = () => {
    setRequestFlow(true);
    const sequence: Component[] = ["gateway", "cache", "feature", "inference", "monitor"];

    sequence.forEach((comp, i) => {
      setTimeout(() => {
        setSelected(comp);
        if (i === sequence.length - 1) {
          setTimeout(() => {
            setRequestFlow(false);
            setSelected(null);
          }, 1500);
        }
      }, i * 800);
    });
  };

  const isActive = (comp: Component) => selected === comp;

  const Box = ({ comp, x, y, width = "110px" }: { comp: Exclude<Component, null>; x: string; y: string; width?: string }) => {
    const info = componentInfo[comp];
    return (
      <motion.div
        className="absolute cursor-pointer rounded-lg p-2 text-center"
        style={{
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          width,
          background: isActive(comp) ? "var(--color-accent)" : "var(--color-bg-tertiary)",
          border: `2px solid ${isActive(comp) ? "var(--color-accent)" : "var(--color-border)"}`,
          boxShadow: isActive(comp) ? "0 0 20px var(--color-accent-glow)" : "none",
        }}
        animate={{ scale: isActive(comp) ? 1.08 : 1 }}
        onClick={() => !requestFlow && setSelected(selected === comp ? null : comp)}
      >
        <div
          className="text-[10px] font-medium"
          style={{ color: isActive(comp) ? "white" : "var(--color-text-primary)" }}
        >
          {info.title}
        </div>
        <div
          className="text-[9px]"
          style={{ color: isActive(comp) ? "rgba(255,255,255,0.8)" : "var(--color-text-muted)" }}
        >
          {info.aws.split(" / ")[0]}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] p-6 my-6"
      style={{ background: "var(--color-bg-tertiary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          ML Inference System Architecture
        </h4>
        <button
          onClick={runRequestFlow}
          disabled={requestFlow}
          className="text-xs px-3 py-1.5 rounded transition-colors"
          style={{
            background: requestFlow ? "var(--color-bg-secondary)" : "var(--color-accent)",
            color: requestFlow ? "var(--color-text-muted)" : "white",
          }}
        >
          {requestFlow ? "Running..." : "Trace Request"}
        </button>
      </div>

      {/* Architecture diagram */}
      <div className="relative h-64 mb-4">
        {/* Components */}
        <Box comp="gateway" x="15%" y="50%" />
        <Box comp="cache" x="38%" y="30%" />
        <Box comp="feature" x="38%" y="70%" />
        <Box comp="inference" x="62%" y="50%" />
        <Box comp="model" x="85%" y="30%" />
        <Box comp="monitor" x="85%" y="70%" />

        {/* Labels */}
        <div
          className="absolute text-[9px] px-1.5 py-0.5 rounded"
          style={{ left: "5%", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }}
        >
          Client
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Gateway to Cache */}
          <line x1="22%" y1="45%" x2="32%" y2="32%" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Gateway to Feature Store */}
          <line x1="22%" y1="55%" x2="32%" y2="68%" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Cache to Inference */}
          <line x1="44%" y1="32%" x2="55%" y2="45%" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Feature Store to Inference */}
          <line x1="44%" y1="68%" x2="55%" y2="55%" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Inference to Model Registry */}
          <line x1="69%" y1="45%" x2="78%" y2="32%" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4" />
          {/* Inference to Monitor */}
          <line x1="69%" y1="55%" x2="78%" y2="68%" stroke="var(--color-border)" strokeWidth="1.5" />
          {/* Client arrow */}
          <line x1="2%" y1="50%" x2="8%" y2="50%" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrow-ml)" />

          <defs>
            <marker id="arrow-ml" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="var(--color-accent)" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Component details */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4"
          style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {componentInfo[selected].title}
            </h5>
            <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "var(--color-accent-glow)", color: "var(--color-accent)" }}>
              {componentInfo[selected].aws}
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
            {componentInfo[selected].description}
          </p>
          <ul className="grid grid-cols-2 gap-1">
            {componentInfo[selected].details.map((detail, i) => (
              <li key={i} className="text-[11px] flex items-start gap-2" style={{ color: "var(--color-text-muted)" }}>
                <span style={{ color: "var(--color-accent)" }}>•</span>
                {detail}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <p className="text-[10px] mt-4 text-center" style={{ color: "var(--color-text-muted)" }}>
        Click components to see details. "Trace Request" shows the inference request flow.
      </p>
    </div>
  );
}
