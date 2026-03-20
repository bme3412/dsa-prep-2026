import { useState } from "react";
import { motion } from "framer-motion";

type AgentRole = "fundamental" | "sentiment" | "technical" | "trader" | "risk" | "portfolio" | null;

const agentInfo: Record<Exclude<AgentRole, null>, {
  title: string;
  color: string;
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
}> = {
  fundamental: {
    title: "Fundamental Analyst",
    color: "var(--color-accent)",
    responsibilities: [
      "Analyze company financials (10-K, 10-Q)",
      "Earnings call transcript analysis",
      "Macro-economic data synthesis",
      "Valuation model updates",
    ],
    inputs: ["SEC filings", "Earnings transcripts", "Economic data"],
    outputs: ["Valuation signals", "Earnings surprises", "Fundamental scores"],
  },
  sentiment: {
    title: "Sentiment Analyst",
    color: "var(--color-teal)",
    responsibilities: [
      "NLP over news and social media",
      "Sentiment scoring and trends",
      "Event detection (M&A, scandals)",
      "Alternative data integration",
    ],
    inputs: ["News feeds", "Social data", "Alt data sources"],
    outputs: ["Sentiment scores", "Event alerts", "Trend signals"],
  },
  technical: {
    title: "Technical Analyst",
    color: "var(--color-amber)",
    responsibilities: [
      "Price action analysis",
      "Technical indicator computation",
      "Chart pattern recognition",
      "Support/resistance identification",
    ],
    inputs: ["OHLCV data", "Volume profiles", "Order flow"],
    outputs: ["Entry/exit signals", "Trend indicators", "Pattern alerts"],
  },
  trader: {
    title: "Trading Agent",
    color: "var(--color-green)",
    responsibilities: [
      "Synthesize all research signals",
      "Generate trade recommendations",
      "Size positions appropriately",
      "Time execution optimally",
    ],
    inputs: ["All analyst outputs", "Market conditions", "Portfolio state"],
    outputs: ["Trade proposals", "Position sizing", "Timing recommendations"],
  },
  risk: {
    title: "Risk Manager",
    color: "var(--color-coral)",
    responsibilities: [
      "Evaluate position limits",
      "Check drawdown constraints",
      "Assess correlation exposure",
      "Approve or reject trades",
    ],
    inputs: ["Trade proposals", "Current portfolio", "Risk limits"],
    outputs: ["Approved trades", "Rejected with reason", "Risk adjustments"],
  },
  portfolio: {
    title: "Portfolio Manager",
    color: "#8b5cf6",
    responsibilities: [
      "Execute approved trades",
      "Manage overall allocation",
      "Track P&L attribution",
      "Generate performance reports",
    ],
    inputs: ["Approved trades", "Execution constraints", "Client mandates"],
    outputs: ["Executed positions", "NAV updates", "Attribution reports"],
  },
};

