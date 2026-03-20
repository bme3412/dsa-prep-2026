import { useState } from "react";
import { motion } from "framer-motion";

const SORTED_ARRAY = [1, 2, 4, 6, 8, 9, 14, 15];
const TARGET = 13;

export function TwoPointersDemo() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(SORTED_ARRAY.length - 1);
  const [found, setFound] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);

  const currentSum = SORTED_ARRAY[left] + SORTED_ARRAY[right];

  const step = () => {
    if (found || left >= right) return;

    const sum = SORTED_ARRAY[left] + SORTED_ARRAY[right];
    if (sum === TARGET) {
      setFound(true);
      setSteps([
        ...steps,
        `Found! ${SORTED_ARRAY[left]} + ${SORTED_ARRAY[right]} = ${TARGET}`,
      ]);
    } else if (sum < TARGET) {
      setSteps([
        ...steps,
        `${SORTED_ARRAY[left]} + ${SORTED_ARRAY[right]} = ${sum} < ${TARGET}, move left pointer right`,
      ]);
      setLeft(left + 1);
    } else {
      setSteps([
        ...steps,
        `${SORTED_ARRAY[left]} + ${SORTED_ARRAY[right]} = ${sum} > ${TARGET}, move right pointer left`,
      ]);
      setRight(right - 1);
    }
  };

  const reset = () => {
    setLeft(0);
    setRight(SORTED_ARRAY.length - 1);
    setFound(false);
    setSteps([]);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Two pointers: find pair summing to {TARGET}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Sorted array: [{SORTED_ARRAY.join(", ")}]
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={step}
            disabled={found || left >= right}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            style={{
              background: "var(--color-accent)",
              color: "white",
            }}
          >
            Step
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

      {/* Array visualization */}
      <div className="flex gap-2 mb-4">
        {SORTED_ARRAY.map((val, i) => {
          const isLeft = i === left;
          const isRight = i === right;
          const isActive = isLeft || isRight;
          return (
            <motion.div
              key={i}
              className="flex-1 h-14 rounded-[var(--radius-md)] flex flex-col items-center justify-center relative"
              style={{
                background: found && isActive
                  ? "var(--color-green-dim)"
                  : isActive
                  ? "var(--color-accent-glow)"
                  : "var(--color-bg-primary)",
                border: found && isActive
                  ? "2px solid var(--color-green)"
                  : isActive
                  ? "2px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
              }}
              animate={{
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="text-lg font-semibold"
                style={{
                  color: found && isActive
                    ? "var(--color-green)"
                    : isActive
                    ? "var(--color-accent)"
                    : "var(--color-text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {val}
              </span>
              {isLeft && (
                <span
                  className="absolute -bottom-5 text-[10px] font-medium"
                  style={{ color: "var(--color-teal)" }}
                >
                  L
                </span>
              )}
              {isRight && (
                <span
                  className="absolute -bottom-5 text-[10px] font-medium"
                  style={{ color: "var(--color-coral)" }}
                >
                  R
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Current sum display */}
      <div
        className="rounded-[var(--radius-md)] p-3 mb-3"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
          arr[{left}] + arr[{right}] ={" "}
          <span style={{ color: "var(--color-teal)" }}>{SORTED_ARRAY[left]}</span> +{" "}
          <span style={{ color: "var(--color-coral)" }}>{SORTED_ARRAY[right]}</span> ={" "}
          <span
            style={{
              color: found
                ? "var(--color-green)"
                : currentSum < TARGET
                ? "var(--color-amber)"
                : "var(--color-coral)",
              fontWeight: 600,
            }}
          >
            {currentSum}
          </span>
          {" "}
          {found ? "(found!)" : currentSum < TARGET ? "< target" : "> target"}
        </p>
      </div>

      {/* Step log */}
      {steps.length > 0 && (
        <div
          className="rounded-[var(--radius-md)] p-3 max-h-24 overflow-y-auto"
          style={{ background: "var(--color-bg-primary)" }}
        >
          {steps.map((s, i) => (
            <p
              key={i}
              className="text-xs mb-1"
              style={{
                color: i === steps.length - 1
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {i + 1}. {s}
            </p>
          ))}
        </div>
      )}

      {/* Key insight */}
      <div
        className="mt-3 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Because the array is sorted, we know: if sum is too small, moving left pointer
          right increases the sum; if too large, moving right pointer left decreases it.
          O(n) instead of O(n^2).
        </p>
      </div>
    </div>
  );
}
