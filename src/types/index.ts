export interface Operation {
  name: string;
  // DSA modules use average/worst
  average?: string;
  worst?: string;
  // Concept modules use time/space
  time?: string;
  space?: string;
  note: string;
  // Use-case focused mode (for live-coding)
  useCase?: string;
  example?: string;
}

export interface Pattern {
  id?: string;
  name: string;
  tag?: string;
  tagColor?: "accent" | "teal" | "amber" | "coral" | "green";
  /** Short description of when to use this pattern */
  description: string;
  /** Extended conceptual explanation in paragraph form */
  explanation?: string;
  /** Problem keywords/signals that indicate this pattern applies */
  triggers?: string;
  code: string;
  investmentParallel?: string;
  problems?: Problem[];
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: TestCase[];
}

export interface AggregatedProblem extends Problem {
  topic: string;
  topicColor: "accent" | "teal" | "amber" | "coral" | "green";
}

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface Section {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
}

export interface DataStructure {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description?: string;
  color: "accent" | "teal" | "amber" | "coral" | "green";
  /** "pattern-first" for DSA modules, "concepts" for knowledge modules, "practice" for practice hub */
  viewMode?: "pattern-first" | "concepts" | "practice";
  sections: Section[];
  operations: Operation[];
  patterns: Pattern[];
  problems: Problem[];
}
