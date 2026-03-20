import { useState } from "react";
import { motion } from "framer-motion";

interface Portfolio {
  name: string;
  returns: number;
  volatility: number;
  color: string;
}

const PORTFOLIOS: Portfolio[] = [
  { name: "Conservative", returns: 0.06, volatility: 0.08, color: "var(--color-green)" },
  { name: "Balanced", returns: 0.10, volatility: 0.12, color: "var(--color-teal)" },
  { name: "Aggressive", returns: 0.14, volatility: 0.20, color: "var(--color-coral)" },
  { name: "Optimal", returns: 0.12, volatility: 0.11, color: "var(--color-accent)" },
];

const RISK_FREE_RATE = 0.04;

function calculateSharpe(returns: number, volatility: number, riskFree: number): number {
  return (returns - riskFree) / volatility;
}

export function SharpeRatioViz() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [riskFreeRate, setRiskFreeRate] = useState(RISK_FREE_RATE);

  const chartWidth = 300;
  const chartHeight = 200;
  const padding = 40;

  // Scale returns and volatility to chart coordinates
  const maxVol = 0.25;
  const maxRet = 0.20;

  const toX = (vol: number) => padding + (vol / maxVol) * (chartWidth - padding * 2);
  const toY = (ret: number) => chartHeight - padding - (ret / maxRet) * (chartHeight - padding * 2);

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Sharpe Ratio — Risk-Adjusted Returns
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Sharpe = (Return - Risk-Free) / Volatility
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-[var(--color-text-muted)]">Risk-free:</label>
          <input
            type="range"
            min="0"
            max="0.08"
            step="0.01"
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
            className="w-20"
          />
          <span className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            {(riskFreeRate * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Chart */}
        <div className="relative">
          <svg width={chartWidth} height={chartHeight}>
            {/* Grid lines */}
            {[0, 0.05, 0.10, 0.15, 0.20].map((ret) => (
              <g key={ret}>
                <line
                  x1={padding}
                  y1={toY(ret)}
                  x2={chartWidth - padding}
                  y2={toY(ret)}
                  stroke="var(--color-border)"
                  strokeDasharray="2 2"
                />
                <text
                  x={padding - 5}
                  y={toY(ret) + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--color-text-muted)"
                >
                  {(ret * 100).toFixed(0)}%
                </text>
              </g>
            ))}

            {/* Risk-free rate line */}
            <line
              x1={padding}
              y1={toY(riskFreeRate)}
              x2={chartWidth - padding}
              y2={toY(riskFreeRate)}
              stroke="var(--color-amber)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* Capital Market Line (from risk-free through optimal) */}
            <line
              x1={toX(0)}
              y1={toY(riskFreeRate)}
              x2={toX(0.25)}
              y2={toY(riskFreeRate + (PORTFOLIOS[3].returns - riskFreeRate) / PORTFOLIOS[3].volatility * 0.25)}
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="4 2"
              opacity="0.5"
            />

            {/* Portfolio points */}
            {PORTFOLIOS.map((p) => {
              const x = toX(p.volatility);
              const y = toY(p.returns);
              const isSelected = selectedPortfolio?.name === p.name;

              return (
                <g key={p.name}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 10 : 8}
                    fill={p.color}
                    stroke="white"
                    strokeWidth="2"
                    animate={{ scale: isSelected ? 1.2 : 1 }}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setSelectedPortfolio(p)}
                    onMouseLeave={() => setSelectedPortfolio(null)}
                  />
                </g>
              );
            })}

            {/* X-axis label */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 5}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-muted)"
            >
              Volatility (Risk)
            </text>

            {/* Y-axis label */}
            <text
              x={10}
              y={chartHeight / 2}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-muted)"
              transform={`rotate(-90, 10, ${chartHeight / 2})`}
            >
              Return
            </text>
          </svg>
        </div>

        {/* Portfolio comparison */}
        <div className="flex-1">
          <p className="text-xs text-[var(--color-text-muted)] mb-2">Portfolio Comparison</p>
          <div className="space-y-2">
            {PORTFOLIOS.map((p) => {
              const sharpe = calculateSharpe(p.returns, p.volatility, riskFreeRate);
              const isSelected = selectedPortfolio?.name === p.name;

              return (
                <motion.div
                  key={p.name}
                  className="p-2 rounded-[var(--radius-sm)] cursor-pointer"
                  style={{
                    background: isSelected ? "var(--color-bg-tertiary)" : "transparent",
                    border: `1px solid ${isSelected ? p.color : "transparent"}`,
                  }}
                  onMouseEnter={() => setSelectedPortfolio(p)}
                  onMouseLeave={() => setSelectedPortfolio(null)}
                  animate={{ scale: isSelected ? 1.02 : 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: p.color }}
                      />
                      <span className="text-xs font-medium">{p.name}</span>
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: sharpe > 1 ? "var(--color-green)" : sharpe > 0.5 ? "var(--color-teal)" : "var(--color-coral)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Sharpe: {sharpe.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      Return: {(p.returns * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      Vol: {(p.volatility * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Sharpe ratio measures excess return per unit of risk. Higher is better.
          A Sharpe of 1.0 is good, 2.0+ is excellent. The "Optimal" portfolio has the highest
          Sharpe — best risk-adjusted returns.
        </p>
      </div>
    </div>
  );
}
