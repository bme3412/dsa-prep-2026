import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AggregatedProblem } from "../types";
import { PracticeModal } from "./PracticeModal";

interface Props {
  problems: AggregatedProblem[];
}

type DifficultyFilter = "all" | "easy" | "medium" | "hard";

export function PracticeView({ problems }: Props) {
  const [selectedProblem, setSelectedProblem] = useState<AggregatedProblem | null>(null);
  const [topicFilter, setTopicFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");

  // Get unique topics
  const topics = Array.from(new Set(problems.map((p) => p.topic)));

  // Filter problems
  const filteredProblems = problems.filter((p) => {
    const matchesTopic = topicFilter === "all" || p.topic === topicFilter;
    const matchesDifficulty = difficultyFilter === "all" || p.difficulty === difficultyFilter;
    return matchesTopic && matchesDifficulty;
  });

  // Count by difficulty
  const easyCount = problems.filter((p) => p.difficulty === "easy").length;
  const mediumCount = problems.filter((p) => p.difficulty === "medium").length;
  const hardCount = problems.filter((p) => p.difficulty === "hard").length;

  const topicColorMap: Record<string, string> = {
    accent: "var(--color-accent)",
    teal: "var(--color-teal)",
    amber: "var(--color-amber)",
    coral: "var(--color-coral)",
    green: "var(--color-green)",
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[var(--color-border)]">
        <h1 className="text-2xl font-semibold mb-2">Practice Problems</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {problems.length} problems from {topics.length} topics
        </p>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 border-b border-[var(--color-border)] flex flex-wrap items-center gap-4">
        {/* Topic filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Topic:</span>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] outline-none cursor-pointer"
          >
            <option value="all">All Topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--color-text-muted)]">Difficulty:</span>
          <div className="flex gap-1">
            {[
              { value: "all", label: "All", count: problems.length },
              { value: "easy", label: "Easy", count: easyCount },
              { value: "medium", label: "Medium", count: mediumCount },
              { value: "hard", label: "Hard", count: hardCount },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDifficultyFilter(opt.value as DifficultyFilter)}
                className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] transition-all"
                style={{
                  background:
                    difficultyFilter === opt.value
                      ? "var(--color-accent)"
                      : "var(--color-bg-tertiary)",
                  color:
                    difficultyFilter === opt.value
                      ? "white"
                      : "var(--color-text-secondary)",
                }}
              >
                {opt.label} ({opt.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Grid */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProblems.map((problem, index) => (
            <motion.button
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => setSelectedProblem(problem)}
              className="text-left p-5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all group"
              style={{ background: "var(--color-bg-secondary)" }}
            >
              {/* Tags */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded"
                  style={{
                    background: `${topicColorMap[problem.topicColor]}20`,
                    color: topicColorMap[problem.topicColor],
                  }}
                >
                  {problem.topic}
                </span>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full"
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
              </div>

              {/* Title */}
              <h3 className="font-medium mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                {problem.title}
              </h3>

              {/* Description preview */}
              <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                {problem.description}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--color-border)]">
                <span className="text-xs text-[var(--color-text-muted)]">
                  {problem.testCases.length} test cases
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {problem.hints.length} hints
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)]">
              No problems match your filters.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProblem && (
          <PracticeModal
            problem={selectedProblem}
            onClose={() => setSelectedProblem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
