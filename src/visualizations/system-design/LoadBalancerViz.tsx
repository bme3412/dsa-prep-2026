import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Server {
  id: string;
  name: string;
  load: number;
  healthy: boolean;
}

interface Request {
  id: number;
  targetServer: string;
}

const INITIAL_SERVERS: Server[] = [
  { id: "s1", name: "Server 1", load: 30, healthy: true },
  { id: "s2", name: "Server 2", load: 45, healthy: true },
  { id: "s3", name: "Server 3", load: 20, healthy: true },
  { id: "s4", name: "Server 4", load: 0, healthy: false },
];

type Algorithm = "round-robin" | "least-connections" | "random";

export function LoadBalancerViz() {
  const [servers, setServers] = useState<Server[]>(INITIAL_SERVERS);
  const [algorithm, setAlgorithm] = useState<Algorithm>("round-robin");
  const [requests, setRequests] = useState<Request[]>([]);
  const [nextRequestId, setNextRequestId] = useState(1);
  const [rrIndex, setRrIndex] = useState(0);

  const healthyServers = servers.filter((s) => s.healthy);

  const getTargetServer = (): string => {
    if (healthyServers.length === 0) return "";

    switch (algorithm) {
      case "round-robin": {
        const target = healthyServers[rrIndex % healthyServers.length];
        setRrIndex((prev) => prev + 1);
        return target.id;
      }
      case "least-connections": {
        const target = healthyServers.reduce((min, s) =>
          s.load < min.load ? s : min
        );
        return target.id;
      }
      case "random": {
        const idx = Math.floor(Math.random() * healthyServers.length);
        return healthyServers[idx].id;
      }
    }
  };

  const sendRequest = () => {
    const targetId = getTargetServer();
    if (!targetId) return;

    const newRequest: Request = { id: nextRequestId, targetServer: targetId };
    setRequests((prev) => [...prev, newRequest]);
    setNextRequestId((prev) => prev + 1);

    // Update server load
    setServers((prev) =>
      prev.map((s) =>
        s.id === targetId ? { ...s, load: Math.min(100, s.load + 15) } : s
      )
    );

    // Remove request after animation
    setTimeout(() => {
      setRequests((prev) => prev.filter((r) => r.id !== newRequest.id));
    }, 800);

    // Decay load over time
    setTimeout(() => {
      setServers((prev) =>
        prev.map((s) =>
          s.id === targetId ? { ...s, load: Math.max(0, s.load - 10) } : s
        )
      );
    }, 1500);
  };

  const toggleHealth = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, healthy: !s.healthy } : s))
    );
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Load Balancer — Request Distribution
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Click servers to toggle health, send requests to see distribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="text-xs px-2 py-1 rounded-[var(--radius-sm)]"
            style={{ background: "var(--color-bg-tertiary)", border: "1px solid var(--color-border)" }}
          >
            <option value="round-robin">Round Robin</option>
            <option value="least-connections">Least Connections</option>
            <option value="random">Random</option>
          </select>
          <button
            onClick={sendRequest}
            className="px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Send Request
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="flex items-center justify-center gap-8 py-6">
        {/* Client */}
        <div className="flex flex-col items-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-bg-tertiary)", border: "2px solid var(--color-border)" }}
          >
            👤
          </div>
          <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>Client</p>
        </div>

        {/* Arrow to LB */}
        <div className="w-12 h-0.5 relative" style={{ background: "var(--color-border)" }}>
          <AnimatePresence>
            {requests.map((r) => (
              <motion.div
                key={r.id}
                className="absolute w-3 h-3 rounded-full"
                style={{ background: "var(--color-accent)", top: -5 }}
                initial={{ left: 0 }}
                animate={{ left: 48 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Load Balancer */}
        <div className="flex flex-col items-center">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            <span className="text-lg">⚖️</span>
          </div>
          <p className="text-[10px] mt-1 font-medium" style={{ color: "var(--color-accent)" }}>
            Load Balancer
          </p>
        </div>

        {/* Arrows to servers */}
        <div className="flex flex-col gap-3 relative">
          {servers.map((server) => (
            <div key={server.id} className="w-16 h-0.5" style={{ background: "var(--color-border)" }}>
              <AnimatePresence>
                {requests
                  .filter((r) => r.targetServer === server.id)
                  .map((r) => (
                    <motion.div
                      key={r.id}
                      className="absolute w-3 h-3 rounded-full"
                      style={{ background: "var(--color-green)", top: -5 }}
                      initial={{ left: 0 }}
                      animate={{ left: 64 }}
                      transition={{ duration: 0.5 }}
                    />
                  ))}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Servers */}
        <div className="flex flex-col gap-2">
          {servers.map((server) => (
            <motion.div
              key={server.id}
              onClick={() => toggleHealth(server.id)}
              className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)] cursor-pointer"
              style={{
                background: "var(--color-bg-tertiary)",
                border: `1px solid ${server.healthy ? "var(--color-green)" : "var(--color-coral)"}`,
                opacity: server.healthy ? 1 : 0.5,
              }}
              whileHover={{ scale: 1.02 }}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-xs"
                style={{ background: server.healthy ? "var(--color-green)" : "var(--color-coral)", color: "white" }}
              >
                {server.healthy ? "✓" : "✗"}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium">{server.name}</p>
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "var(--color-bg-primary)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: server.load > 70 ? "var(--color-coral)" : server.load > 40 ? "var(--color-amber)" : "var(--color-green)",
                    }}
                    animate={{ width: `${server.load}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>
                {server.load}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-accent-glow)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-accent)" }}>Key insight:</strong>{" "}
          Load balancers distribute traffic across servers. Round-robin is simple but ignores load.
          Least-connections is smarter but requires state. Health checks remove failed servers.
        </p>
      </div>
    </div>
  );
}