export function MultiAgentTradingViz() {
  const [selected, setSelected] = useState<AgentRole>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const runAnimation = () => {
    setIsAnimating(true);
    const sequence: AgentRole[] = ["fundamental", "sentiment", "technical", "trader", "risk", "portfolio"];

    sequence.forEach((role, i) => {
      setTimeout(() => {
        setSelected(role);
        if (i === sequence.length - 1) {
          setTimeout(() => {
            setIsAnimating(false);
            setSelected(null);
          }, 1500);
        }
      }, i * 1200);
    });
  };

  const AgentBox = ({ role, x, y }: { role: AgentRole; x: string; y: string }) => {
    if (!role) return null;
    const info = agentInfo[role];
    const isSelected = selected === role;

    return (
      <motion.div
        className="absolute cursor-pointer rounded-lg p-2 text-center"
        style={{
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
          width: "100px",
          background: isSelected ? info.color : "var(--color-bg-secondary)",
          border: `2px solid ${isSelected ? info.color : "var(--color-border)"}`,
          boxShadow: isSelected ? `0 0 20px ${info.color}40` : "none",
        }}
        animate={{
          scale: isSelected ? 1.1 : 1,
        }}
        onClick={() => !isAnimating && setSelected(selected === role ? null : role)}
      >
        <div
          className="text-[10px] font-medium"
          style={{ color: isSelected ? "white" : "var(--color-text-primary)" }}
        >
          {info.title.split(" ")[0]}
        </div>
        <div
          className="text-[9px]"
          style={{ color: isSelected ? "rgba(255,255,255,0.8)" : "var(--color-text-muted)" }}
        >
          {info.title.split(" ")[1]}
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
          Multi-Agent Trading System
        </h4>
        <button
          onClick={runAnimation}
          disabled={isAnimating}
          className="text-xs px-3 py-1.5 rounded transition-colors"
          style={{
            background: isAnimating ? "var(--color-bg-secondary)" : "var(--color-accent)",
            color: isAnimating ? "var(--color-text-muted)" : "white",
          }}
        >
          {isAnimating ? "Running..." : "Run Flow"}
        </button>
      </div>

      {/* Architecture diagram */}
      <div className="relative h-72 mb-4">
        {/* Row 1: Analysts */}
        <div
          className="absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 rounded"
          style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}
        >
          Research Layer
        </div>
        <AgentBox role="fundamental" x="20%" y="18%" />
        <AgentBox role="sentiment" x="50%" y="18%" />
        <AgentBox role="technical" x="80%" y="18%" />

        {/* Row 2: Trader */}
        <div
          className="absolute left-1/2 top-[42%] -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 rounded"
          style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}
        >
          Decision Layer
        </div>
        <AgentBox role="trader" x="50%" y="50%" />

        {/* Row 3: Risk & Portfolio */}
        <div
          className="absolute left-1/2 top-[72%] -translate-x-1/2 text-[10px] font-medium px-2 py-0.5 rounded"
          style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}
        >
          Execution Layer
        </div>
        <AgentBox role="risk" x="35%" y="82%" />
        <AgentBox role="portfolio" x="65%" y="82%" />

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Analysts to Trader */}
          <line x1="20%" y1="28%" x2="45%" y2="45%" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="50%" y1="28%" x2="50%" y2="42%" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="80%" y1="28%" x2="55%" y2="45%" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Trader to Risk */}
          <line x1="45%" y1="58%" x2="38%" y2="74%" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Risk to Portfolio */}
          <line x1="42%" y1="82%" x2="58%" y2="82%" stroke="var(--color-border)" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Arrow marker definition */}
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="var(--color-border)" />
            </marker>
          </defs>
        </svg>

        {/* Labels */}
        <div
          className="absolute text-[9px] px-1.5 py-0.5 rounded"
          style={{ left: "42%", top: "62%", background: "var(--color-bg-primary)", color: "var(--color-text-muted)" }}
        >
          proposals
        </div>
        <div
          className="absolute text-[9px] px-1.5 py-0.5 rounded"
          style={{ left: "46%", top: "78%", background: "var(--color-bg-primary)", color: "var(--color-text-muted)" }}
        >
          approved
        </div>
      </div>

      {/* Agent details */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-4"
          style={{ background: "var(--color-bg-secondary)", border: `2px solid ${agentInfo[selected].color}` }}
        >
          <h5 className="text-sm font-semibold mb-2" style={{ color: agentInfo[selected].color }}>
            {agentInfo[selected].title}
          </h5>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>Responsibilities</p>
              <ul className="space-y-0.5">
                {agentInfo[selected].responsibilities.map((r, i) => (
                  <li key={i} style={{ color: "var(--color-text-muted)" }}>• {r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>Inputs</p>
              <ul className="space-y-0.5">
                {agentInfo[selected].inputs.map((inp, i) => (
                  <li key={i} style={{ color: "var(--color-text-muted)" }}>→ {inp}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1" style={{ color: "var(--color-text-primary)" }}>Outputs</p>
              <ul className="space-y-0.5">
                {agentInfo[selected].outputs.map((out, i) => (
                  <li key={i} style={{ color: "var(--color-text-muted)" }}>← {out}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-[10px] mt-4 text-center" style={{ color: "var(--color-text-muted)" }}>
        Click agents to see details. "Run Flow" shows information flow through the system.
      </p>
    </div>
  );
}
