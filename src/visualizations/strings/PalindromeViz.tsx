import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function PalindromeViz() {
  const [input, setInput] = useState("racecar");
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(6);
  const [, setIsChecking] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);

  const reset = () => {
    setLeft(0);
    setRight(input.length - 1);
    setIsChecking(false);
    setResult(null);
  };

  useEffect(() => {
    reset();
  }, [input]);

  const step = () => {
    if (result !== null) return;

    if (left >= right) {
      setResult(true);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const cleanInput = input.toLowerCase();

    if (cleanInput[left] !== cleanInput[right]) {
      setResult(false);
      setIsChecking(false);
    } else {
      setLeft(left + 1);
      setRight(right - 1);
    }
  };

  const checkAll = () => {
    const cleanInput = input.toLowerCase();
    let l = 0;
    let r = cleanInput.length - 1;

    while (l < r) {
      if (cleanInput[l] !== cleanInput[r]) {
        setLeft(l);
        setRight(r);
        setResult(false);
        return;
      }
      l++;
      r--;
    }
    setLeft(l);
    setRight(r);
    setResult(true);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          Palindrome check — Two pointers from ends
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-[var(--radius-md)] outline-none w-32"
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-mono)",
            }}
            placeholder="Enter text"
          />
          <button
            onClick={step}
            disabled={result !== null}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] disabled:opacity-30 transition-all"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Step
          </button>
          <button
            onClick={checkAll}
            disabled={result !== null}
            className="px-3 py-1.5 text-xs rounded-[var(--radius-sm)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] disabled:opacity-30 transition-all"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Check all
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

      {/* String visualization */}
      <div className="flex gap-1 justify-center mb-4">
        {input.split("").map((char, i) => {
          const isLeft = i === left;
          const isRight = i === right;
          const isMatched = i < left || i > right;
          const isMismatch = result === false && (isLeft || isRight);

          return (
            <motion.div
              key={i}
              className="w-10 h-12 rounded-[var(--radius-sm)] flex flex-col items-center justify-center relative"
              style={{
                background: isMismatch
                  ? "var(--color-coral-dim)"
                  : isMatched
                  ? "var(--color-green-dim)"
                  : isLeft || isRight
                  ? "var(--color-accent-glow)"
                  : "var(--color-bg-primary)",
                border: isMismatch
                  ? "2px solid var(--color-coral)"
                  : isLeft || isRight
                  ? "2px solid var(--color-accent)"
                  : "1px solid var(--color-border)",
              }}
              animate={{ scale: isLeft || isRight ? 1.05 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <span
                className="text-lg font-semibold"
                style={{
                  color: isMismatch
                    ? "var(--color-coral)"
                    : isLeft || isRight
                    ? "var(--color-accent)"
                    : "var(--color-text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {char}
              </span>
              {isLeft && (
                <span
                  className="absolute -bottom-5 text-[10px] font-medium"
                  style={{ color: "var(--color-teal)" }}
                >
                  L
                </span>
              )}
              {isRight && !isLeft && (
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

      {/* Result display */}
      {result !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[var(--radius-md)] p-3 text-center"
          style={{
            background: result ? "var(--color-green-dim)" : "var(--color-coral-dim)",
          }}
        >
          <p
            className="text-sm font-medium"
            style={{ color: result ? "var(--color-green)" : "var(--color-coral)" }}
          >
            {result ? `"${input}" is a palindrome` : `"${input}" is NOT a palindrome`}
          </p>
        </motion.div>
      )}

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-teal-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-teal)" }}>Key insight:</strong>{" "}
          Two pointers from opposite ends, O(n/2) comparisons. For "valid palindrome"
          problems, skip non-alphanumeric characters.
        </p>
      </div>
    </div>
  );
}
