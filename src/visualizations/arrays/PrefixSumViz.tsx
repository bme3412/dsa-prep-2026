import { useState } from "react";
import { motion } from "framer-motion";

const SAMPLE_ARRAY = [3, 1, 4, 1, 5, 9, 2, 6];

function buildPrefixSum(arr: number[]): number[] {
  const prefix = [0];
  for (let i = 0; i < arr.length; i++) {
    prefix.push(prefix[i] + arr[i]);
  }
  return prefix;
}

export function PrefixSumViz() {
  const [rangeStart, setRangeStart] = useState(2);
  const [rangeEnd, setRangeEnd] = useState(5);
  const prefixSum = buildPrefixSum(SAMPLE_ARRAY);

  const rangeSum = prefixSum[rangeEnd + 1] - prefixSum[rangeStart];

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Prefix sum array - O(1) range queries
        </p>
        <div className="flex items-center gap-3">
          <label className="text-xs text-[var(--color-text-muted)]">
            Range:
            <select
              value={rangeStart}
              onChange={(e) => setRangeStart(Number(e.target.value))}
              className="ml-2 px-2 py-1 text-xs rounded border"
              style={{
                background: "var(--color-bg-primary)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            >
              {SAMPLE_ARRAY.map((_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </label>
          <span className="text-xs text-[var(--color-text-muted)]">to</span>
          <select
            value={rangeEnd}
            onChange={(e) => setRangeEnd(Number(e.target.value))}
            className="px-2 py-1 text-xs rounded border"
            style={{
              background: "var(--color-bg-primary)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            {SAMPLE_ARRAY.map((_, i) => (
              <option key={i} value={i} disabled={i < rangeStart}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Original array */}
      <div className="mb-3">
        <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
          Original array
        </p>
        <div className="flex gap-1.5">
          {SAMPLE_ARRAY.map((val, i) => {
            const inRange = i >= rangeStart && i <= rangeEnd;
            return (
              <motion.div
                key={i}
                className="flex-1 h-12 rounded-[var(--radius-sm)] flex flex-col items-center justify-center"
                style={{
                  background: inRange
                    ? "var(--color-accent-glow)"
                    : "var(--color-bg-primary)",
                  border: inRange
                    ? "2px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                }}
                animate={{ scale: inRange ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: inRange
                      ? "var(--color-accent)"
                      : "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {val}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  [{i}]
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Prefix sum array */}
      <div className="mb-4">
        <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
          Prefix sum array (cumulative sums)
        </p>
        <div className="flex gap-1.5">
          {prefixSum.map((val, i) => {
            const isStart = i === rangeStart;
            const isEnd = i === rangeEnd + 1;
            return (
              <motion.div
                key={i}
                className="flex-1 h-12 rounded-[var(--radius-sm)] flex flex-col items-center justify-center"
                style={{
                  background: isStart
                    ? "var(--color-coral-dim)"
                    : isEnd
                    ? "var(--color-green-dim)"
                    : "var(--color-bg-primary)",
                  border: isStart
                    ? "2px solid var(--color-coral)"
                    : isEnd
                    ? "2px solid var(--color-green)"
                    : "1px solid var(--color-border)",
                }}
                animate={{ scale: isStart || isEnd ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: isStart
                      ? "var(--color-coral)"
                      : isEnd
                      ? "var(--color-green)"
                      : "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {val}
                </span>
                <span
                  className="text-[9px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  p[{i}]
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Calculation display */}
      <div
        className="rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <p className="text-xs text-[var(--color-text-muted)] mb-2">
          Range sum formula: prefix[end+1] - prefix[start]
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          sum([{rangeStart}:{rangeEnd}]) = p[{rangeEnd + 1}] - p[{rangeStart}] ={" "}
          <span style={{ color: "var(--color-green)" }}>{prefixSum[rangeEnd + 1]}</span> -{" "}
          <span style={{ color: "var(--color-coral)" }}>{prefixSum[rangeStart]}</span> ={" "}
          <span style={{ color: "var(--color-teal)", fontWeight: 600 }}>{rangeSum}</span>
        </p>
      </div>

      {/* Key insight */}
      <div
        className="mt-3 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Build prefix sum in O(n) once. Then answer any range sum query in O(1).
          Essential for subarray problems and rolling calculations.
        </p>
      </div>
    </div>
  );
}
