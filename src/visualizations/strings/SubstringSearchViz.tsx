import { useState } from "react";
import { motion } from "framer-motion";

export function SubstringSearchViz() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABC");
  const [textIdx, setTextIdx] = useState(0);
  const [patternIdx, setPatternIdx] = useState(0);
  const [foundAt, setFoundAt] = useState<number | null>(null);
  const [, setIsSearching] = useState(false);

  const reset = () => {
    setTextIdx(0);
    setPatternIdx(0);
    setFoundAt(null);
    setIsSearching(false);
  };

  const step = () => {
    if (foundAt !== null) return;
    setIsSearching(true);

    if (textIdx > text.length - pattern.length) {
      setFoundAt(-1); // Not found
      return;
    }

    if (text[textIdx + patternIdx] === pattern[patternIdx]) {
      if (patternIdx === pattern.length - 1) {
        setFoundAt(textIdx);
      } else {
        setPatternIdx(patternIdx + 1);
      }
    } else {
      setTextIdx(textIdx + 1);
      setPatternIdx(0);
    }
  };

  const findAll = () => {
    for (let i = 0; i <= text.length - pattern.length; i++) {
      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        setTextIdx(i);
        setPatternIdx(pattern.length - 1);
        setFoundAt(i);
        return;
      }
    }
    setFoundAt(-1);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Naive substring search — O(n × m)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={step}
            disabled={foundAt !== null}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 transition-all"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Step
          </button>
          <button
            onClick={findAll}
            disabled={foundAt !== null}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] disabled:opacity-30 transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Find
          </button>
          <button
            onClick={reset}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Input fields */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="text-[11px] text-[var(--color-text-muted)] mb-1 block">
            Text
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => { setText(e.target.value.toUpperCase()); reset(); }}
            className="w-full px-3 py-1.5 text-xs rounded-[var(--radius-md)] outline-none"
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-mono)",
            }}
          />
        </div>
        <div style={{ width: 120 }}>
          <label className="text-[11px] text-[var(--color-text-muted)] mb-1 block">
            Pattern
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => { setPattern(e.target.value.toUpperCase()); reset(); }}
            className="w-full px-3 py-1.5 text-xs rounded-[var(--radius-md)] outline-none"
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-mono)",
            }}
          />
        </div>
      </div>

      {/* Text visualization */}
      <div className="mb-3">
        <p className="text-[11px] text-[var(--color-text-muted)] mb-2">Text</p>
        <div className="flex gap-0.5 flex-wrap">
          {text.split("").map((char, i) => {
            const inWindow = i >= textIdx && i < textIdx + pattern.length;
            const isComparing = inWindow && i === textIdx + patternIdx;
            const isMatched = foundAt !== null && foundAt >= 0 && i >= foundAt && i < foundAt + pattern.length;

            return (
              <motion.div
                key={i}
                className="w-6 h-7 rounded-sm flex items-center justify-center"
                style={{
                  background: isMatched
                    ? "var(--color-green)"
                    : isComparing
                    ? "var(--color-amber)"
                    : inWindow
                    ? "var(--color-accent-glow)"
                    : "var(--color-bg-primary)",
                  border: inWindow && !isMatched
                    ? "1px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                }}
              >
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isMatched
                      ? "white"
                      : isComparing
                      ? "var(--color-amber)"
                      : "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {char}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Pattern visualization */}
      <div className="mb-4">
        <p className="text-[11px] text-[var(--color-text-muted)] mb-2">Pattern</p>
        <div className="flex gap-0.5" style={{ marginLeft: textIdx * 26 }}>
          {pattern.split("").map((char, i) => {
            const isComparing = i === patternIdx;
            const isMatched = foundAt !== null && foundAt >= 0;

            return (
              <motion.div
                key={i}
                layout
                className="w-6 h-7 rounded-sm flex items-center justify-center"
                style={{
                  background: isMatched
                    ? "var(--color-green)"
                    : isComparing
                    ? "var(--color-amber)"
                    : "var(--color-teal-dim)",
                  border: isMatched
                    ? "none"
                    : "1px solid var(--color-teal)",
                }}
              >
                <span
                  className="text-xs font-medium"
                  style={{
                    color: isMatched ? "white" : "var(--color-teal)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {char}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {foundAt !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[var(--radius-md)] p-3"
          style={{
            background: foundAt >= 0 ? "var(--color-green-dim)" : "var(--color-coral-dim)",
          }}
        >
          <p
            className="text-xs"
            style={{ color: foundAt >= 0 ? "var(--color-green)" : "var(--color-coral)" }}
          >
            {foundAt >= 0
              ? `Pattern found at index ${foundAt}`
              : "Pattern not found"}
          </p>
        </motion.div>
      )}

      {/* Key insight */}
      <div
        className="mt-3 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-amber-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-amber)" }}>Note:</strong>{" "}
          Naive search is O(n×m). KMP and Rabin-Karp achieve O(n+m) by avoiding
          redundant comparisons. For interviews, Python's <code style={{ fontFamily: "var(--font-mono)" }}>in</code> operator
          or <code style={{ fontFamily: "var(--font-mono)" }}>str.find()</code> are usually sufficient.
        </p>
      </div>
    </div>
  );
}
