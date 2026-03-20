import { useState } from "react";
import { motion } from "framer-motion";

interface AWSService {
  id: string;
  name: string;
  icon: string;
  category: "compute" | "storage" | "queue" | "database" | "api";
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

const SERVICES: AWSService[] = [
  { id: "apigw", name: "API Gateway", icon: "🌐", category: "api", x: 50, y: 100 },
  { id: "lambda1", name: "Lambda", icon: "λ", category: "compute", x: 150, y: 60 },
  { id: "lambda2", name: "Lambda", icon: "λ", category: "compute", x: 150, y: 140 },
  { id: "sqs", name: "SQS", icon: "📬", category: "queue", x: 250, y: 100 },
  { id: "dynamo", name: "DynamoDB", icon: "📊", category: "database", x: 350, y: 60 },
  { id: "s3", name: "S3", icon: "🪣", category: "storage", x: 350, y: 140 },
];

const CONNECTIONS: Connection[] = [
  { from: "apigw", to: "lambda1", label: "sync" },
  { from: "apigw", to: "lambda2", label: "sync" },
  { from: "lambda1", to: "sqs", label: "async" },
  { from: "sqs", to: "lambda2" },
  { from: "lambda1", to: "dynamo" },
  { from: "lambda2", to: "s3" },
];

const CATEGORY_COLORS: Record<string, string> = {
  compute: "var(--color-amber)",
  storage: "var(--color-green)",
  queue: "var(--color-coral)",
  database: "var(--color-accent)",
  api: "var(--color-teal)",
};

export function AWSArchitectureViz() {
  const [selectedService, setSelectedService] = useState<AWSService | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  const getServiceById = (id: string) => SERVICES.find((s) => s.id === id);

  const highlightFlow = (startId: string) => {
    const visited = new Set<string>();
    const path: string[] = [];

    const traverse = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      path.push(id);

      CONNECTIONS.filter((c) => c.from === id).forEach((c) => traverse(c.to));
    };

    traverse(startId);
    setHighlightedPath(path);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            AWS Serverless Architecture
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Click services to highlight data flow paths
          </p>
        </div>
        {highlightedPath.length > 0 && (
          <button
            onClick={() => setHighlightedPath([])}
            className="text-xs px-2 py-1 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Architecture diagram */}
      <div className="relative" style={{ height: 200 }}>
        <svg width="100%" height="100%" viewBox="0 0 420 200">
          {/* Connections */}
          {CONNECTIONS.map((conn) => {
            const from = getServiceById(conn.from);
            const to = getServiceById(conn.to);
            if (!from || !to) return null;

            const isHighlighted =
              highlightedPath.includes(conn.from) && highlightedPath.includes(conn.to);

            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            return (
              <g key={`${conn.from}-${conn.to}`}>
                <motion.line
                  x1={from.x + 20}
                  y1={from.y}
                  x2={to.x - 20}
                  y2={to.y}
                  stroke={isHighlighted ? "var(--color-accent)" : "var(--color-border)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  animate={{ opacity: isHighlighted ? 1 : 0.5 }}
                />
                {conn.label && (
                  <text
                    x={midX}
                    y={midY - 5}
                    textAnchor="middle"
                    fontSize="8"
                    fill="var(--color-text-muted)"
                  >
                    {conn.label}
                  </text>
                )}
                {/* Arrow */}
                <polygon
                  points={`${to.x - 22},${to.y - 4} ${to.x - 22},${to.y + 4} ${to.x - 16},${to.y}`}
                  fill={isHighlighted ? "var(--color-accent)" : "var(--color-border)"}
                />
              </g>
            );
          })}

          {/* Services */}
          {SERVICES.map((service) => {
            const isHighlighted = highlightedPath.includes(service.id);

            return (
              <g key={service.id}>
                <motion.rect
                  x={service.x - 25}
                  y={service.y - 25}
                  width={50}
                  height={50}
                  rx={8}
                  fill={CATEGORY_COLORS[service.category]}
                  stroke={isHighlighted ? "var(--color-text-primary)" : "transparent"}
                  strokeWidth={2}
                  animate={{ scale: isHighlighted ? 1.1 : 1 }}
                  style={{ cursor: "pointer", transformOrigin: `${service.x}px ${service.y}px` }}
                  onClick={() => highlightFlow(service.id)}
                  onMouseEnter={() => setSelectedService(service)}
                  onMouseLeave={() => setSelectedService(null)}
                />
                <text
                  x={service.x}
                  y={service.y + 5}
                  textAnchor="middle"
                  fontSize="16"
                  style={{ pointerEvents: "none" }}
                >
                  {service.icon}
                </text>
                <text
                  x={service.x}
                  y={service.y + 38}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-text-muted)"
                >
                  {service.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Service tooltip */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2 p-2 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}
          >
            <p className="text-xs font-medium">{selectedService.name}</p>
            <p className="text-[10px] capitalize" style={{ color: CATEGORY_COLORS[selectedService.category] }}>
              {selectedService.category}
            </p>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: color }} />
            <span className="text-[10px] capitalize" style={{ color: "var(--color-text-muted)" }}>
              {cat}
            </span>
          </div>
        ))}
      </div>

      {/* Pattern description */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
          <p className="text-xs font-medium">Sync Path</p>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            API Gateway → Lambda → DynamoDB
            <br />
            Request-response, low latency
          </p>
        </div>
        <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
          <p className="text-xs font-medium">Async Path</p>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            Lambda → SQS → Lambda → S3
            <br />
            Decoupled, reliable, scalable
          </p>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Serverless architectures use managed services (Lambda, SQS, DynamoDB) to eliminate
          infrastructure management. Design for failure: use dead-letter queues, idempotency, and retries.
        </p>
      </div>
    </div>
  );
}
