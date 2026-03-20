import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AggregatedProblem } from "../types";
import { loadPyodide } from "pyodide";
import type { PyodideInterface } from "pyodide";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle, indentUnit } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import confetti from "canvas-confetti";

interface Props {
  problem: AggregatedProblem;
  onClose: () => void;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  got: string;
  desc?: string;
}

interface ProblemStats {
  totalTime: number; // in seconds
  attempts: number;
  completedAt?: number;
  bestTime?: number;
}

// LocalStorage key prefix
const STATS_KEY_PREFIX = "dsa-studio-problem-stats-";

function getStats(problemId: string): ProblemStats {
  const stored = localStorage.getItem(STATS_KEY_PREFIX + problemId);
  if (stored) {
    return JSON.parse(stored);
  }
  return { totalTime: 0, attempts: 0 };
}

function saveStats(problemId: string, stats: ProblemStats) {
  localStorage.setItem(STATS_KEY_PREFIX + problemId, JSON.stringify(stats));
}

// Singleton Pyodide instance
let pyodideInstance: PyodideInterface | null = null;
let pyodideLoading: Promise<PyodideInterface> | null = null;

async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) return pyodideLoading;

  pyodideLoading = loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/",
  });

  pyodideInstance = await pyodideLoading;
  return pyodideInstance;
}

// Custom dark theme for CodeMirror
const customTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--color-bg-primary)",
    color: "var(--color-text-primary)",
    fontSize: "14px",
    height: "100%",
  },
  ".cm-content": {
    fontFamily: "var(--font-mono)",
    padding: "16px 0",
    caretColor: "var(--color-accent)",
  },
  ".cm-line": {
    padding: "0 16px",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-bg-secondary)",
    color: "var(--color-text-muted)",
    border: "none",
    paddingRight: "8px",
  },
  ".cm-gutter.cm-lineNumbers": {
    minWidth: "48px",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--color-bg-tertiary)",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-accent)",
    borderLeftWidth: "2px",
  },
  ".cm-selectionBackground": {
    backgroundColor: "rgba(99, 102, 241, 0.3) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(99, 102, 241, 0.3) !important",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "var(--font-mono)",
    lineHeight: "1.6",
  },
}, { dark: true });

// Custom syntax highlighting
const customHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: "#c678dd" },
  { tag: tags.operator, color: "#56b6c2" },
  { tag: tags.special(tags.variableName), color: "#e06c75" },
  { tag: tags.typeName, color: "#e5c07b" },
  { tag: tags.atom, color: "#d19a66" },
  { tag: tags.number, color: "#d19a66" },
  { tag: tags.definition(tags.variableName), color: "#61afef" },
  { tag: tags.string, color: "#98c379" },
  { tag: tags.special(tags.string), color: "#98c379" },
  { tag: tags.comment, color: "#5c6370", fontStyle: "italic" },
  { tag: tags.variableName, color: "#e06c75" },
  { tag: tags.function(tags.variableName), color: "#61afef" },
  { tag: tags.bool, color: "#d19a66" },
  { tag: tags.null, color: "#d19a66" },
  { tag: tags.className, color: "#e5c07b" },
  { tag: tags.propertyName, color: "#e06c75" },
  { tag: tags.self, color: "#e06c75", fontStyle: "italic" },
]);

// Format seconds to MM:SS
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Trigger confetti celebration
function triggerCelebration() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ["#6366f1", "#22d3ee", "#10b981", "#f59e0b", "#ef4444"];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: colors,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  // Big burst in the middle
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
    });
  }, 300);
}

