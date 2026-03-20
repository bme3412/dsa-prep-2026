import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Pattern } from "../types";

interface Props {
  pattern: Pattern;
  onPractice: (problemId: string) => void;
}

const tagColors: Record<string, { bg: string; text: string }> = {
  accent: { bg: "var(--color-accent-glow)", text: "var(--color-accent)" },
  teal: { bg: "var(--color-teal-dim)", text: "var(--color-teal)" },
  amber: { bg: "var(--color-amber-dim)", text: "var(--color-amber)" },
  coral: { bg: "var(--color-coral-dim)", text: "var(--color-coral)" },
  green: { bg: "var(--color-green-dim)", text: "var(--color-green)" },
};

export function PatternCard({ pattern, onPractice }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const colors = pattern.tagColor ? tagColors[pattern.tagColor] : tagColors.accent;

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden transition-colors"
      style={{
        background: isOpen
          ? "var(--color-bg-secondary)"
          : "var(--color-bg-primary)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{pattern.name}</span>
          <span
            className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
            style={{ background: colors.bg, color: colors.text }}
          >
            {pattern.tag}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--color-text-muted)] text-xs"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-[var(--color-border)]">
              <p className="text-sm text-[var(--color-text-secondary)] mt-4 mb-4">
                {pattern.description}
              </p>

              {/* Code block */}
              <pre
                className="text-xs leading-relaxed p-4 rounded-[var(--radius-md)] overflow-x-auto mb-4"
                style={{
                  background: "var(--color-bg-primary)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-text-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {pattern.code}
              </pre>

              {/* Investment parallel */}
              <div
                className="rounded-[var(--radius-md)] px-4 py-3 mb-4"
                style={{ background: "var(--color-amber-dim)" }}
              >
                <p
                  className="text-[11px] font-medium mb-1 uppercase tracking-wider"
                  style={{ color: "var(--color-amber)" }}
                >
                  Investment parallel
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {pattern.investmentParallel}
                </p>
              </div>

              {/* Practice problems linked to this pattern */}
              {pattern.problems && pattern.problems.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--color-text-muted)] mb-2">
                    Practice problems
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pattern.problems?.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => onPractice(problem.id)}
                        className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-tertiary)] transition-all"
                      >
                        {problem.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
