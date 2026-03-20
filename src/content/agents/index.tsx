import { AgentLoopViz } from "../../visualizations/agents/AgentLoopViz";
import { ToolCallingDemo } from "../../visualizations/agents/ToolCallingDemo";
import { GuardrailsViz } from "../../visualizations/agents/GuardrailsViz";
import { BedrockArchitectureViz } from "../../visualizations/agents/BedrockArchitectureViz";
import { MultiAgentTradingViz } from "../../visualizations/agents/MultiAgentTradingViz";
import { CodeBlock } from "../../components/CodeBlock";
import type { DataStructure } from "../../types";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div
    className="space-y-4 text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-[var(--color-text-primary)]"
    style={{ color: "var(--color-text-secondary)" }}
  >
    {children}
  </div>
);

const Code = ({ title, children }: { title?: string; children: string }) => (
  <CodeBlock code={children} language="python" title={title} />
);

const Callout = ({ type, title, children }: { type: "insight" | "warning" | "tip"; title: string; children: React.ReactNode }) => {
  const colors = {
    insight: { bg: "var(--color-accent-glow)", border: "var(--color-accent)", text: "var(--color-accent)" },
    warning: { bg: "var(--color-coral-dim)", border: "var(--color-coral)", text: "var(--color-coral)" },
    tip: { bg: "var(--color-green-dim)", border: "var(--color-green)", text: "var(--color-green)" },
  };
  const c = colors[type];
  return (
    <div
      className="rounded-[var(--radius-md)] p-4 my-4"
      style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: c.text }}>
        {title}
      </p>
      <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {children}
      </div>
    </div>
  );
};

