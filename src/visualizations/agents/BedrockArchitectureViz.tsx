import { useState } from "react";
import { motion } from "framer-motion";

type Component = "agent" | "model" | "actions" | "kb" | "guardrails" | null;

const componentInfo: Record<Exclude<Component, null>, { title: string; description: string; details: string[] }> = {
  agent: {
    title: "Bedrock Agent",
    description: "Orchestration layer that coordinates reasoning and actions",
    details: [
      "Receives user input and session context",
      "Invokes foundation model for reasoning",
      "Decides which action group or KB to query",
      "Loops until task complete or needs human input",
    ],
  },
  model: {
    title: "Foundation Model",
    description: "Claude, Llama, or other LLM powering agent reasoning",
    details: [
      "Generates rationale for next action",
      "Predicts which tools/KBs to invoke",
      "Extracts parameters from context",
      "Native tool_use capability for reliable calling",
    ],
  },
  actions: {
    title: "Action Groups (Lambda)",
    description: "APIs the agent can invoke via Lambda functions",
    details: [
      "OpenAPI 3.0 schemas define interface",
      "Lambda executes business logic",
      "Returns structured responses to agent",
      "Examples: trade execution, risk calculation",
    ],
  },
  kb: {
    title: "Knowledge Bases",
    description: "Vector databases for context retrieval and grounding",
    details: [
      "Vector stores: OpenSearch, pgvector, Pinecone",
      "Automatic chunking and embedding",
      "Retrieved context augments prompts",
      "Grounds responses in enterprise data",
    ],
  },
  guardrails: {
    title: "Bedrock Guardrails",
    description: "Safety filters and compliance controls",
    details: [
      "Content filtering (harmful, PII)",
      "Denied topics (insider info, restricted securities)",
      "Jailbreak/prompt injection protection",
      "Applied to both input and output",
    ],
  },
};

