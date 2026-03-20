import { useState } from "react";

interface BacktestResult {
  date: string;
  portfolio: number;
  benchmark: number;
  signal: number;
}

// Simulated backtest data
const BACKTEST_DATA: BacktestResult[] = [
  { date: "2024-01", portfolio: 100, benchmark: 100, signal: 0 },
  { date: "2024-02", portfolio: 103, benchmark: 102, signal: 1 },
  { date: "2024-03", portfolio: 101, benchmark: 99, signal: -1 },
  { date: "2024-04", portfolio: 106, benchmark: 103, signal: 1 },
  { date: "2024-05", portfolio: 109, benchmark: 105, signal: 1 },
  { date: "2024-06", portfolio: 107, benchmark: 104, signal: -1 },
  { date: "2024-07", portfolio: 112, benchmark: 108, signal: 1 },
  { date: "2024-08", portfolio: 115, benchmark: 110, signal: 1 },
  { date: "2024-09", portfolio: 118, benchmark: 112, signal: 1 },
  { date: "2024-10", portfolio: 116, benchmark: 111, signal: -1 },
  { date: "2024-11", portfolio: 120, benchmark: 114, signal: 1 },
  { date: "2024-12", portfolio: 125, benchmark: 118, signal: 1 },
];

export function BacktestViz() {
  const [showSignals, setShowSignals] = useState(true);

  const maxValue = Math.max(
    ...BACKTEST_DATA.map(d => Math.max(d.portfolio, d.benchmark))
  );
  const minValue = Math.min(
    ...BACKTEST_DATA.map(d => Math.min(d.portfolio, d.benchmark))
  );
  const range = maxValue - minValue;

  const chartHeight = 140;
  const chartWidth = 450;
  const padding = 30;

  const toX = (i: number) => padding + (i / (BACKTEST_DATA.length - 1)) * (chartWidth - padding * 2);
  const toY = (val: number) => chartHeight - padding - ((val - minValue) / range) * (chartHeight - padding * 2);

  const portfolioReturn = ((BACKTEST_DATA[BACKTEST_DATA.length - 1].portfolio - 100) / 100 * 100).toFixed(1);
  const benchmarkReturn = ((BACKTEST_DATA[BACKTEST_DATA.length - 1].benchmark - 100) / 100 * 100).toFixed(1);
  const alpha = (parseFloat(portfolioReturn) - parseFloat(benchmarkReturn)).toFixed(1);

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Backtest Results — Strategy vs Benchmark
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Portfolio: +{portfolioReturn}% | Benchmark: +{benchmarkReturn}% | Alpha: +{alpha}%
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <input
            type="checkbox"
            checked={showSignals}
            onChange={(e) => setShowSignals(e.target.checked)}
          />
          Show signals
        </label>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          {/* Benchmark line */}
          <path
            d={BACKTEST_DATA.map((d, i) => {
              const x = toX(i);
              const y = toY(d.benchmark);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--color-text-muted)"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Portfolio line */}
          <path
            d={BACKTEST_DATA.map((d, i) => {
              const x = toX(i);
              const y = toY(d.portfolio);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />

          {/* Signal markers */}
          {showSignals && BACKTEST_DATA.map((d, i) => {
            if (d.signal === 0) return null;
            const x = toX(i);
            const y = toY(d.portfolio);

            return (
              <g key={i}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={d.signal > 0 ? "var(--color-green)" : "var(--color-coral)"}
                />
                <text
                  x={x}
                  y={d.signal > 0 ? y - 10 : y + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill={d.signal > 0 ? "var(--color-green)" : "var(--color-coral)"}
                >
                  {d.signal > 0 ? "↑" : "↓"}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {BACKTEST_DATA.filter((_, i) => i % 3 === 0).map((d, i) => {
            const actualIdx = i * 3;
            return (
              <text
                key={d.date}
                x={toX(actualIdx)}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize="9"
                fill="var(--color-text-muted)"
              >
                {d.date.slice(5)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5" style={{ background: "var(--color-accent)" }} />
          <span className="text-xs text-[var(--color-text-muted)]">Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5" style={{ background: "var(--color-text-muted)", opacity: 0.5 }} />
          <span className="text-xs text-[var(--color-text-muted)]">Benchmark (SPY)</span>
        </div>
        {showSignals && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-green)" }} />
              <span className="text-xs text-[var(--color-text-muted)]">Long signal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-coral)" }} />
              <span className="text-xs text-[var(--color-text-muted)]">Short/exit signal</span>
            </div>
          </>
        )}
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-3 mt-4">
        {[
          { label: "Total Return", value: `+${portfolioReturn}%`, color: "var(--color-green)" },
          { label: "Alpha", value: `+${alpha}%`, color: "var(--color-accent)" },
          { label: "Win Rate", value: "67%", color: "var(--color-teal)" },
          { label: "Max DD", value: "-3.2%", color: "var(--color-coral)" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="p-2 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-bg-primary)" }}
          >
            <p className="text-[10px] text-[var(--color-text-muted)]">{metric.label}</p>
            <p
              className="text-sm font-semibold"
              style={{ color: metric.color, fontFamily: "var(--font-mono)" }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-accent-glow)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-accent)" }}>Key insight:</strong>{" "}
          Backtesting simulates how a strategy would have performed historically.
          Critical to watch for <strong>overfitting</strong> — a strategy that works perfectly
          on past data may fail on new data. Use out-of-sample testing and walk-forward analysis.
        </p>
      </div>
    </div>
  );
}
