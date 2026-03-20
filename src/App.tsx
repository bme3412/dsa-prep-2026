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
import type { DataStructure } from "./types";

const topics: DataStructure[] = [
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
  const [activeTopic, setActiveTopic] = useState<string>("hashmap");

  const currentTopic = topics.find((t) => t.id === activeTopic);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        topics={topics}
        upcomingTopics={upcomingTopics}
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
      />
      <main className="flex-1 ml-[280px]">
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