export function BedrockArchitectureViz() {
  const [selected, setSelected] = useState<Component>(null);
  const [step, setStep] = useState(0);

  const steps = [
    { label: "1. User Input", active: ["agent"] },
    { label: "2. Reasoning", active: ["agent", "model", "guardrails"] },
    { label: "3. Action/KB Selection", active: ["model", "actions", "kb"] },
    { label: "4. Execution", active: ["actions", "kb"] },
    { label: "5. Observation", active: ["agent", "model"] },
    { label: "6. Response", active: ["agent", "guardrails"] },
  ];

  const currentStep = steps[step];
  const isActive = (comp: Component) => comp && currentStep.active.includes(comp);

  return (
    <div
      className="rounded-[var(--radius-lg)] p-6 my-6"
      style={{ background: "var(--color-bg-tertiary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          AWS Bedrock Agents Architecture
        </h4>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className="text-[10px] px-2 py-1 rounded transition-colors"
              style={{
                background: step === i ? "var(--color-accent)" : "var(--color-bg-secondary)",
                color: step === i ? "white" : "var(--color-text-muted)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
        Step: <span style={{ color: "var(--color-accent)" }}>{currentStep.label}</span>
      </p>

      {/* Architecture diagram */}
      <div className="relative h-64 mb-4">
        {/* Agent (center top) */}
        <motion.div
          className="absolute cursor-pointer rounded-lg p-3 text-center"
          style={{
            left: "50%",
            top: "0",
            transform: "translateX(-50%)",
            width: "140px",
            background: isActive("agent") ? "var(--color-accent)" : "var(--color-bg-secondary)",
            border: `2px solid ${selected === "agent" ? "var(--color-accent)" : "var(--color-border)"}`,
          }}
          animate={{ scale: isActive("agent") ? 1.05 : 1 }}
          onClick={() => setSelected(selected === "agent" ? null : "agent")}
        >
          <div className="text-lg mb-1">🤖</div>
          <div
            className="text-xs font-medium"
            style={{ color: isActive("agent") ? "white" : "var(--color-text-primary)" }}
          >
            Bedrock Agent
          </div>
        </motion.div>

        {/* Foundation Model (center) */}
        <motion.div
          className="absolute cursor-pointer rounded-lg p-3 text-center"
          style={{
            left: "50%",
            top: "80px",
            transform: "translateX(-50%)",
            width: "140px",
            background: isActive("model") ? "var(--color-teal)" : "var(--color-bg-secondary)",
            border: `2px solid ${selected === "model" ? "var(--color-teal)" : "var(--color-border)"}`,
          }}
          animate={{ scale: isActive("model") ? 1.05 : 1 }}
          onClick={() => setSelected(selected === "model" ? null : "model")}
        >
          <div className="text-lg mb-1">🧠</div>
          <div
            className="text-xs font-medium"
            style={{ color: isActive("model") ? "white" : "var(--color-text-primary)" }}
          >
            Foundation Model
          </div>
          <div
            className="text-[10px]"
            style={{ color: isActive("model") ? "rgba(255,255,255,0.8)" : "var(--color-text-muted)" }}
          >
            Claude / Llama
          </div>
        </motion.div>

        {/* Action Groups (left) */}
        <motion.div
          className="absolute cursor-pointer rounded-lg p-3 text-center"
          style={{
            left: "10%",
            top: "160px",
            width: "120px",
            background: isActive("actions") ? "var(--color-amber)" : "var(--color-bg-secondary)",
            border: `2px solid ${selected === "actions" ? "var(--color-amber)" : "var(--color-border)"}`,
          }}
          animate={{ scale: isActive("actions") ? 1.05 : 1 }}
          onClick={() => setSelected(selected === "actions" ? null : "actions")}
        >
          <div className="text-lg mb-1">⚡</div>
          <div
            className="text-xs font-medium"
            style={{ color: isActive("actions") ? "white" : "var(--color-text-primary)" }}
          >
            Action Groups
          </div>
          <div
            className="text-[10px]"
            style={{ color: isActive("actions") ? "rgba(255,255,255,0.8)" : "var(--color-text-muted)" }}
          >
            Lambda Functions
          </div>
        </motion.div>

        {/* Knowledge Bases (right) */}
        <motion.div
          className="absolute cursor-pointer rounded-lg p-3 text-center"
          style={{
            right: "10%",
            top: "160px",
            width: "120px",
            background: isActive("kb") ? "var(--color-green)" : "var(--color-bg-secondary)",
            border: `2px solid ${selected === "kb" ? "var(--color-green)" : "var(--color-border)"}`,
          }}
          animate={{ scale: isActive("kb") ? 1.05 : 1 }}
          onClick={() => setSelected(selected === "kb" ? null : "kb")}
        >
          <div className="text-lg mb-1">📚</div>
          <div
            className="text-xs font-medium"
            style={{ color: isActive("kb") ? "white" : "var(--color-text-primary)" }}
          >
            Knowledge Bases
          </div>
          <div
            className="text-[10px]"
            style={{ color: isActive("kb") ? "rgba(255,255,255,0.8)" : "var(--color-text-muted)" }}
          >
            Vector Store
          </div>
        </motion.div>

        {/* Guardrails (center bottom) */}
        <motion.div
          className="absolute cursor-pointer rounded-lg p-3 text-center"
          style={{
            left: "50%",
            bottom: "0",
            transform: "translateX(-50%)",
            width: "120px",
            background: isActive("guardrails") ? "var(--color-coral)" : "var(--color-bg-secondary)",
            border: `2px solid ${selected === "guardrails" ? "var(--color-coral)" : "var(--color-border)"}`,
          }}
          animate={{ scale: isActive("guardrails") ? 1.05 : 1 }}
          onClick={() => setSelected(selected === "guardrails" ? null : "guardrails")}
        >
          <div className="text-lg mb-1">🛡️</div>
          <div
            className="text-xs font-medium"
            style={{ color: isActive("guardrails") ? "white" : "var(--color-text-primary)" }}
          >
            Guardrails
          </div>
        </motion.div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Agent to Model */}
          <line x1="50%" y1="55" x2="50%" y2="80" stroke="var(--color-border)" strokeWidth="2" />
          {/* Model to Actions */}
          <line x1="42%" y1="130" x2="25%" y2="160" stroke="var(--color-border)" strokeWidth="2" />
          {/* Model to KB */}
          <line x1="58%" y1="130" x2="75%" y2="160" stroke="var(--color-border)" strokeWidth="2" />
          {/* Agent to Guardrails */}
          <line x1="50%" y1="55" x2="50%" y2="200" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4" />
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
          <h5 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text-primary)" }}>
            {componentInfo[selected].title}
          </h5>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-secondary)" }}>
            {componentInfo[selected].description}
          </p>
          <ul className="space-y-1">
            {componentInfo[selected].details.map((detail, i) => (
              <li key={i} className="text-xs flex items-start gap-2" style={{ color: "var(--color-text-muted)" }}>
                <span style={{ color: "var(--color-accent)" }}>•</span>
                {detail}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <p className="text-[10px] mt-4 text-center" style={{ color: "var(--color-text-muted)" }}>
        Click components to see details. Use step buttons to see orchestration flow.
      </p>
    </div>
  );
}
