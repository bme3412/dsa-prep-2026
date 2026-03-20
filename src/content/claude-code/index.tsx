import type { DataStructure } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div
    className="space-y-4 text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-[var(--color-text-primary)]"
    style={{ color: "var(--color-text-secondary)" }}
  >
    {children}
  </div>
);

const Code = ({ title, children, language = "python" }: { title?: string; children: string; language?: "python" | "typescript" | "bash" | "yaml" }) => (
  <CodeBlock code={children} language={language} title={title} />
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

export const claudeCodeContent: DataStructure = {
  id: "claude-code",
  name: "Claude Code",
  icon: "🤖",
  color: "accent",
  tagline: "Master Claude Code CLI and build production AI agents",
  description: "Learn Claude Code, MCP tool integration, hooks, and building production-grade AI agents with the Anthropic SDK.",
  viewMode: "concepts",

  sections: [
    {
      id: "fundamentals",
      title: "Claude Code Fundamentals",
      subtitle: "Getting productive with the CLI",
      content: (
        <Prose>
          <p>
            <strong>Claude Code</strong> is Anthropic's official CLI for Claude — an agentic coding assistant that operates directly in your terminal. Unlike chat interfaces, Claude Code can read your codebase, execute commands, edit files, and iterate on tasks autonomously. It's designed for developers who want Claude integrated into their workflow, not a separate window.
          </p>
          <p>
            The key insight is that Claude Code is <strong>agentic</strong>: you give it a goal, and it figures out the steps. It reads files to understand context, makes edits, runs tests, and iterates until the task is done. You stay in control with approval prompts for sensitive operations.
          </p>
          <p>
            This represents a fundamental shift from <strong>chat-based AI</strong> (you ask, it answers) to <strong>agent-based AI</strong> (you specify goals, it takes actions). Traditional coding assistants require you to copy/paste code snippets and manually apply suggestions. Claude Code operates on your actual files, understands your project structure, and can execute multi-step workflows autonomously. The difference is like asking someone for directions versus having them drive you there.
          </p>
          <p>
            Under the hood, Claude Code maintains a <strong>context window</strong> that includes your conversation history, file contents it has read, and tool results. This context is limited (around 200K tokens), so Claude Code intelligently manages what stays in context. Long conversations can be compacted with <code>/compact</code>, which summarizes earlier exchanges to free up space for new content.
          </p>
          <Code title="Installation and first run" language="bash">
{`# Install globally via npm
npm install -g @anthropic-ai/claude-code

# Or run directly with npx (no install)
npx @anthropic-ai/claude-code

# Start in your project directory
cd my-project
claude

# Claude reads your codebase and is ready to help`}
          </Code>
          <p>
            <strong>Essential commands</strong> control your session. These slash commands work at any time:
          </p>
          <Code title="Core slash commands" language="bash">
{`/help           # Show all commands and shortcuts
/clear          # Clear conversation history (start fresh)
/compact        # Summarize conversation to reduce context
/cost           # Show token usage and estimated cost
/config         # View/edit settings
/memory         # View what Claude remembers about your project

# Navigation
/quit or Ctrl+C # Exit Claude Code
Ctrl+L          # Clear screen (keeps conversation)
Up/Down arrows  # Navigate command history`}
          </Code>
          <p>
            <strong>Context is everything.</strong> Claude Code automatically indexes your project on startup, but you can guide its attention. Mention specific files or patterns, and Claude will read them. The more relevant context Claude has, the better its suggestions.
          </p>
          <Code title="Guiding context" language="bash">
{`# Be specific about files
"Look at src/auth/login.tsx and fix the validation bug"

# Reference patterns
"Follow the pattern in UserService when creating OrderService"

# Point to docs
"Check the API documentation in docs/api.md before implementing"

# Exclude noise
"Focus on the backend/ directory, ignore frontend/"`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>CLAUDE.md - Project Memory</h3>
          <p>
            <strong>CLAUDE.md</strong> is a special file that Claude Code reads on startup. Use it to give Claude persistent context about your project: coding conventions, architecture decisions, common commands, and things to remember. This is your project's "constitution" for Claude.
          </p>
          <p>
            Think of CLAUDE.md as <strong>documentation for your AI teammate</strong>. Just as you'd write an onboarding doc for a new engineer, CLAUDE.md captures the implicit knowledge that experienced team members have: why certain patterns exist, what mistakes to avoid, and how things are done here. Without this, Claude infers patterns from code alone — which works, but misses the "why" behind decisions.
          </p>
          <p>
            CLAUDE.md also serves as a <strong>guard rail</strong>. By explicitly stating "we use X, not Y" or "never do Z," you prevent Claude from making reasonable-but-wrong suggestions based on general best practices that don't apply to your specific codebase. This is especially valuable for projects with unusual constraints or legacy decisions.
          </p>
          <Code title="Example CLAUDE.md" language="bash">
{`# CLAUDE.md - Project Context for Claude Code

## Project Overview
Investment research platform using Python + AWS Lambda + DynamoDB.

## Coding Conventions
- Use type hints everywhere
- Follow Google-style docstrings
- Tests go in tests/ mirroring src/ structure
- Use Pydantic for data validation

## Common Commands
- \`make test\` - Run all tests
- \`make lint\` - Run ruff + mypy
- \`sam local invoke\` - Test Lambda locally

## Architecture
- API Gateway → Lambda → DynamoDB
- Async processing via SQS
- Secrets in AWS Secrets Manager (never env vars)

## Important Files
- src/config.py - All configuration
- src/models/ - Pydantic models
- infrastructure/ - SAM templates

## Things to Remember
- Always use decimal.Decimal for money
- DynamoDB keys are PK + SK (single-table design)
- Never commit .env files`}
          </Code>
          <Callout type="tip" title="CLAUDE.md best practices">
            Keep CLAUDE.md concise (under 500 lines). Focus on information Claude couldn't infer from reading code: conventions, architectural decisions, and gotchas. Update it as your project evolves.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "prompting",
      title: "Effective Prompting for Code",
      subtitle: "Getting better results from Claude",
      content: (
        <Prose>
          <p>
            The difference between mediocre and excellent Claude Code results often comes down to <strong>how you prompt</strong>. Claude is capable of complex tasks, but it needs clear direction. The best prompts are specific, provide context, and break complex tasks into steps.
          </p>
          <p>
            Why does prompting matter so much? Claude operates with <strong>bounded rationality</strong> — it's very capable but works from limited information. Every prompt is an optimization problem: Claude tries to produce the best output given what it knows. The more relevant information in your prompt, the better Claude's "best guess" will be. Vague prompts lead to generic solutions; specific prompts lead to tailored solutions.
          </p>
          <p>
            There's also a <strong>principal-agent problem</strong> at play. You (the principal) want a specific outcome; Claude (the agent) interprets your request and acts. Misalignment happens when Claude optimizes for what it thinks you want rather than what you actually want. The solution is explicit communication: state your goals, constraints, and quality criteria directly. Don't assume Claude will infer them.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Task Decomposition</h3>
          <p>
            <strong>Break big tasks into smaller steps.</strong> Instead of "build a user authentication system," guide Claude through the components: "First, let's create the user model. Then we'll add the registration endpoint. After that, login and JWT tokens."
          </p>
          <p>
            This matters because LLMs have <strong>limited planning horizons</strong>. Claude can reason several steps ahead, but long-horizon planning degrades. By decomposing tasks, you're doing the high-level planning yourself and letting Claude excel at what it's good at: implementing well-defined pieces. Think of it as the difference between asking someone to "organize the office" versus "file these documents, then clear the desk, then sort the bookshelf."
          </p>
          <Code title="Bad vs good prompting" language="bash">
{`# Bad: Too vague, too big
"Add user authentication to this app"

# Good: Specific, scoped, contextual
"Create a User model in src/models/user.py with fields:
- id (UUID, primary key)
- email (unique, indexed)
- password_hash (never store plain passwords)
- created_at, updated_at

Follow the pattern in src/models/product.py.
Use Pydantic with SQLAlchemy integration."

# Even better: Reference existing code
"Look at how we handle Products in src/models/product.py
and create a similar User model"`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Providing Context</h3>
          <p>
            Claude Code reads files, but <strong>you know what's relevant</strong>. Point Claude to the right files, patterns to follow, and constraints to respect. The more specific your pointers, the better the results.
          </p>
          <Code title="Context-rich prompts" language="bash">
{`# Point to relevant files
"Read src/services/payment.py first - I want similar error handling"

# Specify patterns to follow
"Use the repository pattern like in src/repositories/base.py"

# Mention constraints
"This needs to work with Python 3.9 (no | union syntax)"
"Keep the function under 50 lines for readability"
"Don't add new dependencies - use what's in requirements.txt"

# Reference documentation
"The API spec is in docs/openapi.yaml - implement the /orders endpoint"`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Iterative Refinement</h3>
          <p>
            <strong>Start simple, then refine.</strong> Get a working version first, then add complexity. This approach catches misunderstandings early and builds incrementally.
          </p>
          <p>
            This mirrors how experienced developers work — <strong>make it work, make it right, make it fast</strong>. Starting with a minimal implementation lets you verify Claude understood the requirement before investing in edge cases and optimizations. If Claude misunderstood the core requirement, you've lost one iteration rather than a complex implementation. Early feedback loops are more valuable than upfront specification.
          </p>
          <Code title="Iterative development" language="bash">
{`# Round 1: Basic functionality
"Create a function that fetches stock prices from the API"

# Round 2: Add error handling
"Add retry logic for transient failures - 3 retries with exponential backoff"

# Round 3: Add caching
"Cache responses in Redis for 5 minutes to reduce API calls"

# Round 4: Add monitoring
"Add logging and metrics using our observability patterns in src/utils/metrics.py"`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Plan Mode vs Direct Execution</h3>
          <p>
            Use <strong>plan mode</strong> (<code>/plan</code>) for complex tasks where you want to review the approach before changes are made. Use <strong>direct execution</strong> for straightforward tasks where you trust Claude to proceed.
          </p>
          <Code title="When to use plan mode" language="bash">
{`# Use plan mode for:
/plan "Refactor the payment system to support multiple providers"
# Claude will explore the codebase, design an approach, and ask for approval

# Use direct execution for:
"Fix the typo in src/utils/helpers.py line 42"
"Add a docstring to the process_order function"
"Run the tests and fix any failures"`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Common Failure Modes</h3>
          <p>
            Understanding how Claude can go wrong helps you prompt better:
          </p>
          <Code title="Failure modes and fixes" language="bash">
{`# Problem: Claude changes too much
# Fix: Be explicit about scope
"Only modify the calculate_total function - don't touch other code"

# Problem: Claude doesn't follow project patterns
# Fix: Point to examples
"Follow the exact same structure as UserRepository in src/repositories/"

# Problem: Claude hallucinates APIs or libraries
# Fix: Ground in existing code
"Use only libraries already in requirements.txt"
"Check the actual boto3 documentation before using any methods"

# Problem: Claude over-engineers
# Fix: Constrain complexity
"Keep it simple - no abstractions unless necessary"
"This is a one-off script, not a reusable library"

# Problem: Claude doesn't understand business context
# Fix: Explain the why
"This is for a trading system where latency matters - optimize for speed"
"Users are non-technical - error messages should be friendly"`}
          </Code>
          <Callout type="insight" title="The golden rule">
            If you would need to explain it to a new team member, explain it to Claude. Context that seems obvious to you (project conventions, business logic, past decisions) isn't obvious to Claude.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "mcp",
      title: "MCP (Model Context Protocol)",
      subtitle: "Extending Claude with tools",
      content: (
        <Prose>
          <p>
            <strong>Model Context Protocol (MCP)</strong> is an open standard for connecting LLMs to external data and tools. Instead of building custom integrations for each AI model, MCP provides a universal protocol — like USB for AI tools. Claude Code uses MCP to integrate with databases, APIs, file systems, and custom tools.
          </p>
          <p>
            The fundamental insight behind MCP is <strong>separation of concerns</strong>. LLMs are good at reasoning and language; they shouldn't embed knowledge of every possible API. External systems have their own authentication, rate limits, and data formats; they shouldn't need to understand LLMs. MCP creates a clean boundary: tools describe what they do, LLMs decide when to use them.
          </p>
          <p>
            This is similar to how <strong>Unix pipes</strong> revolutionized computing. Instead of monolithic programs, Unix introduced small tools that do one thing well, connected by a standard interface (text streams). MCP does the same for AI: small, focused tools connected by a standard protocol. The result is composability — you can mix and match tools without rewriting anything.
          </p>
          <p>
            The architecture has three components: <strong>Hosts</strong> (like Claude Code) that want to use tools, <strong>Clients</strong> (built into hosts) that manage connections, and <strong>Servers</strong> that expose tools and data. You write MCP servers; hosts discover and use them automatically.
          </p>
          <Code title="MCP architecture" language="bash">
{`# MCP Architecture

┌─────────────────────────────────────────────────────┐
│                  HOST (Claude Code)                  │
│  ┌─────────────────────────────────────────────────┐│
│  │                   MCP CLIENT                    ││
│  │  - Discovers servers                            ││
│  │  - Manages connections                          ││
│  │  - Routes tool calls                            ││
│  └─────────────────────────────────────────────────┘│
└────────────────────┬────────────────────────────────┘
                     │ MCP Protocol (JSON-RPC over stdio/HTTP)
     ┌───────────────┼───────────────┐
     ▼               ▼               ▼
┌─────────┐   ┌─────────────┐   ┌─────────────┐
│Filesystem│   │   GitHub    │   │  Your Custom│
│  Server  │   │   Server    │   │   Server    │
└─────────┘   └─────────────┘   └─────────────┘`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Configuring MCP Servers</h3>
          <p>
            MCP servers are configured in Claude Code settings. Each server runs as a separate process and exposes tools that Claude can call.
          </p>
          <Code title="MCP configuration in settings" language="bash">
{`# ~/.claude/settings.json

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/allowed/dir"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxx"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost/db"
      }
    }
  }
}`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Building Custom MCP Servers</h3>
          <p>
            Build custom MCP servers to give Claude access to your internal APIs, databases, or specialized tools. The Python SDK makes this straightforward.
          </p>
          <p>
            The key to good MCP tool design is <strong>clear contracts</strong>. Each tool should have a descriptive name, detailed docstring explaining when to use it, and a well-typed input schema. Claude uses these descriptions to decide when to call your tool — vague descriptions lead to incorrect tool selection. Think of the docstring as the "sales pitch" for your tool.
          </p>
          <p>
            Error handling matters too. Tools should return <strong>informative error messages</strong> that help Claude recover. Instead of "API Error," return "Rate limit exceeded. Try again in 60 seconds" or "Symbol INVALID not found. Valid format: 1-5 uppercase letters." Claude can use this information to adjust its approach.
          </p>
          <Code title="Custom MCP server for market data">
{`from mcp import Server
import httpx

server = Server("market-data")

@server.tool()
async def get_stock_price(symbol: str) -> dict:
    """Get current stock price for a symbol.

    Args:
        symbol: Stock ticker symbol (e.g., AAPL, GOOGL)
    """
    async with httpx.AsyncClient() as client:
        url = f"https://api.marketdata.com/v1/quote/${"{"}{symbol}${"}"}"
        response = await client.get(url)
        return response.json()

@server.tool()
async def get_fundamentals(symbol: str) -> dict:
    """Get fundamental data for a company."""
    async with httpx.AsyncClient() as client:
        url = f"https://api.marketdata.com/v1/fundamentals/${"{"}{symbol}${"}"}"
        response = await client.get(url)
        return response.json()

if __name__ == "__main__":
    server.run()`}
          </Code>
          <Code title="Running your custom server" language="bash">
{`# Add to settings.json
{
  "mcpServers": {
    "market-data": {
      "command": "python",
      "args": ["/path/to/market_data_server.py"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}

# Now Claude can use your tools:
# "Get the current price and PE ratio for AAPL"
# Claude will call get_stock_price and get_company_fundamentals`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>MCP Resources</h3>
          <p>
            Beyond tools, MCP servers can expose <strong>resources</strong> — data that Claude can read. This is useful for documentation, configuration, or dynamic content.
          </p>
          <Code title="MCP resources">
{`from mcp import Server
from mcp.types import Resource, TextResourceContents

server = Server("docs")

@server.resource("docs://api/endpoints")
async def get_api_docs() -> Resource:
    """Expose API documentation as a resource."""
    docs = load_api_documentation()

    return Resource(
        uri="docs://api/endpoints",
        name="API Endpoints Documentation",
        mimeType="text/markdown",
        contents=TextResourceContents(text=docs)
    )

@server.resource("docs://schema/{table_name}")
async def get_table_schema(table_name: str) -> Resource:
    """Expose database schema as a resource."""
    schema = get_schema_for_table(table_name)

    return Resource(
        uri=f"docs://schema/{table_name}",
        name=f"Schema for {table_name}",
        mimeType="application/json",
        contents=TextResourceContents(text=json.dumps(schema))
    )`}
          </Code>
          <Callout type="warning" title="Security considerations">
            MCP servers run with your permissions. Be careful about what tools you expose — a tool that executes arbitrary SQL or shell commands could be dangerous. Use allowlists, validate inputs, and avoid exposing sensitive operations.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "hooks",
      title: "Hooks System",
      subtitle: "Automating workflows with Claude Code",
      content: (
        <Prose>
          <p>
            <strong>Hooks</strong> let you run custom code in response to Claude Code events. Run a linter after every file edit. Send notifications when tasks complete. Block certain operations. Hooks turn Claude Code from a tool into an integrated part of your workflow.
          </p>
          <p>
            The hook system follows the <strong>Inversion of Control</strong> pattern common in frameworks. Instead of you calling functions, the framework (Claude Code) calls your functions at defined extension points. This allows customization without forking the codebase — you inject behavior into the existing flow.
          </p>
          <p>
            Hooks also implement a form of <strong>aspect-oriented programming</strong>. Concerns like logging, validation, and formatting cut across all file edits — they're "cross-cutting concerns." Rather than Claude needing to know about your linter, hooks let you inject this behavior transparently. The agent focuses on the task; hooks handle the environment.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Hook Types</h3>
          <p>
            Four hook types cover the agent lifecycle. The distinction between <strong>PreToolUse</strong> and <strong>PostToolUse</strong> is crucial: Pre hooks can <strong>prevent</strong> actions (they're gates), while Post hooks can only <strong>react</strong> to actions (they're observers). This maps to security patterns: pre-hooks for access control, post-hooks for auditing.
          </p>
          <Code title="Hook types" language="bash">
{`# PreToolUse - Before Claude executes a tool
# Use cases: Validation, approval gates, logging
# Can block the operation by returning non-zero exit code

# PostToolUse - After Claude executes a tool
# Use cases: Auto-formatting, linting, notifications
# Cannot block (already happened)

# Notification - When Claude wants to tell you something
# Use cases: Send to Slack, email, desktop notification

# Stop - When Claude finishes a task
# Use cases: Run tests, deploy, send summary`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Configuring Hooks</h3>
          <p>
            Configure hooks in your settings or project-specific <code>.claude/settings.json</code>:
          </p>
          <Code title="Hook configuration" language="bash">
{`# .claude/settings.json (project-specific)

{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "npx prettier --write $FILE_PATH"
      },
      {
        "matcher": "Edit",
        "command": "npx eslint --fix $FILE_PATH"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "python .claude/hooks/validate_command.py"
      }
    ],
    "Stop": [
      {
        "command": "make test"
      }
    ]
  }
}`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Hook Examples</h3>
          <Code title="Auto-format on edit (PostToolUse)">
{`# .claude/hooks/format.sh
#!/bin/bash

# $TOOL_NAME, $FILE_PATH, etc. are set by Claude Code
if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
    # Format based on file type
    case "$FILE_PATH" in
        *.py)
            ruff format "$FILE_PATH"
            ruff check --fix "$FILE_PATH"
            ;;
        *.ts|*.tsx|*.js|*.jsx)
            npx prettier --write "$FILE_PATH"
            npx eslint --fix "$FILE_PATH"
            ;;
        *.go)
            gofmt -w "$FILE_PATH"
            ;;
    esac
fi`}
          </Code>
          <Code title="Block dangerous commands (PreToolUse)">
{`# .claude/hooks/validate_command.py
import os
import sys
import json

# Read hook context from stdin
context = json.load(sys.stdin)

if context["tool_name"] == "Bash":
    command = context["arguments"].get("command", "")

    # Block dangerous patterns
    dangerous = [
        "rm -rf /",
        "DROP DATABASE",
        "DELETE FROM",
        "> /dev/sda",
        "chmod 777",
    ]

    for pattern in dangerous:
        if pattern in command:
            print(f"BLOCKED: Command contains dangerous pattern: {pattern}")
            sys.exit(1)  # Non-zero exit blocks the operation

# Allow the operation
sys.exit(0)`}
          </Code>
          <Code title="Run tests on completion (Stop)">
{`# .claude/hooks/on_complete.sh
#!/bin/bash

echo "Running tests..."
make test

if [ $? -eq 0 ]; then
    # Send success notification
    curl -X POST "$SLACK_WEBHOOK" \\
        -H "Content-Type: application/json" \\
        -d '{"text": "✅ Claude completed task - tests passing"}'
else
    curl -X POST "$SLACK_WEBHOOK" \\
        -H "Content-Type: application/json" \\
        -d '{"text": "❌ Claude completed task - tests failing"}'
fi`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>CI/CD Integration</h3>
          <p>
            Hooks can integrate Claude Code into CI/CD pipelines — run Claude in headless mode with hooks that ensure quality:
          </p>
          <Code title="CI pipeline with Claude Code" language="bash">
{`# .github/workflows/claude-review.yml

name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Claude Code review
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # Install Claude Code
          npm install -g @anthropic-ai/claude-code

          # Run review in non-interactive mode
          claude --print "Review the changes in this PR.
            Check for:
            - Security issues
            - Performance problems
            - Code style violations
            - Missing tests

            Output a summary as a PR comment." \\
            | gh pr comment \${{ github.event.pull_request.number }} --body-file -`}
          </Code>
          <Callout type="tip" title="Hook best practices">
            Keep hooks fast — they run synchronously and slow hooks degrade the experience. Use background processes for slow operations. Test hooks thoroughly before deployment.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "agent-sdk",
      title: "Building Agents with Claude",
      subtitle: "From scripts to production agents",
      content: (
        <Prose>
          <p>
            The <strong>Anthropic SDK</strong> lets you build custom AI agents — programs that use Claude to reason, call tools, and accomplish goals. This is the foundation for building AI features in your applications, from simple assistants to complex autonomous workflows.
          </p>
          <p>
            An <strong>agent</strong> is fundamentally a loop: observe, reason, act, repeat. The LLM provides the "reason" step — given observations (context, tool results), it decides what action to take next. The loop continues until the LLM decides the goal is achieved or it gets stuck. This is different from a simple API call; agents maintain state across multiple LLM invocations.
          </p>
          <p>
            The key architectural decision is <strong>tool design</strong>. Tools define what the agent can do in the world. Well-designed tools are the difference between agents that work and agents that spin in circles. Tools should be atomic (do one thing), predictable (same inputs → same outputs), and informative (return useful errors and results).
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Basic API Usage</h3>
          <Code title="Simple API call">
{`import anthropic

client = anthropic.Anthropic()  # Uses ANTHROPIC_API_KEY env var

# Simple message
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Explain Python decorators in one paragraph"}
    ]
)

print(response.content[0].text)`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Tool Use (Function Calling)</h3>
          <p>
            <strong>Tools</strong> let Claude call your functions. You define the function signature, Claude decides when to call it, and you execute the function and return results.
          </p>
          <p>
            This creates a <strong>human-in-the-loop</strong> (or code-in-the-loop) architecture. Claude doesn't directly access your database or APIs; it expresses intent ("I want the stock price for AAPL"), and your code mediates that intent. This is crucial for security and control — you can validate inputs, enforce rate limits, add logging, and implement business logic before any action touches your systems.
          </p>
          <p>
            The tool schema uses <strong>JSON Schema</strong>, which is deliberately simple. Complex nested schemas work but confuse the model. Prefer flat structures with clear field names. If you need complex input, consider multiple simpler tools that Claude can compose.
          </p>
          <Code title="Agent with tools">
{`import anthropic
import json

client = anthropic.Anthropic()

# Define tools Claude can use
tools = [
    {
        "name": "get_stock_price",
        "description": "Get the current stock price for a ticker symbol",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "Stock ticker symbol (e.g., AAPL, GOOGL)"
                }
            },
            "required": ["symbol"]
        }
    },
    {
        "name": "calculate_position_size",
        "description": "Calculate position size based on risk parameters",
        "input_schema": {
            "type": "object",
            "properties": {
                "portfolio_value": {"type": "number"},
                "risk_percent": {"type": "number"},
                "stock_price": {"type": "number"},
                "stop_loss_percent": {"type": "number"}
            },
            "required": ["portfolio_value", "risk_percent", "stock_price", "stop_loss_percent"]
        }
    }
]

# Tool implementations
def get_stock_price(symbol: str) -> dict:
    # In production, call real API
    prices = {"AAPL": 178.50, "GOOGL": 141.25, "MSFT": 378.90}
    return {"symbol": symbol, "price": prices.get(symbol, 0)}

def calculate_position_size(portfolio_value: float, risk_percent: float,
                            stock_price: float, stop_loss_percent: float) -> dict:
    risk_amount = portfolio_value * (risk_percent / 100)
    risk_per_share = stock_price * (stop_loss_percent / 100)
    shares = int(risk_amount / risk_per_share)
    return {"shares": shares, "position_value": shares * stock_price}

# Execute tool calls
def execute_tool(name: str, arguments: dict) -> str:
    if name == "get_stock_price":
        result = get_stock_price(**arguments)
    elif name == "calculate_position_size":
        result = calculate_position_size(**arguments)
    else:
        result = {"error": f"Unknown tool: {name}"}
    return json.dumps(result)

# Agent loop
def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            tools=tools,
            messages=messages
        )

        # Check if Claude wants to use tools
        if response.stop_reason == "tool_use":
            # Extract tool calls
            tool_calls = [block for block in response.content
                         if block.type == "tool_use"]

            # Execute each tool
            tool_results = []
            for tool_call in tool_calls:
                result = execute_tool(tool_call.name, tool_call.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_call.id,
                    "content": result
                })

            # Add assistant message and tool results
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})

        else:
            # Claude is done - return final response
            return response.content[0].text

# Use the agent
result = run_agent(
    "I have a $100,000 portfolio and want to buy AAPL. "
    "I'm willing to risk 2% of my portfolio with a 5% stop loss. "
    "How many shares should I buy?"
)
print(result)`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Streaming Responses</h3>
          <p>
            <strong>Streaming</strong> provides real-time output as Claude generates — essential for good UX in interactive applications.
          </p>
          <p>
            The psychology matters: <strong>perceived latency</strong> differs from actual latency. A 10-second wait with no feedback feels longer than 10 seconds of watching text appear. Streaming transforms the waiting experience into an engaging one. Users can also start reading and processing information before generation completes, making the overall interaction feel faster.
          </p>
          <Code title="Streaming responses">
{`import anthropic

client = anthropic.Anthropic()

# Stream text responses
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short poem about coding"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Stream with tool use (more complex)
def stream_with_tools(user_message: str):
    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        tools=tools,
        messages=[{"role": "user", "content": user_message}]
    ) as stream:
        for event in stream:
            if event.type == "content_block_delta":
                if hasattr(event.delta, "text"):
                    print(event.delta.text, end="", flush=True)
            elif event.type == "content_block_start":
                if event.content_block.type == "tool_use":
                    print(f"\\n[Calling {event.content_block.name}...]")`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Structured Outputs</h3>
          <p>
            Force Claude to return <strong>structured data</strong> that matches a schema — essential for reliable integrations.
          </p>
          <p>
            This solves the <strong>parsing problem</strong>. Natural language is ambiguous; code needs certainty. Without structured outputs, you're writing brittle regex or hoping Claude formats things consistently. With schemas, you get guaranteed parseable output. The schema also helps Claude understand exactly what you need — it's documentation that the model can read.
          </p>
          <p>
            Use <strong>Pydantic</strong> for schema definition — it generates JSON Schema automatically, validates parsed output, and provides type hints for your code. The schema serves three purposes: prompting (tells Claude what to output), validation (catches malformed responses), and typing (enables IDE autocomplete).
          </p>
          <Code title="Structured outputs with Pydantic">
{`import anthropic
from pydantic import BaseModel, Field
from typing import Literal
import json

class StockAnalysis(BaseModel):
    """Structured stock analysis output."""
    symbol: str
    recommendation: Literal["buy", "sell", "hold"]
    confidence: float = Field(ge=0, le=1)
    target_price: float
    reasoning: str = Field(max_length=500)
    risks: list[str] = Field(max_items=5)

client = anthropic.Anthropic()

def analyze_stock(symbol: str) -> StockAnalysis:
    """Get structured stock analysis from Claude."""

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""Analyze {symbol} stock and provide a recommendation.

            Return your analysis as JSON matching this schema:
            {json.dumps(StockAnalysis.model_json_schema(), indent=2)}

            Return ONLY the JSON, no other text."""
        }]
    )

    # Parse and validate
    result = json.loads(response.content[0].text)
    return StockAnalysis(**result)

# Use it
analysis = analyze_stock("AAPL")
print(f"Recommendation: {analysis.recommendation}")
print(f"Confidence: {analysis.confidence:.0%}")
print(f"Target: $" + str(analysis.target_price))`}
          </Code>
          <Callout type="insight" title="Tool design tip">
            Design tools to be <strong>small and focused</strong>. Instead of one mega-tool, create many specific tools. Claude is good at composing multiple tools to solve complex problems.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "production",
      title: "Production Agent Patterns",
      subtitle: "Scaling Claude-based agents",
      content: (
        <Prose>
          <p>
            Moving agents from prototypes to production requires addressing <strong>reliability</strong>, <strong>scalability</strong>, <strong>cost</strong>, and <strong>observability</strong>. These patterns help you build agents that work at scale.
          </p>
          <p>
            The fundamental challenge is that <strong>LLMs are non-deterministic</strong>. The same input can produce different outputs. This breaks assumptions that work for traditional software: you can't unit test for exact output, you can't replay requests exactly, and retries might behave differently. Production agent design is about building reliable systems on top of unreliable components — similar to distributed systems engineering.
          </p>
          <p>
            Cost also scales differently. Traditional APIs might cost fractions of a cent per call. LLM APIs can cost dollars per complex interaction. A bug that causes infinite loops or unnecessary retries can burn through budget quickly. Production systems need circuit breakers, cost caps, and monitoring — the same patterns used for expensive external services.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Stateless Agent Design</h3>
          <p>
            <strong>Stateless agents</strong> scale horizontally — any instance can handle any request. Store conversation state externally (DynamoDB, Redis) rather than in memory.
          </p>
          <p>
            This follows the <strong>Twelve-Factor App</strong> principle: processes should be stateless and share-nothing. Why? Stateful agents create scaling bottlenecks (requests must route to specific instances), operational complexity (instance failures lose state), and deployment challenges (rolling deploys disrupt sessions). External state stores solve all of this — they're designed for distributed access and durability.
          </p>
          <Code title="Stateless agent with external session">
{`import anthropic
import boto3
import json
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
sessions_table = dynamodb.Table("agent-sessions")

class StatelessAgent:
    """Agent that stores all state externally."""

    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.client = anthropic.Anthropic()

    def invoke(self, session_id: str, user_message: str) -> str:
        """Process message with externalized session state."""

        # Load session from DynamoDB
        session = self._load_session(session_id)

        # Add new message
        session["messages"].append({
            "role": "user",
            "content": user_message
        })

        # Call Claude
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=session.get("system_prompt", "You are a helpful assistant."),
            messages=session["messages"]
        )

        assistant_message = response.content[0].text

        # Update session
        session["messages"].append({
            "role": "assistant",
            "content": assistant_message
        })
        session["updated_at"] = datetime.utcnow().isoformat()
        session["token_count"] = session.get("token_count", 0) + response.usage.total_tokens

        # Save session
        self._save_session(session_id, session)

        return assistant_message

    def _load_session(self, session_id: str) -> dict:
        response = sessions_table.get_item(Key={"session_id": session_id})
        if "Item" in response:
            return response["Item"]
        return {
            "session_id": session_id,
            "messages": [],
            "created_at": datetime.utcnow().isoformat(),
            "token_count": 0
        }

    def _save_session(self, session_id: str, session: dict):
        sessions_table.put_item(Item=session)`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Cost Controls</h3>
          <p>
            LLM costs can spiral without controls. Implement <strong>budgets</strong>, <strong>rate limits</strong>, and <strong>cost tracking</strong>.
          </p>
          <p>
            Think of cost control in three layers: <strong>per-request</strong> (max tokens, timeout), <strong>per-session</strong> (budget cap, iteration limit), and <strong>per-user/day</strong> (quota, rate limit). Each layer catches different failure modes. A runaway loop hits per-session limits. An expensive power user hits daily limits. Request limits prevent any single call from being catastrophic.
          </p>
          <p>
            <strong>Estimation before execution</strong> is valuable for expensive operations. Show users the estimated cost before running a complex analysis. This creates accountability and prevents surprise bills. It also lets users make informed decisions about cost/quality tradeoffs.
          </p>
          <Code title="Cost control layer">
{`from dataclasses import dataclass
from decimal import Decimal
import boto3

@dataclass
class CostConfig:
    max_tokens_per_request: int = 4096
    max_requests_per_minute: int = 60
    budget_per_user_daily: Decimal = Decimal("10.00")
    budget_per_session: Decimal = Decimal("1.00")

# Token costs (approximate, check current pricing)
COST_PER_1K_INPUT = Decimal("0.003")   # Claude Sonnet
COST_PER_1K_OUTPUT = Decimal("0.015")

class CostController:
    """Enforce cost limits on agent usage."""

    def __init__(self, config: CostConfig, dynamodb_table):
        self.config = config
        self.table = dynamodb_table

    def check_budget(self, user_id: str, session_id: str) -> bool:
        """Check if user/session has remaining budget."""
        user_usage = self._get_daily_usage(user_id)
        session_usage = self._get_session_usage(session_id)

        return (
            user_usage < self.config.budget_per_user_daily and
            session_usage < self.config.budget_per_session
        )

    def record_usage(self, user_id: str, session_id: str,
                     input_tokens: int, output_tokens: int):
        """Record token usage and cost."""
        cost = (
            Decimal(input_tokens) / 1000 * COST_PER_1K_INPUT +
            Decimal(output_tokens) / 1000 * COST_PER_1K_OUTPUT
        )

        # Update user daily total
        self.table.update_item(
            Key={"pk": f"USER#{user_id}", "sk": "DAILY"},
            UpdateExpression="ADD cost_today :cost, tokens_today :tokens",
            ExpressionAttributeValues={
                ":cost": cost,
                ":tokens": input_tokens + output_tokens
            }
        )

        # Update session total
        self.table.update_item(
            Key={"pk": f"SESSION#{session_id}", "sk": "USAGE"},
            UpdateExpression="ADD total_cost :cost",
            ExpressionAttributeValues={":cost": cost}
        )

    def estimate_cost(self, messages: list) -> Decimal:
        """Estimate cost before making request."""
        # Rough estimation: 4 chars ≈ 1 token
        input_chars = sum(len(m["content"]) for m in messages)
        estimated_input_tokens = input_chars // 4
        estimated_output_tokens = self.config.max_tokens_per_request // 2

        return (
            Decimal(estimated_input_tokens) / 1000 * COST_PER_1K_INPUT +
            Decimal(estimated_output_tokens) / 1000 * COST_PER_1K_OUTPUT
        )`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Prompt Caching</h3>
          <p>
            <strong>Prompt caching</strong> reduces costs when you send the same context repeatedly — common for system prompts and few-shot examples.
          </p>
          <p>
            The economics are significant: cached tokens cost 90% less. If your system prompt is 2000 tokens and you send 1000 requests/day, caching saves ~1.8M tokens/day in effective cost. The implementation is simple — mark stable content with <code>cache_control</code> — but requires thinking about what changes between requests. Cache what's constant; let variable content flow through normally.
          </p>
          <Code title="Using prompt caching">
{`import anthropic

client = anthropic.Anthropic()

# Cache the system prompt (large, repeated context)
SYSTEM_PROMPT = """You are an expert financial analyst...
[Long detailed instructions - 1000+ tokens]
"""

def analyze_with_caching(query: str) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=[
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"}  # Enable caching
            }
        ],
        messages=[{"role": "user", "content": query}]
    )

    # Check cache performance
    usage = response.usage
    print(f"Input tokens: {usage.input_tokens}")
    print(f"Cache read: {usage.cache_read_input_tokens}")
    print(f"Cache write: {usage.cache_creation_input_tokens}")

    return response.content[0].text

# First call: cache write (full cost)
analyze_with_caching("Analyze AAPL")

# Subsequent calls: cache read (90% cheaper for cached tokens)
analyze_with_caching("Analyze GOOGL")
analyze_with_caching("Analyze MSFT")`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Observability</h3>
          <p>
            <strong>Log everything</strong> — requests, responses, latency, tokens, costs. You can't improve what you don't measure.
          </p>
          <p>
            LLM observability differs from traditional systems. You need to track not just "did it work?" but "was the output good?" This requires logging full request/response pairs for later review. Metrics like latency and error rate are necessary but not sufficient — you also need <strong>quality signals</strong>: user feedback, downstream errors, and periodic human evaluation.
          </p>
          <p>
            The observability stack for agents typically includes: <strong>traces</strong> (request flow through tool calls), <strong>metrics</strong> (latency, tokens, cost), <strong>logs</strong> (full payloads for debugging), and <strong>evaluation</strong> (periodic quality assessment). Tools like LangSmith, Weights & Biases, or custom solutions provide these capabilities.
          </p>
          <Code title="Agent observability">
{`import anthropic
import time
import json
from dataclasses import dataclass, asdict
from datetime import datetime
import boto3

cloudwatch = boto3.client("cloudwatch")

@dataclass
class AgentMetrics:
    agent_id: str
    session_id: str
    request_id: str
    timestamp: str
    latency_ms: float
    input_tokens: int
    output_tokens: int
    cost_usd: float
    model: str
    tool_calls: int
    success: bool
    error: str = None

class ObservableAgent:
    """Agent with built-in observability."""

    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.client = anthropic.Anthropic()

    def invoke(self, session_id: str, messages: list) -> tuple[str, AgentMetrics]:
        request_id = f"req-{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}"
        start_time = time.time()

        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4096,
                messages=messages
            )

            latency_ms = (time.time() - start_time) * 1000

            metrics = AgentMetrics(
                agent_id=self.agent_id,
                session_id=session_id,
                request_id=request_id,
                timestamp=datetime.utcnow().isoformat(),
                latency_ms=latency_ms,
                input_tokens=response.usage.input_tokens,
                output_tokens=response.usage.output_tokens,
                cost_usd=self._calculate_cost(response.usage),
                model=response.model,
                tool_calls=sum(1 for b in response.content if b.type == "tool_use"),
                success=True
            )

            self._emit_metrics(metrics)

            return response.content[0].text, metrics

        except Exception as e:
            latency_ms = (time.time() - start_time) * 1000

            metrics = AgentMetrics(
                agent_id=self.agent_id,
                session_id=session_id,
                request_id=request_id,
                timestamp=datetime.utcnow().isoformat(),
                latency_ms=latency_ms,
                input_tokens=0,
                output_tokens=0,
                cost_usd=0,
                model="unknown",
                tool_calls=0,
                success=False,
                error=str(e)
            )

            self._emit_metrics(metrics)
            raise

    def _emit_metrics(self, metrics: AgentMetrics):
        """Send metrics to CloudWatch."""
        cloudwatch.put_metric_data(
            Namespace="AgentMetrics",
            MetricData=[
                {
                    "MetricName": "Latency",
                    "Value": metrics.latency_ms,
                    "Unit": "Milliseconds",
                    "Dimensions": [{"Name": "AgentId", "Value": metrics.agent_id}]
                },
                {
                    "MetricName": "TokensUsed",
                    "Value": metrics.input_tokens + metrics.output_tokens,
                    "Unit": "Count",
                    "Dimensions": [{"Name": "AgentId", "Value": metrics.agent_id}]
                },
                {
                    "MetricName": "Cost",
                    "Value": metrics.cost_usd,
                    "Unit": "None",
                    "Dimensions": [{"Name": "AgentId", "Value": metrics.agent_id}]
                },
                {
                    "MetricName": "Errors",
                    "Value": 0 if metrics.success else 1,
                    "Unit": "Count",
                    "Dimensions": [{"Name": "AgentId", "Value": metrics.agent_id}]
                }
            ]
        )`}
          </Code>
          <Callout type="warning" title="Production checklist">
            Before deploying: Set up cost alerts, implement rate limiting, add request timeouts, create runbooks for common failures, and test with load to understand scaling behavior.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "teams",
      title: "Claude Code for Teams",
      subtitle: "Collaboration patterns",
      content: (
        <Prose>
          <p>
            Using Claude Code effectively as a team requires <strong>shared conventions</strong>, <strong>consistent configuration</strong>, and <strong>clear workflows</strong>. These patterns help teams get consistent results and avoid common pitfalls.
          </p>
          <p>
            The core challenge is <strong>consistency</strong>. Without shared configuration, different team members get different results from similar prompts. One person's Claude knows about your testing conventions; another's doesn't. This creates confusion, duplicated effort, and inconsistent code quality. Shared configuration ensures everyone's Claude "speaks the same language."
          </p>
          <p>
            There's also an <strong>institutional knowledge</strong> benefit. CLAUDE.md captures knowledge that might otherwise exist only in senior engineers' heads. When properly maintained, it becomes living documentation that helps Claude and humans alike understand how the team works.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Shared CLAUDE.md</h3>
          <p>
            Commit <strong>CLAUDE.md</strong> to your repo so all team members get the same project context. Include coding conventions, architecture decisions, and common patterns.
          </p>
          <Code title="Team CLAUDE.md template" language="bash">
{`# CLAUDE.md

## Team Conventions

### Git
- Branch naming: feature/<ticket>-<description>, fix/<ticket>-<description>
- Commits: Conventional commits (feat:, fix:, refactor:, etc.)
- PRs require 1 approval from code owner

### Code Style
- Python: Black + Ruff, Google docstrings
- TypeScript: Prettier + ESLint, JSDoc for public APIs
- Tests: pytest/vitest, 80% coverage minimum

### Architecture
- Monorepo: apps/ for services, packages/ for shared code
- API design: REST + OpenAPI spec in docs/
- Database: Single-table DynamoDB design

## Common Tasks

### Adding a new API endpoint
1. Add route in apps/api/routes/
2. Add handler in apps/api/handlers/
3. Add types in packages/types/
4. Add tests in apps/api/__tests__/
5. Update OpenAPI spec in docs/openapi.yaml

### Deploying to staging
\`\`\`bash
make deploy-staging
\`\`\`

## Things Claude Should Know
- We use feature flags via LaunchDarkly
- All times are UTC, stored as ISO 8601
- Money is stored as cents (integers)
- User IDs are UUIDs, not sequential

## Things Claude Should NOT Do
- Don't modify infrastructure/ without explicit approval
- Don't add new dependencies without discussion
- Don't change database schemas directly`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Project Settings</h3>
          <p>
            Use <strong>.claude/settings.json</strong> in your repo for project-specific configuration that differs from user defaults.
          </p>
          <Code title="Project-specific settings" language="bash">
{`# .claude/settings.json (committed to repo)

{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "make format"
      }
    ],
    "Stop": [
      {
        "command": "make lint"
      }
    ]
  },
  "mcpServers": {
    "internal-docs": {
      "command": "python",
      "args": ["scripts/mcp/docs_server.py"]
    }
  },
  "permissions": {
    "allowedTools": ["Read", "Edit", "Write", "Bash", "Glob", "Grep"],
    "deniedPaths": ["infrastructure/", ".env*", "secrets/"]
  }
}`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Code Review with Claude</h3>
          <p>
            Use Claude Code as a <strong>first-pass reviewer</strong> before human review. It catches common issues and frees humans for higher-level feedback.
          </p>
          <Code title="PR review workflow" language="bash">
{`# Prompt template for code review

"Review this PR for:

1. **Correctness**: Logic bugs, edge cases, error handling
2. **Security**: Injection, auth, data exposure
3. **Performance**: N+1 queries, unnecessary computation
4. **Style**: Consistency with project patterns
5. **Tests**: Coverage, edge cases, assertions

Files changed:
$(git diff main --name-only)

Diff:
$(git diff main)

Focus on substantive issues. Don't nitpick formatting (our linter handles that).
Provide specific line references and suggested fixes."

# Automate in CI
# .github/workflows/claude-review.yml
# Runs on PR, posts review as comment`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Documentation Generation</h3>
          <p>
            Use Claude Code to <strong>generate and maintain documentation</strong> from code. Especially useful for API docs, architecture overviews, and onboarding guides.
          </p>
          <Code title="Documentation generation" language="bash">
{`# Generate API documentation from code

"Read the API routes in apps/api/routes/ and generate:

1. OpenAPI 3.0 spec (update docs/openapi.yaml)
2. Markdown documentation for each endpoint
3. Example requests and responses

Follow the existing format in docs/api/. Include:
- Endpoint URL and method
- Request body schema
- Response schema with status codes
- Authentication requirements
- Rate limits"

# Generate architecture diagram

"Analyze the codebase and create a Mermaid diagram showing:
- Service boundaries
- Data flow between services
- External dependencies
- Database relationships

Save to docs/architecture.md"`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Onboarding New Team Members</h3>
          <p>
            Claude Code accelerates onboarding by explaining code, answering questions, and helping new members follow project patterns.
          </p>
          <Code title="Onboarding workflow" language="bash">
{`# Onboarding prompt for new team members

"I'm new to this codebase. Help me understand:

1. High-level architecture: What are the main components?
2. How does a typical request flow through the system?
3. Where should I look to understand [specific feature]?
4. What are the key files I should read first?
5. What patterns does this codebase follow?"

# Task assignment prompt

"I've been assigned to implement [feature].

1. Where should this code live?
2. What existing code should I reference?
3. What tests should I write?
4. Who should review this?

Help me create a plan before I start coding."`}
          </Code>
          <Callout type="tip" title="Team adoption">
            Start with one or two enthusiastic adopters. Have them document wins and share with the team. Adoption grows organically when people see real productivity gains.
          </Callout>
        </Prose>
      ),
    },
  ],

  operations: [
    { name: "messages.create", time: "O(n)", space: "O(n)", note: "n = tokens" },
    { name: "messages.stream", time: "O(n)", space: "O(1)", note: "Streaming" },
    { name: "Tool execution", time: "O(1)", space: "O(1)", note: "Per call" },
    { name: "Prompt cache hit", time: "O(1)", space: "O(n)", note: "90% cheaper" },
    { name: "Session load", time: "O(1)", space: "O(n)", note: "DynamoDB" },
    { name: "MCP tool call", time: "O(1)", space: "O(1)", note: "IPC overhead" },
  ],

  patterns: [
    {
      name: "Agentic Loop",
      description: "Core pattern for autonomous task completion with tool use.",
      explanation: `The **agentic loop** is the fundamental pattern for Claude-based agents. Claude receives a goal, plans steps, calls tools, observes results, and iterates until complete. The loop continues until Claude decides no more actions are needed.

Key implementation details: Track message history, handle tool results, detect completion, and implement timeout/iteration limits to prevent infinite loops.`,
      triggers: "autonomous tasks, multi-step workflows, tool-using agents",
      code: `def run_agent(goal: str, tools: list, max_iterations: int = 10) -> str:
    messages = [{"role": "user", "content": goal}]

    for i in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            tools=tools,
            messages=messages
        )

        if response.stop_reason != "tool_use":
            return response.content[0].text

        # Execute tools and continue loop
        tool_results = execute_tools(response.content)
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

    return "Max iterations reached"`,
    },
    {
      name: "Structured Output",
      description: "Force Claude to return data matching a specific schema.",
      explanation: `**Structured outputs** ensure Claude returns parseable, validated data rather than free-form text. This is essential for reliable integrations where downstream code depends on specific fields and types.

Use JSON schemas or Pydantic models to define the expected format. Include the schema in the prompt and validate the response.`,
      triggers: "API responses, data extraction, form filling, configuration",
      code: `from pydantic import BaseModel

class Analysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"]
    confidence: float
    key_points: list[str]

def analyze(text: str) -> Analysis:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{
            "role": "user",
            "content": f"Analyze this text and return JSON matching this schema:\\n"
                      f"{Analysis.model_json_schema()}\\n\\nText: {text}"
        }]
    )
    return Analysis.model_validate_json(response.content[0].text)`,
    },
    {
      name: "Retrieval Augmented Generation",
      description: "Ground Claude's responses in retrieved context.",
      explanation: `**RAG** provides Claude with relevant context retrieved from a knowledge base. This reduces hallucinations, keeps responses current, and enables domain-specific knowledge without fine-tuning.

The pattern: embed user query, search vector database, inject results into prompt, generate response with citations.`,
      triggers: "knowledge bases, documentation, Q&A, domain expertise",
      code: `def rag_query(query: str, knowledge_base: VectorDB) -> str:
    # Retrieve relevant documents
    results = knowledge_base.search(query, top_k=5)

    context = "\\n\\n".join([
        f"[{r.id}] {r.content}" for r in results
    ])

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{
            "role": "user",
            "content": f"Context:\\n{context}\\n\\nQuestion: {query}\\n\\n"
                      f"Answer based on the context. Cite sources as [id]."
        }]
    )
    return response.content[0].text`,
    },
  ],

  problems: [],
};
