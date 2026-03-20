import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopicView } from "./components/TopicView";
import { hashmapContent } from "./content/hashmap";
import { arraysContent } from "./content/arrays";
import { sortingContent } from "./content/sorting";
import { stringsContent } from "./content/strings";
import { agentsContent } from "./content/agents";
import { quantFinanceContent } from "./content/quant-finance";
import { productionMLContent } from "./content/production-ml";
import { systemDesignContent } from "./content/system-design";
import { pythonAWSContent } from "./content/python-aws";
import { liveCodingContent } from "./content/live-coding";
import type { DataStructure } from "./types";

const topics: DataStructure[] = [
  liveCodingContent,
  agentsContent,
  quantFinanceContent,
  productionMLContent,
  systemDesignContent,
  pythonAWSContent,
  hashmapContent,
  arraysContent,
  sortingContent,
  stringsContent,
];

const upcomingTopics = [
  { id: "behavioral", name: "Behavioral", icon: "💬", tagline: "Communication skills" },
];

export default function App() {
  const [activeTopic, setActiveTopic] = useState<string>("live-coding");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTopic = topics.find((t) => t.id === activeTopic);

  const handleSelectTopic = (id: string) => {
    setActiveTopic(id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center px-4 z-50 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-tertiary)]"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="ml-3 font-semibold">{currentTopic?.name || "DSA Studio"}</span>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-[280px] bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] z-50 transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[var(--color-border)]">
          <h1 className="text-lg font-semibold">DSA Studio</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleSelectTopic(topic.id)}
              className="w-full text-left px-3 py-3 rounded-lg mb-1 flex items-center gap-3"
              style={{
                background: topic.id === activeTopic ? "var(--color-accent-glow)" : "transparent",
              }}
            >
              <span className="text-xl">{topic.icon}</span>
              <div>
                <p className="text-sm font-medium" style={{
                  color: topic.id === activeTopic ? "var(--color-text-primary)" : "var(--color-text-secondary)"
                }}>
                  {topic.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">{topic.tagline}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px] lg:flex-col lg:border-r lg:border-[var(--color-border)] lg:bg-[var(--color-bg-secondary)] z-10">
        <Sidebar
          topics={topics}
          upcomingTopics={upcomingTopics}
          activeTopic={activeTopic}
          onSelectTopic={handleSelectTopic}
        />
      </aside>

      {/* Main content */}
      <main className="pt-14 lg:pt-0 lg:pl-[280px] min-h-screen">
        <div className="w-full overflow-x-hidden">
          {currentTopic ? (
            <TopicView topic={currentTopic} />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <p className="text-[var(--color-text-muted)]">Select a topic</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
