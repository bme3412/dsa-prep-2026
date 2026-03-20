import { useState } from "react";
import { motion } from "framer-motion";

interface Task {
  id: number;
  name: string;
  type: "io" | "cpu";
  duration: number;
  startTime: number;
  status: "pending" | "running" | "waiting" | "complete";
}

export function AsyncIOViz() {
  const [mode, setMode] = useState<"sync" | "async">("async");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const SAMPLE_TASKS: Omit<Task, "id" | "startTime" | "status">[] = [
    { name: "API Call 1", type: "io", duration: 2000 },
    { name: "API Call 2", type: "io", duration: 1500 },
    { name: "API Call 3", type: "io", duration: 1800 },
    { name: "Process Data", type: "cpu", duration: 500 },
  ];

  const runSimulation = async () => {
    setIsRunning(true);
    setElapsed(0);

    const startTime = Date.now();
    const initialTasks: Task[] = SAMPLE_TASKS.map((t, i) => ({
      ...t,
      id: i,
      startTime: 0,
      status: "pending" as const,
    }));
    setTasks(initialTasks);

    const updateElapsed = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 50);

    if (mode === "sync") {
      // Synchronous: run one at a time
      for (let i = 0; i < initialTasks.length; i++) {
        const taskStartTime = Date.now() - startTime;
        setTasks((prev) =>
          prev.map((t, idx) =>
            idx === i ? { ...t, status: "running", startTime: taskStartTime } : t
          )
        );

        await new Promise((r) => setTimeout(r, initialTasks[i].duration));

        setTasks((prev) =>
          prev.map((t, idx) => (idx === i ? { ...t, status: "complete" } : t))
        );
      }
    } else {
      // Async: run IO tasks concurrently
      const ioTasks = initialTasks.filter((t) => t.type === "io");
      const cpuTasks = initialTasks.filter((t) => t.type === "cpu");

      // Start all IO tasks at once
      const taskStartTime = Date.now() - startTime;
      setTasks((prev) =>
        prev.map((t) =>
          t.type === "io" ? { ...t, status: "running", startTime: taskStartTime } : t
        )
      );

      // Wait for all IO tasks (simulated)
      await Promise.all(
        ioTasks.map(
          (t) =>
            new Promise<void>((resolve) => {
              setTimeout(() => {
                setTasks((prev) =>
                  prev.map((task) =>
                    task.id === t.id ? { ...task, status: "complete" } : task
                  )
                );
                resolve();
              }, t.duration);
            })
        )
      );

      // Then run CPU tasks
      for (const cpuTask of cpuTasks) {
        const cpuStartTime = Date.now() - startTime;
        setTasks((prev) =>
          prev.map((t) =>
            t.id === cpuTask.id
              ? { ...t, status: "running", startTime: cpuStartTime }
              : t
          )
        );

        await new Promise((r) => setTimeout(r, cpuTask.duration));

        setTasks((prev) =>
          prev.map((t) =>
            t.id === cpuTask.id ? { ...t, status: "complete" } : t
          )
        );
      }
    }

    clearInterval(updateElapsed);
    setElapsed(Date.now() - startTime);
    setIsRunning(false);
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "running":
        return "var(--color-accent)";
      case "waiting":
        return "var(--color-amber)";
      case "complete":
        return "var(--color-green)";
      default:
        return "var(--color-bg-tertiary)";
    }
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            AsyncIO — Concurrent I/O
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Compare sync vs async execution of I/O-bound tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "sync" | "async")}
            disabled={isRunning}
            className="text-xs px-2 py-1 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border)" }}
          >
            <option value="async">Async (concurrent)</option>
            <option value="sync">Sync (sequential)</option>
          </select>
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium"
            style={{
              background: isRunning ? "var(--color-bg-tertiary)" : "var(--color-accent)",
              color: isRunning ? "var(--color-text-muted)" : "white",
            }}
          >
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Execution Timeline
          </p>
          <p className="text-xs font-mono" style={{ color: "var(--color-accent)" }}>
            {(elapsed / 1000).toFixed(2)}s
          </p>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <div className="w-24 text-[10px] truncate" style={{ color: "var(--color-text-muted)" }}>
                {task.name}
              </div>
              <div
                className="flex-1 h-6 rounded-[var(--radius-sm)] relative overflow-hidden"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                {task.status !== "pending" && (
                  <motion.div
                    className="absolute h-full rounded-[var(--radius-sm)]"
                    style={{
                      background: getStatusColor(task.status),
                      left: `${(task.startTime / 6000) * 100}%`,
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width:
                        task.status === "complete"
                          ? `${(task.duration / 6000) * 100}%`
                          : `${((elapsed - task.startTime) / 6000) * 100}%`,
                    }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-medium" style={{ color: task.status !== "pending" ? "white" : "var(--color-text-muted)" }}>
                    {task.type === "io" ? "I/O" : "CPU"}
                  </span>
                </div>
              </div>
              <div
                className="w-12 text-[10px] font-mono text-right"
                style={{ color: "var(--color-text-muted)" }}
              >
                {task.duration}ms
              </div>
            </div>
          ))}
        </div>

        {/* Time scale */}
        <div className="flex justify-between mt-2 px-[104px] text-[9px]" style={{ color: "var(--color-text-muted)" }}>
          <span>0s</span>
          <span>2s</span>
          <span>4s</span>
          <span>6s</span>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-3 rounded-[var(--radius-md)]"
          style={{
            background: mode === "sync" ? "var(--color-bg-tertiary)" : "var(--color-accent-glow)",
            border: mode === "async" ? "1px solid var(--color-accent)" : "1px solid transparent",
          }}
        >
          <p className="text-xs font-medium mb-1">Async (await gather)</p>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            I/O tasks run concurrently while waiting. Total time = max(I/O) + CPU
          </p>
          <p className="text-xs font-mono mt-2" style={{ color: "var(--color-green)" }}>
            ~2.5s total
          </p>
        </div>
        <div
          className="p-3 rounded-[var(--radius-md)]"
          style={{
            background: mode === "sync" ? "var(--color-coral-dim)" : "var(--color-bg-tertiary)",
            border: mode === "sync" ? "1px solid var(--color-coral)" : "1px solid transparent",
          }}
        >
          <p className="text-xs font-medium mb-1">Sync (sequential)</p>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            Each task waits for previous. Total time = sum(all tasks)
          </p>
          <p className="text-xs font-mono mt-2" style={{ color: "var(--color-coral)" }}>
            ~5.8s total
          </p>
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-accent-glow)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-accent)" }}>Key insight:</strong>{" "}
          AsyncIO shines for I/O-bound work (API calls, DB queries). While one request waits,
          others can run. For CPU-bound work, use multiprocessing (avoids GIL).
        </p>
      </div>
    </div>
  );
}
