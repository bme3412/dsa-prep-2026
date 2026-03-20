import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CacheEntry {
  key: string;
  value: string;
  hits: number;
}

const INITIAL_CACHE: CacheEntry[] = [
  { key: "user:123", value: "Alice", hits: 5 },
  { key: "product:456", value: "Widget", hits: 3 },
  { key: "session:abc", value: "active", hits: 8 },
];

const SAMPLE_QUERIES = [
  "user:123",
  "product:456",
  "user:789",
  "session:abc",
  "product:999",
];

export function CacheHitViz() {
  const [cache, setCache] = useState<CacheEntry[]>(INITIAL_CACHE);
  const [lastQuery, setLastQuery] = useState<{ key: string; hit: boolean } | null>(null);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });

  const query = (key: string) => {
    const entry = cache.find((e) => e.key === key);

    if (entry) {
      // Cache hit
      setCache((prev) =>
        prev.map((e) => (e.key === key ? { ...e, hits: e.hits + 1 } : e))
      );
      setStats((prev) => ({ ...prev, hits: prev.hits + 1 }));
      setLastQuery({ key, hit: true });
    } else {
      // Cache miss - add to cache
      const newEntry: CacheEntry = { key, value: `data_${key}`, hits: 1 };
      setCache((prev) => {
        const updated = [...prev, newEntry];
        // LRU: keep only last 4 entries
        if (updated.length > 4) {
          return updated.slice(-4);
        }
        return updated;
      });
      setStats((prev) => ({ ...prev, misses: prev.misses + 1 }));
      setLastQuery({ key, hit: false });
    }

    // Clear indicator after delay
    setTimeout(() => setLastQuery(null), 1500);
  };

  const hitRate = stats.hits + stats.misses > 0
    ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(0)
    : "0";

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Cache Hit/Miss — LRU Eviction
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Query keys to see cache behavior with LRU eviction (max 4 entries)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs">
            <span style={{ color: "var(--color-green)" }}>Hits: {stats.hits}</span>
            {" / "}
            <span style={{ color: "var(--color-coral)" }}>Misses: {stats.misses}</span>
          </div>
          <div
            className="px-2 py-1 rounded-[var(--radius-sm)] text-xs font-mono"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            {hitRate}% hit rate
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Query buttons */}
        <div className="w-32">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
            Query Keys
          </p>
          <div className="space-y-1">
            {SAMPLE_QUERIES.map((key) => (
              <button
                key={key}
                onClick={() => query(key)}
                className="w-full text-left px-2 py-1.5 rounded-[var(--radius-sm)] text-xs font-mono transition-colors"
                style={{
                  background: "var(--color-bg-tertiary)",
                  color: cache.some((e) => e.key === key)
                    ? "var(--color-green)"
                    : "var(--color-text-secondary)",
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Cache visualization */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              Cache Contents
            </p>
            <AnimatePresence>
              {lastQuery && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: lastQuery.hit ? "var(--color-green)" : "var(--color-coral)",
                    color: "white",
                  }}
                >
                  {lastQuery.hit ? "HIT" : "MISS"}: {lastQuery.key}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {cache.map((entry) => (
                <motion.div
                  key={entry.key}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)]"
                  style={{
                    background: "var(--color-bg-tertiary)",
                    border: lastQuery?.key === entry.key
                      ? `2px solid ${lastQuery.hit ? "var(--color-green)" : "var(--color-coral)"}`
                      : "2px solid transparent",
                  }}
                >
                  <div className="flex-1">
                    <p className="text-xs font-mono font-medium">{entry.key}</p>
                    <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                      value: {entry.value}
                    </p>
                  </div>
                  <div
                    className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{ background: "var(--color-bg-primary)" }}
                  >
                    {entry.hits} hits
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cache.length === 0 && (
              <p className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>
                Cache empty
              </p>
            )}
          </div>
        </div>

        {/* Flow diagram */}
        <div className="w-40">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
            Cache-Aside Flow
          </p>
          <div className="space-y-2 text-[10px]">
            <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
              1. Check cache
            </div>
            <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-green)", color: "white" }}>
              Hit → Return data
            </div>
            <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-coral)", color: "white" }}>
              Miss → Query DB
            </div>
            <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
              4. Update cache
            </div>
          </div>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Caching trades memory for latency. LRU evicts least-recently-used entries when full.
          For LLMs, semantic caching can match similar (not exact) queries to save tokens.
        </p>
      </div>
    </div>
  );
}
