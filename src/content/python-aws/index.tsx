import type { DataStructure } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";
import { AsyncIOViz } from "../../visualizations/python-aws/AsyncIOViz";
import { LambdaColdStartViz } from "../../visualizations/python-aws/LambdaColdStartViz";
import { AWSArchitectureViz } from "../../visualizations/python-aws/AWSArchitectureViz";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div
    className="space-y-4 text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-[var(--color-text-primary)]"
    style={{ color: "var(--color-text-secondary)" }}
  >
    {children}
  </div>
);

// Wrapper to use shared CodeBlock with children prop pattern
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

export const pythonAWSContent: DataStructure = {
  id: "python-aws",
  name: "Python & AWS",
  icon: "🐍",
  color: "amber",
  tagline: "Production Python for AI systems",
  description:
    "Deep dive into Python's execution model, concurrency patterns, AWS serverless architecture, and production best practices for building AI systems at scale.",
  viewMode: "pattern-first",

  sections: [
    {
      id: "python-aws-synergy",
      title: "Python + AWS for AI Systems",
      subtitle: "Why this combination dominates production AI and when to use it",
      content: (
        <Prose>
          <p>
            Python and AWS form the dominant stack for production AI systems, and understanding why reveals how to use them effectively together. Python's ecosystem—<strong>NumPy</strong>, <strong>pandas</strong>, <strong>PyTorch</strong>, <strong>LangChain</strong>, the entire ML/AI stack—has no serious competitor. AWS provides the infrastructure: compute that scales from zero to thousands of concurrent requests, managed services that eliminate operational burden, and building blocks that compose into sophisticated architectures. The combination means you can prototype in a Jupyter notebook and deploy to production with the same language and similar patterns.
          </p>
          <p>
            <strong>Use case 1: LLM-powered applications.</strong> You're building a document Q&A system. Python handles the <strong>RAG pipeline</strong>—LangChain or custom code for chunking, embeddings (OpenAI or <strong>Bedrock</strong>), and prompt construction. <strong>AWS Lambda</strong> runs the inference code, scaling automatically with request volume. <strong>DynamoDB</strong> stores conversation history and cached embeddings. <strong>S3</strong> holds the document corpus. <strong>API Gateway</strong> provides the REST interface. The entire system can handle zero to thousands of requests per minute with no infrastructure management.
          </p>
          <p>
            <strong>Use case 2: Batch ML inference.</strong> You need to run predictions on millions of records nightly. Python handles model loading and inference—your <strong>scikit-learn</strong> or <strong>PyTorch</strong> model. <strong>AWS Step Functions</strong> orchestrates the pipeline: trigger from <strong>S3</strong> upload or scheduled event, fan out to <strong>Lambda</strong> or <strong>Fargate</strong> for parallel processing, aggregate results back to S3 or DynamoDB. This pattern processes 10 million records using 1000 parallel Lambda invocations, completing in minutes what would take hours sequentially.
          </p>
          <p>
            <strong>Use case 3: Real-time feature engineering.</strong> You're computing features from streaming data for fraud detection. Python defines the feature logic—aggregations, lookups, transformations. <strong>Kinesis</strong> ingests the event stream. <strong>Lambda</strong> computes features per event. <strong>DynamoDB</strong> stores aggregated state (counts, averages over windows). The computed features feed into a <strong>SageMaker</strong> endpoint for real-time predictions. Latency from event to prediction: under 100ms at 10,000 events/second.
          </p>
          <Callout type="insight" title="Architecture principle">
            Python provides the logic; AWS provides the infrastructure. Keep <strong>Lambda</strong> functions focused on business logic—AWS handles scaling, retries, logging, and monitoring. Your Python code should be <strong>stateless</strong> (state lives in DynamoDB/S3/ElastiCache), <strong>idempotent</strong> (safe to retry), and <strong>fast to start</strong> (for Lambda cold starts). This separation lets you iterate on logic without touching infrastructure.
          </Callout>
          <AWSArchitectureViz />
          <p>
            <strong>When NOT to use serverless Python:</strong> Ultra-low latency requirements (sub-10ms) favor containerized services. Very large models that don't fit in <strong>Lambda's</strong> memory need <strong>SageMaker</strong> or <strong>EC2</strong>. Long-running training jobs need EC2 or SageMaker, not Lambda's 15-minute timeout. GPU workloads need SageMaker or EC2 with GPU instances. The serverless Python stack excels at glue code, lightweight inference, data transformation, and orchestration—the 80% of production AI work that isn't model training.
          </p>
        </Prose>
      ),
    },
    {
      id: "python-execution-model",
      title: "Python's Execution Model",
      subtitle: "Understanding the GIL, memory, and why it matters for ML",
      content: (
        <Prose>
          <p>
            Python's <strong>Global Interpreter Lock (GIL)</strong> is perhaps the most misunderstood aspect of the language. The GIL is a <strong>mutex</strong>—a lock that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously. This exists because <strong>CPython's</strong> memory management is not thread-safe: it uses <strong>reference counting</strong> for garbage collection, and without the GIL, simultaneous threads could corrupt reference counts, leading to memory leaks or use-after-free bugs.
          </p>
          <p>
            The practical implication is that <strong>Python threads cannot achieve true parallelism for CPU-bound work</strong>. If you have 8 CPU cores and spawn 8 threads to crunch numbers, only one thread executes Python bytecode at a time—the others wait for the GIL. However, this limitation applies only to pure Python code. <strong>I/O operations</strong> (network calls, file reads, database queries) release the GIL while waiting, allowing other threads to run. This is why threading still provides concurrency benefits for <strong>I/O-bound</strong> workloads.
          </p>
          <p>
            For ML systems, the GIL has nuanced implications. <strong>NumPy</strong> and other C extensions release the GIL during computation, so array operations can run in parallel. Model inference with <strong>PyTorch</strong> or <strong>TensorFlow</strong> similarly releases the GIL. The bottleneck appears in pure Python code: data preprocessing, feature engineering logic, or glue code between library calls. Understanding this helps you architect systems correctly—use <strong>threads</strong> for I/O concurrency, <strong>processes</strong> for CPU parallelism, and <strong>async</strong> for high-concurrency network operations.
          </p>
          <Callout type="insight" title="Key insight">
            The GIL doesn't make Python slow—<strong>NumPy</strong> operations run at C speed. The GIL limits parallelism in pure Python code. For most ML workflows, the heavy computation happens in C extensions that release the GIL anyway. Your bottleneck is usually I/O or the Python glue code between library calls.
          </Callout>
          <p>
            Python's <strong>memory model</strong> uses <strong>reference counting</strong> with cycle detection. Each object maintains a count of references to it; when the count drops to zero, memory is freed immediately. This provides <strong>deterministic cleanup</strong> (unlike garbage-collected languages with unpredictable pauses) but requires the GIL to prevent race conditions on reference counts. For long-running services, be aware that <strong>memory fragmentation</strong> can accumulate—large objects allocated then freed leave gaps that smaller allocations may not fill efficiently.
          </p>
        </Prose>
      ),
    },
    {
      id: "concurrency-models",
      title: "Concurrency Models",
      subtitle: "Threading vs Multiprocessing vs AsyncIO—when to use each",
      content: (
        <Prose>
          <p>
            Python offers three concurrency models, each suited to different problems. <strong>Threading</strong> provides concurrent execution within a single process, sharing memory between threads. Despite the GIL, threading works well for I/O-bound tasks because threads release the GIL while waiting for I/O. Use <strong>ThreadPoolExecutor</strong> for parallel HTTP requests, database queries, or file operations. The shared memory model means threads can communicate via shared state, but this requires careful synchronization with <strong>locks</strong>.
          </p>
          <p>
            <strong>Multiprocessing</strong> sidesteps the GIL entirely by spawning separate Python processes. Each process has its own Python interpreter and memory space, enabling true <strong>parallel execution</strong> on multiple CPU cores. The tradeoff is communication overhead: processes must serialize data (via <strong>pickle</strong>) to exchange information through <strong>Queues</strong>, <strong>Pipes</strong>, or <strong>shared memory</strong>. For CPU-bound workloads like batch processing, data transformation, or model training, multiprocessing unlocks full CPU utilization. However, process spawning has higher latency than thread creation, and memory isn't shared—each process loads its own copy of imported modules.
          </p>
          <p>
            <strong>AsyncIO</strong> is Python's single-threaded concurrency model using <strong>coroutines</strong>. Rather than spawning threads or processes, async code yields control voluntarily when waiting for I/O, allowing other coroutines to run. This is <strong>cooperative multitasking</strong>—the <strong>event loop</strong> schedules coroutines, but they must explicitly <code>await</code> to yield. AsyncIO shines for high-concurrency I/O scenarios: thousands of simultaneous <strong>WebSocket</strong> connections, parallel API calls, or real-time event processing. It uses less memory than threading (no thread stacks) and avoids context-switching overhead.
          </p>
          <div className="grid grid-cols-3 gap-3 my-4">
            {[
              {
                title: "Threading",
                when: "I/O-bound with blocking libraries",
                example: "requests, psycopg2, file I/O",
                color: "var(--color-accent)",
              },
              {
                title: "Multiprocessing",
                when: "CPU-bound parallelism",
                example: "Data transforms, batch processing",
                color: "var(--color-green)",
              },
              {
                title: "AsyncIO",
                when: "High-concurrency I/O",
                example: "API clients, WebSockets, streaming",
                color: "var(--color-amber)",
              },
            ].map((model) => (
              <div
                key={model.title}
                className="p-3 rounded-[var(--radius-md)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: model.color }}>
                  {model.title}
                </p>
                <p className="text-[11px] mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  {model.when}
                </p>
                <p className="text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>
                  {model.example}
                </p>
              </div>
            ))}
          </div>
          <Callout type="tip" title="Decision framework">
            Start with the simplest model that solves your problem. For most API-heavy applications, asyncio with aiohttp or httpx provides the best performance/complexity tradeoff. For CPU-heavy batch jobs, multiprocessing is straightforward. Threading is best when you need concurrency but must use blocking libraries that don't support async.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "asyncio-patterns",
      title: "AsyncIO Patterns for AI Systems",
      subtitle: "Rate limiting, error handling, and production patterns",
      content: (
        <Prose>
          <p>
            LLM applications make many concurrent API calls—to embedding services, inference endpoints, databases, and external tools. <strong>AsyncIO</strong> is the natural fit, but production async code requires patterns beyond basic <code>await</code>. The mental model: your code runs on a single thread, with an <strong>event loop</strong> scheduling <strong>coroutines</strong>. When a coroutine hits an <code>await</code>, it suspends, and the event loop runs another ready coroutine. This <strong>cooperative multitasking</strong> means one blocking call (like <code>time.sleep()</code> instead of <code>asyncio.sleep()</code>) freezes everything.
          </p>
          <p>
            <strong>Rate limiting</strong> is essential for API calls. Use <strong>asyncio.Semaphore</strong> to limit concurrent operations. Initialize with the max concurrent requests (e.g., <code>Semaphore(10)</code>), then <code>async with semaphore</code> before each call. The semaphore blocks when at capacity and releases as calls complete. For more sophisticated rate limiting—requests per second rather than concurrent requests—implement a <strong>token bucket</strong> or use libraries like <strong>aiolimiter</strong>.
          </p>
          <Code title="Rate-limited concurrent requests">
{`import asyncio
import aiohttp

async def fetch_with_limit(urls: list[str], max_concurrent: int = 10) -> list[dict]:
    semaphore = asyncio.Semaphore(max_concurrent)

    async def fetch_one(session: aiohttp.ClientSession, url: str) -> dict:
        async with semaphore:  # Limits concurrent requests
            async with session.get(url) as response:
                return await response.json()

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)`}
          </Code>
          <p>
            <strong>Error handling</strong> in async code requires care. <strong>asyncio.gather(*tasks)</strong> by default cancels all tasks if one raises—add <code>return_exceptions=True</code> to continue and collect exceptions in results. For more control, use <strong>asyncio.TaskGroup</strong> (Python 3.11+), which provides <strong>structured concurrency</strong>: all tasks complete or all are cancelled on exception. Always handle cleanup with <code>try/finally</code>—unclosed sessions or connections leak resources.
          </p>
          <p>
            <strong>Timeouts and cancellation</strong> prevent hung operations. Use <strong>asyncio.timeout(seconds)</strong> (Python 3.11+) or <strong>asyncio.wait_for(coro, timeout)</strong> to bound operation time. Cancellation propagates via <strong>CancelledError</strong>—catch it if you need cleanup, but typically let it propagate to cancel the whole task tree. For graceful shutdown, track active tasks and <code>await</code> them before exiting.
          </p>
          <AsyncIOViz />
          <Callout type="warning" title="Common pitfall">
            Never call blocking functions in async code—they freeze the event loop. Use <code>asyncio.to_thread()</code> (Python 3.9+) to run blocking code in a thread pool, or find async-native libraries (aiohttp not requests, asyncpg not psycopg2, aiofiles not open).
          </Callout>
        </Prose>
      ),
    },
    {
      id: "type-hints-pydantic",
      title: "Type Hints & Pydantic",
      subtitle: "Type safety and validation for production systems",
      content: (
        <Prose>
          <p>
            Type hints transform Python from a "runtime error" language to a "dev-time error" language. With mypy or pyright, you catch type mismatches before running code. More importantly, type hints serve as documentation—function signatures become contracts. For production ML systems handling financial data, catching a <code>float</code> where you expected <code>Decimal</code> at dev time prevents costly production bugs.
          </p>
          <p>
            Modern Python type hints are expressive. Use <code>list[str]</code> not <code>List[str]</code> (Python 3.9+). Union types use <code>str | None</code> not <code>Optional[str]</code> (Python 3.10+). For generics, <code>TypeVar</code> creates type parameters: <code>T = TypeVar('T')</code> makes functions like <code>first(items: list[T]) -&gt; T</code> type-safe for any element type. <code>ParamSpec</code> preserves function signatures through decorators. These features enable type-safe patterns that were previously impossible.
          </p>
          <Code title="Modern type hints (Python 3.11+)">
{`from typing import TypeVar, ParamSpec
from collections.abc import Callable

T = TypeVar('T')
P = ParamSpec('P')

# Generic function preserving element type
def first(items: list[T]) -> T | None:
    return items[0] if items else None

# Decorator preserving function signature
def logged(func: Callable[P, T]) -> Callable[P, T]:
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

# Union types with modern syntax
def process(value: str | int | None) -> str:
    if value is None:
        return "empty"
    return str(value)`}
          </Code>
          <p>
            <strong>Pydantic</strong> bridges type hints and runtime validation. While type hints are erased at runtime (they're just metadata), Pydantic models validate data on instantiation. This is perfect for API boundaries—validating request bodies, config files, or external data. Pydantic v2 is significantly faster (written in Rust) and introduces new patterns: <code>model_validator</code> for cross-field validation, <code>computed_field</code> for derived properties, and native JSON schema generation.
          </p>
          <Code title="Pydantic v2 patterns">
{`from pydantic import BaseModel, Field, field_validator, model_validator
from decimal import Decimal
from datetime import datetime

class TradeOrder(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=10)
    quantity: int = Field(..., gt=0)
    price: Decimal = Field(..., gt=0, decimal_places=2)
    side: Literal["buy", "sell"]
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    @field_validator("symbol")
    @classmethod
    def uppercase_symbol(cls, v: str) -> str:
        return v.upper()

    @model_validator(mode="after")
    def validate_order(self) -> "TradeOrder":
        if self.quantity * self.price > Decimal("1000000"):
            raise ValueError("Order value exceeds limit")
        return self

    model_config = {"frozen": True}  # Immutable after creation`}
          </Code>
          <Callout type="tip" title="Best practice">
            Use Pydantic for external data (API requests, config, files) where runtime validation matters. Use <code>@dataclass</code> for internal data structures where type checking at dev-time is sufficient. This keeps code fast where validation isn't needed.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "testing-ml-systems",
      title: "Testing Strategies for ML Systems",
      subtitle: "From unit tests to integration tests for non-deterministic systems",
      content: (
        <Prose>
          <p>
            Testing ML systems is harder than testing traditional software. Models are stochastic—the same input might produce slightly different outputs. Training depends on random initialization. External dependencies (LLM APIs, databases) are slow and expensive. Yet testing is more important, not less, because ML bugs are subtle: a model silently returning wrong predictions looks exactly like a model working correctly.
          </p>
          <p>
            The <strong>test pyramid</strong> applies but with ML-specific layers. <strong>Unit tests</strong> cover deterministic code: data transforms, feature engineering functions, preprocessing pipelines. These should be fast, numerous, and mock external dependencies. <strong>Integration tests</strong> verify components work together: the pipeline correctly loads data, transforms it, and produces expected output format. <strong>Contract tests</strong> check API compatibility: your service accepts expected request formats and returns valid responses. <strong>Model tests</strong> verify behavior: outputs are in expected ranges, edge cases don't crash, latency is acceptable.
          </p>
          <Code title="Pytest fixtures for ML testing">
{`import pytest
from unittest.mock import AsyncMock, patch
import numpy as np

@pytest.fixture
def mock_embedding_model():
    """Mock embedding model that returns deterministic vectors."""
    mock = AsyncMock()
    mock.embed.return_value = np.random.default_rng(42).random(384)
    return mock

@pytest.fixture
def sample_documents():
    """Consistent test documents."""
    return [
        {"id": "1", "text": "First document about finance"},
        {"id": "2", "text": "Second document about trading"},
    ]

@pytest.fixture
async def db_session():
    """Test database with automatic cleanup."""
    async with create_test_database() as session:
        yield session
        await session.rollback()

@pytest.mark.asyncio
async def test_rag_pipeline(mock_embedding_model, sample_documents, db_session):
    """Integration test for RAG pipeline."""
    pipeline = RAGPipeline(
        embedding_model=mock_embedding_model,
        db=db_session
    )

    # Index documents
    await pipeline.index(sample_documents)

    # Query and verify
    results = await pipeline.query("finance trading", k=2)

    assert len(results) == 2
    assert all("id" in r for r in results)
    mock_embedding_model.embed.assert_called()`}
          </Code>
          <p>
            <strong>Mocking LLM responses</strong> is essential for deterministic tests. Create fixtures that return consistent responses, or use recorded responses (cassette pattern). For testing prompt logic without real API calls, mock the client's completion method. Test error handling by making mocks raise expected exceptions (rate limits, timeouts, invalid responses).
          </p>
          <p>
            <strong>Property-based testing</strong> with Hypothesis finds edge cases you wouldn't think to test. Generate random inputs that satisfy constraints, then verify invariants hold. For data validation, this catches malformed inputs that slip through regular tests. For transforms, verify properties like "output length equals input length" or "encoding then decoding returns original."
          </p>
          <Callout type="insight" title="Test organization">
            Put fixtures in <code>conftest.py</code> for automatic discovery. Use <code>pytest.mark.asyncio</code> for async tests (requires pytest-asyncio). Parametrize tests with <code>@pytest.mark.parametrize</code> for multiple input cases. Keep unit tests fast (&lt;100ms each); slow integration tests can run separately in CI.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "aws-lambda",
      title: "AWS Lambda Deep Dive",
      subtitle: "Execution model, cold starts, and ML inference patterns",
      content: (
        <Prose>
          <p>
            <strong>Lambda's</strong> execution model is container-based. When you invoke a Lambda, AWS allocates a container (if needed), initializes your runtime, runs your handler, then keeps the container "warm" for reuse. Understanding this lifecycle is essential for performance optimization. The <strong>cold start</strong> includes container allocation, runtime initialization, and your init code (imports, client creation). Subsequent <strong>warm invocations</strong> skip initialization entirely—your handler runs immediately.
          </p>
          <p>
            <strong>Cold start latency</strong> varies dramatically: 100ms for a minimal Python function, 1-5 seconds for a function with heavy dependencies (ML libraries, database connections), and 10+ seconds if you add <strong>VPC</strong> networking. Optimization strategies: initialize clients outside the handler (they persist across invocations), minimize deployment package size, use <strong>Lambda Layers</strong> for dependencies, lazy-load rarely-used modules, and consider <strong>provisioned concurrency</strong> for latency-sensitive workloads.
          </p>
          <LambdaColdStartViz />
          <Code title="Optimized Lambda handler pattern">
{`import json
import boto3
from functools import lru_cache
from pydantic import BaseModel, ValidationError

# Initialize OUTSIDE handler - reused across invocations
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('predictions')

# Lazy loading for expensive imports
@lru_cache(maxsize=1)
def get_model():
    """Load model only on first use, cache for reuse."""
    import torch  # Heavy import deferred
    return torch.jit.load('/opt/model.pt')

class PredictRequest(BaseModel):
    features: list[float]
    model_version: str = "v1"

def handler(event: dict, context) -> dict:
    """Lambda handler with proper error handling."""
    try:
        # Parse and validate request
        body = json.loads(event.get('body', '{}'))
        request = PredictRequest.model_validate(body)

        # Get cached model and predict
        model = get_model()
        prediction = model(request.features)

        # Store result
        table.put_item(Item={
            'request_id': context.aws_request_id,
            'prediction': str(prediction)
        })

        return {
            'statusCode': 200,
            'body': json.dumps({'prediction': float(prediction)}),
            'headers': {'Content-Type': 'application/json'}
        }
    except ValidationError as e:
        return {'statusCode': 400, 'body': json.dumps({'errors': e.errors()})}
    except Exception as e:
        print(f"Error: {e}")  # Goes to CloudWatch
        return {'statusCode': 500, 'body': json.dumps({'error': 'Internal error'})}`}
          </Code>
          <p>
            For <strong>ML inference</strong>, Lambda presents tradeoffs. The 10GB memory limit accommodates many models, but large models load slowly on cold start. Strategies: use smaller models (<strong>distillation</strong>, <strong>quantization</strong>), deploy models to <strong>S3</strong> and stream weights, or use <strong>Lambda extensions</strong> for pre-warming. For latency-critical inference, consider <strong>provisioned concurrency</strong> or switch to container-based deployment (<strong>ECS</strong>, <strong>SageMaker endpoints</strong>) where the model stays loaded.
          </p>
          <Callout type="tip" title="Lambda Powertools">
            <strong>AWS Lambda Powertools</strong> (Python) provides production-ready utilities: <strong>structured logging</strong>, distributed tracing with <strong>X-Ray</strong>, custom metrics to <strong>CloudWatch</strong>, validation with <strong>Pydantic</strong> integration, and <strong>idempotency</strong> handling. Adopt it early—retrofitting observability is painful.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "event-driven-architecture",
      title: "Event-Driven Architecture on AWS",
      subtitle: "SQS, SNS, EventBridge, and Step Functions",
      content: (
        <Prose>
          <p>
            Production ML systems are inherently <strong>event-driven</strong>. A document upload triggers embedding generation. A new prediction triggers downstream processing. A model update triggers cache invalidation. Event-driven architecture <strong>decouples</strong> these components: producers emit events without knowing who consumes them, consumers process events independently, and failures in one component don't cascade to others.
          </p>
          <p>
            <strong>SQS (Simple Queue Service)</strong> provides durable, <strong>at-least-once</strong> message delivery. <strong>Standard queues</strong> offer high throughput with best-effort ordering; <strong>FIFO queues</strong> guarantee order and <strong>exactly-once</strong> processing (with lower throughput). For <strong>Lambda</strong> integration, configure <strong>batch size</strong> and <strong>visibility timeout</strong> carefully: visibility timeout should be 6x your Lambda timeout to handle retries. Use <strong>dead-letter queues (DLQ)</strong> to capture failed messages after max retries—essential for debugging and recovery.
          </p>
          <AWSArchitectureViz />
          <p>
            <strong>SNS (Simple Notification Service)</strong> implements <strong>pub/sub</strong>: one message fans out to multiple subscribers. Use it when multiple services need the same event—SNS delivers to all subscribers in parallel. SNS can trigger <strong>Lambda</strong>, push to <strong>SQS</strong>, send emails, or invoke HTTP endpoints. <strong>Filter policies</strong> route specific message types to specific subscribers without code changes.
          </p>
          <p>
            <strong>EventBridge</strong> is AWS's modern event bus. It routes events based on <strong>content matching</strong> (not just topics), integrates with 20+ AWS services as event sources, and supports <strong>cross-account</strong> event delivery. For complex routing logic—"route ML predictions above threshold X to the alert service, others to batch processing"—EventBridge <strong>rules</strong> replace custom routing code. <strong>Schema registry</strong> validates event structure, catching malformed events before they cause downstream failures.
          </p>
          <p>
            <strong>Step Functions</strong> orchestrates multi-step workflows with <strong>state management</strong>, <strong>error handling</strong>, and <strong>retries</strong> built in. For ML pipelines—data extraction → preprocessing → training → evaluation → deployment—Step Functions tracks progress, handles failures gracefully, and provides visibility. <strong>Express Workflows</strong> handle high-volume, short-duration workflows (event processing); <strong>Standard Workflows</strong> handle long-running orchestration (model training).
          </p>
          <Callout type="insight" title="Design principle">
            Events should be immutable facts about what happened, not commands about what to do. "OrderPlaced" is an event; "ProcessOrder" is a command. This distinction enables loose coupling—consumers decide how to react, and new consumers can be added without changing producers.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "dynamodb",
      title: "DynamoDB for ML Systems",
      subtitle: "NoSQL modeling, access patterns, and consistency",
      content: (
        <Prose>
          <p>
            <strong>DynamoDB</strong> is fundamentally different from relational databases. There are no joins, no complex queries, and no ad-hoc access patterns. Instead, you model data for your <strong>access patterns</strong> upfront. This "<strong>access-pattern-first</strong>" design feels backwards if you're used to SQL, but it enables consistent <strong>single-digit millisecond latency</strong> at any scale. For ML systems needing low-latency reads (<strong>feature stores</strong>, <strong>prediction caching</strong>, <strong>session state</strong>), DynamoDB is a natural fit.
          </p>
          <p>
            <strong>Single-table design</strong> stores multiple entity types in one table using <strong>composite keys</strong>. The <strong>partition key (PK)</strong> determines data distribution across partitions; the <strong>sort key (SK)</strong> enables range queries within a partition. A common pattern: <code>PK=USER#123</code>, <code>SK=PROFILE</code> for user data; <code>PK=USER#123</code>, <code>SK=ORDER#456</code> for orders. One query with <code>PK=USER#123</code> retrieves both—no joins needed. This <strong>denormalization</strong> trades storage for query efficiency.
          </p>
          <Code title="Single-table design pattern">
{`import boto3
from boto3.dynamodb.conditions import Key

class FeatureStore:
    """DynamoDB-backed feature store using single-table design."""

    def __init__(self, table_name: str):
        self.table = boto3.resource('dynamodb').Table(table_name)

    def put_features(self, entity_id: str, feature_set: str, features: dict):
        """Store features with entity#feature_set key pattern."""
        self.table.put_item(Item={
            'PK': f'ENTITY#{entity_id}',
            'SK': f'FEATURES#{feature_set}',
            'features': features,
            'updated_at': datetime.utcnow().isoformat(),
        })

    def get_features(self, entity_id: str, feature_sets: list[str]) -> dict:
        """Get multiple feature sets for an entity in one query."""
        # Use BatchGetItem for multiple specific keys
        # or Query with SK begins_with for range
        response = self.table.query(
            KeyConditionExpression=Key('PK').eq(f'ENTITY#{entity_id}')
        )
        return {
            item['SK'].split('#')[1]: item['features']
            for item in response['Items']
            if item['SK'].split('#')[1] in feature_sets
        }

    def get_latest_features(self, entity_id: str) -> dict:
        """Get most recent features using GSI sorted by updated_at."""
        # Requires GSI with updated_at as sort key
        pass`}
          </Code>
          <p>
            <strong>Global Secondary Indexes (GSIs)</strong> enable additional access patterns. A GSI projects items with different key attributes, allowing queries that the base table doesn't support. <strong>Sparse indexes</strong> only include items with the index key present—useful for "hot" data like active sessions or pending jobs. Over-indexing wastes money; under-indexing requires expensive <strong>scans</strong>.
          </p>
          <p>
            <strong>Consistency</strong> in DynamoDB is <strong>eventually consistent</strong> by default (reads might not reflect recent writes), with optional <strong>strongly consistent reads</strong> (always current, but 2x cost and latency). For ML systems, eventual consistency is usually fine—feature staleness of milliseconds rarely matters. Use strongly consistent reads only when correctness requires it (e.g., checking if a model version exists before deploying).
          </p>
          <Callout type="warning" title="Hot partitions">
            <strong>DynamoDB</strong> distributes data by partition key hash. If many requests hit the same PK ("<strong>hot partition</strong>"), throughput is limited. For time-series data, don't use timestamp as PK—use composite keys like <code>entity_id#date_bucket</code> to spread load. For high-write scenarios, add random suffixes (<strong>write sharding</strong>) and aggregate on read.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "s3-data-pipelines",
      title: "S3 for Data Pipelines",
      subtitle: "Partitioning, formats, and event-driven processing",
      content: (
        <Prose>
          <p>
            <strong>S3</strong> is the de facto <strong>data lake</strong> for ML systems. Its design as an <strong>object store</strong> (not a filesystem) has implications for access patterns. Objects are <strong>immutable</strong>—updates rewrite the entire object. Listing is prefix-based and eventually consistent (though reads are now <strong>strongly consistent</strong>). Pricing is by storage, requests, and data transfer. Understanding these characteristics drives efficient data pipeline design.
          </p>
          <p>
            <strong>Partitioning strategy</strong> is critical for query performance. Partition by the dimensions you filter on: <code>s3://bucket/data/year=2024/month=03/day=19/</code> enables efficient date-range queries with tools like <strong>Athena</strong> or <strong>Spark</strong>. For entity-based access, partition by entity: <code>s3://bucket/features/entity_id=123/</code>. Avoid too many small files (listing overhead) or too few large files (can't parallelize reads). Target 128MB-1GB per file for analytics workloads.
          </p>
          <p>
            <strong>File formats</strong> matter for performance. <strong>JSON Lines (JSONL)</strong> is human-readable but verbose and slow to parse. <strong>Parquet</strong> is columnar—reading specific columns skips irrelevant data, and compression is excellent. For ML feature stores and analytics, Parquet is the standard. For event streams and logs where you read entire records, JSONL or <strong>Avro</strong> work well. For model artifacts, use format-specific conventions (PyTorch's <code>.pt</code>, <strong>ONNX</strong>, <strong>SafeTensors</strong>).
          </p>
          <Code title="Event-driven S3 processing">
{`import boto3
import json
from urllib.parse import unquote_plus

s3 = boto3.client('s3')

def handler(event: dict, context):
    """Process S3 uploads triggered by EventBridge or S3 notifications."""
    for record in event['Records']:
        # Handle both S3 notification and EventBridge formats
        if 'body' in record:  # SQS wrapping
            s3_event = json.loads(record['body'])
        else:
            s3_event = record

        bucket = s3_event['s3']['bucket']['name']
        key = unquote_plus(s3_event['s3']['object']['key'])

        # Validate key matches expected pattern
        if not key.startswith('raw/') or not key.endswith('.jsonl'):
            print(f"Skipping unexpected key: {key}")
            continue

        # Process file
        response = s3.get_object(Bucket=bucket, Key=key)
        lines = response['Body'].read().decode('utf-8').split('\\n')

        processed = [transform(json.loads(line)) for line in lines if line]

        # Write to processed partition
        output_key = key.replace('raw/', 'processed/').replace('.jsonl', '.parquet')
        write_parquet(bucket, output_key, processed)

        print(f"Processed {len(processed)} records from {key}")`}
          </Code>
          <p>
            <strong>Event-driven processing</strong> triggers on S3 changes. <strong>S3 Event Notifications</strong> invoke <strong>Lambda</strong> directly or publish to <strong>SNS/SQS</strong>. <strong>EventBridge</strong> provides more sophisticated routing—trigger on specific prefixes, object sizes, or metadata. For reliable processing, use <strong>SQS</strong> between S3 and Lambda: the queue provides retry, <strong>DLQ</strong> for failures, and <strong>backpressure</strong> when processing can't keep up with upload rate.
          </p>
          <Callout type="tip" title="Performance optimization">
            Use <strong>multipart uploads</strong> for files over 100MB (parallelizes the upload). Use <strong>byte-range fetches</strong> to read portions of large files. Use <strong>S3 Select</strong> to push filtering to S3 (returns only matching rows, reducing data transfer). For high-throughput access, use <strong>S3 Transfer Acceleration</strong> or place compute in the same region as data.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "infrastructure-as-code",
      title: "Infrastructure as Code",
      subtitle: "CDK patterns for reproducible infrastructure",
      content: (
        <Prose>
          <p>
            <strong>Infrastructure as Code (IaC)</strong> treats infrastructure configuration like application code: <strong>version controlled</strong>, reviewed, tested, and deployed through pipelines. This eliminates <strong>configuration drift</strong> (where environments slowly diverge), enables <strong>reproducible environments</strong> (spin up a staging copy from the same code), and provides <strong>audit trails</strong> (git history shows who changed what). For ML systems with complex infrastructure dependencies, IaC is essential.
          </p>
          <p>
            <strong>AWS CDK</strong> (Cloud Development Kit) lets you define infrastructure in Python (or TypeScript, Java, Go). Unlike declarative templates (<strong>CloudFormation</strong>, <strong>Terraform</strong> HCL), CDK is imperative—you write code that generates infrastructure. This enables loops, conditionals, and abstractions that declarative languages can't express. CDK <strong>synthesizes</strong> to CloudFormation, so you get CloudFormation's reliability with programming language expressiveness.
          </p>
          <Code title="CDK stack for ML API">
{`from aws_cdk import (
    Stack, Duration, RemovalPolicy,
    aws_lambda as lambda_,
    aws_apigateway as apigw,
    aws_dynamodb as dynamodb,
    aws_s3 as s3,
    aws_sqs as sqs,
    aws_lambda_event_sources as events,
)
from constructs import Construct

class MLServiceStack(Stack):
    def __init__(self, scope: Construct, id: str, env_name: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        # Feature store table
        feature_table = dynamodb.Table(
            self, "FeatureStore",
            partition_key=dynamodb.Attribute(
                name="PK", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="SK", type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.RETAIN if env_name == "prod" else RemovalPolicy.DESTROY,
        )

        # Processing queue with DLQ
        dlq = sqs.Queue(self, "ProcessingDLQ")
        queue = sqs.Queue(
            self, "ProcessingQueue",
            visibility_timeout=Duration.seconds(300),
            dead_letter_queue=sqs.DeadLetterQueue(
                queue=dlq, max_receive_count=3
            ),
        )

        # Lambda with dependencies layer
        deps_layer = lambda_.LayerVersion(
            self, "DepsLayer",
            code=lambda_.Code.from_asset("layers/deps"),
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_11],
        )

        # Inference Lambda
        inference_fn = lambda_.Function(
            self, "InferenceFunction",
            runtime=lambda_.Runtime.PYTHON_3_11,
            handler="inference.handler",
            code=lambda_.Code.from_asset("lambda/inference"),
            layers=[deps_layer],
            timeout=Duration.seconds(30),
            memory_size=1024,
            environment={
                "FEATURE_TABLE": feature_table.table_name,
                "ENV": env_name,
            },
        )

        feature_table.grant_read_data(inference_fn)

        # API Gateway
        api = apigw.RestApi(self, "MLAPI")
        api.root.add_resource("predict").add_method(
            "POST", apigw.LambdaIntegration(inference_fn)
        )`}
          </Code>
          <p>
            <strong>CDK constructs</strong> organize code at three levels. L1 constructs map directly to CloudFormation resources (CfnBucket). L2 constructs add sensible defaults and helper methods (Bucket with easy grant methods). L3 constructs (patterns) combine multiple resources into higher-level abstractions (LambdaRestApi creates Lambda + API Gateway + permissions). Build custom L3 constructs to encapsulate your organization's patterns—a "MLInferenceEndpoint" construct that bundles Lambda, API Gateway, DynamoDB, and monitoring.
          </p>
          <Callout type="insight" title="Environment management">
            Use CDK context or environment variables to parameterize stacks. Create separate stacks for dev/staging/prod with different configurations (smaller instances in dev, deletion protection in prod). Deploy through CI/CD pipelines with <code>cdk diff</code> for review and <code>cdk deploy</code> for application. CDK Pipelines can codify your entire deployment process.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "observability",
      title: "Observability & Debugging",
      subtitle: "Logs, metrics, traces for production ML systems",
      content: (
        <Prose>
          <p>
            <strong>Observability</strong> is the ability to understand system behavior from external outputs. For ML systems, this is critical: a model silently returning wrong predictions looks identical to correct operation without observability. The <strong>three pillars</strong>—<strong>logs</strong>, <strong>metrics</strong>, <strong>traces</strong>—provide complementary views. Logs capture discrete events ("request received", "prediction made"). Metrics track aggregates over time (request count, latency percentiles). Traces follow requests across service boundaries.
          </p>
          <p>
            <strong>Structured logging</strong> outputs JSON instead of plain text, enabling programmatic analysis. Include <strong>correlation IDs</strong> (request_id, trace_id) that link related logs across services. Log at appropriate levels: DEBUG for development, INFO for significant events, WARNING for recoverable issues, ERROR for failures requiring attention. In <strong>Lambda</strong>, logs go to <strong>CloudWatch</strong> automatically; use <strong>Lambda Powertools</strong> for structured output.
          </p>
          <Code title="Structured logging with Lambda Powertools">
{`from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.metrics import MetricUnit

logger = Logger(service="ml-inference")
tracer = Tracer(service="ml-inference")
metrics = Metrics(namespace="MLService")

@logger.inject_lambda_context(log_event=True)
@tracer.capture_lambda_handler
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event: dict, context: LambdaContext) -> dict:
    # Correlation ID automatically added to all logs
    logger.info("Processing inference request", extra={
        "model_version": "v2.1",
        "feature_count": len(event.get("features", []))
    })

    with tracer.capture_method():
        prediction = model.predict(event["features"])

    # Custom metrics
    metrics.add_metric(name="PredictionValue", unit=MetricUnit.Count, value=prediction)
    metrics.add_metric(name="InferenceLatency", unit=MetricUnit.Milliseconds, value=elapsed_ms)

    if prediction > THRESHOLD:
        logger.warning("High-confidence prediction", extra={
            "prediction": prediction,
            "threshold": THRESHOLD
        })

    return {"statusCode": 200, "body": json.dumps({"prediction": prediction})}`}
          </Code>
          <p>
            <strong>CloudWatch Logs Insights</strong> queries logs with a SQL-like syntax. Common patterns: filter by error level, aggregate by <strong>correlation ID</strong>, calculate <strong>latency percentiles</strong>, find slow requests. For debugging Lambda issues, start with <code>filter @message like /ERROR/</code>, then drill into specific request IDs. Set up <strong>CloudWatch alarms</strong> on error rates and latency percentiles to catch issues before users report them.
          </p>
          <p>
            <strong>X-Ray tracing</strong> follows requests across services. Each service adds a <strong>segment</strong> to the trace; <strong>subsegments</strong> break down internal operations. For ML systems, trace embedding generation, model inference, and database calls separately. The <strong>X-Ray service map</strong> visualizes dependencies and highlights latency bottlenecks. Enable X-Ray in Lambda with a single configuration flag; SDKs automatically instrument AWS SDK calls.
          </p>
          <Callout type="tip" title="Debugging serverless">
            For local development, use <strong>AWS SAM CLI</strong> to invoke Lambda locally with test events. For production debugging, <strong>CloudWatch Logs Insights</strong> is your primary tool—learn its query syntax well. For distributed issues, <strong>X-Ray traces</strong> show where time is spent. For intermittent issues, enable detailed logging temporarily (log all inputs/outputs) and disable after capturing the problem.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "security",
      title: "Security Best Practices",
      subtitle: "IAM, secrets, encryption for financial systems",
      content: (
        <Prose>
          <p>
            Financial systems demand rigorous security. A data breach exposes customer information; a misconfigured permission enables unauthorized trades. AWS provides the building blocks, but you must assemble them correctly. The <strong>principle of least privilege</strong>—granting only the permissions actually needed—is the foundation. <strong>Defense in depth</strong>—multiple security layers so no single failure is catastrophic—is the strategy.
          </p>
          <p>
            <strong>IAM (Identity and Access Management)</strong> controls who can do what. <strong>IAM policies</strong> specify allowed actions on resources with optional conditions. For <strong>Lambda</strong>, the <strong>execution role</strong> defines what AWS services the function can access—grant read to specific <strong>DynamoDB</strong> tables, not all tables; grant write to specific <strong>S3</strong> prefixes, not entire buckets. Use <strong>IAM Roles</strong> (assumed by services) rather than <strong>IAM Users</strong> with access keys wherever possible. Enable <strong>IAM Access Analyzer</strong> to find overly permissive policies.
          </p>
          <Code title="Least-privilege IAM policy">
{`# CDK example: Minimal permissions for inference Lambda
from aws_cdk import aws_iam as iam

inference_role = iam.Role(
    self, "InferenceRole",
    assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
    managed_policies=[
        iam.ManagedPolicy.from_aws_managed_policy_name(
            "service-role/AWSLambdaBasicExecutionRole"  # CloudWatch logs
        )
    ],
)

# Grant specific table access, not dynamodb:*
feature_table.grant_read_data(inference_role)

# Grant specific bucket prefix, not s3:*
models_bucket.grant_read(inference_role, "models/production/*")

# Add inline policy for specific operations
inference_role.add_to_policy(iam.PolicyStatement(
    effect=iam.Effect.ALLOW,
    actions=["secretsmanager:GetSecretValue"],
    resources=[f"arn:aws:secretsmanager:{region}:{account}:secret:ml-api-key-*"],
))`}
          </Code>
          <p>
            <strong>Secrets management</strong> keeps credentials out of code. <strong>AWS Secrets Manager</strong> stores secrets with automatic rotation, encryption, and access logging. <strong>Parameter Store</strong> (part of <strong>Systems Manager</strong>) is simpler and cheaper for non-rotating secrets. Never commit secrets to git, pass them in environment variables from Secrets Manager, or reference Parameter Store paths. For API keys to external services (OpenAI, etc.), rotate regularly and monitor for unusual usage patterns.
          </p>
          <p>
            <strong>Encryption</strong> protects data at rest and in transit. <strong>S3</strong>, <strong>DynamoDB</strong>, and most AWS services encrypt at rest by default using AWS-managed keys; use customer-managed <strong>KMS keys</strong> for additional control and audit logging. Data in transit uses <strong>TLS</strong>—<strong>API Gateway</strong> enforces HTTPS, and AWS service-to-service calls are encrypted. For highly sensitive data, consider <strong>client-side encryption</strong> where your application encrypts before sending to AWS.
          </p>
          <p>
            <strong>VPC considerations</strong> add network-level isolation but increase complexity and <strong>cold start latency</strong>. Place <strong>Lambda</strong> in VPC only if it needs to access VPC resources (<strong>RDS</strong>, <strong>ElastiCache</strong>, private EC2). Use <strong>VPC endpoints</strong> to reach AWS services (S3, DynamoDB, Secrets Manager) without traversing the public internet. <strong>Security groups</strong> control inbound/outbound traffic at the instance level; <strong>NACLs</strong> control traffic at the subnet level.
          </p>
          <Callout type="warning" title="Security checklist">
            Enable <strong>CloudTrail</strong> for API audit logging. Enable <strong>GuardDuty</strong> for threat detection. Enable <strong>Config</strong> for compliance monitoring. Review <strong>IAM Access Analyzer</strong> findings. Rotate credentials regularly. Never log secrets or PII. Encrypt all data at rest. Use <strong>VPC endpoints</strong> for sensitive traffic.
          </Callout>
        </Prose>
      ),
    },
  ],

  operations: [
    { name: "asyncio.gather()", time: "O(max task)", space: "O(n tasks)", note: "Concurrent await, returns when all complete" },
    { name: "asyncio.Semaphore", time: "O(1)", space: "O(1)", note: "Limits concurrent operations" },
    { name: "Lambda cold start", time: "100ms - 10s+", space: "O(pkg size)", note: "Depends on dependencies, VPC" },
    { name: "Lambda warm invoke", time: "1-100ms", space: "O(1)", note: "Handler only, no init" },
    { name: "DynamoDB GetItem", time: "O(1)", space: "O(item)", note: "Single-digit milliseconds" },
    { name: "DynamoDB Query", time: "O(items)", space: "O(items)", note: "Up to 1MB per request" },
    { name: "S3 GET (first byte)", time: "~100ms", space: "O(1)", note: "Higher for large files" },
    { name: "SQS SendMessage", time: "~10ms", space: "O(1)", note: "Durable write" },
    { name: "Pydantic validation", time: "O(fields)", space: "O(1)", note: "Rust-based in v2" },
  ],

  patterns: [
    {
      name: "AsyncIO Semaphore Rate Limiting",
      description: "Limit concurrent async operations to avoid overwhelming APIs or databases.",
      explanation: `**Rate limiting** is essential when making concurrent API calls. Without limits, you might spawn thousands of simultaneous requests, overwhelming the target service and triggering rate limits or failures. The **asyncio.Semaphore** acts as a bouncer: only N tasks can hold the semaphore at once, others wait.

The pattern wraps each API call in **'async with semaphore:'** before the actual request. When a task acquires the semaphore, it decrements the internal counter; when it releases (automatically on context exit), it increments. Tasks block on acquisition when the counter is zero. This provides **backpressure** without complex queuing.

For more sophisticated rate limiting—requests per second rather than concurrent requests—implement a **token bucket** or **sliding window**. The semaphore approach is simpler and sufficient for most use cases: "don't make more than 10 requests at once" is often all you need.`,
      triggers: "\"rate limit\", \"too many requests\", \"429 errors\", \"concurrent limit\", \"throttling\", \"backpressure\"",
      code: `import asyncio
import aiohttp

class RateLimitedClient:
    def __init__(self, max_concurrent: int = 10):
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.session: aiohttp.ClientSession | None = None

    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, *args):
        await self.session.close()

    async def fetch(self, url: str) -> dict:
        async with self.semaphore:  # Limit concurrency
            async with self.session.get(url) as response:
                return await response.json()

    async def fetch_all(self, urls: list[str]) -> list[dict]:
        tasks = [self.fetch(url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

# Usage
async def main():
    async with RateLimitedClient(max_concurrent=5) as client:
        results = await client.fetch_all(urls)`,
    },
    {
      name: "Structured Concurrency with TaskGroup",
      description: "Python 3.11+ pattern for managing related async tasks with proper cancellation.",
      explanation: `**TaskGroup** (Python 3.11+) provides **structured concurrency**: a way to ensure all spawned tasks complete or are cancelled together. Unlike **gather()**, which continues with other tasks if one fails (with return_exceptions=True) or cancels all on first failure (default), TaskGroup guarantees cleanup: when the TaskGroup exits, all tasks are complete or cancelled.

This matters for **resource management**. If you spawn 100 tasks and one fails after 10 complete, you want to cancel the remaining 89, not let them continue orphaned. TaskGroup handles this automatically. It also propagates exceptions properly—you see the original exception, not a wrapped **CancelledError**.

Use **TaskGroup** when tasks are logically related and should succeed or fail together. Use **gather()** with return_exceptions=True when you want to attempt all tasks and collect partial results. The mental model: TaskGroup is a "transaction" of async work; gather() is "best effort parallel."`,
      triggers: "\"cancel remaining tasks\", \"structured concurrency\", \"task group\", \"all or nothing\", \"cleanup on failure\"",
      code: `import asyncio

async def process_batch_structured(items: list[dict]) -> list[dict]:
    """Process items with automatic cancellation on failure."""
    results = []

    async with asyncio.TaskGroup() as tg:
        # All tasks created here will be awaited/cancelled together
        for item in items:
            tg.create_task(process_item(item, results))

    # Only reached if ALL tasks succeeded
    # If any task raised, exception propagates and others are cancelled
    return results

async def process_with_timeout(items: list[dict], timeout: float) -> list[dict]:
    """Timeout entire batch, not individual items."""
    async with asyncio.timeout(timeout):
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(process_item(item)) for item in items]

    return [task.result() for task in tasks]

# For partial failure tolerance, use gather
async def process_best_effort(items: list[dict]) -> list[dict | Exception]:
    tasks = [process_item(item) for item in items]
    return await asyncio.gather(*tasks, return_exceptions=True)`,
    },
    {
      name: "Lambda SQS Partial Batch Failure",
      description: "Handle SQS batch processing with partial failure reporting.",
      explanation: `When **Lambda** processes **SQS** messages in batches, the default behavior is all-or-nothing: if the handler raises, all messages return to the queue for retry. This causes processed messages to be reprocessed, wasting resources and potentially causing duplicate side effects.

**Partial batch failure** response lets you report which specific messages failed. Messages you report as failed return to the queue; successfully processed messages are deleted. This requires enabling **'ReportBatchItemFailures'** on the event source mapping and returning a specific response format with **'batchItemFailures'** array.

The key is wrapping each message's processing in try/except and collecting failures rather than letting exceptions propagate. Always make message processing **idempotent**—retried messages should produce the same result as first-time processing.`,
      triggers: "\"SQS batch\", \"partial failure\", \"some messages failed\", \"batch processing\", \"message retry\"",
      code: `import json
import boto3

def handler(event: dict, context) -> dict:
    """Process SQS batch with partial failure reporting."""
    batch_item_failures = []

    for record in event['Records']:
        message_id = record['messageId']
        try:
            body = json.loads(record['body'])
            process_message(body)  # Your business logic

        except ValidationError as e:
            # Invalid message - don't retry, send to DLQ
            print(f"Invalid message {message_id}: {e}")
            batch_item_failures.append({'itemIdentifier': message_id})

        except RetryableError as e:
            # Transient failure - retry
            print(f"Retryable error {message_id}: {e}")
            batch_item_failures.append({'itemIdentifier': message_id})

        except Exception as e:
            # Unknown error - log and retry
            print(f"Unexpected error {message_id}: {e}")
            batch_item_failures.append({'itemIdentifier': message_id})

    # Return failures - these messages will be retried
    return {'batchItemFailures': batch_item_failures}

# Event source mapping config:
# FunctionResponseTypes: ["ReportBatchItemFailures"]
# BatchSize: 10
# MaximumBatchingWindowInSeconds: 5`,
    },
    {
      name: "DynamoDB Single-Table Design",
      description: "Store multiple entity types in one table using composite keys.",
      explanation: `**Single-table design** stores all related entities in one **DynamoDB** table using **composite primary keys** (PK + SK). This feels wrong if you're used to relational databases, but it aligns with DynamoDB's strengths: one query can return multiple entity types, avoiding the need for joins.

The pattern uses **prefixes** to distinguish entity types: PK='USER#123', SK='PROFILE' for user data; PK='USER#123', SK='ORDER#001' for orders. Querying PK='USER#123' returns both user profile and all orders in one round trip. **Global Secondary Indexes (GSIs)** enable additional access patterns—GSI with SK as PK allows "get all orders" without scanning users.

Design for **access patterns**, not entities. List all the queries your application needs, then design keys and indexes to serve them efficiently. This is backwards from relational design but critical for DynamoDB performance. Single-table design is powerful but complex; start simpler with multiple tables if your access patterns are straightforward.`,
      triggers: "\"DynamoDB\", \"NoSQL design\", \"denormalization\", \"single table\", \"composite key\", \"avoid joins\"",
      code: `import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

class SingleTableDB:
    def __init__(self, table_name: str):
        self.table = boto3.resource('dynamodb').Table(table_name)

    def put_user(self, user_id: str, name: str, email: str):
        self.table.put_item(Item={
            'PK': f'USER#{user_id}',
            'SK': 'PROFILE',
            'name': name,
            'email': email,
            'entity_type': 'user'
        })

    def put_order(self, user_id: str, order_id: str, total: float):
        self.table.put_item(Item={
            'PK': f'USER#{user_id}',
            'SK': f'ORDER#{order_id}',
            'total': Decimal(str(total)),
            'entity_type': 'order'
        })

    def get_user_with_orders(self, user_id: str) -> dict:
        """Single query returns user AND all their orders."""
        response = self.table.query(
            KeyConditionExpression=Key('PK').eq(f'USER#{user_id}')
        )
        items = response['Items']
        user = next((i for i in items if i['SK'] == 'PROFILE'), None)
        orders = [i for i in items if i['SK'].startswith('ORDER#')]
        return {'user': user, 'orders': orders}`,
    },
    {
      name: "S3 Event Processing Pipeline",
      description: "Process S3 uploads with Lambda triggers and proper error handling.",
      explanation: `**S3 events** trigger **Lambda** for event-driven data processing. When a file uploads to S3, a notification invokes your Lambda with event details (bucket, key, size). This decouples upload from processing and scales automatically—100 simultaneous uploads trigger 100 Lambda invocations.

Route S3 events through **SQS** for reliability. Direct S3→Lambda invocation loses events if Lambda fails; **S3→SQS→Lambda** retries failed messages. Set **visibility timeout** to 6x Lambda timeout for safe retries. Use **DLQ** to capture persistently failing files for investigation.

Handle the event format carefully: S3 keys are **URL-encoded** (spaces become %20), so use **urllib.parse.unquote_plus**. Filter events by prefix and suffix in the S3 notification configuration to avoid processing unexpected files. Make processing **idempotent**—the same file might trigger multiple times.`,
      triggers: "\"S3 upload\", \"file processing\", \"event-driven\", \"data pipeline\", \"ETL\", \"file arrives\"",
      code: `import boto3
import json
from urllib.parse import unquote_plus

s3 = boto3.client('s3')

def handler(event: dict, context):
    """Process S3 uploads triggered by EventBridge/S3 notifications."""
    for record in event['Records']:
        # Handle SQS wrapping if using S3 -> SQS -> Lambda
        if 'body' in record:
            s3_event = json.loads(record['body'])['Records'][0]
        else:
            s3_event = record

        bucket = s3_event['s3']['bucket']['name']
        key = unquote_plus(s3_event['s3']['object']['key'])

        # Validate key matches expected pattern
        if not key.startswith('raw/') or not key.endswith('.jsonl'):
            print(f"Skipping unexpected key: {key}")
            continue

        # Process file
        response = s3.get_object(Bucket=bucket, Key=key)
        content = response['Body'].read().decode('utf-8')

        processed = [
            transform(json.loads(line))
            for line in content.split('\\n') if line
        ]

        # Write to processed location
        output_key = key.replace('raw/', 'processed/')
        s3.put_object(
            Bucket=bucket,
            Key=output_key,
            Body=json.dumps(processed),
            ContentType='application/json'
        )

        print(f"Processed {len(processed)} records: {key} -> {output_key}")`,
    },
    {
      name: "Pydantic Settings with Validation",
      description: "Type-safe configuration management with environment variables.",
      explanation: `**Pydantic Settings** bridges configuration files and environment variables with **type-safe validation**. It reads from environment variables (and .env files), validates types, applies constraints, and provides IDE autocomplete. This eliminates stringly-typed configuration bugs—a misspelled env var name surfaces immediately, not at runtime.

Settings use the same validation as Pydantic models: **Field constraints** (min/max), custom validators, nested models. They also support secrets (**SecretStr** hides values in logs), file loading (json_file, yaml_file), and prefix stripping (MYAPP_DATABASE_URL → database_url). Cache the Settings instance with **@lru_cache** to avoid rereading on every access.

In **Lambda**, combine with **AWS Secrets Manager** for sensitive values. The Settings class defines structure and defaults; actual values come from Lambda environment variables or Secrets Manager at runtime. This keeps secrets out of code while maintaining type safety.`,
      triggers: "\"configuration\", \"environment variables\", \"settings\", \".env file\", \"config validation\"",
      code: `from pydantic_settings import BaseSettings
from pydantic import Field, SecretStr
from functools import lru_cache

class Settings(BaseSettings):
    # Required - must be set
    openai_api_key: SecretStr
    database_url: str

    # Optional with defaults
    debug: bool = False
    log_level: str = "INFO"
    max_retries: int = 3

    # Constrained values
    batch_size: int = Field(default=100, ge=1, le=1000)
    timeout_seconds: float = Field(default=30.0, gt=0)

    # AWS configuration
    aws_region: str = "us-east-1"
    dynamodb_table: str = "features"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,  # OPENAI_API_KEY -> openai_api_key
    }

@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()

# Usage
settings = get_settings()
print(settings.aws_region)  # "us-east-1"
print(settings.openai_api_key.get_secret_value())  # Actual key value`,
    },
    {
      name: "Pytest Fixtures for ML Testing",
      description: "Reusable test fixtures for mocking ML dependencies.",
      explanation: `**Pytest fixtures** provide reusable setup for tests. For ML systems, fixtures mock expensive dependencies (**LLM APIs**, databases, models), provide consistent test data, and handle **resource lifecycle** (create before test, cleanup after). The fixture system's **dependency injection** means tests declare what they need; pytest provides it.

Define fixtures in **conftest.py** for automatic discovery across test files. Use **scope='function'** (default) for isolated tests, **scope='module'** or **scope='session'** for expensive setup shared across tests. **Async fixtures** with **pytest-asyncio** enable testing async code naturally.

For **LLM testing**, fixtures mock the API client to return **deterministic responses**. This makes tests fast (no API calls), free (no API costs), and reproducible (same response every time). Test the actual API integration separately with a small set of **integration tests**.`,
      triggers: "\"pytest\", \"fixtures\", \"mock LLM\", \"test setup\", \"test isolation\", \"conftest\"",
      code: `import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from typing import AsyncGenerator

@pytest.fixture
def mock_openai():
    """Mock OpenAI client for deterministic testing."""
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="Mocked response"))]
    mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

    with patch("app.services.openai_client", mock_client):
        yield mock_client

@pytest.fixture
def sample_embeddings():
    """Deterministic embeddings for testing."""
    import numpy as np
    rng = np.random.default_rng(42)  # Fixed seed
    return rng.random((10, 384)).astype(np.float32)

@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator:
    """Test database with automatic cleanup."""
    async with create_test_database() as session:
        yield session
        await session.rollback()

@pytest.mark.asyncio
async def test_rag_pipeline(mock_openai, sample_embeddings, db_session):
    """Integration test with mocked dependencies."""
    pipeline = RAGPipeline(llm=mock_openai, db=db_session)

    result = await pipeline.query("test question")

    assert "Mocked response" in result
    mock_openai.chat.completions.create.assert_called_once()`,
    },
    {
      name: "Exponential Backoff with Jitter",
      description: "Retry failed operations with increasing delays to avoid thundering herd.",
      explanation: `**Exponential backoff** spreads retry attempts over increasing time intervals, reducing load on failing services. Without backoff, immediate retries from thousands of clients hammer a recovering service, prolonging the outage. Backoff gives the service time to recover.

Add **jitter** (randomness) to prevent synchronized retries. If 1000 clients all retry at exactly 1s, 2s, 4s, they hit the service in synchronized waves. Jitter spreads these out: clients retry at random times within each interval, smoothing the load. **Full jitter** (0 to delay) is most effective; **partial jitter** (delay/2 to delay) is simpler.

Configure **max retries** and **max delay**. Infinite retries never give up; max delay prevents absurdly long waits (60 seconds is typical max). Make retry conditions explicit—retry on **429** (rate limit) and **5xx** (server error), but not on **4xx** (client error, won't succeed on retry).`,
      triggers: "\"retry\", \"backoff\", \"exponential\", \"transient failure\", \"rate limit\", \"429\", \"5xx\"",
      code: `import asyncio
import random
from functools import wraps
from typing import Type, Callable, TypeVar

T = TypeVar('T')

def async_retry(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    retryable_exceptions: tuple[Type[Exception], ...] = (Exception,),
    jitter: bool = True
):
    """Async retry decorator with exponential backoff."""
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except retryable_exceptions as e:
                    last_exception = e

                    if attempt == max_retries:
                        raise

                    # Calculate delay with exponential backoff
                    delay = min(base_delay * (exponential_base ** attempt), max_delay)

                    # Add jitter to prevent thundering herd
                    if jitter:
                        delay *= random.uniform(0.5, 1.5)

                    print(f"Retry {attempt + 1}/{max_retries} after {delay:.2f}s: {e}")
                    await asyncio.sleep(delay)

            raise last_exception

        return wrapper
    return decorator

@async_retry(max_retries=3, retryable_exceptions=(ConnectionError, TimeoutError))
async def call_api(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()`,
    },
    {
      name: "Circuit Breaker Pattern",
      description: "Prevent cascade failures by stopping requests to failing services.",
      explanation: `The **circuit breaker** prevents **cascade failures** when a downstream service fails. Like an electrical circuit breaker, it "trips" after too many failures, stopping requests entirely. This gives the failing service time to recover and prevents your system from wasting resources on requests that will fail.

Three states: **CLOSED** (normal operation, requests pass through), **OPEN** (service failing, requests rejected immediately), **HALF_OPEN** (testing if service recovered, limited requests allowed). The circuit opens after **N failures** in a time window, stays open for a **timeout period**, then moves to half-open. If half-open requests succeed, it closes; if they fail, it reopens.

Combine with **retries**: retries handle **transient failures**, circuit breaker handles **sustained outages**. Without a circuit breaker, retries multiply load on a failing service. The circuit breaker cuts off that load, letting the service recover.`,
      triggers: "\"circuit breaker\", \"cascade failure\", \"fail fast\", \"service down\", \"prevent overload\"",
      code: `import asyncio
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass

class CircuitState(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open"  # Testing recovery

@dataclass
class CircuitBreaker:
    failure_threshold: int = 5
    recovery_timeout: float = 30.0
    half_open_max_calls: int = 3

    state: CircuitState = CircuitState.CLOSED
    failures: int = 0
    last_failure_time: datetime | None = None
    half_open_calls: int = 0

    async def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if self._should_attempt_recovery():
                self.state = CircuitState.HALF_OPEN
                self.half_open_calls = 0
            else:
                raise CircuitBreakerOpen("Circuit breaker is open")

        if self.state == CircuitState.HALF_OPEN:
            if self.half_open_calls >= self.half_open_max_calls:
                raise CircuitBreakerOpen("Half-open call limit reached")
            self.half_open_calls += 1

        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        if self.state == CircuitState.HALF_OPEN:
            self.state = CircuitState.CLOSED
        self.failures = 0

    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = datetime.now()
        if self.failures >= self.failure_threshold:
            self.state = CircuitState.OPEN

    def _should_attempt_recovery(self) -> bool:
        if self.last_failure_time is None:
            return True
        return datetime.now() - self.last_failure_time > timedelta(seconds=self.recovery_timeout)`,
    },
    {
      name: "Idempotency with DynamoDB",
      description: "Ensure operations execute exactly once using DynamoDB conditional writes.",
      explanation: `**Idempotency** ensures that executing an operation multiple times has the same effect as executing it once. This is critical for **event-driven systems** where messages may be delivered more than once (**SQS at-least-once delivery**) or operations may be retried on failure.

**DynamoDB conditional writes** provide idempotency at the database level. Store a unique **request ID**; before processing, check if that ID exists (**conditional write**). If it exists, skip processing (duplicate). If not, write the ID and process. The **atomic conditional write** prevents **race conditions** where two simultaneous requests both see "no ID" and both process.

Set a **TTL** on idempotency records to clean up old entries. The TTL should exceed your maximum **retry window**—if retries stop after 24 hours, idempotency records can expire after 48 hours. This bounds storage while ensuring duplicates are caught.`,
      triggers: "\"idempotency\", \"exactly once\", \"duplicate prevention\", \"at-least-once\", \"conditional write\"",
      code: `import boto3
from botocore.exceptions import ClientError
from datetime import datetime, timedelta
import hashlib

class IdempotencyStore:
    def __init__(self, table_name: str, ttl_hours: int = 48):
        self.table = boto3.resource('dynamodb').Table(table_name)
        self.ttl_hours = ttl_hours

    def get_idempotency_key(self, request: dict) -> str:
        """Generate deterministic key from request content."""
        content = json.dumps(request, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()

    def execute_once(self, idempotency_key: str, operation):
        """Execute operation only if not already executed."""
        ttl = int((datetime.now() + timedelta(hours=self.ttl_hours)).timestamp())

        try:
            # Conditional write - fails if key exists
            self.table.put_item(
                Item={
                    'PK': f'IDEMPOTENCY#{idempotency_key}',
                    'SK': 'LOCK',
                    'created_at': datetime.now().isoformat(),
                    'ttl': ttl,
                },
                ConditionExpression='attribute_not_exists(PK)'
            )

            # Key didn't exist - execute operation
            result = operation()

            # Store result for duplicate requests
            self.table.update_item(
                Key={'PK': f'IDEMPOTENCY#{idempotency_key}', 'SK': 'LOCK'},
                UpdateExpression='SET #result = :result, #status = :status',
                ExpressionAttributeNames={'#result': 'result', '#status': 'status'},
                ExpressionAttributeValues={':result': result, ':status': 'completed'}
            )

            return result

        except ClientError as e:
            if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
                # Already executed - return cached result
                item = self.table.get_item(
                    Key={'PK': f'IDEMPOTENCY#{idempotency_key}', 'SK': 'LOCK'}
                ).get('Item', {})
                return item.get('result')
            raise`,
    },
    {
      name: "Lambda Powertools Observability",
      description: "Structured logging, tracing, and metrics with AWS Lambda Powertools.",
      explanation: `**Lambda Powertools** provides production-ready **observability** for Python Lambda functions. It integrates **structured logging**, **distributed tracing**, and **custom metrics** in a decorator-based pattern that requires minimal code changes. The library handles **correlation IDs**, **cold start detection**, and **CloudWatch/X-Ray** integration automatically.

**Logger** outputs JSON with consistent structure, automatically including Lambda context (function name, request ID, memory size). **Tracer** wraps **X-Ray SDK** with simpler APIs and automatic **subsegment creation**. **Metrics** creates **CloudWatch EMF** (Embedded Metrics Format) for custom metrics without calling the CloudWatch API (lower cost, lower latency).

Start with **Logger** and **Tracer** on every function—the overhead is negligible, and having observability from day one saves debugging time later. Add custom **Metrics** for business-relevant measurements (predictions made, processing time, cache hit rate). Use **Logger.inject_lambda_context** to automatically log the full event on cold starts.`,
      triggers: "\"logging\", \"tracing\", \"metrics\", \"observability\", \"CloudWatch\", \"X-Ray\", \"Lambda Powertools\"",
      code: `from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.metrics import MetricUnit
import json

logger = Logger(service="ml-inference")
tracer = Tracer(service="ml-inference")
metrics = Metrics(namespace="MLService")

@logger.inject_lambda_context(log_event=True)  # Log full event on cold start
@tracer.capture_lambda_handler
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event: dict, context: LambdaContext) -> dict:
    # Correlation ID automatically added to all logs
    request_id = context.aws_request_id

    logger.info("Processing request", extra={
        "model_version": "v2.1",
        "feature_count": len(event.get("features", [])),
    })

    # Custom subsegment for tracing
    with tracer.capture_method():
        prediction = run_inference(event["features"])

    # Custom metrics (sent via EMF, no API calls)
    metrics.add_metric(
        name="PredictionCount",
        unit=MetricUnit.Count,
        value=1
    )
    metrics.add_metric(
        name="InferenceLatency",
        unit=MetricUnit.Milliseconds,
        value=elapsed_ms
    )

    # Structured log for debugging
    logger.info("Inference complete", extra={
        "prediction": prediction,
        "latency_ms": elapsed_ms,
    })

    return {
        "statusCode": 200,
        "body": json.dumps({"prediction": prediction})
    }`,
    },
    {
      name: "CDK Custom Construct",
      description: "Reusable infrastructure components with AWS CDK.",
      explanation: `**CDK Constructs** encapsulate infrastructure patterns as **reusable components**. Instead of copying **Lambda + API Gateway + DynamoDB** configuration across projects, create a custom construct that bundles them with your organization's defaults. This is **infrastructure abstraction**—hide complexity behind a clean interface.

Constructs follow a **hierarchy**: **L1** (raw CloudFormation), **L2** (AWS defaults + helper methods), **L3** (patterns combining multiple resources). Custom constructs are typically **L3**: they accept high-level parameters and create multiple underlying resources with proper permissions and configuration.

Design constructs for your team's common patterns. An **"MLEndpoint" construct** might create Lambda, API Gateway, DynamoDB for caching, CloudWatch alarms, and X-Ray tracing. Teams use it with one line; the construct handles infrastructure details. **Version constructs** in a shared library for consistency across projects.`,
      triggers: "\"CDK\", \"infrastructure\", \"reusable\", \"construct\", \"IaC pattern\", \"template\"",
      code: `from aws_cdk import (
    Stack, Duration, RemovalPolicy,
    aws_lambda as lambda_,
    aws_apigateway as apigw,
    aws_dynamodb as dynamodb,
    aws_cloudwatch as cloudwatch,
)
from constructs import Construct

class MLInferenceEndpoint(Construct):
    """Reusable construct for ML inference endpoints."""

    def __init__(
        self,
        scope: Construct,
        id: str,
        *,
        function_code: lambda_.Code,
        handler: str,
        memory_size: int = 1024,
        timeout_seconds: int = 30,
        enable_caching: bool = True,
    ):
        super().__init__(scope, id)

        # Cache table (optional)
        self.cache_table = None
        if enable_caching:
            self.cache_table = dynamodb.Table(
                self, "CacheTable",
                partition_key=dynamodb.Attribute(
                    name="cache_key",
                    type=dynamodb.AttributeType.STRING
                ),
                billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
                time_to_live_attribute="ttl",
            )

        # Lambda function
        self.function = lambda_.Function(
            self, "Function",
            runtime=lambda_.Runtime.PYTHON_3_11,
            handler=handler,
            code=function_code,
            memory_size=memory_size,
            timeout=Duration.seconds(timeout_seconds),
            tracing=lambda_.Tracing.ACTIVE,
            environment={
                "CACHE_TABLE": self.cache_table.table_name if self.cache_table else "",
            },
        )

        if self.cache_table:
            self.cache_table.grant_read_write_data(self.function)

        # API Gateway
        self.api = apigw.RestApi(self, "Api")
        self.api.root.add_resource("predict").add_method(
            "POST", apigw.LambdaIntegration(self.function)
        )

        # CloudWatch alarm
        self.error_alarm = cloudwatch.Alarm(
            self, "ErrorAlarm",
            metric=self.function.metric_errors(),
            threshold=5,
            evaluation_periods=1,
            alarm_description="ML inference errors exceeded threshold",
        )

# Usage in a stack
class MyStack(Stack):
    def __init__(self, scope, id, **kwargs):
        super().__init__(scope, id, **kwargs)

        endpoint = MLInferenceEndpoint(
            self, "SentimentAnalysis",
            function_code=lambda_.Code.from_asset("lambda/sentiment"),
            handler="main.handler",
            memory_size=2048,
        )`,
    },
  ],

  problems: [
    {
      id: "async-batch",
      title: "Async batch processor",
      difficulty: "medium",
      description:
        "Implement an async function that processes items in batches with a maximum batch size and concurrency limit. Handle partial failures gracefully.",
      examples: [],
      starterCode: `async def batch_process(
    items: list[T],
    processor: Callable[[list[T]], Awaitable[list[R]]],
    batch_size: int = 10,
    max_concurrency: int = 5
) -> list[R]:
    """Process items in batches with concurrency control."""
    pass`,
      hints: [
        "Use asyncio.Semaphore for concurrency control",
        "Chunk the items into batches of batch_size",
        "Use asyncio.gather with return_exceptions=True for partial failure handling",
        "Flatten results from all batches into a single list",
      ],
      solution: `import asyncio
from typing import TypeVar, Callable, Awaitable

T = TypeVar('T')
R = TypeVar('R')

async def batch_process(
    items: list[T],
    processor: Callable[[list[T]], Awaitable[list[R]]],
    batch_size: int = 10,
    max_concurrency: int = 5
) -> list[R]:
    """Process items in batches with concurrency control."""
    semaphore = asyncio.Semaphore(max_concurrency)

    async def process_batch(batch: list[T]) -> list[R]:
        async with semaphore:
            return await processor(batch)

    # Chunk items into batches
    batches = [
        items[i:i + batch_size]
        for i in range(0, len(items), batch_size)
    ]

    # Process all batches concurrently (limited by semaphore)
    tasks = [process_batch(batch) for batch in batches]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Flatten results, handling exceptions
    flattened = []
    for result in results:
        if isinstance(result, Exception):
            print(f"Batch failed: {result}")
        else:
            flattened.extend(result)

    return flattened`,
      testCases: [],
    },
    {
      id: "lambda-handler-decorator",
      title: "Type-safe Lambda handler decorator",
      difficulty: "medium",
      description:
        "Create a decorator that validates Lambda input/output using Pydantic models, handles errors gracefully, and returns proper HTTP responses.",
      examples: [],
      starterCode: `def validated_handler(
    request_model: Type[BaseModel],
    response_model: Type[BaseModel]
):
    """Decorator for type-safe Lambda handlers."""
    pass`,
      hints: [
        "Parse event['body'] and validate with request_model",
        "Call the wrapped function with the validated request",
        "Validate the response with response_model",
        "Handle ValidationError with 400 status code",
        "Handle other exceptions with 500 status code",
      ],
      solution: `import json
from functools import wraps
from typing import Type, TypeVar
from pydantic import BaseModel, ValidationError

T = TypeVar('T', bound=BaseModel)
R = TypeVar('R', bound=BaseModel)

def validated_handler(request_model: Type[T], response_model: Type[R]):
    """Decorator for type-safe Lambda handlers."""
    def decorator(func):
        @wraps(func)
        def wrapper(event: dict, context):
            try:
                # Parse request body
                body = event.get('body', '{}')
                if isinstance(body, str):
                    body = json.loads(body)
                request = request_model.model_validate(body)

                # Call handler
                result = func(request, context)

                # Validate response
                if not isinstance(result, response_model):
                    result = response_model.model_validate(result)

                return {
                    'statusCode': 200,
                    'body': result.model_dump_json(),
                    'headers': {'Content-Type': 'application/json'}
                }
            except ValidationError as e:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'errors': e.errors()}),
                    'headers': {'Content-Type': 'application/json'}
                }
            except Exception as e:
                print(f"Handler error: {e}")
                return {
                    'statusCode': 500,
                    'body': json.dumps({'error': 'Internal server error'}),
                    'headers': {'Content-Type': 'application/json'}
                }
        return wrapper
    return decorator

# Usage
class PredictRequest(BaseModel):
    features: list[float]

class PredictResponse(BaseModel):
    prediction: float
    confidence: float

@validated_handler(PredictRequest, PredictResponse)
def handler(request: PredictRequest, context) -> PredictResponse:
    return PredictResponse(prediction=0.85, confidence=0.92)`,
      testCases: [],
    },
    {
      id: "dynamo-repository",
      title: "Generic DynamoDB repository",
      difficulty: "medium",
      description:
        "Implement a generic repository class for DynamoDB with Pydantic model support, handling type conversions (float to Decimal) and CRUD operations.",
      examples: [],
      starterCode: `class DynamoRepository(Generic[T]):
    def __init__(self, table_name: str, model_class: Type[T], pk_field: str):
        pass

    def create(self, item: T) -> T:
        pass

    def get(self, pk: str) -> T | None:
        pass

    def update(self, pk: str, updates: dict) -> T | None:
        pass

    def delete(self, pk: str) -> bool:
        pass`,
      hints: [
        "Convert float to Decimal before storing (DynamoDB requirement)",
        "Use model_validate to convert DynamoDB items back to Pydantic models",
        "Handle missing items (get_item returns empty dict)",
        "Use UpdateExpression with ExpressionAttributeNames/Values",
      ],
      solution: `from typing import TypeVar, Generic, Type
from pydantic import BaseModel
import boto3
from decimal import Decimal

T = TypeVar('T', bound=BaseModel)

class DynamoRepository(Generic[T]):
    def __init__(self, table_name: str, model_class: Type[T], pk_field: str):
        self.table = boto3.resource('dynamodb').Table(table_name)
        self.model_class = model_class
        self.pk_field = pk_field

    def _to_dynamo(self, data: dict) -> dict:
        """Convert floats to Decimal for DynamoDB."""
        if isinstance(data, float):
            return Decimal(str(data))
        if isinstance(data, dict):
            return {k: self._to_dynamo(v) for k, v in data.items()}
        if isinstance(data, list):
            return [self._to_dynamo(v) for v in data]
        return data

    def create(self, item: T) -> T:
        data = self._to_dynamo(item.model_dump())
        self.table.put_item(Item=data)
        return item

    def get(self, pk: str) -> T | None:
        response = self.table.get_item(Key={self.pk_field: pk})
        if 'Item' not in response:
            return None
        return self.model_class.model_validate(response['Item'])

    def update(self, pk: str, updates: dict) -> T | None:
        update_expr = "SET " + ", ".join(f"#{k} = :{k}" for k in updates)
        names = {f"#{k}": k for k in updates}
        values = {f":{k}": self._to_dynamo(v) for k, v in updates.items()}

        response = self.table.update_item(
            Key={self.pk_field: pk},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=names,
            ExpressionAttributeValues=values,
            ReturnValues="ALL_NEW"
        )
        return self.model_class.model_validate(response['Attributes'])

    def delete(self, pk: str) -> bool:
        self.table.delete_item(Key={self.pk_field: pk})
        return True`,
      testCases: [],
    },
  ],
};
