import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BUCKET_COUNT = 8;

function hashString(s: string): {
  chars: { char: string; code: number }[];
  sum: number;
  index: number;
} {
  const chars = s.split("").map((char) => ({
    char,
    code: char.charCodeAt(0),
  }));
  const sum = chars.reduce((acc, c) => acc + c.code, 0);
  const index = sum % BUCKET_COUNT;
  return { chars, sum, index };
}

export function HashFunctionDemo() {
  const [input, setInput] = useState("NVDA");
  const result = input.length > 0 ? hashString(input) : null;

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center gap-3 mb-5">
        <label className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Key
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          maxLength={8}
          className="px-3 py-2 text-sm rounded-[var(--radius-md)] outline-none w-32 font-medium uppercase"
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-primary)",
            fontFamily: "var(--font-mono)",
          }}
          placeholder="AAPL"
        />
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={input}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Step 1: Char codes */}
            <div
              className="rounded-[var(--radius-md)] p-3"
              style={{ background: "var(--color-bg-primary)" }}
            >
              <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
                Step 1 — Character → ASCII
              </p>
              <div className="flex gap-4 flex-wrap">
                {result.chars.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-1.5"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-accent)" }}
                    >
                      "{c.char}"
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      →
                    </span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {c.code}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Step 2: Sum */}
            <div
              className="rounded-[var(--radius-md)] p-3"
              style={{ background: "var(--color-bg-primary)" }}
            >
              <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
                Step 2 — Sum
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {result.chars.map((c) => c.code).join(" + ")} ={" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--color-teal)" }}
                >
                  {result.sum}
                </span>
              </p>
            </div>

            {/* Step 3: Mod */}
            <div
              className="rounded-[var(--radius-md)] p-3"
              style={{ background: "var(--color-bg-primary)" }}
            >
              <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
                Step 3 — Mod by bucket count
              </p>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {result.sum} % {BUCKET_COUNT} ={" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--color-amber)" }}
                >
                  {result.index}
                </span>
              </p>
            </div>

            {/* Visual bucket indicator */}
            <div className="pt-2">
              <p className="text-[11px] text-[var(--color-text-muted)] mb-2">
                Bucket array
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: BUCKET_COUNT }, (_, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-xs"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background:
                        i === result.index
                          ? "var(--color-accent-glow)"
                          : "var(--color-bg-primary)",
                      border:
                        i === result.index
                          ? "1.5px solid var(--color-accent)"
                          : "1px solid var(--color-border)",
                      color:
                        i === result.index
                          ? "var(--color-accent)"
                          : "var(--color-text-muted)",
                      fontWeight: i === result.index ? 600 : 400,
                    }}
                    animate={
                      i === result.index
                        ? { scale: [1, 1.06, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {i}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
