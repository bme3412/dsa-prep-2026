import { AgentLoopViz } from "../../visualizations/agents/AgentLoopViz";
import { ToolCallingDemo } from "../../visualizations/agents/ToolCallingDemo";
import { GuardrailsViz } from "../../visualizations/agents/GuardrailsViz";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
    {children}
  </p>
);

const CodeInline = ({ children }: { children: React.ReactNode }) => (
  <code
    className="text-xs px-1.5 py-0.5 rounded"
    style={{
      fontFamily: "var(--font-mono)",
      background: "var(--color-bg-tertiary)",
      color: "var(--color-accent)",
    }}
  >
    {children}
  </code>
);

export const agentsContent: DataStructure = {
  id: "agents",
  name: "Agentic AI Systems",
  icon: "🤖",
  tagline:
    "Build, operate, and design LLM-powered agents. From ReAct loops to human-in-the-loop workflows.",
  color: "coral",

  sections: [
    {
      id: "what-are-agents",
      title: "What are AI Agents?",
      subtitle: "From chatbots to autonomous systems",
      content: (
        <>
          <Prose>
            An <strong>AI agent</strong> is a system that uses an LLM as its reasoning
            engine to decide what actions to take. Unlike a simple chatbot that just
            responds to prompts, agents can observe their environment, reason about
            goals, use tools, and take actions to achieve outcomes.
          </Prose>
          <Prose>
            Key characteristics: <strong>autonomy</strong> (deciding what to do next),
            <strong> tool use</strong> (calling functions/APIs), and
            <strong> persistence</strong> (maintaining state across interactions).
            Modern agents range from simple ReAct loops to complex multi-agent
            orchestration systems.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`# Simple agent structure
class Agent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = tools
        self.memory = []

    def run(self, task: str) -> str:
        while not self.is_complete():
            # Observe: gather context
            observation = self.observe()

            # Think: reason about next step
            thought = self.llm.think(observation, self.memory)

            # Act: execute tool or respond
            action = self.llm.decide_action(thought)
            result = self.execute(action)

            self.memory.append((thought, action, result))

        return self.get_final_answer()`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "react-architecture",
      title: "Agent architectures",
      subtitle: "ReAct, Plan-and-Execute, Multi-Agent",
      content: (
        <>
          <Prose>
            <strong>ReAct</strong> (Reason + Act) interleaves reasoning and action
            in a loop. The agent observes, thinks about what to do, acts, then
            observes the result. This is the most common pattern for simple agents.
          </Prose>
          <AgentLoopViz />
          <Prose>
            <strong>Plan-and-Execute</strong> separates planning from execution.
            First, create a full plan of steps, then execute each step. Good for
            complex tasks but less adaptive to unexpected results.
          </Prose>
          <Prose>
            <strong>Multi-Agent</strong> systems coordinate multiple specialized
            agents. One agent might research, another writes code, another reviews.
            Useful for complex workflows but harder to debug and control.
          </Prose>
        </>
      ),
    },
    {
      id: "tool-use",
      title: "Tool use & function calling",
      subtitle: "OpenAI/Anthropic patterns for structured output",
      content: (
        <>
          <Prose>
            Tools give agents capabilities beyond text generation. You define tools
            with <strong>JSON schemas</strong> describing parameters and types. The
            LLM generates structured JSON matching the schema, your code executes
            the function, and returns results.
          </Prose>
          <ToolCallingDemo />
          <Prose>
            Best practices: use <CodeInline>Pydantic</CodeInline> for schema
            validation, keep tool descriptions clear and concise, handle errors
            gracefully, and log all tool calls for debugging.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`from pydantic import BaseModel
from typing import Literal

class GetStockPrice(BaseModel):
    """Get the current price of a stock."""
    symbol: str

class ExecuteTrade(BaseModel):
    """Execute a trade (requires approval)."""
    symbol: str
    quantity: int
    side: Literal["buy", "sell"]

# Register tools with the LLM
tools = [GetStockPrice, ExecuteTrade]

# LLM returns structured output matching schema
response = llm.chat(
    messages=[{"role": "user", "content": "Buy 100 shares of NVDA"}],
    tools=tools
)

# Parse and execute
if response.tool_calls:
    tool_call = response.tool_calls[0]
    if tool_call.name == "ExecuteTrade":
        trade = ExecuteTrade(**tool_call.arguments)
        result = execute_trade(trade)`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "memory-context",
      title: "Memory & context management",
      subtitle: "Short-term, long-term, and retrieval-augmented memory",
      content: (
        <>
          <Prose>
            Agents need memory to maintain state across interactions.
            <strong> Short-term memory</strong> is the conversation history within
            the context window. <strong>Long-term memory</strong> persists across
            sessions using vector databases or structured storage.
          </Prose>
          <Prose>
            <strong>Retrieval-augmented memory</strong> stores past interactions
            in a vector database and retrieves relevant context for each new query.
            This lets agents "remember" far more than fits in the context window.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`class AgentMemory:
    def __init__(self, vector_store, max_context_tokens=8000):
        self.vector_store = vector_store
        self.short_term = []  # Current conversation
        self.max_tokens = max_context_tokens

    def add(self, role: str, content: str):
        self.short_term.append({"role": role, "content": content})
        # Also persist to long-term
        self.vector_store.add(content, metadata={"role": role})

    def get_context(self, query: str) -> list:
        # Get relevant long-term memories
        relevant = self.vector_store.search(query, k=5)

        # Combine with recent short-term
        context = [{"role": "system", "content": "Relevant history:"}]
        context.extend(relevant)
        context.extend(self.short_term[-10:])  # Last 10 messages

        return self._truncate_to_fit(context)

    def _truncate_to_fit(self, messages):
        # Ensure we don't exceed context window
        ...`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "human-in-loop",
      title: "Human-in-the-loop patterns",
      subtitle: "Approval gates, review workflows, and escalation",
      content: (
        <>
          <Prose>
            For high-stakes actions, agents should request human approval before
            executing. This preserves <strong>accountability</strong> and catches
            errors before they cause damage. The key is designing clear approval
            workflows that don't bottleneck productivity.
          </Prose>
          <GuardrailsViz />
          <Prose>
            Patterns: <strong>async approval queues</strong> (agent submits,
            human reviews later), <strong>tiered thresholds</strong> (auto-approve
            small actions, escalate large ones), and <strong>confidence-based
            escalation</strong> (agent requests help when uncertain).
          </Prose>
        </>
      ),
    },
    {
      id: "guardrails",
      title: "Guardrails & safety",
      subtitle: "Cost limits, scope constraints, and rollback",
      content: (
        <>
          <Prose>
            Production agents need guardrails to prevent runaway costs, scope creep,
            and dangerous actions. Implement checks at multiple levels: input
            validation, action filtering, output sanitization, and resource limits.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`class GuardedAgent:
    def __init__(self, agent, config):
        self.agent = agent
        self.config = config
        self.cost_tracker = CostTracker(budget=config.max_cost)
        self.rate_limiter = RateLimiter(config.max_requests_per_minute)

    async def run(self, task: str):
        # Check rate limit
        if not self.rate_limiter.allow():
            raise RateLimitExceeded()

        # Run with cost tracking
        with self.cost_tracker.track():
            result = await self.agent.run(task)

        # Check if we're approaching budget
        if self.cost_tracker.remaining < self.config.warning_threshold:
            await self.notify_admin("Approaching cost limit")

        return result

class CostTracker:
    def __init__(self, budget: float):
        self.budget = budget
        self.spent = 0.0

    @contextmanager
    def track(self):
        start_tokens = get_token_count()
        yield
        end_tokens = get_token_count()
        cost = calculate_cost(end_tokens - start_tokens)
        self.spent += cost

        if self.spent > self.budget:
            raise BudgetExceeded(f"Spent {self.spent:.2f} of {self.budget} budget")`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "testing-agents",
      title: "Testing agentic systems",
      subtitle: "Deterministic vs stochastic outputs",
      content: (
        <>
          <Prose>
            Testing agents is hard because LLM outputs are non-deterministic. Use
            multiple strategies: <strong>unit test tools</strong> independently,
            <strong> mock the LLM</strong> for integration tests, and
            <strong> eval suites</strong> for end-to-end behavior.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <pre
              className="text-xs leading-relaxed"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`import pytest
from unittest.mock import Mock

# Unit test: tools work correctly
def test_get_stock_price():
    result = get_stock_price("NVDA")
    assert "price" in result
    assert isinstance(result["price"], float)

# Integration test: mock LLM responses
def test_agent_uses_correct_tool():
    mock_llm = Mock()
    mock_llm.decide_action.return_value = {
        "tool": "get_stock_price",
        "arguments": {"symbol": "NVDA"}
    }

    agent = Agent(llm=mock_llm, tools=[get_stock_price])
    result = agent.run("What's NVDA trading at?")

    mock_llm.decide_action.assert_called_once()

# Eval suite: test against expected behaviors
EVAL_CASES = [
    {"input": "Buy 100 NVDA", "expected_tool": "execute_trade"},
    {"input": "What's AAPL price?", "expected_tool": "get_stock_price"},
]

@pytest.mark.parametrize("case", EVAL_CASES)
def test_agent_behavior(case):
    agent = Agent(llm=real_llm, tools=tools)
    result = agent.run(case["input"])
    assert result.tool_used == case["expected_tool"]`}
            </pre>
          </div>
        </>
      ),
    },
  ],

  operations: [
    {
      name: "LLM Call",
      average: "O(tokens)",
      worst: "O(context)",
      note: "Cost scales with input + output tokens.",
    },
    {
      name: "Tool Execution",
      average: "O(1) to O(n)",
      worst: "Varies",
      note: "Depends on the tool. Network calls add latency.",
    },
    {
      name: "Memory Retrieval",
      average: "O(log n)",
      worst: "O(n)",
      note: "Vector search is typically O(log n) with indexes.",
    },
    {
      name: "Agent Loop Iteration",
      average: "O(1)",
      worst: "O(max_steps)",
      note: "Set max iterations to prevent infinite loops.",
    },
    {
      name: "Context Assembly",
      average: "O(k)",
      worst: "O(memory_size)",
      note: "k = number of retrieved memories.",
    },
    {
      name: "Guardrail Checks",
      average: "O(1)",
      worst: "O(rules)",
      note: "Check each rule sequentially.",
    },
  ],

  patterns: [
    {
      id: "react-loop",
      name: "ReAct loop implementation",
      tag: "Essential",
      tagColor: "coral",
      description:
        "The core agent loop: observe context, think about next step, act, repeat. Most common pattern for simple agents.",
      code: `def react_loop(llm, tools, task: str, max_steps: int = 10):
    """Basic ReAct implementation."""
    messages = [{"role": "user", "content": task}]

    for step in range(max_steps):
        # Think: ask LLM what to do
        response = llm.chat(messages, tools=tools)

        # Check if done
        if response.finish_reason == "stop":
            return response.content

        # Act: execute tool call
        if response.tool_calls:
            tool_call = response.tool_calls[0]
            result = execute_tool(tool_call, tools)

            # Add to conversation
            messages.append({"role": "assistant", "tool_calls": [tool_call]})
            messages.append({"role": "tool", "content": str(result)})

    raise MaxStepsExceeded(f"Agent did not complete in {max_steps} steps")`,
      investmentParallel:
        "An analyst researching a company: observe financials, think about implications, look up more data, repeat until thesis is formed.",
      problems: [],
    },
    {
      id: "tool-registration",
      name: "Tool/skill registration",
      tag: "Essential",
      tagColor: "teal",
      description:
        "Register tools with typed schemas so the LLM knows what's available. Use Pydantic for validation and automatic schema generation.",
      code: `from pydantic import BaseModel, Field
from typing import Callable

class ToolRegistry:
    def __init__(self):
        self.tools: dict[str, Callable] = {}
        self.schemas: list[dict] = []

    def register(self, func: Callable, schema: type[BaseModel]):
        """Register a tool with its Pydantic schema."""
        self.tools[schema.__name__] = func
        self.schemas.append({
            "type": "function",
            "function": {
                "name": schema.__name__,
                "description": schema.__doc__,
                "parameters": schema.model_json_schema()
            }
        })

    def execute(self, tool_name: str, arguments: dict):
        """Execute a tool with validated arguments."""
        func = self.tools[tool_name]
        return func(**arguments)

# Usage
registry = ToolRegistry()

class GetPortfolioHoldings(BaseModel):
    """Get current holdings for a portfolio."""
    portfolio_id: str = Field(description="Portfolio identifier")

@registry.register(schema=GetPortfolioHoldings)
def get_holdings(portfolio_id: str):
    return db.query_holdings(portfolio_id)`,
      investmentParallel:
        "A standardized interface for investment operations - every tool has a defined input/output contract.",
      problems: [],
    },
    {
      id: "structured-output",
      name: "Structured output parsing",
      tag: "High frequency",
      tagColor: "amber",
      description:
        "Force LLM to output valid JSON matching a schema. Essential for reliable tool calling and data extraction.",
      code: `from pydantic import BaseModel
import instructor

# Patch the OpenAI client to enforce structured output
client = instructor.patch(openai.OpenAI())

class StockAnalysis(BaseModel):
    symbol: str
    sentiment: Literal["bullish", "bearish", "neutral"]
    confidence: float  # 0-1
    key_factors: list[str]
    price_target: float | None

# LLM is forced to return valid StockAnalysis
analysis = client.chat.completions.create(
    model="gpt-4",
    response_model=StockAnalysis,
    messages=[{
        "role": "user",
        "content": "Analyze NVDA based on recent earnings"
    }]
)

# analysis is a validated Pydantic model
print(f"{analysis.symbol}: {analysis.sentiment}")
print(f"Confidence: {analysis.confidence:.0%}")`,
      investmentParallel:
        "Standardized research reports - every analyst output follows the same structure for downstream processing.",
      problems: [],
    },
    {
      id: "retry-logic",
      name: "Error recovery & retry logic",
      tag: "Production",
      tagColor: "green",
      description:
        "Handle failures gracefully with retries, exponential backoff, and fallbacks. Essential for production reliability.",
      code: `import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

class RetryConfig:
    max_attempts: int = 3
    min_wait: float = 1.0
    max_wait: float = 30.0

@retry(
    stop=stop_after_attempt(RetryConfig.max_attempts),
    wait=wait_exponential(
        multiplier=1,
        min=RetryConfig.min_wait,
        max=RetryConfig.max_wait
    ),
    reraise=True
)
async def call_llm_with_retry(messages, tools):
    """Call LLM with automatic retry on transient failures."""
    try:
        return await llm.chat(messages, tools=tools)
    except RateLimitError:
        # Let tenacity handle retry
        raise
    except InvalidRequestError as e:
        # Don't retry invalid requests
        raise
    except Exception as e:
        logger.warning(f"LLM call failed: {e}, retrying...")
        raise

# With fallback to simpler model
async def call_with_fallback(messages, tools):
    try:
        return await call_llm_with_retry(messages, tools, model="gpt-4")
    except Exception:
        logger.warning("Falling back to gpt-3.5-turbo")
        return await call_llm_with_retry(messages, tools, model="gpt-3.5-turbo")`,
      investmentParallel:
        "Trading systems that retry on network failures but fail fast on validation errors.",
      problems: [],
    },
    {
      id: "approval-flow",
      name: "Human-in-the-loop approval",
      tag: "Critical",
      tagColor: "coral",
      description:
        "For high-stakes actions, pause execution and wait for human approval. Use async patterns to avoid blocking.",
      code: `from enum import Enum
import asyncio

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class ApprovalRequest:
    def __init__(self, action: dict, reason: str):
        self.action = action
        self.reason = reason
        self.status = ApprovalStatus.PENDING
        self.event = asyncio.Event()

    async def wait_for_decision(self, timeout: float = 3600):
        try:
            await asyncio.wait_for(self.event.wait(), timeout)
            return self.status
        except asyncio.TimeoutError:
            return ApprovalStatus.REJECTED

class ApprovalGate:
    def __init__(self, thresholds: dict):
        self.thresholds = thresholds
        self.pending: dict[str, ApprovalRequest] = {}

    async def check(self, action: dict) -> bool:
        # Auto-approve if below threshold
        if action.get("amount", 0) < self.thresholds.get("auto_approve", 1000):
            return True

        # Create approval request
        request = ApprovalRequest(action, "Amount exceeds auto-approve threshold")
        self.pending[request.id] = request

        # Notify reviewers
        await notify_slack(f"Approval needed: {action}")

        # Wait for decision
        status = await request.wait_for_decision()
        return status == ApprovalStatus.APPROVED`,
      investmentParallel:
        "Trade approval workflows - small orders auto-execute, large orders require PM sign-off.",
      problems: [],
    },
    {
      id: "cost-tracking",
      name: "Cost tracking & budgets",
      tag: "Production",
      tagColor: "amber",
      description:
        "Track API costs in real-time and enforce budgets. Essential for preventing runaway costs in production.",
      code: `from dataclasses import dataclass
from contextlib import contextmanager
import tiktoken

@dataclass
class CostConfig:
    input_cost_per_1k: float = 0.01   # GPT-4 input
    output_cost_per_1k: float = 0.03  # GPT-4 output
    budget_per_request: float = 1.0
    budget_per_day: float = 100.0

class CostTracker:
    def __init__(self, config: CostConfig):
        self.config = config
        self.daily_spend = 0.0
        self.request_spend = 0.0
        self.encoder = tiktoken.get_encoding("cl100k_base")

    def estimate_cost(self, messages: list, response: str) -> float:
        input_tokens = sum(
            len(self.encoder.encode(m["content"]))
            for m in messages
        )
        output_tokens = len(self.encoder.encode(response))

        input_cost = (input_tokens / 1000) * self.config.input_cost_per_1k
        output_cost = (output_tokens / 1000) * self.config.output_cost_per_1k
        return input_cost + output_cost

    @contextmanager
    def track_request(self):
        self.request_spend = 0.0
        yield self
        if self.request_spend > self.config.budget_per_request:
            raise BudgetExceeded("Request budget exceeded")

    def add_cost(self, cost: float):
        self.request_spend += cost
        self.daily_spend += cost

        if self.daily_spend > self.config.budget_per_day:
            raise BudgetExceeded("Daily budget exceeded")`,
      investmentParallel:
        "Risk limits on trading desks - track exposure in real-time, alert when approaching limits.",
      problems: [],
    },
  ],

  problems: [
    {
      id: "simple-react-agent",
      title: "Implement a Simple ReAct Agent",
      difficulty: "medium",
      description:
        "Implement a basic ReAct agent that can use tools to answer questions. The agent should loop through observe-think-act until it has an answer or reaches max steps.",
      examples: [
        {
          input: 'agent.run("What is 25 * 4?")',
          output: "100",
          explanation: "Agent uses calculator tool, gets result, responds.",
        },
      ],
      starterCode: `def react_agent(llm, tools: dict, task: str, max_steps: int = 5):
    """
    Implement a ReAct agent.

    Args:
        llm: LLM client with .chat(messages) method
        tools: Dict of tool_name -> callable
        task: The task to complete
        max_steps: Maximum iterations

    Returns:
        Final answer string
    """
    # Your implementation here
    pass`,
      solution: `def react_agent(llm, tools: dict, task: str, max_steps: int = 5):
    messages = [
        {"role": "system", "content": f"You have these tools: {list(tools.keys())}. "
         "Use them to help answer the user's question. "
         "Respond with TOOL: tool_name(args) to use a tool, "
         "or ANSWER: your_answer when done."},
        {"role": "user", "content": task}
    ]

    for step in range(max_steps):
        response = llm.chat(messages)
        content = response.content.strip()

        if content.startswith("ANSWER:"):
            return content[7:].strip()

        if content.startswith("TOOL:"):
            # Parse tool call
            tool_str = content[5:].strip()
            tool_name = tool_str.split("(")[0]
            args_str = tool_str.split("(")[1].rstrip(")")

            # Execute tool
            if tool_name in tools:
                result = tools[tool_name](args_str)
                messages.append({"role": "assistant", "content": content})
                messages.append({"role": "user", "content": f"Tool result: {result}"})
            else:
                messages.append({"role": "user", "content": f"Unknown tool: {tool_name}"})
        else:
            messages.append({"role": "assistant", "content": content})

    raise Exception("Max steps reached without answer")`,
      hints: [
        "Start with a system message explaining available tools.",
        "Parse the LLM's response to detect tool calls vs final answers.",
        "After tool execution, add the result as a new user message.",
        "Keep the conversation history so the LLM has context.",
      ],
      testCases: [
        {
          input: 'react_agent(mock_llm, {"calc": eval}, "What is 2+2?")',
          expected: '"4"',
          description: "Simple calculation",
        },
      ],
    },
    {
      id: "tool-schema",
      title: "Design Tool Schema for Portfolio Queries",
      difficulty: "easy",
      description:
        "Design Pydantic schemas for portfolio management tools: get_holdings, get_performance, and execute_rebalance.",
      examples: [
        {
          input: "GetHoldings(portfolio_id='PORT001')",
          output: '[{"symbol": "NVDA", "weight": 0.15}, ...]',
        },
      ],
      starterCode: `from pydantic import BaseModel, Field
from typing import Literal

# Define your tool schemas here

class GetHoldings(BaseModel):
    \"\"\"Get current holdings for a portfolio.\"\"\"
    # Add fields
    pass

class GetPerformance(BaseModel):
    \"\"\"Get portfolio performance metrics.\"\"\"
    # Add fields
    pass

class ExecuteRebalance(BaseModel):
    \"\"\"Execute a portfolio rebalance (requires approval).\"\"\"
    # Add fields
    pass`,
      solution: `from pydantic import BaseModel, Field
from typing import Literal
from datetime import date

class GetHoldings(BaseModel):
    """Get current holdings for a portfolio."""
    portfolio_id: str = Field(description="Unique portfolio identifier")
    as_of_date: date | None = Field(default=None, description="Point-in-time date, defaults to today")

class GetPerformance(BaseModel):
    """Get portfolio performance metrics over a period."""
    portfolio_id: str = Field(description="Unique portfolio identifier")
    start_date: date = Field(description="Start of performance period")
    end_date: date = Field(description="End of performance period")
    benchmark: str | None = Field(default="SPY", description="Benchmark to compare against")

class ExecuteRebalance(BaseModel):
    """Execute a portfolio rebalance to target weights (requires approval)."""
    portfolio_id: str = Field(description="Portfolio to rebalance")
    target_weights: dict[str, float] = Field(description="Target weights by symbol, must sum to 1.0")
    urgency: Literal["low", "normal", "high"] = Field(default="normal", description="Execution urgency")
    dry_run: bool = Field(default=True, description="If true, simulate without executing")`,
      hints: [
        "Use Field() to add descriptions - these help the LLM understand parameters.",
        "Use Literal for constrained choices (e.g., urgency levels).",
        "Include sensible defaults where appropriate.",
        "Add a dry_run option for dangerous operations.",
      ],
      testCases: [
        {
          input: 'GetHoldings(portfolio_id="PORT001").model_dump()',
          expected: '{"portfolio_id": "PORT001", "as_of_date": null}',
          description: "Basic schema validation",
        },
      ],
    },
    {
      id: "retry-wrapper",
      title: "Implement Retry with Exponential Backoff",
      difficulty: "medium",
      description:
        "Implement a decorator that retries a function with exponential backoff on failure. Should handle rate limits specially.",
      examples: [
        {
          input: "@retry(max_attempts=3)\\ndef flaky_api(): ...",
          output: "Retries up to 3 times with exponential backoff",
        },
      ],
      starterCode: `import time
import functools
from typing import Callable, TypeVar

T = TypeVar('T')

class RateLimitError(Exception):
    pass

def retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    exponential_base: float = 2.0
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """
    Decorator that retries a function with exponential backoff.

    Args:
        max_attempts: Maximum number of attempts
        base_delay: Initial delay in seconds
        max_delay: Maximum delay in seconds
        exponential_base: Base for exponential backoff
    """
    # Your implementation here
    pass`,
      solution: `import time
import functools
from typing import Callable, TypeVar

T = TypeVar('T')

class RateLimitError(Exception):
    pass

def retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 30.0,
    exponential_base: float = 2.0
) -> Callable[[Callable[..., T]], Callable[..., T]]:
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> T:
            last_exception = None

            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except RateLimitError as e:
                    # Rate limits get longer backoff
                    delay = min(base_delay * (exponential_base ** (attempt + 1)), max_delay)
                    last_exception = e
                except Exception as e:
                    # Other errors use standard backoff
                    delay = min(base_delay * (exponential_base ** attempt), max_delay)
                    last_exception = e

                if attempt < max_attempts - 1:
                    time.sleep(delay)

            raise last_exception

        return wrapper
    return decorator`,
      hints: [
        "Use functools.wraps to preserve the original function's metadata.",
        "Calculate delay as base_delay * (exponential_base ** attempt).",
        "Cap the delay at max_delay to prevent excessively long waits.",
        "Handle RateLimitError specially - it might need longer delays.",
      ],
      testCases: [
        {
          input: "retry(max_attempts=3)(lambda: 1)()",
          expected: "1",
          description: "Success on first try",
        },
      ],
    },
    {
      id: "cost-tracker",
      title: "Create a Cost Tracking Wrapper",
      difficulty: "medium",
      description:
        "Implement a cost tracker that monitors API usage and raises an exception when budget is exceeded.",
      examples: [
        {
          input: "tracker.track_cost(input_tokens=1000, output_tokens=500)",
          output: "Tracks $0.025 (assuming GPT-4 pricing)",
        },
      ],
      starterCode: `from dataclasses import dataclass, field
from contextlib import contextmanager

@dataclass
class CostTracker:
    budget: float = 10.0
    input_cost_per_1k: float = 0.01
    output_cost_per_1k: float = 0.03
    total_spent: float = field(default=0.0)

    def track_cost(self, input_tokens: int, output_tokens: int) -> float:
        \"\"\"Track cost of an API call. Raises if budget exceeded.\"\"\"
        # Your implementation here
        pass

    @contextmanager
    def budget_context(self, request_budget: float | None = None):
        \"\"\"Context manager that tracks cost within a request.\"\"\"
        # Your implementation here
        pass

    @property
    def remaining(self) -> float:
        # Your implementation here
        pass`,
      solution: `from dataclasses import dataclass, field
from contextlib import contextmanager

class BudgetExceeded(Exception):
    pass

@dataclass
class CostTracker:
    budget: float = 10.0
    input_cost_per_1k: float = 0.01
    output_cost_per_1k: float = 0.03
    total_spent: float = field(default=0.0)

    def track_cost(self, input_tokens: int, output_tokens: int) -> float:
        input_cost = (input_tokens / 1000) * self.input_cost_per_1k
        output_cost = (output_tokens / 1000) * self.output_cost_per_1k
        cost = input_cost + output_cost

        if self.total_spent + cost > self.budget:
            raise BudgetExceeded(
                f"Would exceed budget: {self.total_spent + cost:.4f} > {self.budget}"
            )

        self.total_spent += cost
        return cost

    @contextmanager
    def budget_context(self, request_budget: float | None = None):
        start_spent = self.total_spent
        try:
            yield self
        finally:
            request_cost = self.total_spent - start_spent
            if request_budget and request_cost > request_budget:
                raise BudgetExceeded(
                    f"Request exceeded budget: {request_cost:.4f} > {request_budget}"
                )

    @property
    def remaining(self) -> float:
        return self.budget - self.total_spent`,
      hints: [
        "Calculate cost as (tokens / 1000) * cost_per_1k.",
        "Check budget BEFORE adding the cost to catch overages early.",
        "The context manager should track cost within its scope.",
        "Use a property for remaining budget to keep it up-to-date.",
      ],
      testCases: [
        {
          input: "CostTracker(budget=1.0).track_cost(1000, 1000)",
          expected: "0.04",
          description: "Basic cost calculation",
        },
      ],
    },
    {
      id: "approval-gate",
      title: "Build an Approval Workflow",
      difficulty: "hard",
      description:
        "Implement an async approval gate that pauses execution for high-value actions and waits for human approval.",
      examples: [
        {
          input: 'await gate.check({"action": "trade", "amount": 50000})',
          output: "Waits for approval since amount > threshold",
        },
      ],
      starterCode: `import asyncio
from enum import Enum
from dataclasses import dataclass

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

@dataclass
class ApprovalGate:
    auto_approve_threshold: float = 10000
    timeout_seconds: float = 3600

    async def check(self, action: dict) -> bool:
        \"\"\"
        Check if action needs approval and wait if so.
        Returns True if approved, False if rejected.
        Raises TimeoutError if no decision within timeout.
        \"\"\"
        # Your implementation here
        pass

    async def approve(self, request_id: str):
        \"\"\"Mark a pending request as approved.\"\"\"
        pass

    async def reject(self, request_id: str):
        \"\"\"Mark a pending request as rejected.\"\"\"
        pass`,
      solution: `import asyncio
from enum import Enum
from dataclasses import dataclass, field
from typing import Dict
import uuid

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

@dataclass
class PendingApproval:
    action: dict
    status: ApprovalStatus = ApprovalStatus.PENDING
    event: asyncio.Event = field(default_factory=asyncio.Event)

@dataclass
class ApprovalGate:
    auto_approve_threshold: float = 10000
    timeout_seconds: float = 3600
    pending: Dict[str, PendingApproval] = field(default_factory=dict)

    async def check(self, action: dict) -> bool:
        # Auto-approve if below threshold
        amount = action.get("amount", 0)
        if amount < self.auto_approve_threshold:
            return True

        # Create pending approval
        request_id = str(uuid.uuid4())
        approval = PendingApproval(action=action)
        self.pending[request_id] = approval

        # Wait for decision with timeout
        try:
            await asyncio.wait_for(
                approval.event.wait(),
                timeout=self.timeout_seconds
            )
            return approval.status == ApprovalStatus.APPROVED
        except asyncio.TimeoutError:
            del self.pending[request_id]
            raise TimeoutError(f"Approval timeout for request {request_id}")

    async def approve(self, request_id: str):
        if request_id in self.pending:
            self.pending[request_id].status = ApprovalStatus.APPROVED
            self.pending[request_id].event.set()

    async def reject(self, request_id: str):
        if request_id in self.pending:
            self.pending[request_id].status = ApprovalStatus.REJECTED
            self.pending[request_id].event.set()`,
      hints: [
        "Use asyncio.Event to signal when a decision is made.",
        "Store pending approvals in a dict keyed by request ID.",
        "Use asyncio.wait_for to implement timeout.",
        "Auto-approve actions below the threshold immediately.",
      ],
      testCases: [
        {
          input: 'await ApprovalGate(auto_approve_threshold=10000).check({"amount": 5000})',
          expected: "True",
          description: "Auto-approve below threshold",
        },
      ],
    },
  ],
};
