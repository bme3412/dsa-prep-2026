import { useState, useRef } from "react";
import { motion } from "framer-motion";

const INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90];

export function BubbleSortViz() {
  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [comparing, setComparing] = useState<[number, number] | null>(null);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const stopRef = useRef(false);

  const reset = () => {
    stopRef.current = true;
    setArray([...INITIAL_ARRAY]);
    setComparing(null);
    setSorted([]);
    setIsRunning(false);
  };

  const bubbleSort = async () => {
    stopRef.current = false;
    setIsRunning(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) return;

        setComparing([j, j + 1]);
        await new Promise((r) => setTimeout(r, speed));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise((r) => setTimeout(r, speed));
        }
      }
      setSorted((prev) => [...prev, n - 1 - i]);
    }

    setSorted(Array.from({ length: n }, (_, i) => i));
    setComparing(null);
    setIsRunning(false);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Bubble Sort — O(n²)
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Compare adjacent pairs, swap if out of order
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isRunning}
            className="px-2 py-1 text-xs rounded border"
            style={{
              background: "var(--color-bg-primary)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          >
            <option value={800}>Slow</option>
            <option value={500}>Medium</option>
            <option value={200}>Fast</option>
          </select>
          <button
            onClick={bubbleSort}
            disabled={isRunning}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 transition-all"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            {isRunning ? "Sorting..." : "Start"}
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
      <div className="flex gap-2 items-end justify-center" style={{ height: 160 }}>
        {array.map((val, i) => {
          const isComparing = comparing?.includes(i);
          const isSorted = sorted.includes(i);
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
                  height: val * 1.5,
                  background: isSorted
                    ? "var(--color-green)"
                    : isComparing
                    ? "var(--color-amber)"
                    : "var(--color-accent)",
                }}
                animate={{
                  scale: isComparing ? 1.05 : 1,
                }}
                transition={{ duration: 0.15 }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{ color: "white", fontFamily: "var(--font-mono)" }}
                >
                  {val}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-amber-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-amber)" }}>Key insight:</strong>{" "}
          Each pass "bubbles" the largest unsorted element to its final position.
          Simple but inefficient — use for small arrays or nearly sorted data.
        </p>
      </div>
    </div>
  );
}
