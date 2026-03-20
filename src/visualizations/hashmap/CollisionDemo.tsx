import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BUCKET_COUNT = 6;

interface ChainEntry {
  key: string;
  value: string;
}

function hashKey(s: string): number {
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    sum += s.charCodeAt(i);
  }
  return sum % BUCKET_COUNT;
}

// Deliberately chosen to cause collisions
const collisionItems: { key: string; value: string }[] = [
  { key: "CRM", value: "$302" },
  { key: "NOW", value: "$845" },
  { key: "PANW", value: "$312" },
  { key: "CRWD", value: "$340" },
  { key: "MSFT", value: "$430" },
  { key: "AAPL", value: "$189" },
];

type Strategy = "chaining" | "probing";

export function CollisionDemo() {
  const [strategy, setStrategy] = useState<Strategy>("chaining");
  const [insertIndex, setInsertIndex] = useState(0);
  const [chainBuckets, setChainBuckets] = useState<ChainEntry[][]>(
    () => Array.from({ length: BUCKET_COUNT }, () => [])
  );
  const [probeBuckets, setProbeBuckets] = useState<(ChainEntry | null)[]>(
    () => Array(BUCKET_COUNT).fill(null)
  );
  const [log, setLog] = useState<string[]>([]);
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null);

  const reset = () => {
    setInsertIndex(0);
    setChainBuckets(Array.from({ length: BUCKET_COUNT }, () => []));
    setProbeBuckets(Array(BUCKET_COUNT).fill(null));
    setLog([]);
    setHighlightBucket(null);
  };

  const switchStrategy = (s: Strategy) => {
    setStrategy(s);
    reset();
  };

  const insertNext = () => {
    if (insertIndex >= collisionItems.length) return;
    const item = collisionItems[insertIndex];
    const bucket = hashKey(item.key);

    if (strategy === "chaining") {
      setChainBuckets((prev) => {
        const next = prev.map((b) => [...b]);
        const existed = next[bucket].length > 0;
        next[bucket].push({ key: item.key, value: item.value });
        setLog((l) => [
          ...l,
          existed
            ? `hash("${item.key}") → ${bucket} — collision! Appended to chain (length: ${next[bucket].length})`
            : `hash("${item.key}") → ${bucket} — placed directly`,
        ]);
        return next;
      });
      setHighlightBucket(bucket);
    } else {
      setProbeBuckets((prev) => {
        const next = [...prev];
        let probe = bucket;
        let probeCount = 0;
        while (next[probe] !== null) {
          probeCount++;
          probe = (probe + 1) % BUCKET_COUNT;
        }
        next[probe] = { key: item.key, value: item.value };
        setLog((l) => [
          ...l,
          probeCount > 0
            ? `hash("${item.key}") → ${bucket} — occupied! Probed ${probeCount}× → placed at ${probe}`
            : `hash("${item.key}") → ${bucket} — placed directly`,
        ]);
        setHighlightBucket(probe);
        return next;
      });
    }

    setInsertIndex((i) => i + 1);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      {/* Strategy toggle */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="flex gap-1 p-1 rounded-[var(--radius-md)]"
          style={{ background: "var(--color-bg-primary)" }}
        >
          {(["chaining", "probing"] as Strategy[]).map((s) => (
            <button
              key={s}
              onClick={() => switchStrategy(s)}
              className="relative text-xs px-4 py-1.5 rounded-[var(--radius-sm)] transition-colors"
              style={{
                color:
                  strategy === s
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
              }}
            >
              {strategy === s && (
                <motion.div
                  layoutId="strategy-bg"
                  className="absolute inset-0 rounded-[var(--radius-sm)]"
                  style={{ background: "var(--color-bg-elevated)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 capitalize">{s}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={insertNext}
            disabled={insertIndex >= collisionItems.length}
            className="text-xs px-4 py-1.5 rounded-[var(--radius-sm)] font-medium transition-all disabled:opacity-30"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            {insertIndex < collisionItems.length
              ? `Insert ${collisionItems[insertIndex].key}`
              : "Done"}
          </button>
          <button
            onClick={reset}
            className="text-xs px-3 py-1.5 rounded-[var(--radius-sm)] transition-all"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Bucket visualization */}
      {strategy === "chaining" ? (
        <div className="grid grid-cols-6 gap-2 mb-4">
          {chainBuckets.map((chain, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className="text-[11px] text-[var(--color-text-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {i}
              </span>
              <div
                className="w-full min-h-[48px] rounded-[var(--radius-md)] p-1.5 flex flex-col gap-1"
                style={{
                  background:
                    i === highlightBucket
                      ? "var(--color-accent-glow)"
                      : "var(--color-bg-primary)",
                  border:
                    i === highlightBucket
                      ? "1.5px solid var(--color-accent)"
                      : "1px solid var(--color-border)",
                }}
              >
                <AnimatePresence>
                  {chain.map((entry, j) => (
                    <motion.div
                      key={entry.key}
                      initial={{ opacity: 0, scale: 0.8, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: j * 0.05 }}
                      className="rounded-[var(--radius-sm)] px-2 py-1.5 text-center"
                      style={{
                        background:
                          j === chain.length - 1 && i === highlightBucket
                            ? "var(--color-teal-dim)"
                            : "var(--color-bg-tertiary)",
                        border:
                          j === chain.length - 1 && i === highlightBucket
                            ? "1px solid rgba(45, 212, 191, 0.3)"
                            : "1px solid var(--color-border)",
                      }}
                    >
                      <p
                        className="text-[11px] font-medium"
                        style={{
                          color:
                            j === chain.length - 1 && i === highlightBucket
                              ? "var(--color-teal)"
                              : "var(--color-text-primary)",
                        }}
                      >
                        {entry.key}
                      </p>
                      <p
                        className="text-[10px] text-[var(--color-text-muted)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {entry.value}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {chain.length === 0 && (
                  <div className="flex items-center justify-center h-8">
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      empty
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-2 mb-4">
          {probeBuckets.map((entry, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span
                className="text-[11px] text-[var(--color-text-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {i}
              </span>
              <motion.div
                className="w-full h-14 rounded-[var(--radius-md)] flex flex-col items-center justify-center"
                style={{
                  background: entry
                    ? i === highlightBucket
                      ? "var(--color-accent-glow)"
                      : "var(--color-teal-dim)"
                    : "var(--color-bg-primary)",
                  border: entry
                    ? i === highlightBucket
                      ? "1.5px solid var(--color-accent)"
                      : "1px solid rgba(45, 212, 191, 0.3)"
                    : "1px solid var(--color-border)",
                }}
                animate={
                  i === highlightBucket ? { scale: [0.95, 1.03, 1] } : {}
                }
                transition={{ duration: 0.25 }}
              >
                <AnimatePresence>
                  {entry ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <p
                        className="text-[11px] font-medium"
                        style={{
                          color:
                            i === highlightBucket
                              ? "var(--color-accent)"
                              : "var(--color-teal)",
                        }}
                      >
                        {entry.key}
                      </p>
                      <p
                        className="text-[10px] text-[var(--color-text-muted)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {entry.value}
                      </p>
                    </motion.div>
                  ) : (
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      empty
                    </span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div
          className="rounded-[var(--radius-md)] p-3 max-h-[140px] overflow-y-auto"
          style={{ background: "var(--color-bg-primary)" }}
        >
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Insertion log
          </p>
          {log.map((entry, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs leading-relaxed"
              style={{
                fontFamily: "var(--font-mono)",
                color: entry.includes("collision") || entry.includes("Probed")
                  ? "var(--color-coral)"
                  : "var(--color-text-secondary)",
              }}
            >
              {entry}
            </motion.p>
          ))}
        </div>
      )}
    </div>
  );
}
