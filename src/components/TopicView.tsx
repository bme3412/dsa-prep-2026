import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DataStructure } from "../types";
import { ComplexityTable } from "./ComplexityTable";
import { PatternCard } from "./PatternCard";
import { ProblemWorkspace } from "./ProblemWorkspace";
import { PatternFirstView } from "./PatternFirstView";

interface TopicViewProps {
  topic: DataStructure;
}

type Tab = "learn" | "patterns" | "practice";

export function TopicView({ topic }: TopicViewProps) {
  // Use pattern-first view for DSA modules
  if (topic.viewMode === "pattern-first") {
    return <PatternFirstView topic={topic} />;
  }
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const [activeProblem, setActiveProblem] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "learn", label: "Concepts" },
    { id: "patterns", label: "Patterns", count: topic.patterns.length },
    { id: "practice", label: "Practice", count: topic.problems.length },
  ];

  const selectedProblem = topic.problems.find((p) => p.id === activeProblem);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="px-12 pt-16 pb-10 border-b border-[var(--color-border)]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-5xl mb-4 block">{topic.icon}</span>
          <h1
            className="text-5xl tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {topic.name}
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            {topic.tagline}
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex gap-1 mt-8 bg-[var(--color-bg-tertiary)] rounded-[var(--radius-md)] p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveProblem(null);
              }}
              className="relative px-5 py-2 text-sm rounded-[var(--radius-sm)] transition-colors"
              style={{
                color:
                  activeTab === tab.id
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
              }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-[var(--color-bg-elevated)] rounded-[var(--radius-sm)]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-[11px] text-[var(--color-text-muted)] bg-[var(--color-bg-primary)] px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "learn" && (
          <motion.div
            key="learn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-12 py-10 max-w-4xl"
          >
            {topic.sections.map((section, i) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="mb-14"
                id={section.id}
              >
                <h2
                  className="text-2xl mb-1 tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-sm text-[var(--color-text-muted)] mb-6">
                    {section.subtitle}
                  </p>
                )}
                <div className="space-y-4">{section.content}</div>
              </motion.section>
            ))}

            <section className="mb-14">
              <h2
                className="text-2xl mb-6 tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Operations & complexity
              </h2>
              <ComplexityTable operations={topic.operations} />
            </section>
          </motion.div>
        )}

        {activeTab === "patterns" && (
          <motion.div
            key="patterns"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-12 py-10 max-w-4xl"
          >
            <div className="space-y-4">
              {topic.patterns.map((pattern, i) => (
                <motion.div
                  key={pattern.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <PatternCard
                    pattern={pattern}
                    onPractice={(problemId) => {
                      setActiveTab("practice");
                      setActiveProblem(problemId);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "practice" && (
          <motion.div
            key="practice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedProblem ? (
              <ProblemWorkspace
                problem={selectedProblem}
                onBack={() => setActiveProblem(null)}
              />
            ) : (
              <div className="px-12 py-10 max-w-4xl">
                <div className="grid gap-3">
                  {topic.problems.map((problem, i) => (
                    <motion.button
                      key={problem.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setActiveProblem(problem.id)}
                      className="w-full text-left px-5 py-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-secondary)] transition-all group"
                    >
                      <div className="flex items-center justify-between">
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
                          <span className="text-sm font-medium">
                            {problem.title}
                          </span>
                        </div>
                        <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors text-sm">
                          →
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1.5 ml-[72px]">
                        {problem.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
