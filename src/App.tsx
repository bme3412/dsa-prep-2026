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

// Placeholder topics for the sidebar (not yet built)
const upcomingTopics = [
  { id: "behavioral", name: "Behavioral", icon: "💬", tagline: "Communication skills" },
];

export default function App() {
  const [activeTopic, setActiveTopic] = useState<string>("live-coding");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentTopic = topics.find((t) => t.id === activeTopic);

  const handleSelectTopic = (id: string) => {
    setActiveTopic(id);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile header with hamburger */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] flex items-center px-4 z-30 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {sidebarOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
        <h1 className="ml-3 text-lg font-semibold">DSA Studio</h1>
      </header>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless open */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-10
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          topics={topics}
          upcomingTopics={upcomingTopics}
          activeTopic={activeTopic}
          onSelectTopic={handleSelectTopic}
        />
      </div>

      {/* Main content - responsive margins */}
      <main className="flex-1 pt-14 lg:pt-0 lg:ml-[280px] min-w-0">
        {currentTopic ? (
          <TopicView topic={currentTopic} />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-[var(--color-text-muted)] text-lg">
                Coming soon
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
