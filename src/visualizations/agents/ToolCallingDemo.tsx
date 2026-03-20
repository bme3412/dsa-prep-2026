import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tool {
  name: string;
  description: string;
  parameters: { name: string; type: string; required: boolean }[];
}

const TOOLS: Tool[] = [
  {
    name: "get_stock_price",
    description: "Get the current price of a stock",
    parameters: [
      { name: "symbol", type: "string", required: true },
    ],
  },
  {
    name: "get_portfolio_holdings",
    description: "Get current portfolio positions",
    parameters: [
      { name: "portfolio_id", type: "string", required: true },
      { name: "as_of_date", type: "string", required: false },
    ],
  },
  {
    name: "calculate_risk_metrics",
    description: "Calculate VaR and other risk metrics",
    parameters: [
      { name: "portfolio_id", type: "string", required: true },
      { name: "confidence_level", type: "number", required: false },
    ],
  },
];

const DEMO_CALL = {
  tool: "get_stock_price",
  arguments: { symbol: "NVDA" },
  result: { price: 875.42, change_pct: 2.3, volume: 45_200_000 },
};

export function ToolCallingDemo() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showCall, setShowCall] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const reset = () => {
    setSelectedTool(null);
    setShowCall(false);
    setShowResult(false);
  };

  const selectTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowCall(false);
    setShowResult(false);
  };

  const makeCall = () => {
    setShowCall(true);
    setTimeout(() => setShowResult(true), 800);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Tool Calling / Function Calling
        </p>
        <button
          onClick={reset}
          className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Reset
        </button>
      </div>

      {/* Available tools */}
      <div className="mb-4">
        <p className="text-[11px] text-[var(--color-text-muted)] mb-2">Available Tools</p>
        <div className="flex gap-2 flex-wrap">
          {TOOLS.map((tool) => (
            <button
              key={tool.name}
              onClick={() => selectTool(tool)}
              className="px-3 py-2 rounded-[var(--radius-md)] text-xs transition-all"
              style={{
                background: selectedTool?.name === tool.name
                  ? "var(--color-accent-glow)"
                  : "var(--color-bg-primary)",
                border: selectedTool?.name === tool.name
                  ? "1px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
                color: selectedTool?.name === tool.name
                  ? "var(--color-accent)"
                  : "var(--color-text-secondary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tool.name}()
            </button>
          ))}
        </div>
      </div>

      {/* Tool schema */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div
              className="rounded-[var(--radius-md)] p-4"
              style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}
            >
              <p className="text-xs text-[var(--color-text-muted)] mb-2">Tool Schema (JSON)</p>
              <pre
                className="text-xs leading-relaxed overflow-x-auto"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
              >
{`{
  "name": "${selectedTool.name}",
  "description": "${selectedTool.description}",
  "parameters": {
    "type": "object",
    "properties": {
${selectedTool.parameters.map(p => `      "${p.name}": { "type": "${p.type}" }`).join(",\n")}
    },
    "required": [${selectedTool.parameters.filter(p => p.required).map(p => `"${p.name}"`).join(", ")}]
  }
}`}
              </pre>
              {selectedTool.name === "get_stock_price" && !showCall && (
                <button
                  onClick={makeCall}
                  className="mt-3 px-4 py-2 text-xs rounded-[var(--radius-sm)] transition-all"
                  style={{ background: "var(--color-accent)", color: "white" }}
                >
                  Simulate Call: get_stock_price("NVDA")
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call and result */}
      <AnimatePresence>
        {showCall && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div
              className="rounded-[var(--radius-md)] p-3"
              style={{ background: "var(--color-amber-dim)", border: "1px solid var(--color-amber)" }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: "var(--color-amber)" }}>
                LLM → Tool Call
              </p>
              <pre className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
{`{
  "tool": "${DEMO_CALL.tool}",
  "arguments": ${JSON.stringify(DEMO_CALL.arguments)}
}`}
              </pre>
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[var(--radius-md)] p-3"
                style={{ background: "var(--color-green-dim)", border: "1px solid var(--color-green)" }}
              >
                <p className="text-xs font-medium mb-1" style={{ color: "var(--color-green)" }}>
                  Tool → Result
                </p>
                <pre className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
{JSON.stringify(DEMO_CALL.result, null, 2)}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-accent-glow)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-accent)" }}>Key insight:</strong>{" "}
          Tools are defined with JSON schemas. The LLM generates structured JSON matching the schema,
          your code executes the function, and returns results for the LLM to interpret.
        </p>
      </div>
    </div>
  );
}
