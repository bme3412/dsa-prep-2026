import { useState } from "react";
import { motion } from "framer-motion";

interface Invocation {
  id: number;
  type: "cold" | "warm";
  initTime: number;
  execTime: number;
  totalTime: number;
}

export function LambdaColdStartViz() {
  const [invocations, setInvocations] = useState<Invocation[]>([]);
  const [nextId, setNextId] = useState(1);
  const [lastInvokeTime, setLastInvokeTime] = useState(0);
  const [isInvoking, setIsInvoking] = useState(false);

  const COLD_INIT_TIME = 800; // ms
  const WARM_TIMEOUT = 5000; // 5 seconds for demo (real is ~15 min)
  const EXEC_TIME_BASE = 100;
  const EXEC_TIME_VARIANCE = 50;

  const invoke = () => {
    setIsInvoking(true);
    const now = Date.now();
    const isCold = lastInvokeTime === 0 || now - lastInvokeTime > WARM_TIMEOUT;

    const initTime = isCold ? COLD_INIT_TIME : 0;
    const execTime = EXEC_TIME_BASE + Math.random() * EXEC_TIME_VARIANCE;

    // Simulate the delay
    setTimeout(() => {
      const newInvocation: Invocation = {
        id: nextId,
        type: isCold ? "cold" : "warm",
        initTime: Math.round(initTime),
        execTime: Math.round(execTime),
        totalTime: Math.round(initTime + execTime),
      };

      setInvocations((prev) => [...prev.slice(-7), newInvocation]);
      setNextId((prev) => prev + 1);
      setLastInvokeTime(Date.now());
      setIsInvoking(false);
    }, initTime + execTime);
  };

  const resetContainer = () => {
    setLastInvokeTime(0);
    setInvocations([]);
  };

  const avgCold = invocations.filter((i) => i.type === "cold");
  const avgWarm = invocations.filter((i) => i.type === "warm");

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Lambda Cold Start — Container Lifecycle
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            First invoke is cold (init), subsequent are warm (container idle timeout: 5s demo)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetContainer}
            className="px-2 py-1 rounded-[var(--radius-sm)] text-xs"
            style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-muted)" }}
          >
            Reset Container
          </button>
          <button
            onClick={invoke}
            disabled={isInvoking}
            className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium"
            style={{
              background: isInvoking ? "var(--color-bg-tertiary)" : "var(--color-amber)",
              color: isInvoking ? "var(--color-text-muted)" : "white",
            }}
          >
            {isInvoking ? "Invoking..." : "Invoke Lambda"}
          </button>
        </div>
      </div>

      {/* Container state */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-[var(--radius-md)]" style={{ background: "var(--color-bg-tertiary)" }}>
        <div className="flex-1">
          <p className="text-xs font-medium mb-1">Container State</p>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-3 h-3 rounded-full"
              style={{
                background: lastInvokeTime === 0 ? "var(--color-text-muted)" : "var(--color-green)",
              }}
              animate={{
                scale: isInvoking ? [1, 1.2, 1] : 1,
              }}
              transition={{ repeat: isInvoking ? Infinity : 0, duration: 0.5 }}
            />
            <span className="text-xs">
              {lastInvokeTime === 0
                ? "No container (cold)"
                : isInvoking
                ? "Processing..."
                : "Warm (idle)"}
            </span>
          </div>
        </div>
        {lastInvokeTime > 0 && (
          <div>
            <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              Time since last invoke
            </p>
            <p className="text-xs font-mono">
              {Math.round((Date.now() - lastInvokeTime) / 1000)}s
            </p>
          </div>
        )}
      </div>

      {/* Invocation timeline */}
      <div className="mb-4">
        <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
          Invocation Timeline
        </p>
        <div className="space-y-2">
          {invocations.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>
              No invocations yet. Click "Invoke Lambda" to start.
            </p>
          ) : (
            invocations.map((inv) => (
              <motion.div
                key={inv.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span
                  className="text-[10px] font-mono w-6"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  #{inv.id}
                </span>
                <div className="flex-1 h-6 rounded-[var(--radius-sm)] overflow-hidden flex" style={{ background: "var(--color-bg-primary)" }}>
                  {inv.type === "cold" && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(inv.initTime / 1000) * 100}%` }}
                      className="h-full flex items-center justify-center"
                      style={{ background: "var(--color-coral)" }}
                    >
                      <span className="text-[9px] text-white">Init</span>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(inv.execTime / 1000) * 100}%` }}
                    className="h-full flex items-center justify-center"
                    style={{ background: "var(--color-green)" }}
                  >
                    <span className="text-[9px] text-white">Exec</span>
                  </motion.div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: inv.type === "cold" ? "var(--color-coral)" : "var(--color-green)",
                      color: "white",
                    }}
                  >
                    {inv.type}
                  </span>
                  <span className="text-[10px] font-mono w-16 text-right">
                    {inv.totalTime}ms
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Cold Starts</p>
          <p className="text-sm font-mono" style={{ color: "var(--color-coral)" }}>
            {avgCold.length}
            {avgCold.length > 0 && (
              <span className="text-[10px] ml-1">
                (avg {Math.round(avgCold.reduce((a, b) => a + b.totalTime, 0) / avgCold.length)}ms)
              </span>
            )}
          </p>
        </div>
        <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Warm Starts</p>
          <p className="text-sm font-mono" style={{ color: "var(--color-green)" }}>
            {avgWarm.length}
            {avgWarm.length > 0 && (
              <span className="text-[10px] ml-1">
                (avg {Math.round(avgWarm.reduce((a, b) => a + b.totalTime, 0) / avgWarm.length)}ms)
              </span>
            )}
          </p>
        </div>
        <div className="p-2 rounded-[var(--radius-sm)]" style={{ background: "var(--color-bg-tertiary)" }}>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>Hit Rate</p>
          <p className="text-sm font-mono">
            {invocations.length > 0
              ? `${Math.round((avgWarm.length / invocations.length) * 100)}%`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-amber-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-amber)" }}>Key insight:</strong>{" "}
          Cold starts add 100ms-2s+ latency. Mitigate with: provisioned concurrency,
          smaller packages, keep functions warm with scheduled pings, avoid VPC unless needed.
        </p>
      </div>
    </div>
  );
}
