import { useState } from "react";
import { motion } from "framer-motion";
import type { DataStructure, Pattern } from "../types";
import { ComplexityTable } from "./ComplexityTable";
import { ProblemWorkspace } from "./ProblemWorkspace";
import { CodeBlock } from "./CodeBlock";

// Render text with **bold** markdown syntax
const renderWithBold = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

interface Props {
  topic: DataStructure;
}

function PatternSection({ pattern, index }: { pattern: Pattern; index: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-14 pb-10 border-b border-[var(--color-border)] last:border-b-0"
    >
      {/* Pattern header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ background: "var(--color-accent-glow)", color: "var(--color-accent)" }}
          >
            Pattern {index + 1}
          </span>
        </div>
        <h3
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pattern.name}
        </h3>
      </div>

      {/* Conceptual explanation - the main teaching content */}
      <div className="prose prose-sm max-w-none mb-6">
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {pattern.description}
        </p>

        {/* Extended explanation if available */}
        {pattern.explanation && (
          <div className="mt-4 space-y-3">
            {pattern.explanation.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {renderWithBold(paragraph)}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* When to recognize - trigger words */}
      {pattern.triggers && (
        <div
          className="rounded-[var(--radius-md)] p-4 mb-6"
          style={{ background: "var(--color-teal-dim)", borderLeft: "3px solid var(--color-teal)" }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ color: "var(--color-teal)" }}
          >
            Recognize this pattern when you see
          </p>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {pattern.triggers}
          </p>
        </div>
      )}

      {/* Template code */}
      <div className="mb-4">
        <CodeBlock
          code={pattern.code}
          language="python"
          title="Implementation"
        />
      </div>

      {/* Linked problems */}
      {pattern.problems && pattern.problems.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-4">
          <span className="text-xs text-[var(--color-text-muted)]">Related problems:</span>
          {pattern.problems.map((p) => (
            <span
              key={p.id}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}
            >
              {p.title}
            </span>
          ))}
        </div>
      )}
    </motion.section>
  );
}

export function PatternFirstView({ topic }: Props) {
  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [showPractice, setShowPractice] = useState(false);

  const selectedProblem = topic.problems.find((p) => p.id === activeProblem);

  if (selectedProblem) {
    return (
      <ProblemWorkspace
        problem={selectedProblem}
        onBack={() => setActiveProblem(null)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 border-b border-[var(--color-border)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-3xl sm:text-4xl mb-3 block">{topic.icon}</span>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-2 sm:mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {topic.name}
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl">
            {topic.description}
          </p>
        </motion.div>
      </header>

      {/* Main content */}
      <div className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 max-w-4xl">
        {/* Patterns */}
        {topic.patterns.map((pattern, i) => (
          <PatternSection key={pattern.name} pattern={pattern} index={i} />
        ))}

        {/* Complexity table */}
        <section className="mb-12 pt-8">
          <h2
            className="text-xl mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Time & Space Complexity
          </h2>
          <ComplexityTable operations={topic.operations} />
        </section>

        {/* Practice section */}
        <section className="pt-8 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Practice Problems
            </h2>
            <button
              onClick={() => setShowPractice(!showPractice)}
              className="text-sm px-4 py-2 rounded-[var(--radius-md)] transition-colors"
              style={{
                background: showPractice ? "var(--color-accent)" : "var(--color-bg-tertiary)",
                color: showPractice ? "white" : "var(--color-text-secondary)",
              }}
            >
              {showPractice ? "Hide Problems" : "Show Problems"}
            </button>
          </div>

          {showPractice && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-3"
            >
              {topic.problems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => setActiveProblem(problem.id)}
                  className="w-full text-left px-5 py-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background:
                          problem.difficulty === "easy"
                            ? "var(--color-green-dim)"
                            : problem.difficulty === "medium"
                            ? "var(--color-amber-dim)"
                            : "var(--color-coral-dim)",
                        color:
                          problem.difficulty === "easy"
                            ? "var(--color-green)"
                            : problem.difficulty === "medium"
                            ? "var(--color-amber)"
                            : "var(--color-coral)",
                      }}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="text-sm font-medium">{problem.title}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1.5 ml-[72px]">
                    {problem.description}
                  </p>
                </button>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
