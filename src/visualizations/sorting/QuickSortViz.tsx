import { useState } from "react";
import { motion } from "framer-motion";

const INITIAL_ARRAY = [50, 23, 9, 18, 61, 32];

interface Step {
  array: number[];
  pivot: number;
  left: number;
  right: number;
  partitioned: number[];
  description: string;
}

function generateQuickSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const arrayCopy = [...arr];
  const partitioned: number[] = [];

  function partition(low: number, high: number): number {
    const pivot = arrayCopy[high];
    let i = low - 1;

    steps.push({
      array: [...arrayCopy],
      pivot: high,
      left: low,
      right: high,
      partitioned: [...partitioned],
      description: `Pivot: ${pivot}. Partition [${low}..${high}]`,
    });

    for (let j = low; j < high; j++) {
      if (arrayCopy[j] < pivot) {
        i++;
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
      }
    }
    [arrayCopy[i + 1], arrayCopy[high]] = [arrayCopy[high], arrayCopy[i + 1]];

    partitioned.push(i + 1);
    steps.push({
      array: [...arrayCopy],
      pivot: i + 1,
      left: low,
      right: high,
      partitioned: [...partitioned],
      description: `Pivot ${pivot} placed at index ${i + 1}`,
    });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      partitioned.push(low);
    }
  }

  quickSort(0, arr.length - 1);
  return steps;
}

export function QuickSortViz() {
  const [stepIndex, setStepIndex] = useState(-1);
  const steps = generateQuickSteps([...INITIAL_ARRAY]);

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null;
  const displayArray = currentStep ? currentStep.array : INITIAL_ARRAY;

  const reset = () => setStepIndex(-1);
  const next = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  };

  const isComplete = stepIndex === steps.length - 1;

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Quick Sort — O(n log n) average
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Pick pivot, partition around it, recurse
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={next}
            disabled={isComplete}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 transition-all"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            {stepIndex < 0 ? "Start" : "Next"}
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
      <div className="flex gap-2 items-end justify-center" style={{ height: 130 }}>
        {displayArray.map((val, i) => {
          const isPivot = currentStep?.pivot === i;
          const isPartitioned = currentStep?.partitioned.includes(i) || isComplete;
          const inRange =
            currentStep && i >= currentStep.left && i <= currentStep.right;

          return (
            <motion.div
              key={i}
              layout
              className="flex flex-col items-center"
              style={{ width: 45 }}
            >
              <motion.div
                className="w-full rounded-t-[var(--radius-sm)] flex items-end justify-center pb-1"
                style={{
                  height: val * 1.8,
                  background: isComplete
                    ? "var(--color-green)"
                    : isPartitioned
                    ? "var(--color-green)"
                    : isPivot
                    ? "var(--color-coral)"
                    : inRange
                    ? "var(--color-accent)"
                    : "var(--color-bg-tertiary)",
                  border:
                    !isComplete && !isPartitioned && !isPivot && !inRange
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
                animate={{ scale: isPivot ? 1.08 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{
                    color:
                      isComplete || isPartitioned || isPivot || inRange
                        ? "white"
                        : "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {val}
                </span>
              </motion.div>
              {isPivot && (
                <span
                  className="text-[10px] mt-1 font-medium"
                  style={{ color: "var(--color-coral)" }}
                >
                  pivot
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Step info */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
          {currentStep
            ? currentStep.description
            : "Click Start to begin"}
        </p>
      </div>

      {/* Key insight */}
      <div
        className="mt-3 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-coral-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-coral)" }}>Key insight:</strong>{" "}
          In-place sorting with O(log n) stack space. Fastest in practice for most data.
          Worst case O(n²) with bad pivots — use randomization or median-of-three.
        </p>
      </div>
    </div>
  );
}
