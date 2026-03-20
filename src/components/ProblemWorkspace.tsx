import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { Problem } from "../types";

interface Props {
  problem: Problem;
  onBack: () => void;
}

export function ProblemWorkspace({ problem, onBack }: Props) {
  const [code, setCode] = useState(problem.starterCode);
  const [results, setResults] = useState<
    { passed: boolean; input: string; expected: string; got: string; desc?: string }[]
  >([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(problem.starterCode);
    setResults([]);
    setShowSolution(false);
    setShowHints(false);
    setHintIndex(0);
  }, [problem.id]);

  const runTests = useCallback(() => {
    // Note: This is a simplified test runner that evaluates JS/TS.
    // For Python problems, you'd integrate Pyodide or a backend.
    // For now, test cases are validated as string comparisons.
    const newResults = problem.testCases.map((tc) => {
      try {
        // Create a function from the code and call it
        const fn = new Function(
          `${code}\n\nreturn JSON.stringify(${tc.input});`
        );
        const got = fn();
        const passed = got === tc.expected;
        return {
          passed,
          input: tc.input,
          expected: tc.expected,
          got: got || "undefined",
          desc: tc.description,
        };
      } catch (err: unknown) {
        return {
          passed: false,
          input: tc.input,
          expected: tc.expected,
          got: `Error: ${err instanceof Error ? err.message : String(err)}`,
          desc: tc.description,
        };
      }
    });
    setResults(newResults);
  }, [code, problem.testCases]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = code.substring(0, start) + "  " + code.substring(end);
        setCode(newCode);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    }
  };

  const passedCount = results.filter((r) => r.passed).length;

  return (
    <div className="flex h-[calc(100vh-1px)]">
      {/* Left: Problem description */}
      <div className="w-[420px] border-r border-[var(--color-border)] overflow-y-auto">
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <button
            onClick={onBack}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] mb-3 transition-colors"
          >
            ← All problems
          </button>
          <div className="flex items-center gap-3 mb-2">
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
            <h2 className="text-lg font-medium">{problem.title}</h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {problem.description}
          </p>
        </div>

        {/* Examples */}
        <div className="px-6 py-4">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            Examples
          </p>
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="mb-4 rounded-[var(--radius-md)] p-3"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs text-[var(--color-text-muted)] mb-1">
                Input
              </p>
              <pre
                className="text-xs mb-2"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-text-primary)",
                }}
              >
                {ex.input}
              </pre>
              <p className="text-xs text-[var(--color-text-muted)] mb-1">
                Output
              </p>
              <pre
                className="text-xs"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-teal)",
                }}
              >
                {ex.output}
              </pre>
              {ex.explanation && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-2 italic">
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Hints */}
        <div className="px-6 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-xs text-[var(--color-accent)] hover:underline"
          >
            {showHints ? "Hide hints" : `Show hints (${problem.hints.length})`}
          </button>
          {showHints && (
            <div className="mt-3 space-y-2">
              {problem.hints.slice(0, hintIndex + 1).map((hint, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-[var(--color-text-secondary)] p-2 rounded"
                  style={{ background: "var(--color-accent-glow)" }}
                >
                  💡 {hint}
                </motion.div>
              ))}
              {hintIndex < problem.hints.length - 1 && (
                <button
                  onClick={() => setHintIndex(hintIndex + 1)}
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                >
                  Show next hint →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Code editor + results */}
      <div className="flex-1 flex flex-col">
        {/* Editor toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
          <div className="flex items-center gap-4">
            <span
              className="text-xs text-[var(--color-text-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              solution.js
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-all"
            >
              {showSolution ? "Hide solution" : "Show solution"}
            </button>
            <button
              onClick={() => {
                setCode(problem.starterCode);
                setResults([]);
              }}
              className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-all"
            >
              Reset
            </button>
            <button
              onClick={runTests}
              className="text-xs px-4 py-1.5 rounded-[var(--radius-sm)] font-medium transition-all"
              style={{
                background: "var(--color-accent)",
                color: "white",
              }}
            >
              Run tests ⌘↵
            </button>
          </div>
        </div>

        {/* Code area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full h-full resize-none p-5 outline-none text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                tabSize: 2,
              }}
            />
          </div>

          {/* Solution panel */}
          {showSolution && (
            <div className="border-t border-[var(--color-border)]">
              <div className="px-5 py-2 bg-[var(--color-bg-tertiary)]">
                <p className="text-xs text-[var(--color-text-muted)]">
                  Solution
                </p>
              </div>
              <pre
                className="p-5 text-xs leading-relaxed overflow-auto max-h-[300px]"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-primary)",
                }}
              >
                {problem.solution}
              </pre>
            </div>
          )}

          {/* Test results */}
          {results.length > 0 && (
            <div className="border-t border-[var(--color-border)] max-h-[250px] overflow-y-auto">
              <div
                className="px-5 py-2 flex items-center gap-3"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <span className="text-xs font-medium">Test results</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background:
                      passedCount === results.length
                        ? "var(--color-green-dim)"
                        : "var(--color-coral-dim)",
                    color:
                      passedCount === results.length
                        ? "var(--color-green)"
                        : "var(--color-coral)",
                  }}
                >
                  {passedCount}/{results.length} passed
                </span>
              </div>
              <div className="divide-y divide-[var(--color-border)]">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 flex items-start gap-3"
                    style={{ background: "var(--color-bg-secondary)" }}
                  >
                    <span className="text-sm mt-0.5">
                      {r.passed ? "✓" : "✗"}
                    </span>
                    <div className="flex-1 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                      {r.desc && (
                        <p className="text-[var(--color-text-muted)] mb-1" style={{ fontFamily: "var(--font-body)" }}>
                          {r.desc}
                        </p>
                      )}
                      <p className="text-[var(--color-text-secondary)]">
                        Input: {r.input}
                      </p>
                      <p style={{ color: "var(--color-teal)" }}>
                        Expected: {r.expected}
                      </p>
                      {!r.passed && (
                        <p style={{ color: "var(--color-coral)" }}>
                          Got: {r.got}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
