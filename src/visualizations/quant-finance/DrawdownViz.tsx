import { useState, useMemo } from "react";
import { motion } from "framer-motion";

// Simulated portfolio returns
const RETURNS = [0.02, -0.01, 0.03, -0.05, -0.03, 0.02, 0.04, -0.02, 0.01, -0.06, -0.02, 0.05, 0.03, 0.02, -0.01];

function calculateDrawdown(returns: number[]) {
  const values = [100]; // Start with $100
  let peak = 100;
  const drawdowns: number[] = [];
  const peaks: number[] = [100];

  for (const ret of returns) {
    const newValue = values[values.length - 1] * (1 + ret);
    values.push(newValue);
    peak = Math.max(peak, newValue);
    peaks.push(peak);
    drawdowns.push((newValue - peak) / peak);
  }

  const maxDrawdown = Math.min(...drawdowns);
  const maxDrawdownIdx = drawdowns.indexOf(maxDrawdown);

  return { values, peaks, drawdowns, maxDrawdown, maxDrawdownIdx };
}

export function DrawdownViz() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const data = useMemo(() => calculateDrawdown(RETURNS), []);

  const maxValue = Math.max(...data.values);
  const minValue = Math.min(...data.values);
  const range = maxValue - minValue;

  const chartHeight = 120;
  const chartWidth = 400;

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Portfolio Drawdown Analysis
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Max Drawdown: {(data.maxDrawdown * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight + 40 }}>
        <svg width="100%" height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}>
          {/* Peak line (underwater reference) */}
          <path
            d={data.peaks.map((p, i) => {
              const x = (i / (data.values.length - 1)) * chartWidth;
              const y = chartHeight - ((p - minValue) / range) * chartHeight;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--color-text-muted)"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.5"
          />

          {/* Drawdown fill */}
          <path
            d={`
              ${data.values.map((v, i) => {
                const x = (i / (data.values.length - 1)) * chartWidth;
                const y = chartHeight - ((v - minValue) / range) * chartHeight;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              ${data.peaks.slice().reverse().map((p, i) => {
                const idx = data.peaks.length - 1 - i;
                const x = (idx / (data.values.length - 1)) * chartWidth;
                const y = chartHeight - ((p - minValue) / range) * chartHeight;
                return `L ${x} ${y}`;
              }).join(' ')}
              Z
            `}
            fill="var(--color-coral)"
            opacity="0.15"
          />

          {/* Portfolio value line */}
          <path
            d={data.values.map((v, i) => {
              const x = (i / (data.values.length - 1)) * chartWidth;
              const y = chartHeight - ((v - minValue) / range) * chartHeight;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />

          {/* Max drawdown marker */}
          <circle
            cx={(data.maxDrawdownIdx + 1) / (data.values.length - 1) * chartWidth}
            cy={chartHeight - ((data.values[data.maxDrawdownIdx + 1] - minValue) / range) * chartHeight}
            r="5"
            fill="var(--color-coral)"
          />

          {/* Interactive points */}
          {data.values.map((v, i) => {
            const x = (i / (data.values.length - 1)) * chartWidth;
            const y = chartHeight - ((v - minValue) / range) * chartHeight;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={hoveredIdx === i ? 6 : 3}
                fill={hoveredIdx === i ? "var(--color-teal)" : "var(--color-accent)"}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredIdx !== null && hoveredIdx > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 right-0 p-2 rounded-[var(--radius-sm)]"
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
              Day {hoveredIdx}: ${data.values[hoveredIdx].toFixed(2)}
            </p>
            <p className="text-xs" style={{ color: "var(--color-coral)" }}>
              Drawdown: {(data.drawdowns[hoveredIdx - 1] * 100).toFixed(1)}%
            </p>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5" style={{ background: "var(--color-accent)" }} />
          <span className="text-xs text-[var(--color-text-muted)]">Portfolio Value</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5" style={{ background: "var(--color-text-muted)", opacity: 0.5 }} />
          <span className="text-xs text-[var(--color-text-muted)]">Peak (High Water Mark)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--color-coral)" }} />
          <span className="text-xs text-[var(--color-text-muted)]">Max Drawdown</span>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-coral-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-coral)" }}>Key insight:</strong>{" "}
          Drawdown measures peak-to-trough decline. Max drawdown is the worst historical loss
          from a peak. Critical for risk management — a 50% drawdown requires a 100% gain to recover.
        </p>
      </div>
    </div>
  );
}