export const agentsContent: DataStructure = {
  id: "agents",
  name: "Agentic AI Systems",
  icon: "🤖",
  tagline: "Build, operate, and scale LLM-powered agents using AWS Bedrock for enterprise financial systems.",
  color: "coral",
  description: "Deep dive into agentic AI architectures, AWS Bedrock integration, multi-agent systems for trading, and production patterns for enterprise deployment.",
  viewMode: "pattern-first",

  sections: [
    {
      id: "what-are-agents",
      title: "What are AI Agents?",
      subtitle: "From chatbots to autonomous systems",
      content: (
        <Prose>
          <p>
            An <strong>AI agent</strong> is a system that uses an LLM as its <strong>reasoning engine</strong> to decide what actions to take. Unlike a simple chatbot that responds to prompts, agents can observe their environment, reason about goals, use tools, and take actions to achieve outcomes. The key difference: chatbots are <strong>reactive</strong> (respond to input), agents are <strong>proactive</strong> (pursue goals across multiple steps).
          </p>
          <p>
            In enterprise financial systems, agents transform how we build AI applications. Instead of hardcoding business logic, you define <strong>tools</strong> (APIs the agent can call) and <strong>objectives</strong> (what to accomplish). The agent reasons about how to use those tools to achieve the objective. This makes systems more flexible—add a new data source by adding a tool, not rewriting the entire pipeline.
          </p>
          <p>
            Key characteristics of production agents: <strong>autonomy</strong> (deciding what to do next without human intervention for each step), <strong>tool use</strong> (calling functions, APIs, databases), <strong>persistence</strong> (maintaining state across interactions), and <strong>guardrails</strong> (safety constraints that prevent harmful actions). Modern agents range from simple <strong>ReAct loops</strong> (reason, act, observe, repeat) to complex <strong>multi-agent orchestration</strong> systems where specialized agents collaborate.
          </p>
          <Callout type="insight" title="Why this matters for investment firms">
            At a quantitative asset manager, agents can automate research workflows (analyze earnings, generate trading signals), compliance checks (validate trades against rules), and portfolio operations (rebalancing, reporting). The key is that agents handle the reasoning—you provide the tools and constraints.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "react-architecture",
      title: "Agent Architectures",
      subtitle: "ReAct, Plan-and-Execute, Multi-Agent",
      content: (
        <Prose>
          <p>
            <strong>ReAct</strong> (Reason + Act) is the foundational agent pattern. The agent observes its current state, thinks about what to do next, takes an action (calls a tool or responds), then observes the result. This loop continues until the task is complete. ReAct is simple, debuggable, and works well for most single-turn and short multi-turn tasks. However, it can be inefficient for complex tasks that would benefit from upfront planning.
          </p>
          <AgentLoopViz />
          <p>
            <strong>Plan-and-Execute</strong> separates planning from execution. First, the agent creates a full plan of steps needed to complete the task. Then it executes each step, potentially re-planning if something unexpected happens. This architecture is better for complex tasks with multiple dependencies, but it's less adaptive—if early steps fail, the plan may become invalid.
          </p>
          <p>
            <strong>Multi-Agent systems</strong> coordinate multiple specialized agents. Instead of one agent doing everything, you have a <strong>Fundamental Analyst</strong> agent analyzing financials, a <strong>Sentiment Analyst</strong> processing news, a <strong>Risk Manager</strong> checking constraints, and a <strong>Portfolio Manager</strong> executing trades. A <strong>supervisor agent</strong> or orchestration layer coordinates them. This mirrors how trading desks actually work—specialists collaborate under coordination.
          </p>
          <Callout type="tip" title="When to use each">
            <strong>ReAct:</strong> Most tasks, especially when you need transparency and debuggability. <strong>Plan-and-Execute:</strong> Complex multi-step workflows where thinking ahead helps. <strong>Multi-Agent:</strong> When different expertise domains need to collaborate, or when you want to parallelize different types of analysis.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "multi-agent-financial",
      title: "Multi-Agent Financial Systems",
      subtitle: "Specialized agents for trading and investment",
      content: (
        <Prose>
          <p>
            Production trading systems increasingly use <strong>multi-agent architectures</strong> where specialized agents handle different aspects of the investment process. The <strong>TradingAgents</strong> pattern (proven in research) assigns distinct roles: <strong>Fundamental Analyst</strong> (SEC filings, earnings), <strong>Sentiment Analyst</strong> (news, social data), <strong>Technical Analyst</strong> (price action, indicators), <strong>Trader</strong> (synthesize signals, propose trades), <strong>Risk Manager</strong> (approve/reject), and <strong>Portfolio Manager</strong> (execute and track).
          </p>
          <MultiAgentTradingViz />
          <p>
            <strong>Coordination mechanisms</strong> determine how agents interact. <strong>Hierarchical</strong> coordination has a supervisor that delegates to specialists—the supervisor sees all outputs and makes final decisions. <strong>Sequential</strong> coordination passes output from one agent to the next (analyst → trader → risk → execution). <strong>Parallel</strong> coordination runs multiple analysts simultaneously, then aggregates results. Most production systems combine these—parallel analysis feeding into sequential decision-making.
          </p>
          <p>
            <strong>Shared state</strong> is critical. All agents need access to current market data, portfolio positions, and risk limits. This is typically implemented via a <strong>shared context</strong> (passed to each agent) or <strong>shared memory store</strong> (DynamoDB, Redis). The risk manager agent acts as a <strong>gatekeeper</strong>—no trade executes without its approval, enforcing position limits and compliance rules.
          </p>
          <Code title="Multi-agent supervisor pattern">
{`from typing import Literal
import asyncio

class TradingOrchestrator:
    """Supervisor that coordinates specialist agents."""

    def __init__(self, agents: dict, risk_limits: dict):
        self.fundamental = agents["fundamental"]
        self.sentiment = agents["sentiment"]
        self.technical = agents["technical"]
        self.trader = agents["trader"]
        self.risk = agents["risk"]
        self.limits = risk_limits

    async def analyze_and_trade(self, symbol: str, market_data: dict) -> dict:
        # Parallel analysis from specialists
        analyses = await asyncio.gather(
            self.fundamental.analyze(symbol),
            self.sentiment.analyze(symbol),
            self.technical.analyze(symbol, market_data),
        )

        # Trader synthesizes and proposes
        trade_proposal = await self.trader.propose(
            symbol=symbol,
            fundamental=analyses[0],
            sentiment=analyses[1],
            technical=analyses[2],
            portfolio_state=self.get_portfolio_state(),
        )

        # Risk manager approves or rejects
        risk_decision = await self.risk.evaluate(
            proposal=trade_proposal,
            limits=self.limits,
            current_exposure=self.get_exposure(),
        )

        if risk_decision["approved"]:
            return await self.execute_trade(trade_proposal)
        else:
            return {"status": "rejected", "reason": risk_decision["reason"]}`}
          </Code>
        </Prose>
      ),
    },
    {
      id: "tool-use",
      title: "Tool Use & Function Calling",
      subtitle: "OpenAI/Anthropic patterns for structured output",
      content: (
        <Prose>
          <p>
            <strong>Tools</strong> give agents capabilities beyond text generation. You define tools with <strong>JSON schemas</strong> describing parameters, types, and descriptions. The LLM generates structured JSON matching the schema, your code executes the function, and returns results to the agent. Modern foundation models (Claude 3.5, GPT-4) have <strong>native tool use</strong> capabilities—they're trained to output valid tool calls, not just prompted to do so.
          </p>
          <ToolCallingDemo />
          <p>
            <strong>Schema design matters</strong>. Clear, specific descriptions help the LLM understand when to use each tool and what parameters to provide. Use <strong>Pydantic</strong> for automatic schema generation—define your tool's input as a Pydantic model, and the JSON schema is generated automatically. Include parameter descriptions, constraints (min/max values), and examples.
          </p>
          <p>
            For financial systems, tools typically include: <strong>market data</strong> (get price, get fundamentals), <strong>portfolio operations</strong> (get holdings, calculate risk), <strong>execution</strong> (submit order, check status), and <strong>research</strong> (search documents, query knowledge base). Mark high-stakes tools (trade execution) as <strong>requiring approval</strong> so the agent knows to pause for human confirmation.
          </p>
          <Code title="Tool definition with Pydantic">
{`from pydantic import BaseModel, Field
from typing import Literal
from decimal import Decimal

class GetMarketData(BaseModel):
    """Get current market data for a symbol."""
    symbol: str = Field(description="Ticker symbol (e.g., NVDA)")
    data_type: Literal["quote", "fundamentals", "technicals"] = Field(
        default="quote", description="Type of data to retrieve"
    )

class SubmitOrder(BaseModel):
    """Submit a trade order. REQUIRES HUMAN APPROVAL."""
    symbol: str = Field(description="Ticker symbol")
    side: Literal["buy", "sell"] = Field(description="Trade direction")
    quantity: int = Field(gt=0, description="Number of shares")
    order_type: Literal["market", "limit"] = Field(default="limit")
    limit_price: Decimal | None = Field(
        default=None, description="Limit price (required for limit orders)"
    )

class QueryKnowledgeBase(BaseModel):
    """Search internal research documents and reports."""
    query: str = Field(description="Natural language search query")
    doc_types: list[str] = Field(
        default=["research", "filings"],
        description="Document types to search"
    )
    max_results: int = Field(default=5, ge=1, le=20)

# Register tools for the agent
TOOLS = [GetMarketData, SubmitOrder, QueryKnowledgeBase]`}
          </Code>
        </Prose>
      ),
    },
    {
      id: "aws-bedrock",
      title: "AWS Bedrock for Agents",
      subtitle: "Converse API, Action Groups, and Knowledge Bases",
      content: (
        <Prose>
          <p>
            <strong>AWS Bedrock Agents</strong> provide a managed service for building production agents. Instead of implementing the ReAct loop yourself, Bedrock handles orchestration: it invokes the foundation model, parses tool calls, executes your Lambda functions, and loops until complete. The key components: <strong>Foundation Model</strong> (Claude, Llama) for reasoning, <strong>Action Groups</strong> (Lambda functions the agent can call), <strong>Knowledge Bases</strong> (vector stores for retrieval), and <strong>Guardrails</strong> (safety filters).
          </p>
          <BedrockArchitectureViz />
          <p>
            The <strong>Converse API</strong> is Bedrock's unified, model-agnostic interface for conversations. Unlike the legacy InvokeModel API (which has model-specific formats), Converse works identically across all message-capable models. This is the enterprise standard—write code once, swap models without changes. It supports multi-turn conversations, streaming, and native tool use. Use <strong>ConverseStream</strong> for real-time token delivery in user-facing applications.
          </p>
          <p>
            <strong>Action Groups</strong> connect agents to your business logic via Lambda. You define the interface with an <strong>OpenAPI 3.0 schema</strong>—each operation needs a unique <code>operationId</code>, parameter schemas with descriptions, and response schemas. When the agent decides to use a tool, Bedrock invokes your Lambda with the parameters, and your Lambda returns structured results that the agent incorporates into its reasoning.
          </p>
          <p>
            <strong>Knowledge Bases</strong> enable RAG (Retrieval-Augmented Generation) within agents. You store documents in S3, Bedrock chunks and embeds them into a vector store (OpenSearch, pgvector, Pinecone), and the agent can query relevant context during reasoning. This grounds agent responses in your enterprise data—essential for financial research agents that need access to internal reports, filings, and market commentary.
          </p>
          <Code title="Bedrock Converse API with tool use">
{`import boto3
import json

bedrock = boto3.client("bedrock-runtime")

def converse_with_tools(messages: list, tools: list, model_id: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"):
    """Multi-turn conversation with tool use via Converse API."""

    # Convert Pydantic tools to Bedrock format
    tool_config = {
        "tools": [
            {
                "toolSpec": {
                    "name": tool.__name__,
                    "description": tool.__doc__,
                    "inputSchema": {"json": tool.model_json_schema()}
                }
            }
            for tool in tools
        ]
    }

    while True:
        response = bedrock.converse(
            modelId=model_id,
            messages=messages,
            toolConfig=tool_config,
        )

        # Check if model wants to use a tool
        stop_reason = response["stopReason"]

        if stop_reason == "tool_use":
            # Extract tool calls from response
            assistant_message = response["output"]["message"]
            messages.append(assistant_message)

            tool_results = []
            for block in assistant_message["content"]:
                if block.get("toolUse"):
                    tool_use = block["toolUse"]

                    # Execute the tool
                    result = execute_tool(
                        tool_use["name"],
                        tool_use["input"]
                    )

                    tool_results.append({
                        "toolResult": {
                            "toolUseId": tool_use["toolUseId"],
                            "content": [{"json": result}]
                        }
                    })

            # Add tool results as user message
            messages.append({"role": "user", "content": tool_results})

        else:
            # Model is done, return final response
            return response["output"]["message"]["content"][0]["text"]`}
          </Code>
          <Callout type="insight" title="When to use Bedrock Agents vs custom">
            Use <strong>Bedrock Agents</strong> when you want managed orchestration, built-in guardrails, and easy integration with AWS services. Build <strong>custom agents</strong> when you need fine-grained control over the reasoning loop, custom orchestration patterns (multi-agent), or specific latency requirements. Many production systems use Bedrock for standard workflows and custom code for specialized patterns.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "memory-context",
      title: "Memory & Context Management",
      subtitle: "Short-term, long-term, and retrieval-augmented memory",
      content: (
        <Prose>
          <p>
            Agents need <strong>memory</strong> to maintain state across interactions. <strong>Short-term memory</strong> is the conversation history within the context window—messages accumulate as the agent reasons and acts. <strong>Long-term memory</strong> persists across sessions using external storage: vector databases for semantic retrieval, DynamoDB for structured state, or Redis for fast key-value access.
          </p>
          <p>
            <strong>Retrieval-augmented memory</strong> stores past interactions and relevant context in a vector database. For each new query, the agent retrieves the most relevant past interactions and includes them in the prompt. This allows agents to "remember" far more than fits in the context window—crucial for trading agents that need to reference historical decisions, client preferences, or past market events.
          </p>
          <p>
            <strong>Context window management</strong> is critical at scale. Long conversations accumulate tokens, increasing cost and latency. Strategies: <strong>summarize</strong> older messages periodically, <strong>truncate</strong> to recent + retrieved relevant context, or use <strong>hierarchical memory</strong> (keep recent messages in full, older in summaries, oldest in vector search only). For financial agents, also maintain <strong>structured state</strong> separately—current positions, P&L, risk metrics shouldn't be re-extracted from conversation each turn.
          </p>
          <Code title="Memory management for trading agent">
{`from dataclasses import dataclass
import numpy as np

@dataclass
class AgentMemory:
    """Manages short-term and long-term memory for trading agents."""

    vector_store: VectorStore
    state_store: DynamoDB
    max_context_messages: int = 20

    def __init__(self, session_id: str):
        self.session_id = session_id
        self.messages: list[dict] = []  # Short-term
        self.portfolio_state: dict = self.state_store.get(session_id) or {}

    def add_message(self, role: str, content: str):
        """Add to short-term, persist to long-term."""
        message = {"role": role, "content": content}
        self.messages.append(message)

        # Persist to vector store for future retrieval
        self.vector_store.add(
            text=content,
            metadata={
                "session_id": self.session_id,
                "role": role,
                "timestamp": datetime.utcnow().isoformat()
            }
        )

        # Truncate if exceeding limit
        if len(self.messages) > self.max_context_messages:
            self._summarize_old_messages()

    def get_context(self, query: str) -> list[dict]:
        """Build context for agent: recent + relevant retrieved."""

        # Retrieve relevant past context
        relevant = self.vector_store.search(
            query=query,
            filter={"session_id": self.session_id},
            k=5
        )

        # Build final context
        context = [
            {"role": "system", "content": f"Portfolio state: {self.portfolio_state}"}
        ]

        if relevant:
            context.append({
                "role": "system",
                "content": f"Relevant history: {self._format_retrieved(relevant)}"
            })

        # Add recent messages (last N)
        context.extend(self.messages[-self.max_context_messages:])

        return context

    def update_portfolio_state(self, updates: dict):
        """Update structured state (separate from conversation)."""
        self.portfolio_state.update(updates)
        self.state_store.put(self.session_id, self.portfolio_state)`}
          </Code>
        </Prose>
      ),
    },
    {
      id: "guardrails",
      title: "Guardrails & Compliance",
      subtitle: "Safety, risk controls, and financial compliance",
      content: (
        <Prose>
          <p>
            Production agents in financial systems need multiple layers of <strong>guardrails</strong>. <strong>Amazon Bedrock Guardrails</strong> provide content filtering (block harmful content), denied topics (prevent discussion of restricted securities), PII protection (redact client data), and jailbreak detection (prevent prompt injection). These apply to both input (what users send) and output (what the agent responds).
          </p>
          <GuardrailsViz />
          <p>
            <strong>Financial compliance guardrails</strong> go beyond content safety. <strong>Pre-trade checks</strong> validate that proposed trades comply with position limits, client suitability requirements, and restricted securities lists. <strong>Insider trading walls</strong> prevent agents from accessing or acting on material non-public information. <strong>Market impact limits</strong> prevent trades that would move the market. These are typically implemented as explicit checks in your Lambda action handlers, not as LLM prompting.
          </p>
          <p>
            <strong>Audit trail requirements</strong> are critical for regulated financial systems. Every agent decision must be logged: what input triggered the decision, what reasoning the agent performed, what tools it called, what the final action was, and whether a human approved it. This enables post-hoc analysis of trades, regulatory reporting, and debugging agent behavior. Store these in immutable logs (S3, append-only DynamoDB) with timestamps and correlation IDs.
          </p>
          <Code title="Financial compliance guardrails">
{`from dataclasses import dataclass
from enum import Enum

class GuardrailResult(Enum):
    ALLOWED = "allowed"
    BLOCKED = "blocked"
    REQUIRES_APPROVAL = "requires_approval"

@dataclass
class TradeGuardrails:
    """Pre-trade compliance checks for financial agents."""

    position_limits: dict[str, float]  # symbol -> max position
    restricted_securities: set[str]
    max_order_value: float = 1_000_000
    require_approval_threshold: float = 100_000

    def check_trade(self, trade: dict, portfolio: dict) -> tuple[GuardrailResult, str]:
        symbol = trade["symbol"]
        quantity = trade["quantity"]
        price = trade.get("price", self.get_market_price(symbol))
        order_value = quantity * price

        # Check restricted securities
        if symbol in self.restricted_securities:
            self.log_blocked(trade, "Restricted security")
            return GuardrailResult.BLOCKED, f"{symbol} is on restricted list"

        # Check position limits
        current_position = portfolio.get(symbol, {}).get("quantity", 0)
        new_position = current_position + quantity
        limit = self.position_limits.get(symbol, float("inf"))

        if abs(new_position) > limit:
            self.log_blocked(trade, "Position limit exceeded")
            return GuardrailResult.BLOCKED, f"Would exceed position limit of {limit}"

        # Check order value limits
        if order_value > self.max_order_value:
            self.log_blocked(trade, "Order value exceeded")
            return GuardrailResult.BLOCKED, f"Order value \${order_value:,.0f} exceeds max"

        # Check approval threshold
        if order_value > self.require_approval_threshold:
            self.log_approval_required(trade)
            return GuardrailResult.REQUIRES_APPROVAL, f"Order > \${self.require_approval_threshold:,.0f}"

        self.log_allowed(trade)
        return GuardrailResult.ALLOWED, "Trade passed all checks"

    def log_blocked(self, trade: dict, reason: str):
        """Immutable audit log for blocked trades."""
        self.audit_log.append({
            "action": "BLOCKED",
            "trade": trade,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat(),
            "agent_session": self.session_id,
        })`}
          </Code>
          <Callout type="warning" title="Defense in depth">
            Don't rely on a single guardrail layer. Use <strong>Bedrock Guardrails</strong> for content safety, <strong>Lambda checks</strong> for business rules, <strong>database constraints</strong> for position limits, and <strong>human approval</strong> for high-stakes decisions. If one layer fails, others catch the issue.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "observability",
      title: "Production Observability",
      subtitle: "Monitoring, tracing, and debugging agents",
      content: (
        <Prose>
          <p>
            Observability for agentic systems has <strong>three tiers</strong>. <strong>Agent behavior observability</strong> tracks each reasoning step: which tools were called, with what parameters, what results returned, how many tokens consumed. <strong>Task-level metrics</strong> aggregate across executions: task completion rate (target: 85-95%), latency percentiles (p50, p95, p99), cost per task, error rates by type. <strong>System dashboards</strong> show operational health: agent adoption, cost trends, performance over time.
          </p>
          <p>
            <strong>AWS Lambda Powertools</strong> provides structured logging, distributed tracing with X-Ray, and CloudWatch metrics in a decorator-based pattern. Every agent execution gets a <strong>correlation ID</strong> that ties together all logs, traces, and metrics for that request. This is essential for debugging—when a trade fails, you can trace from the user request through every reasoning step, tool call, and response.
          </p>
          <p>
            <strong>Key metrics to track</strong>: <strong>Task completion rate</strong> (did the agent finish successfully?), <strong>Tool accuracy</strong> (were the right tools called with correct parameters?), <strong>Reasoning quality</strong> (subjective but can be spot-checked), <strong>Latency</strong> (total time and per-step breakdown), <strong>Cost</strong> (tokens consumed, Lambda duration). Set alerts on completion rate drops, latency spikes, and cost anomalies.
          </p>
          <Code title="Agent observability with Lambda Powertools">
{`from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.metrics import MetricUnit
import json

logger = Logger(service="trading-agent")
tracer = Tracer(service="trading-agent")
metrics = Metrics(namespace="TradingAgents")

@logger.inject_lambda_context(log_event=True)
@tracer.capture_lambda_handler
@metrics.log_metrics(capture_cold_start_metric=True)
def agent_handler(event: dict, context):
    """Agent Lambda with full observability."""

    correlation_id = context.aws_request_id

    # Log agent invocation
    logger.info("Agent invoked", extra={
        "correlation_id": correlation_id,
        "action_group": event.get("actionGroupName"),
        "api_path": event.get("apiPath"),
    })

    # Track tool execution
    with tracer.capture_method():
        start_time = time.time()
        result = execute_business_logic(event)
        duration_ms = (time.time() - start_time) * 1000

    # Emit metrics
    metrics.add_metric(
        name="ToolExecutionLatency",
        unit=MetricUnit.Milliseconds,
        value=duration_ms
    )
    metrics.add_metric(
        name="ToolInvocationCount",
        unit=MetricUnit.Count,
        value=1
    )

    # Log result for debugging
    logger.info("Tool execution complete", extra={
        "correlation_id": correlation_id,
        "duration_ms": duration_ms,
        "result_summary": summarize_result(result),
    })

    return format_agent_response(event, result)

def log_agent_reasoning(correlation_id: str, step: int, thought: str, action: str):
    """Log each reasoning step for audit trail."""
    logger.info("Agent reasoning step", extra={
        "correlation_id": correlation_id,
        "step": step,
        "thought": thought[:500],  # Truncate for logging
        "action": action,
        "timestamp": datetime.utcnow().isoformat(),
    })`}
          </Code>
          <Callout type="tip" title="Debugging agentic systems">
            When an agent fails: 1) Find the correlation ID from the error. 2) Query CloudWatch Logs Insights for all logs with that ID. 3) Trace the reasoning steps—which tool call failed? 4) Check the X-Ray trace for latency breakdown. 5) Reproduce with the same input in a test environment.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "cost-management",
      title: "Cost Management at Scale",
      subtitle: "Prompt caching, model tiering, and token optimization",
      content: (
        <Prose>
          <p>
            Agentic AI costs scale with usage in ways that can surprise. <strong>Cost drivers</strong>: foundation model tokens (input + output, billed per 1K or 1M), guardrails evaluation (per input and output), knowledge base queries (per retrieval), Lambda compute time, and data transfer. A single complex agent task might involve 5-10 LLM calls, each with thousands of tokens—costs add up quickly.
          </p>
          <p>
            <strong>Prompt caching</strong> provides 45-80% cost reduction for high-volume workloads. Cache the system prompt and reference data (which don't change between requests) so you only pay for the incremental user input and response. Bedrock supports prompt caching natively. Case study: a financial research agent reduced costs from $47K/month to $12.7K/month (73% reduction) by caching system prompts with market context.
          </p>
          <p>
            <strong>Intelligent routing</strong> sends requests to different models based on complexity. Route 70-80% of simple queries (price lookups, status checks) to cheap models (<strong>Claude Haiku</strong> at $0.80/$4.00 per 1M tokens). Route complex analysis to <strong>Claude Sonnet</strong> ($3/$15 per 1M). Reserve <strong>Claude Opus</strong> ($15/$75 per 1M) for edge cases requiring maximum capability. A simple classifier (can be rule-based or a small model) routes requests.
          </p>
          <p>
            <strong>Batch inference</strong> offers 50% discount for non-real-time workloads. Portfolio analysis, compliance reviews, and backtesting can run overnight as batch jobs. Bedrock now supports the Converse API format for batch inference, so you can use the same code for real-time and batch.
          </p>
          <Code title="Cost-optimized agent routing">
{`from enum import Enum
from dataclasses import dataclass

class ModelTier(Enum):
    FAST = "anthropic.claude-3-haiku-20240307-v1:0"       # $0.80/$4 per 1M
    BALANCED = "anthropic.claude-3-5-sonnet-20241022-v2:0"  # $3/$15 per 1M
    POWERFUL = "anthropic.claude-3-opus-20240229-v1:0"     # $15/$75 per 1M

@dataclass
class CostOptimizedRouter:
    """Route requests to appropriate model tier based on complexity."""

    # Simple heuristics for routing
    simple_patterns = ["price", "quote", "status", "holdings"]
    complex_patterns = ["analyze", "recommend", "strategy", "compare"]

    def route(self, query: str, context: dict) -> ModelTier:
        query_lower = query.lower()

        # Check for simple queries
        if any(p in query_lower for p in self.simple_patterns):
            if len(query) < 100 and not context.get("requires_reasoning"):
                return ModelTier.FAST

        # Check for complex queries
        if any(p in query_lower for p in self.complex_patterns):
            # High-value or risky decisions get best model
            if context.get("trade_value", 0) > 500_000:
                return ModelTier.POWERFUL
            return ModelTier.BALANCED

        # Default to balanced
        return ModelTier.BALANCED

    def estimate_cost(self, model: ModelTier, input_tokens: int, output_tokens: int) -> float:
        costs = {
            ModelTier.FAST: (0.25, 1.25),      # per 1M tokens
            ModelTier.BALANCED: (3.0, 15.0),
            ModelTier.POWERFUL: (15.0, 75.0),
        }
        input_cost, output_cost = costs[model]
        return (input_tokens / 1_000_000) * input_cost + (output_tokens / 1_000_000) * output_cost

class PromptCache:
    """Cache system prompts to reduce token costs."""

    def __init__(self, bedrock_client, cache_ttl_seconds: int = 300):
        self.client = bedrock_client
        self.cache_ttl = cache_ttl_seconds

    def create_cached_prompt(self, system_prompt: str, static_context: str) -> str:
        """Create a prompt with cacheable prefix."""
        # Bedrock caches the prefix automatically when it exceeds
        # the cache threshold (typically 1024+ tokens)
        return f"""<cached_context>
{system_prompt}

Reference Data:
{static_context}
</cached_context>

User Query:
"""`}
          </Code>
          <Callout type="insight" title="Cost attribution">
            Track costs per agent, per task type, and per user/team. This enables: 1) Identifying expensive patterns to optimize. 2) Chargebacks to business units. 3) ROI calculation (cost of agent vs. human time saved). 4) Budget alerts before overspending.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "testing-agents",
      title: "Testing Agentic Systems",
      subtitle: "Deterministic tests, evaluations, and chaos engineering",
      content: (
        <Prose>
          <p>
            Testing agents is challenging because LLM outputs are <strong>non-deterministic</strong>. The same input might produce different outputs, different tool call sequences, or different reasoning paths. You need a layered testing strategy: <strong>unit tests</strong> for deterministic components (tools, guardrails, data transforms), <strong>integration tests</strong> with mocked LLMs, and <strong>evaluation suites</strong> for end-to-end behavior assessment.
          </p>
          <p>
            The <strong>golden dataset approach</strong> curates 20-50 examples with expected behaviors: input query, expected tool sequence, expected output characteristics. Run the agent against these periodically and measure: <strong>task completion rate</strong>, <strong>tool accuracy</strong> (right tools, right parameters), <strong>output quality</strong> (often LLM-as-judge), <strong>latency</strong>, <strong>cost</strong>. Track metrics over time to detect degradation.
          </p>
          <p>
            <strong>Handling non-determinism</strong>: Use <strong>temperature=0</strong> for reproducibility in tests (not production, where some variability is often beneficial). Run tests multiple times and check consistency. Define <strong>invariants</strong> that must hold regardless of variation (e.g., "must call risk check before executing trade"). Use <strong>LLM-as-judge</strong> to evaluate quality on a rubric rather than exact string matching.
          </p>
          <p>
            <strong>Chaos engineering</strong> for agents: What happens when market data API is slow? When the knowledge base returns irrelevant results? When a tool throws an error? Test these scenarios explicitly. Financial agents must degrade gracefully—a failed analysis shouldn't result in executing a bad trade.
          </p>
          <Code title="Agent evaluation framework">
{`import pytest
from dataclasses import dataclass
from typing import Callable

@dataclass
class AgentTestCase:
    """A single test case for agent evaluation."""
    name: str
    input_query: str
    expected_tools: list[str]  # Tools that should be called
    invariants: list[Callable[[dict], bool]]  # Must all return True
    quality_rubric: str  # For LLM-as-judge evaluation

# Golden dataset
EVAL_CASES = [
    AgentTestCase(
        name="simple_price_query",
        input_query="What's the current price of NVDA?",
        expected_tools=["GetMarketData"],
        invariants=[
            lambda r: "price" in r["response"].lower(),
            lambda r: r["tool_calls"][0]["name"] == "GetMarketData",
        ],
        quality_rubric="Response should include current price and be concise."
    ),
    AgentTestCase(
        name="trade_with_risk_check",
        input_query="Buy 1000 shares of AAPL",
        expected_tools=["GetMarketData", "CheckRiskLimits", "SubmitOrder"],
        invariants=[
            lambda r: "CheckRiskLimits" in [t["name"] for t in r["tool_calls"]],
            lambda r: r["tool_calls"].index({"name": "CheckRiskLimits"}) <
                      r["tool_calls"].index({"name": "SubmitOrder"}),  # Risk before order
        ],
        quality_rubric="Must check risk before submitting order. Response should confirm order details."
    ),
]

class AgentEvaluator:
    """Evaluate agent against golden dataset."""

    def __init__(self, agent, llm_judge):
        self.agent = agent
        self.judge = llm_judge

    def run_evaluation(self, cases: list[AgentTestCase]) -> dict:
        results = []

        for case in cases:
            # Run agent (multiple times for consistency check)
            runs = [self.agent.run(case.input_query) for _ in range(3)]

            # Check invariants
            invariant_pass = all(
                all(inv(run) for inv in case.invariants)
                for run in runs
            )

            # Check tool usage
            tools_used = set(t["name"] for run in runs for t in run["tool_calls"])
            tool_accuracy = len(set(case.expected_tools) & tools_used) / len(case.expected_tools)

            # LLM-as-judge for quality
            quality_score = self.judge.evaluate(
                response=runs[0]["response"],
                rubric=case.quality_rubric
            )

            results.append({
                "name": case.name,
                "invariant_pass": invariant_pass,
                "tool_accuracy": tool_accuracy,
                "quality_score": quality_score,
                "consistency": self._check_consistency(runs),
            })

        return {
            "cases": results,
            "overall_pass_rate": sum(1 for r in results if r["invariant_pass"]) / len(results),
            "avg_tool_accuracy": sum(r["tool_accuracy"] for r in results) / len(results),
            "avg_quality": sum(r["quality_score"] for r in results) / len(results),
        }`}
          </Code>
        </Prose>
      ),
    },
  ],

  operations: [
    { name: "Bedrock Converse API", time: "200ms - 5s", space: "O(context)", note: "Depends on model, tokens, streaming" },
    { name: "Action Group (Lambda)", time: "50ms - 30s", space: "O(payload)", note: "Cold start + execution time" },
    { name: "Knowledge Base Query", time: "100-500ms", space: "O(k results)", note: "Vector search + retrieval" },
    { name: "Guardrails Evaluation", time: "50-200ms", space: "O(1)", note: "Per input/output evaluation" },
    { name: "Agent Loop Iteration", time: "500ms - 10s", space: "O(context)", note: "LLM + tool execution per step" },
    { name: "Multi-Agent Coordination", time: "2-30s", space: "O(agents × context)", note: "Depends on parallelization" },
    { name: "Memory Retrieval", time: "50-200ms", space: "O(k)", note: "Vector search for relevant context" },
    { name: "Prompt Cache Hit", time: "~0ms", space: "O(1)", note: "Cached prefix is free" },
  ],

  patterns: [
    {
      name: "ReAct Loop Implementation",
      description: "The core agent loop: observe context, think about next step, act, repeat.",
      explanation: `**ReAct** (Reason + Act) is the foundational agent pattern where the agent iteratively observes, reasons, and acts until the task is complete. Each iteration: gather context (observations), invoke the LLM to think about next steps, execute an action (tool call or response), then observe the result. The loop continues until the LLM indicates completion or max steps is reached.

The key implementation detail is **maintaining conversation state**. Each thought, action, and observation becomes a message in the conversation history. The LLM sees the full history and decides the next step based on accumulated context. This is what gives agents "memory" within a single task—they remember what they've already tried and learned.

For production, add **timeouts** (don't loop forever), **cost tracking** (each iteration costs tokens), and **graceful termination** (if stuck, return best-effort answer rather than failing). Also log each step for debugging—agent failures are often diagnosed by tracing reasoning steps.`,
      triggers: "\"agent\", \"ReAct\", \"reasoning loop\", \"observe think act\", \"autonomous\"",
      code: `import boto3
from dataclasses import dataclass

@dataclass
class ReActAgent:
    """Production ReAct agent with Bedrock."""

    bedrock: boto3.client
    model_id: str = "anthropic.claude-3-5-sonnet-20241022-v2:0"
    max_steps: int = 10

    def run(self, task: str, tools: list, system_prompt: str = "") -> dict:
        messages = [{"role": "user", "content": [{"text": task}]}]
        tool_config = self._build_tool_config(tools)

        for step in range(self.max_steps):
            response = self.bedrock.converse(
                modelId=self.model_id,
                system=[{"text": system_prompt}] if system_prompt else [],
                messages=messages,
                toolConfig=tool_config,
            )

            assistant_msg = response["output"]["message"]
            messages.append(assistant_msg)

            if response["stopReason"] == "end_turn":
                # Agent is done
                return {
                    "response": self._extract_text(assistant_msg),
                    "steps": step + 1,
                    "messages": messages,
                }

            if response["stopReason"] == "tool_use":
                # Execute tool and continue
                tool_results = self._execute_tools(assistant_msg, tools)
                messages.append({"role": "user", "content": tool_results})

        raise MaxStepsExceeded(f"Agent did not complete in {self.max_steps} steps")`,
    },
    {
      name: "Bedrock Converse API Multi-Turn",
      description: "Model-agnostic conversation with native tool use via AWS Bedrock.",
      explanation: `The **Converse API** is Bedrock's unified interface for multi-turn conversations. Unlike InvokeModel (which has model-specific request/response formats), Converse works identically across Claude, Llama, Mistral, and other models. This is the **enterprise standard**—write code once, swap models without changes.

Key features: **tool use** with structured tool_use blocks (not prompt engineering), **streaming** with ConverseStream for real-time token delivery, **system prompts** for persistent instructions, and **consistent message format** across all models. The API handles model-specific translation internally.

For production agents, Converse simplifies: **model evaluation** (easily A/B test models), **fallback patterns** (try Sonnet, fall back to Haiku), **cost optimization** (route by model without code changes), and **batch inference** (same format works for batch jobs with 50% discount).`,
      triggers: "\"Bedrock\", \"Converse API\", \"multi-turn\", \"model-agnostic\", \"enterprise\"",
      code: `import boto3
from typing import Generator

def converse_stream(
    bedrock: boto3.client,
    messages: list[dict],
    tools: list[dict] | None = None,
    model_id: str = "anthropic.claude-3-5-sonnet-20241022-v2:0",
) -> Generator[str, None, dict]:
    """Stream conversation with tool use support."""

    kwargs = {
        "modelId": model_id,
        "messages": messages,
    }
    if tools:
        kwargs["toolConfig"] = {"tools": tools}

    response = bedrock.converse_stream(**kwargs)

    full_response = {"content": [], "tool_calls": []}
    current_text = ""

    for event in response["stream"]:
        if "contentBlockDelta" in event:
            delta = event["contentBlockDelta"]["delta"]
            if "text" in delta:
                current_text += delta["text"]
                yield delta["text"]  # Stream to caller

        if "contentBlockStop" in event:
            if current_text:
                full_response["content"].append({"text": current_text})
                current_text = ""

        if "messageStop" in event:
            return full_response

# Usage with streaming
async def chat_with_streaming(user_input: str):
    messages = [{"role": "user", "content": [{"text": user_input}]}]

    print("Assistant: ", end="", flush=True)
    for token in converse_stream(bedrock, messages, tools=TRADING_TOOLS):
        print(token, end="", flush=True)
    print()`,
    },
    {
      name: "Action Group Lambda Handler",
      description: "Lambda function that handles Bedrock Agent action group invocations.",
      explanation: `**Action Groups** connect Bedrock Agents to your business logic. You define the API with an **OpenAPI 3.0 schema**, and Bedrock invokes your Lambda when the agent decides to use that tool. The Lambda receives a structured event with the action group name, API path, HTTP method, and parameters.

The Lambda must return a specific response format: the original action group and API path, an HTTP status code, and a **responseBody** that the agent incorporates into its reasoning. Structure your response to help the agent—include relevant data, status information, and any guidance for next steps.

For financial systems, Lambda handlers should: **validate inputs** (don't trust agent-generated parameters blindly), **check permissions** (use session attributes for user context), **log for audit** (every tool invocation is a compliance record), and **handle errors gracefully** (return helpful error messages the agent can reason about).`,
      triggers: "\"action group\", \"Lambda handler\", \"Bedrock agent\", \"tool execution\", \"OpenAPI\"",
      code: `import json
import boto3
from datetime import datetime

def lambda_handler(event: dict, context) -> dict:
    """Handle Bedrock Agent action group invocations."""

    # Extract invocation details
    action_group = event["actionGroup"]
    api_path = event["apiPath"]
    http_method = event["httpMethod"]
    parameters = event.get("parameters", [])
    session_attrs = event.get("sessionAttributes", {})

    # Convert parameters to dict
    params = {p["name"]: p["value"] for p in parameters}

    # Route to appropriate handler
    handlers = {
        "/portfolio/holdings": get_portfolio_holdings,
        "/market/quote": get_market_quote,
        "/trade/submit": submit_trade_order,
        "/risk/check": check_risk_limits,
    }

    handler = handlers.get(api_path)
    if not handler:
        return error_response(event, 404, f"Unknown API path: {api_path}")

    try:
        # Execute with audit logging
        log_invocation(event, session_attrs)
        result = handler(params, session_attrs)
        log_success(event, result)

        return {
            "messageVersion": "1.0",
            "response": {
                "actionGroup": action_group,
                "apiPath": api_path,
                "httpMethod": http_method,
                "httpStatusCode": 200,
                "responseBody": {
                    "application/json": {
                        "body": json.dumps(result)
                    }
                }
            }
        }
    except ValidationError as e:
        return error_response(event, 400, str(e))
    except PermissionError as e:
        return error_response(event, 403, str(e))
    except Exception as e:
        log_error(event, e)
        return error_response(event, 500, "Internal error processing request")

def error_response(event: dict, status: int, message: str) -> dict:
    return {
        "messageVersion": "1.0",
        "response": {
            "actionGroup": event["actionGroup"],
            "apiPath": event["apiPath"],
            "httpMethod": event["httpMethod"],
            "httpStatusCode": status,
            "responseBody": {
                "application/json": {
                    "body": json.dumps({"error": message})
                }
            }
        }
    }`,
    },
    {
      name: "Multi-Agent Orchestration",
      description: "Coordinate specialized agents for complex financial workflows.",
      explanation: `**Multi-agent systems** decompose complex tasks across specialized agents. In financial systems, this mirrors how trading desks work: analysts research, traders synthesize signals, risk managers approve, portfolio managers execute. Each agent focuses on its domain expertise, and a **supervisor** or orchestration layer coordinates them.

**Coordination patterns**: **Hierarchical** has a supervisor that delegates and aggregates (most control, potential bottleneck). **Sequential** passes output through a pipeline (simple but can't parallelize). **Parallel** runs agents concurrently and merges results (fast but needs conflict resolution). Most production systems combine these—parallel analysis feeding into sequential decision-making with hierarchical oversight.

Key implementation concerns: **shared state** (all agents need current market data, positions), **conflict resolution** (what if analysts disagree?), **timeout handling** (don't wait forever for one slow agent), and **partial failure** (if sentiment agent fails, can we proceed with fundamental and technical?). Design for graceful degradation.`,
      triggers: "\"multi-agent\", \"orchestration\", \"coordinator\", \"specialist agents\", \"trading system\"",
      code: `import asyncio
from dataclasses import dataclass
from typing import Protocol

class AnalystAgent(Protocol):
    async def analyze(self, symbol: str, context: dict) -> dict: ...

@dataclass
class TradingCoordinator:
    """Orchestrates multi-agent trading workflow."""

    analysts: dict[str, AnalystAgent]  # fundamental, sentiment, technical
    trader: TraderAgent
    risk_manager: RiskAgent
    executor: ExecutionAgent
    timeout_seconds: float = 30.0

    async def execute_workflow(self, symbol: str, market_data: dict) -> dict:
        """Run full trading workflow with timeout and error handling."""

        # Phase 1: Parallel analysis from all analysts
        analysis_tasks = {
            name: asyncio.create_task(agent.analyze(symbol, market_data))
            for name, agent in self.analysts.items()
        }

        analyses = {}
        try:
            done, pending = await asyncio.wait(
                analysis_tasks.values(),
                timeout=self.timeout_seconds,
                return_when=asyncio.ALL_COMPLETED
            )

            for name, task in analysis_tasks.items():
                if task in done:
                    analyses[name] = task.result()
                else:
                    task.cancel()
                    analyses[name] = {"status": "timeout", "signal": "neutral"}

        except Exception as e:
            # Proceed with available analyses
            for name, task in analysis_tasks.items():
                if task.done() and not task.cancelled():
                    analyses[name] = task.result()

        # Phase 2: Trader synthesizes and proposes
        proposal = await self.trader.propose(
            symbol=symbol,
            analyses=analyses,
            portfolio=self.get_portfolio_state(),
        )

        if proposal["action"] == "hold":
            return {"status": "no_trade", "reason": proposal["reason"]}

        # Phase 3: Risk manager approval
        risk_check = await self.risk_manager.evaluate(proposal)

        if not risk_check["approved"]:
            return {"status": "rejected", "reason": risk_check["reason"]}

        # Phase 4: Execute
        execution = await self.executor.execute(proposal)

        return {
            "status": "executed",
            "trade": execution,
            "analyses": analyses,
        }`,
    },
    {
      name: "Bedrock Guardrails Integration",
      description: "Apply content filters and compliance checks to agent inputs and outputs.",
      explanation: `**Amazon Bedrock Guardrails** provide configurable safety controls: **content filters** (block harmful/offensive content), **denied topics** (prevent discussion of specific subjects), **word filters** (block specific terms), **PII detection** (redact sensitive data), and **contextual grounding** (reduce hallucinations). Guardrails apply to both agent input and output.

For financial systems, configure guardrails to: **block insider trading signals** (deny topics around material non-public information), **filter restricted securities** (word filters for securities on restricted list), **protect client PII** (redact account numbers, SSNs in outputs), and **prevent unauthorized advice** (deny topics around individual investment advice if not licensed).

Guardrails are evaluated **before and after** the LLM call. Input guardrails catch problematic requests before they reach the model. Output guardrails filter the response before it reaches the user. Both add latency (~50-200ms) and cost, but are essential for compliance. In 2026, Bedrock guardrails are 85% cheaper than at launch—now $0.15 per 1,000 text units.`,
      triggers: "\"guardrails\", \"content filter\", \"compliance\", \"PII\", \"safety\", \"denied topics\"",
      code: `import boto3

bedrock = boto3.client("bedrock-runtime")

def apply_guardrails(
    text: str,
    guardrail_id: str,
    guardrail_version: str = "DRAFT",
    source: str = "INPUT",
) -> dict:
    """Apply Bedrock Guardrails to text."""

    response = bedrock.apply_guardrail(
        guardrailIdentifier=guardrail_id,
        guardrailVersion=guardrail_version,
        source=source,
        content=[{"text": {"text": text}}]
    )

    return {
        "action": response["action"],  # NONE, GUARDRAIL_INTERVENED
        "outputs": response.get("outputs", []),
        "assessments": response.get("assessments", []),
    }

def converse_with_guardrails(
    messages: list,
    guardrail_id: str,
    model_id: str = "anthropic.claude-3-5-sonnet-20241022-v2:0",
) -> dict:
    """Conversation with guardrails applied to input and output."""

    response = bedrock.converse(
        modelId=model_id,
        messages=messages,
        guardrailConfig={
            "guardrailIdentifier": guardrail_id,
            "guardrailVersion": "DRAFT",
            "trace": "enabled",  # Include guardrail trace in response
        }
    )

    # Check if guardrails intervened
    if response.get("stopReason") == "guardrail_intervened":
        trace = response.get("trace", {}).get("guardrail", {})
        return {
            "blocked": True,
            "reason": trace.get("assessments", []),
            "output": "I cannot process this request due to compliance policies."
        }

    return {
        "blocked": False,
        "output": response["output"]["message"]["content"][0]["text"]
    }

# Guardrail configuration (created via console or API)
FINANCIAL_GUARDRAIL_CONFIG = {
    "name": "trading-agent-guardrail",
    "blockedInputMessaging": "This request cannot be processed.",
    "blockedOutputsMessaging": "Response filtered for compliance.",
    "contentPolicyConfig": {
        "filtersConfig": [
            {"type": "HATE", "inputStrength": "HIGH", "outputStrength": "HIGH"},
            {"type": "VIOLENCE", "inputStrength": "HIGH", "outputStrength": "HIGH"},
        ]
    },
    "topicPolicyConfig": {
        "topicsConfig": [
            {
                "name": "insider-information",
                "definition": "Material non-public information about securities",
                "examples": ["The CEO told me earnings will beat estimates"],
                "type": "DENY"
            },
        ]
    },
    "wordPolicyConfig": {
        "wordsConfig": [
            {"text": "RESTRICTED_TICKER_1"},
            {"text": "RESTRICTED_TICKER_2"},
        ]
    }
}`,
    },
    {
      name: "Prompt Caching for Cost Optimization",
      description: "Cache system prompts and static context to reduce token costs by 45-80%.",
      explanation: `**Prompt caching** stores the tokenized representation of prompt prefixes, so repeated requests with the same prefix only pay for the incremental new tokens. For agents with stable system prompts and reference data, this provides 45-80% cost reduction. The tradeoff: there's a small overhead for cache management, so it's most beneficial for high-volume workloads.

How it works: Bedrock (and Anthropic directly) automatically cache prompts above a threshold (typically 1024+ tokens). The first request pays full price and populates the cache. Subsequent requests with the same prefix get a **cache hit**, paying only for the incremental tokens. Cache entries have TTL (typically 5 minutes), so sustained traffic is needed to benefit.

For trading agents, cache: **system prompts** (agent instructions, persona, rules), **reference data** (security master, risk limits, compliance rules), and **static context** (market regime descriptions, strategy documentation). Don't cache: user queries, dynamic market data, real-time positions. Structure prompts with cached content first, dynamic content last.`,
      triggers: "\"prompt caching\", \"cost optimization\", \"cache hit\", \"token reduction\", \"high volume\"",
      code: `from dataclasses import dataclass
from functools import lru_cache

@dataclass
class CachedPromptManager:
    """Manage prompt caching for cost optimization."""

    system_prompt: str
    reference_data: str
    cache_threshold_tokens: int = 1024

    def build_prompt(self, user_query: str, dynamic_context: str = "") -> list[dict]:
        """Build prompt with cacheable prefix first."""

        # Cacheable prefix (system + reference data)
        # This part stays constant across requests
        cached_prefix = f"""You are a trading assistant for a quantitative hedge fund.

## Rules
{self.system_prompt}

## Reference Data
{self.reference_data}

## Instructions
Analyze the user's request and use available tools to help them.
Always check risk limits before proposing trades.
"""

        # Dynamic content (not cached)
        dynamic_suffix = ""
        if dynamic_context:
            dynamic_suffix = f"""
## Current Context
{dynamic_context}
"""

        return [
            {"role": "user", "content": [{"text": f"{cached_prefix}{dynamic_suffix}User Query: {user_query}"}]}
        ]

    def estimate_savings(self, requests_per_hour: int, avg_dynamic_tokens: int) -> dict:
        """Estimate cost savings from caching."""

        cached_tokens = self._count_tokens(self.system_prompt + self.reference_data)

        # Without caching: pay for all tokens every request
        without_cache = requests_per_hour * (cached_tokens + avg_dynamic_tokens)

        # With caching: pay for cached tokens once per TTL period
        cache_ttl_hours = 1/12  # 5 minute TTL
        cache_populates = requests_per_hour * cache_ttl_hours
        with_cache = (cache_populates * cached_tokens) + (requests_per_hour * avg_dynamic_tokens)

        return {
            "without_cache_tokens": without_cache,
            "with_cache_tokens": with_cache,
            "savings_percent": (1 - with_cache / without_cache) * 100,
            "cached_prefix_tokens": cached_tokens,
        }

# Usage
manager = CachedPromptManager(
    system_prompt=TRADING_RULES,
    reference_data=load_security_master() + load_risk_limits(),
)

# High-volume requests benefit from caching
for query in user_queries:
    messages = manager.build_prompt(
        user_query=query,
        dynamic_context=get_current_positions(),
    )
    response = bedrock.converse(messages=messages, ...)`,
    },
    {
      name: "Step Functions Agent Orchestration",
      description: "Durable workflows for long-running agent tasks with human approval gates.",
      explanation: `**AWS Step Functions** orchestrates multi-step agent workflows with built-in state management, error handling, and human approval gates. Unlike pure agent loops (which run in a single Lambda invocation), Step Functions workflows persist state across steps, survive failures, and can pause for human input.

Use Step Functions when: workflows take **minutes to hours** (beyond Lambda timeout), **human approval** is required at specific gates, you need **durable audit trails** for compliance, or **complex branching logic** is easier to visualize in a state machine than code.

The pattern: Step Functions owns the macro workflow (sequence of steps, approvals, branching). Each step invokes a Lambda that might use an agent for reasoning. The agent handles the cognitive task; Step Functions handles orchestration, retries, and state. This separation makes workflows more observable and debuggable—you can see exactly where in the workflow execution is, vs. tracing through agent reasoning.`,
      triggers: "\"Step Functions\", \"workflow\", \"long-running\", \"human approval\", \"durable\", \"state machine\"",
      code: `# Step Functions State Machine Definition (ASL)
PORTFOLIO_REBALANCE_WORKFLOW = {
    "Comment": "Portfolio rebalancing with agent analysis and human approval",
    "StartAt": "AnalyzePortfolio",
    "States": {
        "AnalyzePortfolio": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:analyze-portfolio",
            "Next": "GenerateRebalanceProposal",
            "Retry": [{"ErrorEquals": ["TransientError"], "MaxAttempts": 3}],
        },
        "GenerateRebalanceProposal": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:generate-proposal",
            "Next": "CheckProposalSize",
        },
        "CheckProposalSize": {
            "Type": "Choice",
            "Choices": [
                {
                    "Variable": "$.proposal.total_value",
                    "NumericGreaterThan": 1000000,
                    "Next": "RequireHumanApproval"
                }
            ],
            "Default": "ExecuteRebalance"
        },
        "RequireHumanApproval": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
            "Parameters": {
                "FunctionName": "request-approval",
                "Payload": {
                    "proposal.$": "$.proposal",
                    "taskToken.$": "$$.Task.Token"
                }
            },
            "Next": "ProcessApprovalDecision",
            "TimeoutSeconds": 86400,  # 24 hour approval window
        },
        "ProcessApprovalDecision": {
            "Type": "Choice",
            "Choices": [
                {"Variable": "$.approved", "BooleanEquals": True, "Next": "ExecuteRebalance"},
            ],
            "Default": "WorkflowRejected"
        },
        "ExecuteRebalance": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:execute-rebalance",
            "Next": "GenerateReport",
        },
        "GenerateReport": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:generate-report",
            "End": True
        },
        "WorkflowRejected": {
            "Type": "Succeed",
            "Comment": "Workflow rejected by approver"
        }
    }
}

# Lambda to request approval (sends to Slack/email, waits for callback)
def request_approval_handler(event, context):
    task_token = event["taskToken"]
    proposal = event["proposal"]

    # Store task token for callback
    store_pending_approval(task_token, proposal)

    # Notify approvers
    send_slack_notification(
        channel="#portfolio-approvals",
        message=f"Rebalance proposal requires approval: \${proposal['total_value']:,.0f}",
        actions=[
            {"text": "Approve", "value": f"approve:{task_token}"},
            {"text": "Reject", "value": f"reject:{task_token}"},
        ]
    )

    # Don't return - Step Functions waits for SendTaskSuccess/SendTaskFailure

# Callback from Slack button
def approval_callback(decision: str, task_token: str):
    sfn = boto3.client("stepfunctions")

    if decision == "approve":
        sfn.send_task_success(
            taskToken=task_token,
            output=json.dumps({"approved": True})
        )
    else:
        sfn.send_task_success(
            taskToken=task_token,
            output=json.dumps({"approved": False})
        )`,
    },
    {
      name: "Tool Registration with Pydantic",
      description: "Register tools with typed schemas for automatic validation and schema generation.",
      explanation: `**Pydantic-based tool registration** provides type safety, automatic JSON schema generation, and runtime validation. Define each tool as a Pydantic model with typed fields, descriptions, and constraints. The registry generates OpenAPI-compatible schemas for Bedrock and validates all tool calls before execution.

Benefits: **compile-time type checking** catches schema mismatches during development, **automatic documentation** from docstrings and field descriptions, **runtime validation** prevents malformed tool calls from reaching business logic, and **consistent interface** across all tools.

For financial systems, add **permission annotations** (which tools require approval), **audit requirements** (which tools must be logged), and **rate limits** (max calls per time window). The registry becomes the single source of truth for agent capabilities.`,
      triggers: "\"tool registration\", \"Pydantic\", \"schema\", \"validation\", \"type safety\"",
      code: `from pydantic import BaseModel, Field
from typing import Callable, Literal
from functools import wraps

class ToolRegistry:
    """Type-safe tool registration with Pydantic."""

    def __init__(self):
        self.tools: dict[str, Callable] = {}
        self.schemas: list[dict] = []
        self.requires_approval: set[str] = set()

    def register(
        self,
        schema: type[BaseModel],
        requires_approval: bool = False,
    ):
        """Decorator to register a tool with its schema."""
        def decorator(func: Callable) -> Callable:
            tool_name = schema.__name__

            @wraps(func)
            def wrapper(**kwargs):
                # Validate inputs with Pydantic
                validated = schema(**kwargs)
                return func(**validated.model_dump())

            self.tools[tool_name] = wrapper
            self.schemas.append({
                "toolSpec": {
                    "name": tool_name,
                    "description": schema.__doc__ or "",
                    "inputSchema": {"json": schema.model_json_schema()}
                }
            })

            if requires_approval:
                self.requires_approval.add(tool_name)

            return wrapper
        return decorator

    def execute(self, tool_name: str, arguments: dict) -> dict:
        """Execute a tool with validation."""
        if tool_name not in self.tools:
            raise ValueError(f"Unknown tool: {tool_name}")

        if tool_name in self.requires_approval:
            raise ApprovalRequired(f"{tool_name} requires human approval")

        return self.tools[tool_name](**arguments)

    def get_bedrock_tool_config(self) -> dict:
        """Get tool config for Bedrock Converse API."""
        return {"tools": self.schemas}

# Usage
registry = ToolRegistry()

class GetPortfolioRisk(BaseModel):
    """Calculate risk metrics for a portfolio."""
    portfolio_id: str = Field(description="Portfolio identifier")
    metrics: list[Literal["var", "sharpe", "beta"]] = Field(
        default=["var"], description="Risk metrics to calculate"
    )

@registry.register(schema=GetPortfolioRisk)
def get_portfolio_risk(portfolio_id: str, metrics: list[str]) -> dict:
    portfolio = load_portfolio(portfolio_id)
    return {metric: calculate_metric(portfolio, metric) for metric in metrics}

class SubmitTradeOrder(BaseModel):
    """Submit a trade order. REQUIRES APPROVAL."""
    symbol: str
    side: Literal["buy", "sell"]
    quantity: int = Field(gt=0)

@registry.register(schema=SubmitTradeOrder, requires_approval=True)
def submit_trade_order(symbol: str, side: str, quantity: int) -> dict:
    return execute_trade(symbol, side, quantity)`,
    },
    {
      name: "Structured Output Parsing",
      description: "Force LLM to output valid JSON matching a schema for reliable data extraction.",
      explanation: `**Structured output** ensures the LLM returns valid, typed data rather than free-form text. This is essential for agents that need to extract information (entities, classifications, decisions) and pass it to downstream code. Without structured output, you're parsing text with regex—fragile and error-prone.

Modern approaches: **native tool use** (Bedrock, Anthropic, OpenAI all support), **instructor library** (patches clients to enforce Pydantic models), **JSON mode** (model outputs valid JSON, you parse and validate). Native tool use is most reliable—the model is trained to output valid tool calls, not just prompted.

For financial applications: extract **trade parameters** (symbol, quantity, side, price), **research summaries** (thesis, sentiment, price target), **risk assessments** (exposure, VaR, recommendations). Structure outputs to match your domain models so they flow directly into business logic.`,
      triggers: "\"structured output\", \"JSON\", \"data extraction\", \"parsing\", \"schema\"",
      code: `from pydantic import BaseModel, Field
from typing import Literal

class TradeRecommendation(BaseModel):
    """Structured trade recommendation from agent."""
    symbol: str
    action: Literal["buy", "sell", "hold"]
    confidence: float = Field(ge=0, le=1)
    quantity: int | None = Field(default=None, ge=0)
    rationale: str
    risk_factors: list[str]
    time_horizon: Literal["intraday", "swing", "position"]

class ResearchSummary(BaseModel):
    """Structured research summary."""
    symbol: str
    thesis: str
    sentiment: Literal["bullish", "bearish", "neutral"]
    price_target: float | None
    key_catalysts: list[str]
    risks: list[str]
    sources: list[str]

def extract_structured(
    bedrock: boto3.client,
    prompt: str,
    output_schema: type[BaseModel],
    model_id: str = "anthropic.claude-3-5-sonnet-20241022-v2:0",
) -> BaseModel:
    """Extract structured data using tool use."""

    # Define extraction tool
    tool_config = {
        "tools": [{
            "toolSpec": {
                "name": "extract_data",
                "description": f"Extract {output_schema.__name__} from the analysis",
                "inputSchema": {"json": output_schema.model_json_schema()}
            }
        }],
        "toolChoice": {"tool": {"name": "extract_data"}}  # Force tool use
    }

    response = bedrock.converse(
        modelId=model_id,
        messages=[{"role": "user", "content": [{"text": prompt}]}],
        toolConfig=tool_config,
    )

    # Extract tool call result
    for block in response["output"]["message"]["content"]:
        if "toolUse" in block:
            return output_schema(**block["toolUse"]["input"])

    raise ValueError("Model did not return structured output")

# Usage
recommendation = extract_structured(
    bedrock=bedrock,
    prompt=f"Analyze {symbol} and provide a trade recommendation based on: {analysis}",
    output_schema=TradeRecommendation,
)

print(f"Recommendation: {recommendation.action} {recommendation.symbol}")
print(f"Confidence: {recommendation.confidence:.0%}")`,
    },
    {
      name: "Error Recovery & Retry Logic",
      description: "Handle failures gracefully with exponential backoff, fallbacks, and circuit breakers.",
      explanation: `Production agents face transient failures: API rate limits, network timeouts, service unavailability. **Retry logic** with **exponential backoff** handles transient issues without overwhelming failing services. **Jitter** (randomness) prevents thundering herd when many clients retry simultaneously.

**Fallback patterns** provide degraded functionality when primary paths fail: fall back to a simpler/cheaper model, return cached results, or gracefully inform the user. **Circuit breakers** prevent cascading failures—if a service is failing, stop calling it entirely for a cooldown period rather than piling up failed requests.

For financial agents, distinguish **retryable errors** (rate limits, timeouts) from **fatal errors** (invalid parameters, authentication failures). Don't retry the latter. Also implement **idempotency**—retried operations should have the same effect as single execution, especially for trade submissions.`,
      triggers: "\"retry\", \"backoff\", \"error handling\", \"fallback\", \"circuit breaker\", \"resilience\"",
      code: `import asyncio
import random
from functools import wraps
from typing import TypeVar, Callable
from dataclasses import dataclass

T = TypeVar("T")

@dataclass
class RetryConfig:
    max_attempts: int = 3
    base_delay: float = 1.0
    max_delay: float = 60.0
    exponential_base: float = 2.0
    jitter: bool = True
    retryable_exceptions: tuple = (TimeoutError, ConnectionError, RateLimitError)

def with_retry(config: RetryConfig = RetryConfig()):
    """Decorator for retry with exponential backoff."""
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            last_exception = None

            for attempt in range(config.max_attempts):
                try:
                    return await func(*args, **kwargs)
                except config.retryable_exceptions as e:
                    last_exception = e

                    if attempt == config.max_attempts - 1:
                        raise

                    # Calculate delay with exponential backoff
                    delay = min(
                        config.base_delay * (config.exponential_base ** attempt),
                        config.max_delay
                    )

                    # Add jitter
                    if config.jitter:
                        delay *= (0.5 + random.random())

                    await asyncio.sleep(delay)

            raise last_exception
        return wrapper
    return decorator

class ModelFallback:
    """Fallback to simpler models on failure."""

    models = [
        "anthropic.claude-3-5-sonnet-20241022-v2:0",
        "anthropic.claude-3-haiku-20240307-v1:0",
    ]

    @with_retry()
    async def call_with_fallback(self, messages: list, tools: list) -> dict:
        for model in self.models:
            try:
                return await self._call_model(model, messages, tools)
            except (RateLimitError, ServiceUnavailableError) as e:
                if model == self.models[-1]:
                    raise  # Last resort failed
                continue  # Try next model

    async def _call_model(self, model_id: str, messages: list, tools: list) -> dict:
        response = await self.bedrock.converse(
            modelId=model_id,
            messages=messages,
            toolConfig={"tools": tools},
        )
        return response

class CircuitBreaker:
    """Prevent cascading failures with circuit breaker pattern."""

    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open

    async def call(self, func: Callable, *args, **kwargs):
        if self.state == "open":
            if self._should_attempt_recovery():
                self.state = "half-open"
            else:
                raise CircuitBreakerOpen("Circuit breaker is open")

        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        self.failures = 0
        self.state = "closed"

    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.state = "open"`,
    },
    {
      name: "Human-in-the-Loop Approval",
      description: "Pause agent execution for human approval on high-stakes decisions.",
      explanation: `For high-stakes actions (large trades, irreversible operations), agents should pause and request **human approval** before proceeding. This provides a safety net—humans catch errors that automated guardrails miss—and maintains accountability for decisions.

**Async approval patterns**: Agent submits request and returns immediately, human reviews asynchronously (via Slack, email, dashboard), decision triggers continuation. This avoids blocking the agent while waiting. Use **asyncio.Event** or **Step Functions waitForTaskToken** to implement the pause.

Design considerations: **tiered thresholds** (auto-approve small, escalate large), **timeout handling** (what happens if no response in 24 hours?), **escalation paths** (if primary approver doesn't respond, escalate to secondary), **audit logging** (who approved what when).`,
      triggers: "\"human approval\", \"human-in-the-loop\", \"escalation\", \"approval gate\", \"high stakes\"",
      code: `import asyncio
from enum import Enum
from dataclasses import dataclass, field
from typing import Optional
import uuid

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    TIMEOUT = "timeout"

@dataclass
class ApprovalRequest:
    id: str
    action: dict
    requester: str
    reason: str
    status: ApprovalStatus = ApprovalStatus.PENDING
    approver: Optional[str] = None
    decision_time: Optional[str] = None
    event: asyncio.Event = field(default_factory=asyncio.Event)

class ApprovalGate:
    """Human-in-the-loop approval for high-stakes agent actions."""

    def __init__(
        self,
        auto_approve_threshold: float = 10_000,
        timeout_seconds: float = 3600,
        notification_service: NotificationService = None,
    ):
        self.threshold = auto_approve_threshold
        self.timeout = timeout_seconds
        self.notifier = notification_service
        self.pending: dict[str, ApprovalRequest] = {}

    async def check(self, action: dict, requester: str) -> tuple[bool, str]:
        """Check if action needs approval and wait if so."""

        amount = action.get("value", action.get("quantity", 0) * action.get("price", 0))

        # Auto-approve below threshold
        if amount < self.threshold:
            self._log_auto_approved(action)
            return True, "Auto-approved: below threshold"

        # Create approval request
        request = ApprovalRequest(
            id=str(uuid.uuid4()),
            action=action,
            requester=requester,
            reason=f"Trade value \${amount:,.0f} exceeds \${self.threshold:,.0f} threshold",
        )
        self.pending[request.id] = request

        # Notify approvers
        await self._notify_approvers(request)

        # Wait for decision
        try:
            await asyncio.wait_for(request.event.wait(), timeout=self.timeout)

            if request.status == ApprovalStatus.APPROVED:
                return True, f"Approved by {request.approver}"
            else:
                return False, f"Rejected by {request.approver}: {request.reason}"

        except asyncio.TimeoutError:
            request.status = ApprovalStatus.TIMEOUT
            return False, "Approval timeout"
        finally:
            del self.pending[request.id]

    async def approve(self, request_id: str, approver: str):
        """Mark request as approved."""
        if request_id in self.pending:
            request = self.pending[request_id]
            request.status = ApprovalStatus.APPROVED
            request.approver = approver
            request.decision_time = datetime.utcnow().isoformat()
            request.event.set()
            self._log_decision(request)

    async def reject(self, request_id: str, approver: str, reason: str = ""):
        """Mark request as rejected."""
        if request_id in self.pending:
            request = self.pending[request_id]
            request.status = ApprovalStatus.REJECTED
            request.approver = approver
            request.reason = reason
            request.decision_time = datetime.utcnow().isoformat()
            request.event.set()
            self._log_decision(request)

    async def _notify_approvers(self, request: ApprovalRequest):
        """Send notification to approvers."""
        await self.notifier.send_slack(
            channel="#trade-approvals",
            message=f"Approval needed: {request.action}",
            actions=[
                {"text": "Approve", "callback": f"/approve/{request.id}"},
                {"text": "Reject", "callback": f"/reject/{request.id}"},
            ]
        )`,
    },
    {
      name: "Cost Tracking & Budgets",
      description: "Track API costs in real-time and enforce per-request and daily budgets.",
      explanation: `Agentic AI costs can spiral quickly—each reasoning step consumes tokens, and complex tasks might take 10+ LLM calls. **Cost tracking** monitors spend in real-time, enabling: **budget enforcement** (stop before exceeding limits), **attribution** (cost per agent, per user, per task type), **alerting** (notify when approaching limits), and **optimization** (identify expensive patterns to fix).

Track costs at multiple levels: **per-request** (single agent invocation), **per-task** (full workflow including multiple requests), **per-user/team** (chargebacks and accountability), **per-day** (operational budgets). Use token counters (tiktoken for Anthropic models) to estimate before calling, and actual token counts from responses to reconcile.

For financial firms, cost tracking ties into **P&L attribution**. If an agent generates $1M in alpha but costs $50K/month to run, that's a good trade. Track cost alongside performance to measure ROI.`,
      triggers: "\"cost tracking\", \"budget\", \"token counting\", \"spend limit\", \"ROI\"",
      code: `from dataclasses import dataclass, field
from contextlib import contextmanager
from datetime import datetime, date

@dataclass
class CostConfig:
    # Anthropic Claude 3.5 Sonnet pricing (per 1M tokens)
    input_cost_per_million: float = 3.0
    output_cost_per_million: float = 15.0

    # Budget limits
    budget_per_request: float = 1.0
    budget_per_task: float = 10.0
    budget_per_day: float = 1000.0

@dataclass
class CostTracker:
    """Track and enforce LLM costs."""

    config: CostConfig = field(default_factory=CostConfig)
    daily_spend: float = 0.0
    daily_reset_date: date = field(default_factory=date.today)
    request_spend: float = 0.0
    task_spend: float = 0.0

    def track_tokens(self, input_tokens: int, output_tokens: int) -> float:
        """Track cost from token usage."""
        self._check_daily_reset()

        cost = self._calculate_cost(input_tokens, output_tokens)

        # Check budgets
        if self.request_spend + cost > self.config.budget_per_request:
            raise BudgetExceeded(f"Request budget: \${self.config.budget_per_request}")

        if self.task_spend + cost > self.config.budget_per_task:
            raise BudgetExceeded(f"Task budget: \${self.config.budget_per_task}")

        if self.daily_spend + cost > self.config.budget_per_day:
            raise BudgetExceeded(f"Daily budget: \${self.config.budget_per_day}")

        # Update trackers
        self.request_spend += cost
        self.task_spend += cost
        self.daily_spend += cost

        return cost

    def _calculate_cost(self, input_tokens: int, output_tokens: int) -> float:
        input_cost = (input_tokens / 1_000_000) * self.config.input_cost_per_million
        output_cost = (output_tokens / 1_000_000) * self.config.output_cost_per_million
        return input_cost + output_cost

    @contextmanager
    def track_request(self):
        """Context manager for per-request tracking."""
        self.request_spend = 0.0
        try:
            yield self
        finally:
            # Log request cost
            self._log_request_cost(self.request_spend)

    @contextmanager
    def track_task(self, task_id: str):
        """Context manager for per-task tracking."""
        self.task_spend = 0.0
        start_time = datetime.utcnow()
        try:
            yield self
        finally:
            # Log task cost with metadata
            self._log_task_cost(task_id, self.task_spend, start_time)

    @property
    def remaining_daily(self) -> float:
        return self.config.budget_per_day - self.daily_spend

    def get_cost_report(self) -> dict:
        return {
            "daily_spend": self.daily_spend,
            "daily_remaining": self.remaining_daily,
            "daily_budget": self.config.budget_per_day,
            "utilization_percent": (self.daily_spend / self.config.budget_per_day) * 100,
        }

# Usage with agent
tracker = CostTracker()

with tracker.track_task("portfolio-analysis-123"):
    with tracker.track_request():
        response = agent.run("Analyze NVDA")
        tracker.track_tokens(
            response["usage"]["input_tokens"],
            response["usage"]["output_tokens"]
        )

    # Multiple requests in one task
    with tracker.track_request():
        response = agent.run("Compare to AMD")
        tracker.track_tokens(...)

print(f"Task cost: \${tracker.task_spend:.4f}")`,
    },
  ],

  problems: [
    {
      id: "simple-react-agent",
      title: "Implement a Simple ReAct Agent",
      difficulty: "medium",
      description: "Implement a basic ReAct agent that can use tools to answer questions. The agent should loop through observe-think-act until it has an answer or reaches max steps.",
      examples: [{ input: 'agent.run("What is 25 * 4?")', output: "100", explanation: "Agent uses calculator tool, gets result, responds." }],
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
            tool_str = content[5:].strip()
            tool_name = tool_str.split("(")[0]
            args_str = tool_str.split("(")[1].rstrip(")")

            if tool_name in tools:
                result = tools[tool_name](args_str)
                messages.append({"role": "assistant", "content": content})
                messages.append({"role": "user", "content": f"Tool result: {result}"})
            else:
                messages.append({"role": "user", "content": f"Unknown tool: {tool_name}"})
        else:
            messages.append({"role": "assistant", "content": content})

    raise Exception("Max steps reached without answer")`,
      hints: ["Start with a system message explaining available tools.", "Parse the LLM's response to detect tool calls vs final answers.", "After tool execution, add the result as a new user message."],
      testCases: [{ input: 'react_agent(mock_llm, {"calc": eval}, "What is 2+2?")', expected: '"4"', description: "Simple calculation" }],
    },
    {
      id: "tool-schema",
      title: "Design Tool Schema for Portfolio Queries",
      difficulty: "easy",
      description: "Design Pydantic schemas for portfolio management tools: get_holdings, get_performance, and execute_rebalance.",
      examples: [{ input: "GetHoldings(portfolio_id='PORT001')", output: '[{"symbol": "NVDA", "weight": 0.15}, ...]' }],
      starterCode: `from pydantic import BaseModel, Field
from typing import Literal

class GetHoldings(BaseModel):
    """Get current holdings for a portfolio."""
    pass

class GetPerformance(BaseModel):
    """Get portfolio performance metrics."""
    pass

class ExecuteRebalance(BaseModel):
    """Execute a portfolio rebalance (requires approval)."""
    pass`,
      solution: `from pydantic import BaseModel, Field
from typing import Literal
from datetime import date

class GetHoldings(BaseModel):
    """Get current holdings for a portfolio."""
    portfolio_id: str = Field(description="Unique portfolio identifier")
    as_of_date: date | None = Field(default=None, description="Point-in-time date")

class GetPerformance(BaseModel):
    """Get portfolio performance metrics over a period."""
    portfolio_id: str = Field(description="Unique portfolio identifier")
    start_date: date = Field(description="Start of performance period")
    end_date: date = Field(description="End of performance period")
    benchmark: str = Field(default="SPY", description="Benchmark symbol")

class ExecuteRebalance(BaseModel):
    """Execute a portfolio rebalance to target weights (requires approval)."""
    portfolio_id: str = Field(description="Portfolio to rebalance")
    target_weights: dict[str, float] = Field(description="Target weights by symbol")
    urgency: Literal["low", "normal", "high"] = Field(default="normal")
    dry_run: bool = Field(default=True, description="Simulate without executing")`,
      hints: ["Use Field() to add descriptions.", "Use Literal for constrained choices.", "Include sensible defaults.", "Add dry_run for dangerous operations."],
      testCases: [{ input: 'GetHoldings(portfolio_id="PORT001").model_dump()', expected: '{"portfolio_id": "PORT001", "as_of_date": null}', description: "Schema validation" }],
    },
    {
      id: "retry-wrapper",
      title: "Implement Retry with Exponential Backoff",
      difficulty: "medium",
      description: "Implement a decorator that retries a function with exponential backoff on failure.",
      examples: [{ input: "@retry(max_attempts=3)\\ndef flaky_api(): ...", output: "Retries up to 3 times with exponential backoff" }],
      starterCode: `import time
import functools

def retry(max_attempts: int = 3, base_delay: float = 1.0, max_delay: float = 30.0):
    """Decorator that retries with exponential backoff."""
    pass`,
      solution: `import time
import functools
import random

def retry(max_attempts: int = 3, base_delay: float = 1.0, max_delay: float = 30.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None

            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        delay = min(base_delay * (2 ** attempt), max_delay)
                        delay *= (0.5 + random.random())  # Jitter
                        time.sleep(delay)

            raise last_exception
        return wrapper
    return decorator`,
      hints: ["Use functools.wraps to preserve metadata.", "Calculate delay as base_delay * (2 ** attempt).", "Cap delay at max_delay.", "Add jitter to prevent thundering herd."],
      testCases: [{ input: "retry(max_attempts=3)(lambda: 1)()", expected: "1", description: "Success on first try" }],
    },
    {
      id: "cost-tracker",
      title: "Create a Cost Tracking Wrapper",
      difficulty: "medium",
      description: "Implement a cost tracker that monitors API usage and raises an exception when budget is exceeded.",
      examples: [{ input: "tracker.track_cost(input_tokens=1000, output_tokens=500)", output: "Tracks $0.025" }],
      starterCode: `from dataclasses import dataclass, field
from contextlib import contextmanager

@dataclass
class CostTracker:
    budget: float = 10.0
    input_cost_per_million: float = 3.0
    output_cost_per_million: float = 15.0
    total_spent: float = field(default=0.0)

    def track_cost(self, input_tokens: int, output_tokens: int) -> float:
        pass

    @contextmanager
    def budget_context(self):
        pass

    @property
    def remaining(self) -> float:
        pass`,
      solution: `from dataclasses import dataclass, field
from contextlib import contextmanager

class BudgetExceeded(Exception):
    pass

@dataclass
class CostTracker:
    budget: float = 10.0
    input_cost_per_million: float = 3.0
    output_cost_per_million: float = 15.0
    total_spent: float = field(default=0.0)

    def track_cost(self, input_tokens: int, output_tokens: int) -> float:
        input_cost = (input_tokens / 1_000_000) * self.input_cost_per_million
        output_cost = (output_tokens / 1_000_000) * self.output_cost_per_million
        cost = input_cost + output_cost

        if self.total_spent + cost > self.budget:
            raise BudgetExceeded(f"Would exceed budget: \${self.total_spent + cost:.4f}")

        self.total_spent += cost
        return cost

    @contextmanager
    def budget_context(self):
        start = self.total_spent
        yield self
        spent = self.total_spent - start
        print(f"Context spent: \${spent:.4f}")

    @property
    def remaining(self) -> float:
        return self.budget - self.total_spent`,
      hints: ["Calculate cost as (tokens / 1M) * rate.", "Check budget BEFORE adding cost.", "Use contextmanager for scoped tracking."],
      testCases: [{ input: "CostTracker(budget=1.0).track_cost(1000, 1000)", expected: "0.018", description: "Basic cost calculation" }],
    },
    {
      id: "approval-gate",
      title: "Build an Approval Workflow",
      difficulty: "hard",
      description: "Implement an async approval gate that pauses execution for high-value actions.",
      examples: [{ input: 'await gate.check({"action": "trade", "amount": 50000})', output: "Waits for approval" }],
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
        pass

    async def approve(self, request_id: str):
        pass

    async def reject(self, request_id: str):
        pass`,
      solution: `import asyncio
from enum import Enum
from dataclasses import dataclass, field
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
    pending: dict = field(default_factory=dict)

    async def check(self, action: dict) -> bool:
        amount = action.get("amount", 0)
        if amount < self.auto_approve_threshold:
            return True

        request_id = str(uuid.uuid4())
        approval = PendingApproval(action=action)
        self.pending[request_id] = approval

        try:
            await asyncio.wait_for(approval.event.wait(), self.timeout_seconds)
            return approval.status == ApprovalStatus.APPROVED
        except asyncio.TimeoutError:
            return False
        finally:
            del self.pending[request_id]

    async def approve(self, request_id: str):
        if request_id in self.pending:
            self.pending[request_id].status = ApprovalStatus.APPROVED
            self.pending[request_id].event.set()

    async def reject(self, request_id: str):
        if request_id in self.pending:
            self.pending[request_id].status = ApprovalStatus.REJECTED
            self.pending[request_id].event.set()`,
      hints: ["Use asyncio.Event to signal decisions.", "Store pending approvals in a dict.", "Use asyncio.wait_for for timeout.", "Auto-approve below threshold."],
      testCases: [{ input: 'await ApprovalGate(auto_approve_threshold=10000).check({"amount": 5000})', expected: "True", description: "Auto-approve below threshold" }],
    },
    {
      id: "bedrock-agent-design",
      title: "Design Bedrock Agent for Portfolio Rebalancing",
      difficulty: "hard",
      description: "Design the OpenAPI schema and Lambda handler for a Bedrock Agent action group that handles portfolio rebalancing with risk checks.",
      examples: [{ input: "Agent: 'Rebalance portfolio to 60/40 stocks/bonds'", output: "Calls risk check, proposes trades, requests approval" }],
      starterCode: `# Design the OpenAPI schema for these operations:
# 1. get_current_allocation - Get current portfolio weights
# 2. calculate_rebalance - Calculate trades needed for target allocation
# 3. check_risk_limits - Validate against position and risk limits
# 4. execute_rebalance - Execute the rebalancing trades (requires approval)

OPENAPI_SCHEMA = {
    "openapi": "3.0.0",
    "paths": {
        # Your schema here
    }
}

def lambda_handler(event: dict, context) -> dict:
    """Handle action group invocations."""
    pass`,
      solution: `OPENAPI_SCHEMA = {
    "openapi": "3.0.0",
    "info": {"title": "Portfolio Rebalancing API", "version": "1.0.0"},
    "paths": {
        "/portfolio/allocation": {
            "get": {
                "operationId": "get-current-allocation",
                "description": "Get current portfolio weights by asset class",
                "parameters": [
                    {"name": "portfolio_id", "in": "query", "required": True, "schema": {"type": "string"}}
                ],
                "responses": {"200": {"description": "Current allocation weights"}}
            }
        },
        "/portfolio/rebalance-plan": {
            "post": {
                "operationId": "calculate-rebalance",
                "description": "Calculate trades needed for target allocation",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "portfolio_id": {"type": "string"},
                                    "target_allocation": {"type": "object"},
                                    "tolerance_pct": {"type": "number", "default": 1.0}
                                }
                            }
                        }
                    }
                },
                "responses": {"200": {"description": "Proposed trades"}}
            }
        },
        "/risk/check": {
            "post": {
                "operationId": "check-risk-limits",
                "description": "Validate proposed trades against risk limits",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "portfolio_id": {"type": "string"},
                                    "proposed_trades": {"type": "array"}
                                }
                            }
                        }
                    }
                },
                "responses": {"200": {"description": "Risk check result"}}
            }
        },
        "/portfolio/execute-rebalance": {
            "post": {
                "operationId": "execute-rebalance",
                "description": "Execute rebalancing trades. REQUIRES HUMAN APPROVAL.",
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "portfolio_id": {"type": "string"},
                                    "trades": {"type": "array"},
                                    "approval_id": {"type": "string"}
                                }
                            }
                        }
                    }
                },
                "responses": {"200": {"description": "Execution result"}}
            }
        }
    }
}

def lambda_handler(event: dict, context) -> dict:
    api_path = event["apiPath"]
    params = {p["name"]: p["value"] for p in event.get("parameters", [])}
    body = event.get("requestBody", {}).get("content", {}).get("application/json", {})

    handlers = {
        "/portfolio/allocation": get_allocation,
        "/portfolio/rebalance-plan": calculate_rebalance,
        "/risk/check": check_risk,
        "/portfolio/execute-rebalance": execute_rebalance,
    }

    result = handlers[api_path]({**params, **body})

    return {
        "messageVersion": "1.0",
        "response": {
            "actionGroup": event["actionGroup"],
            "apiPath": api_path,
            "httpStatusCode": 200,
            "responseBody": {"application/json": {"body": json.dumps(result)}}
        }
    }`,
      hints: ["Each operation needs operationId, parameters/requestBody, and responses.", "Mark high-stakes operations with REQUIRES APPROVAL in description.", "Lambda should route by apiPath.", "Include audit logging."],
      testCases: [],
    },
    {
      id: "multi-agent-coordinator",
      title: "Implement Multi-Agent Trading Coordinator",
      difficulty: "hard",
      description: "Implement a coordinator that orchestrates multiple specialist agents (fundamental, sentiment, technical) and a risk manager for trading decisions.",
      examples: [{ input: "coordinator.analyze('NVDA')", output: "Aggregated analysis with risk-approved trade recommendation" }],
      starterCode: `import asyncio
from dataclasses import dataclass
from typing import Protocol

class AnalystAgent(Protocol):
    async def analyze(self, symbol: str) -> dict: ...

class RiskAgent(Protocol):
    async def evaluate(self, proposal: dict) -> dict: ...

@dataclass
class TradingCoordinator:
    analysts: dict[str, AnalystAgent]
    risk_manager: RiskAgent
    timeout: float = 30.0

    async def analyze_and_recommend(self, symbol: str) -> dict:
        pass`,
      solution: `import asyncio
from dataclasses import dataclass
from typing import Protocol

class AnalystAgent(Protocol):
    async def analyze(self, symbol: str) -> dict: ...

class RiskAgent(Protocol):
    async def evaluate(self, proposal: dict) -> dict: ...

@dataclass
class TradingCoordinator:
    analysts: dict[str, AnalystAgent]
    risk_manager: RiskAgent
    timeout: float = 30.0

    async def analyze_and_recommend(self, symbol: str) -> dict:
        # Run all analysts in parallel
        tasks = {
            name: asyncio.create_task(agent.analyze(symbol))
            for name, agent in self.analysts.items()
        }

        analyses = {}
        done, pending = await asyncio.wait(
            tasks.values(),
            timeout=self.timeout,
            return_when=asyncio.ALL_COMPLETED
        )

        # Collect results, handle timeouts
        for name, task in tasks.items():
            if task in done and not task.cancelled():
                try:
                    analyses[name] = task.result()
                except Exception as e:
                    analyses[name] = {"error": str(e), "signal": "neutral"}
            else:
                task.cancel()
                analyses[name] = {"status": "timeout", "signal": "neutral"}

        # Synthesize recommendation
        signals = [a.get("signal", "neutral") for a in analyses.values()]
        bullish = signals.count("bullish")
        bearish = signals.count("bearish")

        if bullish > bearish and bullish >= 2:
            action = "buy"
            confidence = bullish / len(signals)
        elif bearish > bullish and bearish >= 2:
            action = "sell"
            confidence = bearish / len(signals)
        else:
            return {"action": "hold", "reason": "No consensus", "analyses": analyses}

        proposal = {
            "symbol": symbol,
            "action": action,
            "confidence": confidence,
            "analyses": analyses,
        }

        # Risk check
        risk_result = await self.risk_manager.evaluate(proposal)

        if not risk_result["approved"]:
            return {
                "action": "blocked",
                "reason": risk_result["reason"],
                "original_proposal": proposal,
            }

        return {
            "action": action,
            "confidence": confidence,
            "analyses": analyses,
            "risk_approved": True,
        }`,
      hints: ["Use asyncio.wait with timeout for parallel execution.", "Handle partial failures gracefully.", "Synthesize signals with voting or weighted average.", "Always check with risk manager before returning recommendation."],
      testCases: [],
    },
  ],
};
