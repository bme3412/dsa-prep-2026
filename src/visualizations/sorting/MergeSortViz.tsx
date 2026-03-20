import { useState } from "react";
import { motion } from "framer-motion";

const INITIAL_ARRAY = [38, 27, 43, 3, 9, 82, 10];

interface Step {
  array: number[];
  left: number;
  mid: number;
  right: number;
  phase: "divide" | "merge";
  description: string;
}

function generateMergeSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const arrayCopy = [...arr];

  function mergeSort(left: number, right: number) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push({
      array: [...arrayCopy],
      left,
      mid,
      right,
      phase: "divide",
      description: `Divide: [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);

    // Merge
    const leftArr = arrayCopy.slice(left, mid + 1);
    const rightArr = arrayCopy.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        arrayCopy[k++] = leftArr[i++];
      } else {
        arrayCopy[k++] = rightArr[j++];
      }
    }
    while (i < leftArr.length) arrayCopy[k++] = leftArr[i++];
    while (j < rightArr.length) arrayCopy[k++] = rightArr[j++];

    steps.push({
      array: [...arrayCopy],
      left,
      mid,
      right,
      phase: "merge",
      description: `Merge: [${left}..${right}] → [${arrayCopy.slice(left, right + 1).join(", ")}]`,
    });
  }

  mergeSort(0, arr.length - 1);
  return steps;
}

export function MergeSortViz() {
  const [stepIndex, setStepIndex] = useState(-1);
  const steps = generateMergeSteps([...INITIAL_ARRAY]);

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null;
  const displayArray = currentStep ? currentStep.array : INITIAL_ARRAY;

  const reset = () => setStepIndex(-1);
  const next = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
  };
  const prev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Merge Sort — O(n log n)
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Divide and conquer: split, sort halves, merge
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={stepIndex <= 0}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] disabled:opacity-30 transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Prev
          </button>
          <button
            onClick={next}
            disabled={stepIndex >= steps.length - 1}
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
      <div className="flex gap-2 items-end justify-center" style={{ height: 140 }}>
        {displayArray.map((val, i) => {
          const inLeftHalf =
            currentStep && i >= currentStep.left && i <= currentStep.mid;
          const inRightHalf =
            currentStep && i > currentStep.mid && i <= currentStep.right;
          const isActive = inLeftHalf || inRightHalf;

          return (
            <motion.div
              key={i}
              layout
              className="flex flex-col items-center"
              style={{ width: 40 }}
            >
              <motion.div
                className="w-full rounded-t-[var(--radius-sm)] flex items-end justify-center pb-1"
                style={{
                  height: val * 1.4,
                  background:
                    stepIndex === steps.length - 1
                      ? "var(--color-green)"
                      : currentStep?.phase === "merge" && isActive
                      ? "var(--color-teal)"
                      : inLeftHalf
                      ? "var(--color-accent)"
                      : inRightHalf
                      ? "var(--color-coral)"
                      : "var(--color-bg-tertiary)",
                  border: isActive ? "none" : "1px solid var(--color-border)",
                }}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: isActive || stepIndex === steps.length - 1 ? "white" : "var(--color-text-primary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {val}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Step info */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            {currentStep ? currentStep.description : "Click Start to begin"}
          </p>
          <span className="text-xs text-[var(--color-text-muted)]">
            Step {stepIndex + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-3 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Guaranteed O(n log n) — no worst case degradation. Stable sort. Trade-off:
          requires O(n) extra space for merging.
        </p>
      </div>
    </div>
  );
}
