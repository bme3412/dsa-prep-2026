import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Point {
  id: string;
  label: string;
  x: number;
  y: number;
  category: string;
}

// Simulated 2D projection of embeddings
const POINTS: Point[] = [
  // Finance cluster
  { id: "1", label: "stock price", x: 0.2, y: 0.8, category: "finance" },
  { id: "2", label: "market cap", x: 0.25, y: 0.75, category: "finance" },
  { id: "3", label: "trading volume", x: 0.15, y: 0.7, category: "finance" },
  { id: "4", label: "portfolio", x: 0.3, y: 0.85, category: "finance" },
  // Tech cluster
  { id: "5", label: "API endpoint", x: 0.7, y: 0.3, category: "tech" },
  { id: "6", label: "database query", x: 0.75, y: 0.25, category: "tech" },
  { id: "7", label: "server config", x: 0.65, y: 0.35, category: "tech" },
  { id: "8", label: "deployment", x: 0.8, y: 0.2, category: "tech" },
  // Mixed/other
  { id: "9", label: "data analysis", x: 0.45, y: 0.5, category: "mixed" },
  { id: "10", label: "report generation", x: 0.5, y: 0.55, category: "mixed" },
];

const CATEGORY_COLORS: Record<string, string> = {
  finance: "var(--color-green)",
  tech: "var(--color-accent)",
  mixed: "var(--color-amber)",
};

export function EmbeddingSpaceViz() {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [queryPoint, setQueryPoint] = useState<{ x: number; y: number } | null>(null);

  const chartSize = 280;
  const padding = 30;

  const toPixel = (val: number) => padding + val * (chartSize - padding * 2);

  const nearestPoints = useMemo(() => {
    if (!queryPoint) return [];

    return POINTS.map((p) => ({
      ...p,
      distance: Math.sqrt(
        Math.pow(p.x - queryPoint.x, 2) + Math.pow(p.y - queryPoint.y, 2)
      ),
    }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [queryPoint]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - padding) / (chartSize - padding * 2);
    const y = (e.clientY - rect.top - padding) / (chartSize - padding * 2);

    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
      setQueryPoint({ x, y });
    }
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Embedding Space — 2D Projection
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Click anywhere to query nearest neighbors
          </p>
        </div>
        {queryPoint && (
          <button
            onClick={() => setQueryPoint(null)}
            className="text-xs px-2 py-1 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-muted)" }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Chart */}
        <svg
          width={chartSize}
          height={chartSize}
          onClick={handleClick}
          style={{ cursor: "crosshair" }}
        >
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((val) => (
            <g key={val}>
              <line
                x1={toPixel(val)}
                y1={padding}
                x2={toPixel(val)}
                y2={chartSize - padding}
                stroke="var(--color-border)"
                strokeDasharray="2 2"
              />
              <line
                x1={padding}
                y1={toPixel(val)}
                x2={chartSize - padding}
                y2={toPixel(val)}
                stroke="var(--color-border)"
                strokeDasharray="2 2"
              />
            </g>
          ))}

          {/* Connection lines to nearest neighbors */}
          {queryPoint && nearestPoints.map((p) => (
            <motion.line
              key={p.id}
              x1={toPixel(queryPoint.x)}
              y1={toPixel(queryPoint.y)}
              x2={toPixel(p.x)}
              y2={toPixel(p.y)}
              stroke="var(--color-coral)"
              strokeWidth="1"
              strokeDasharray="4 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            />
          ))}

          {/* Points */}
          {POINTS.map((point) => {
            const isNearest = nearestPoints.some((p) => p.id === point.id);
            return (
              <motion.circle
                key={point.id}
                cx={toPixel(point.x)}
                cy={toPixel(point.y)}
                r={isNearest ? 8 : 6}
                fill={CATEGORY_COLORS[point.category]}
                stroke={isNearest ? "var(--color-coral)" : "white"}
                strokeWidth={isNearest ? 2 : 1}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setSelectedPoint(point)}
                onMouseLeave={() => setSelectedPoint(null)}
                animate={{ scale: selectedPoint?.id === point.id ? 1.3 : 1 }}
              />
            );
          })}

          {/* Query point */}
          {queryPoint && (
            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <circle
                cx={toPixel(queryPoint.x)}
                cy={toPixel(queryPoint.y)}
                r="10"
                fill="var(--color-coral)"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={toPixel(queryPoint.x)}
                y={toPixel(queryPoint.y) + 4}
                textAnchor="middle"
                fontSize="10"
                fill="white"
              >
                Q
              </text>
            </motion.g>
          )}

          {/* Axis labels */}
          <text x={chartSize / 2} y={chartSize - 5} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">
            Dimension 1
          </text>
          <text x={8} y={chartSize / 2} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)" transform={`rotate(-90, 8, ${chartSize / 2})`}>
            Dimension 2
          </text>
        </svg>

        {/* Info panel */}
        <div className="flex-1">
          {/* Legend */}
          <div className="mb-4">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>Categories</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-[10px] capitalize" style={{ color: "var(--color-text-muted)" }}>{cat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected point info */}
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-2 rounded-[var(--radius-sm)] mb-3"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-medium">{selectedPoint.label}</p>
              <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                ({selectedPoint.x.toFixed(2)}, {selectedPoint.y.toFixed(2)})
              </p>
            </motion.div>
          )}

          {/* Nearest neighbors */}
          {queryPoint && nearestPoints.length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--color-coral)" }}>
                Nearest Neighbors
              </p>
              <div className="space-y-1">
                {nearestPoints.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-[10px] p-1.5 rounded-[var(--radius-sm)]"
                    style={{ background: "var(--color-bg-tertiary)" }}
                  >
                    <span>{idx + 1}. {p.label}</span>
                    <span className="font-mono" style={{ color: "var(--color-text-muted)" }}>
                      d={p.distance.toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-accent-glow)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-accent)" }}>Key insight:</strong>{" "}
          Embeddings map text to vectors where similar concepts cluster together.
          Vector search finds nearest neighbors using cosine similarity or L2 distance.
        </p>
      </div>
    </div>
  );
}
