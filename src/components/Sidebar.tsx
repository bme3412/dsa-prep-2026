import { motion } from "framer-motion";
import type { DataStructure } from "../types";

interface SidebarProps {
  topics: DataStructure[];
  upcomingTopics: { id: string; name: string; icon: string; tagline: string }[];
  activeTopic: string;
  onSelectTopic: (id: string) => void;
}

const colorMap: Record<string, string> = {
  accent: "var(--color-accent)",
  teal: "var(--color-teal)",
  amber: "var(--color-amber)",
  coral: "var(--color-coral)",
  green: "var(--color-green)",
};

export function Sidebar({
  topics,
  upcomingTopics,
  activeTopic,
  onSelectTopic,
}: SidebarProps) {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--color-border)]">
        <h1
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          DSA Studio
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-1 tracking-wide uppercase">
          Data structures & algorithms
        </p>
      </div>

      {/* Active topics */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] px-3 mb-2">
          Modules
        </p>
        {topics.map((topic) => {
          const isActive = topic.id === activeTopic;
          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className="w-full text-left px-3 py-2.5 rounded-[var(--radius-md)] mb-1 transition-all duration-150 relative group"
              style={{
                background: isActive
                  ? "var(--color-accent-glow)"
                  : "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full"
                  style={{ background: colorMap[topic.color] }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3">
                <span className="text-lg">{topic.icon}</span>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: isActive
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                    }}
                  >
                    {topic.name}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {topic.tagline}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] px-3 mb-2">
            Coming soon
          </p>
          {upcomingTopics.map((topic) => (
            <div
              key={topic.id}
              className="px-3 py-2.5 mb-1 opacity-40 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{topic.icon}</span>
                <div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {topic.name}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    {topic.tagline}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[var(--color-border)]">
        <p className="text-[11px] text-[var(--color-text-muted)]">
          Interview prep for Acadian
        </p>
      </div>
    </div>
  );
}