export function PracticeModal({ problem, onClose }: Props) {
  const [code, setCode] = useState(problem.starterCode);
  const [results, setResults] = useState<TestResult[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(!!pyodideInstance);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [stats, setStats] = useState<ProblemStats>(() => getStats(problem.id));

  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Initialize Pyodide on mount
  useEffect(() => {
    if (!pyodideInstance) {
      getPyodide().then(() => setPyodideReady(true));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    startTimeRef.current = Date.now();

    timerRef.current = window.setInterval(() => {
      if (!isCompleted) {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Save cumulative time on unmount
      const sessionTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const currentStats = getStats(problem.id);
      saveStats(problem.id, {
        ...currentStats,
        totalTime: currentStats.totalTime + sessionTime,
      });
    };
  }, [problem.id, isCompleted]);

  // Initialize CodeMirror editor
  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        setCode(update.state.doc.toString());
      }
    });

    const state = EditorState.create({
      doc: problem.starterCode,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        python(),
        keymap.of([indentWithTab]),
        customTheme,
        syntaxHighlighting(customHighlightStyle),
        updateListener,
        EditorState.tabSize.of(4),
        indentUnit.of("    "),
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    editorViewRef.current = view;

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, []);

  // Update editor content when problem changes
  useEffect(() => {
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      if (currentContent !== problem.starterCode) {
        editorViewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: problem.starterCode,
          },
        });
      }
    }
    setCode(problem.starterCode);
    setResults([]);
    setShowSolution(false);
    setShowHints(false);
    setHintIndex(0);
    setIsCompleted(false);
    setElapsedTime(0);
    startTimeRef.current = Date.now();
    setStats(getStats(problem.id));
  }, [problem.id, problem.starterCode]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Handle Cmd+Enter to run tests
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        runTests();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, problem.testCases, pyodideReady]);

  const runTests = useCallback(async () => {
    if (!pyodideReady || isRunning) return;

    setIsRunning(true);
    const pyodide = await getPyodide();

    const newResults: TestResult[] = [];

    for (const tc of problem.testCases) {
      try {
        // Run the user's code and then evaluate the test case
        const fullCode = `${code}\n\nimport json\nresult = ${tc.input}\njson.dumps(result)`;
        const got = await pyodide.runPythonAsync(fullCode);
        const passed = got === tc.expected;
        newResults.push({
          passed,
          input: tc.input,
          expected: tc.expected,
          got: got || "None",
          desc: tc.description,
        });
      } catch (err: unknown) {
        newResults.push({
          passed: false,
          input: tc.input,
          expected: tc.expected,
          got: `Error: ${err instanceof Error ? err.message : String(err)}`,
          desc: tc.description,
        });
      }
    }

    setResults(newResults);
    setIsRunning(false);

    // Check if all tests passed
    const allPassed = newResults.every((r) => r.passed);
    if (allPassed && newResults.length > 0) {
      setIsCompleted(true);
      setShowSuccessOverlay(true);
      triggerCelebration();

      // Update stats
      const currentStats = getStats(problem.id);
      const newStats: ProblemStats = {
        ...currentStats,
        attempts: currentStats.attempts + 1,
        completedAt: Date.now(),
        bestTime: currentStats.bestTime
          ? Math.min(currentStats.bestTime, elapsedTime)
          : elapsedTime,
      };
      saveStats(problem.id, newStats);
      setStats(newStats);

      // Hide success overlay after a few seconds
      setTimeout(() => setShowSuccessOverlay(false), 4000);
    } else {
      // Increment attempts even on failure
      const currentStats = getStats(problem.id);
      saveStats(problem.id, {
        ...currentStats,
        attempts: currentStats.attempts + 1,
      });
    }
  }, [code, problem.testCases, problem.id, pyodideReady, isRunning, elapsedTime]);

  const resetCode = useCallback(() => {
    if (editorViewRef.current) {
      const currentContent = editorViewRef.current.state.doc.toString();
      editorViewRef.current.dispatch({
        changes: {
          from: 0,
          to: currentContent.length,
          insert: problem.starterCode,
        },
      });
    }
    setCode(problem.starterCode);
    setResults([]);
    setIsCompleted(false);
  }, [problem.starterCode]);

  const passedCount = results.filter((r) => r.passed).length;

  const topicColorMap: Record<string, string> = {
    accent: "var(--color-accent)",
    teal: "var(--color-teal)",
    amber: "var(--color-amber)",
    coral: "var(--color-coral)",
    green: "var(--color-green)",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-[var(--color-bg-secondary)] border border-[var(--color-green)] rounded-2xl p-8 shadow-2xl text-center"
              style={{ boxShadow: "0 0 60px rgba(16, 185, 129, 0.3)" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-[var(--color-green)] mb-2"
              >
                All Tests Passed!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[var(--color-text-secondary)] mb-4"
              >
                Completed in {formatTime(elapsedTime)}
              </motion.p>
              {stats.bestTime && stats.bestTime < elapsedTime && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-[var(--color-text-muted)]"
                >
                  Best time: {formatTime(stats.bestTime)}
                </motion.p>
              )}
              {stats.bestTime && elapsedTime <= stats.bestTime && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-[var(--color-amber)] font-medium"
                >
                  ⚡ New best time!
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-[95vw] h-[90vh] max-w-7xl rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "var(--color-bg-primary)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-all"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        <div className="flex h-full">
          {/* Left: Problem description */}
          <div className="w-[380px] border-r border-[var(--color-border)] overflow-y-auto flex-shrink-0">
            <div className="px-6 py-5 border-b border-[var(--color-border)]">
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
                {isCompleted && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-[var(--color-green-dim)] text-[var(--color-green)]">
                    ✓ Solved
                  </span>
                )}
              </div>
              <h2 className="text-lg font-medium mb-2">{problem.title}</h2>
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
                      {hint}
                    </motion.div>
                  ))}
                  {hintIndex < problem.hints.length - 1 && (
                    <button
                      onClick={() => setHintIndex(hintIndex + 1)}
                      className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                    >
                      Show next hint
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="px-6 py-4 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Your Stats
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3" style={{ background: "var(--color-bg-tertiary)" }}>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Total Time</p>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {formatTime(stats.totalTime + elapsedTime)}
                  </p>
                </div>
                <div className="rounded-lg p-3" style={{ background: "var(--color-bg-tertiary)" }}>
                  <p className="text-xs text-[var(--color-text-muted)] mb-1">Attempts</p>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-mono)" }}>
                    {stats.attempts}
                  </p>
                </div>
                {stats.bestTime && (
                  <div className="rounded-lg p-3 col-span-2" style={{ background: "var(--color-bg-tertiary)" }}>
                    <p className="text-xs text-[var(--color-text-muted)] mb-1">Best Time</p>
                    <p className="text-sm font-medium text-[var(--color-green)]" style={{ fontFamily: "var(--font-mono)" }}>
                      {formatTime(stats.bestTime)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Code editor + solution side by side + results */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span
                  className="text-xs text-[var(--color-text-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  solution.py
                </span>
                {!pyodideReady && (
                  <span className="text-xs text-[var(--color-amber)] flex items-center gap-1">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading Python...
                  </span>
                )}
                {pyodideReady && (
                  <span className="text-xs text-[var(--color-green)]">Python ready</span>
                )}
                {/* Timer */}
                <div className="flex items-center gap-2 ml-4 px-3 py-1 rounded-md" style={{ background: "var(--color-bg-tertiary)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-text-muted)]">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span
                    className={`text-xs font-medium ${isCompleted ? "text-[var(--color-green)]" : "text-[var(--color-text-primary)]"}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {formatTime(elapsedTime)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className={`text-xs px-3 py-1.5 rounded-[var(--radius-sm)] border transition-all ${
                    showSolution
                      ? "border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                      : "border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                  }`}
                >
                  {showSolution ? "Hide solution" : "Show solution"}
                </button>
                <button
                  onClick={resetCode}
                  className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={runTests}
                  disabled={!pyodideReady || isRunning}
                  className="text-xs px-4 py-1.5 rounded-[var(--radius-sm)] font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                  style={{
                    background: isCompleted ? "var(--color-green)" : "var(--color-accent)",
                    color: "white",
                  }}
                >
                  {isRunning && (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isRunning ? "Running..." : isCompleted ? "Run again" : "Run tests"}
                  <span className="text-[10px] opacity-70">⌘↵</span>
                </button>
              </div>
            </div>

            {/* Code area - side by side with solution */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 flex min-h-0">
                {/* Code editor */}
                <div
                  className={`flex-1 overflow-hidden flex flex-col ${showSolution ? "border-r border-[var(--color-border)]" : ""}`}
                >
                  <div
                    ref={editorRef}
                    className="flex-1 overflow-auto"
                    style={{ minHeight: 0 }}
                  />
                </div>

                {/* Solution panel - side by side */}
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "50%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col overflow-hidden"
                      style={{ background: "var(--color-bg-secondary)" }}
                    >
                      <div className="px-4 py-2 bg-[var(--color-bg-tertiary)] flex items-center justify-between border-b border-[var(--color-border)]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--color-text-muted)]">Reference Solution</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-accent-glow)] text-[var(--color-accent)]">
                            Read only
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(problem.solution);
                          }}
                          className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] flex items-center gap-1"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <pre
                        className="flex-1 p-4 text-sm leading-relaxed overflow-auto"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {problem.solution}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Test results */}
              {results.length > 0 && (
                <div className="border-t border-[var(--color-border)] max-h-[200px] overflow-y-auto flex-shrink-0">
                  <div
                    className="px-5 py-2 flex items-center gap-3 sticky top-0"
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
                        <span
                          className="text-sm mt-0.5"
                          style={{
                            color: r.passed
                              ? "var(--color-green)"
                              : "var(--color-coral)",
                          }}
                        >
                          {r.passed ? "✓" : "✗"}
                        </span>
                        <div
                          className="flex-1 text-xs"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {r.desc && (
                            <p
                              className="text-[var(--color-text-muted)] mb-1"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
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
      </motion.div>
    </motion.div>
  );
}
