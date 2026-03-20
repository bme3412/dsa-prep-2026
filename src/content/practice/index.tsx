import type { DataStructure, AggregatedProblem } from "../../types";
import { arraysContent } from "../arrays";
import { hashmapContent } from "../hashmap";
import { sortingContent } from "../sorting";
import { stringsContent } from "../strings";

// Aggregate problems from all DSA topics
const dsaTopics = [arraysContent, hashmapContent, sortingContent, stringsContent];

export const aggregatedProblems: AggregatedProblem[] = dsaTopics.flatMap((topic) =>
  topic.problems.map((problem) => ({
    ...problem,
    topic: topic.name,
    topicColor: topic.color,
  }))
);

// Create a DataStructure for sidebar integration
export const practiceContent: DataStructure = {
  id: "practice",
  name: "Practice",
  icon: "🎯",
  tagline: "Test your skills",
  description: "Practice problems aggregated from all DSA topics",
  color: "accent",
  viewMode: "practice",
  sections: [],
  operations: [],
  patterns: [],
  problems: [], // Problems are handled via aggregatedProblems
};
