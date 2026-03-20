import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BUCKET_COUNT = 8;

interface Entry {
  key: string;
  value: string;
  bucket: number;
}

const presetEntries: { key: string; value: string }[] = [
  { key: "NVDA", value: "$131" },
  { key: "AVGO", value: "$198" },
  { key: "AMD", value: "$102" },
  { key: "MSFT", value: "$430" },
  { key: "AAPL", value: "$189" },
];

function hashKey(s: string): number {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i);
  }
  return sum % BUCKET_COUNT;
}

export function BucketArrayViz() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [presetIndex, setPresetIndex] = useState(0);
  const [lastInserted, setLastInserted] = useState<number | null>(null);

  const buckets: (Entry | null)[] = Array(BUCKET_COUNT).fill(null);
  entries.forEach((e) => {
    // Simple: last write wins for display (no chaining here)
    buckets[e.bucket] = e;
  });

  const insertNext = () => {
    if (presetIndex >= presetEntries.length) return;
    const { key, value } = presetEntries[presetIndex];
    const bucket = hashKey(key);
    setEntries((prev) => [...prev, { key, value, bucket }]);
    setLastInserted(bucket);
    setPresetIndex((i) => i + 1);
  };

  const reset = () => {
    setEntries([]);
    setPresetIndex(0);
    setLastInserted(null);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={insertNext}
          disabled={presetIndex >= presetEntries.length}
          className="text-xs px-4 py-2 rounded-[var(--radius-sm)] font-medium transition-all disabled:opacity-30"
          style={{
            background: "var(--color-accent)",
            color: "white",
          }}
        >
          {presetIndex < presetEntries.length
            ? `Insert ${presetEntries[presetIndex].key}`
            : "All inserted"}
        </button>
        <button
          onClick={reset}
          className="text-xs px-3 py-2 rounded-[var(--radius-sm)] transition-all"
          style={{
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          Reset
        </button>
        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          {entries.length} / {BUCKET_COUNT} buckets used
        </span>
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {buckets.map((entry, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span
              className="text-[11px] text-[var(--color-text-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {i}
            </span>
            <motion.div
              className="w-full aspect-[1/1.2] rounded-[var(--radius-md)] flex flex-col items-center justify-center"
              style={{
                background: entry
                  ? i === lastInserted
                    ? "var(--color-accent-glow)"
                    : "var(--color-teal-dim)"
                  : "var(--color-bg-primary)",
                border: entry
                  ? i === lastInserted
                    ? "1.5px solid var(--color-accent)"
                    : "1px solid rgba(45, 212, 191, 0.3)"
                  : "1px solid var(--color-border)",
              }}
              animate={i === lastInserted ? { scale: [0.9, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {entry && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <p
                      className="text-xs font-medium"
                      style={{
                        color:
                          i === lastInserted
                            ? "var(--color-accent)"
                            : "var(--color-teal)",
                      }}
                    >
                      {entry.key}
                    </p>
                    <p
                      className="text-[11px] text-[var(--color-text-muted)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {entry.value}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
