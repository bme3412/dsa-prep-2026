import { useState } from "react";
import { motion } from "framer-motion";

const SAMPLE_ARRAY = [2, 1, 5, 1, 3, 2];
const WINDOW_SIZE = 3;

export function SlidingWindowDemo() {
  const [windowStart, setWindowStart] = useState(0);
  const maxStart = SAMPLE_ARRAY.length - WINDOW_SIZE;

  const windowSum = SAMPLE_ARRAY.slice(windowStart, windowStart + WINDOW_SIZE).reduce(
    (a, b) => a + b,
    0
  );

  const slide = (direction: "left" | "right") => {
    if (direction === "left" && windowStart > 0) {
      setWindowStart(windowStart - 1);
    } else if (direction === "right" && windowStart < maxStart) {
      setWindowStart(windowStart + 1);
    }
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Fixed-size sliding window (k={WINDOW_SIZE})
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => slide("left")}
            disabled={windowStart === 0}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Slide left
          </button>
          <button
            onClick={() => slide("right")}
            disabled={windowStart === maxStart}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Slide right
          </button>
          <button
            onClick={() => setWindowStart(0)}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] transition-all"
            style={{
              background: "var(--color-accent)",
              color: "white",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Array visualization */}
      <div className="flex gap-2 mb-4">
        {SAMPLE_ARRAY.map((val, i) => {
          const inWindow = i >= windowStart && i < windowStart + WINDOW_SIZE;
          return (
            <motion.div
              key={i}
              className="flex-1 h-14 rounded-[var(--radius-md)] flex flex-col items-center justify-center"
              style={{
                background: inWindow
                  ? "var(--color-accent-glow)"
                  : "var(--color-bg-primary)",
                border: inWindow
                  ? "2px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
              }}
              animate={{
                scale: inWindow ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="text-lg font-semibold"
                style={{
                  color: inWindow
                    ? "var(--color-accent)"
                    : "var(--color-text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {val}
              </span>
              <span
                className="text-[10px] mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                i={i}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Window info */}
      <div
        className="rounded-[var(--radius-md)] p-3 flex items-center justify-between"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">
            Window range
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            [{windowStart}, {windowStart + WINDOW_SIZE - 1}]
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">
            Window elements
          </p>
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            [{SAMPLE_ARRAY.slice(windowStart, windowStart + WINDOW_SIZE).join(", ")}]
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">
            Window sum
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-teal)", fontFamily: "var(--font-mono)" }}
          >
            {windowSum}
          </p>
        </div>
      </div>

      {/* Sliding window insight */}
      <div
        className="mt-3 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Instead of recalculating the sum from scratch each slide (O(k)), we can
          subtract the outgoing element and add the incoming element (O(1)).
        </p>
      </div>
    </div>
  );
}
