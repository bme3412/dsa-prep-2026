import type { DataStructure } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";
import { AsyncIOViz } from "../../visualizations/python-aws/AsyncIOViz";
import { LambdaColdStartViz } from "../../visualizations/python-aws/LambdaColdStartViz";
import { AWSArchitectureViz } from "../../visualizations/python-aws/AWSArchitectureViz";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] mb-4">
    {children}
  </p>
);

const Callout = ({
  type,
  title,
  children,
}: {
  type: "insight" | "warning" | "tip" | "analogy";
  title: string;
  children: React.ReactNode;
}) => {
  const colors = {
    insight: { bg: "var(--color-accent-glow)", border: "var(--color-accent)", icon: "💡" },
    warning: { bg: "var(--color-coral-dim)", border: "var(--color-coral)", icon: "⚠️" },
    tip: { bg: "var(--color-green-dim)", border: "var(--color-green)", icon: "✅" },
    analogy: { bg: "var(--color-amber-dim)", border: "var(--color-amber)", icon: "🔗" },
  };
  const c = colors[type];
  return (
    <div
      className="rounded-[var(--radius-md)] p-4 my-4"
      style={{ background: c.bg, borderLeft: `3px solid ${c.border}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: c.border }}>
        {c.icon} {title}
      </p>
      <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {children}
      </div>
    </div>
  );
};

const ConceptCard = ({
  name,
  oneLiner,
  details,
  example,
}: {
  name: string;
  oneLiner: string;
  details: string;
  example?: string;
}) => (
  <div className="border border-[var(--color-border)] rounded-lg p-4 my-4">
    <div className="flex items-center gap-2 mb-2">
      <span
        className="text-sm font-semibold px-2 py-0.5 rounded"
        style={{ background: "var(--color-accent-glow)", color: "var(--color-accent)" }}
      >
        {name}
      </span>
    </div>
    <p className="text-sm font-medium text-[var(--color-text-primary)] mb-2">{oneLiner}</p>
    <p className="text-sm text-[var(--color-text-secondary)] mb-3">{details}</p>
    {example && <CodeBlock code={example.trim()} language="python" />}
  </div>
);

const ComparisonTable = ({
  items,
}: {
  items: { name: string; when: string; example: string; color: string }[];
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
    {items.map((item) => (
      <div
        key={item.name}
        className="p-4 rounded-[var(--radius-md)]"
        style={{ background: "var(--color-bg-tertiary)" }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: item.color }}>
          {item.name}
        </p>
        <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
          {item.when}
        </p>
        <p className="text-[11px] font-mono" style={{ color: "var(--color-text-muted)" }}>
          {item.example}
        </p>
      </div>
    ))}
  </div>
);

export const pythonAWSContent: DataStructure = {
  id: "python-aws",
  name: "Python & AWS",
  icon: "🐍",
  color: "amber",
  tagline: "Production Python for AI systems",
  description:
    "A deep dive into Python's execution model, concurrency patterns, and AWS serverless architecture for building production AI systems.",
  viewMode: "pattern-first",

  sections: [
    // ==================== SECTION 1: WHY PYTHON + AWS ====================
    {
      id: "why-python-aws",
      title: "Why Python + AWS Dominates AI",
      subtitle: "Understanding the stack before using it",
      content: (
        <>
          <Prose>
            Before diving into syntax and services, let's understand <strong>why</strong> this combination exists. Python isn't the fastest language. AWS isn't the simplest cloud. Yet together they power most production AI systems. Understanding why helps you use them correctly.
          </Prose>

          <Prose>
            <strong>Python's superpower is its ecosystem.</strong> NumPy, pandas, PyTorch, scikit-learn, LangChain, Hugging Face — the entire ML/AI stack is Python-first. This isn't about language features; it's about having the right tools. When you need a transformer model, an embedding service, or a data pipeline, Python has battle-tested libraries. Other languages have you writing from scratch.
          </Prose>

          <Prose>
            <strong>AWS's superpower is managed infrastructure.</strong> Instead of provisioning servers, configuring load balancers, and managing databases, you describe what you need. Lambda runs your code without servers. DynamoDB stores your data without database administration. S3 stores files without storage management. This lets you focus on AI logic, not ops.
          </Prose>

          <Callout type="analogy" title="The Restaurant Kitchen Analogy">
            Think of Python + AWS like a restaurant kitchen. Python is the chef — skilled at creating dishes (algorithms), combining ingredients (libraries), and following recipes (workflows). AWS is the kitchen infrastructure — the ovens, fridges, and dishwashers that the chef uses but doesn't maintain. A great chef in a terrible kitchen struggles; amazing equipment with no chef is useless. Together, they serve customers.
          </Callout>

          <Prose>
            <strong>The three use cases you'll encounter most:</strong>
          </Prose>

          <ConceptCard
            name="LLM-Powered Applications"
            oneLiner="Document Q&A, chatbots, content generation"
            details="Python handles the RAG pipeline — chunking documents, generating embeddings, constructing prompts, parsing responses. Lambda runs the inference code, scaling automatically. DynamoDB stores conversation history. S3 holds the document corpus. The whole system scales from 0 to 1000s of requests with no infrastructure changes."
          />

          <ConceptCard
            name="Batch ML Inference"
            oneLiner="Processing millions of records overnight"
            details="Your scikit-learn or PyTorch model runs predictions on massive datasets. Step Functions orchestrate the pipeline: trigger on S3 upload, fan out to Lambda for parallel processing, aggregate results. 10 million records processed by 1000 parallel Lambdas, completing in minutes."
          />

          <ConceptCard
            name="Real-time Feature Engineering"
            oneLiner="Computing features from streaming events"
            details="Python defines feature logic — aggregations, lookups, window functions. Kinesis ingests the event stream. Lambda computes features per event. DynamoDB stores aggregated state. Features feed into SageMaker for predictions. Event to prediction: under 100ms at 10,000 events/second."
          />

          <AWSArchitectureViz />

          <Callout type="warning" title="When NOT to Use Serverless Python">
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Ultra-low latency (&lt;10ms)</strong>: Lambda cold starts kill you. Use containers.</li>
              <li><strong>Large models</strong>: Lambda's 10GB limit may not fit. Use SageMaker or EC2.</li>
              <li><strong>Long-running jobs</strong>: Lambda has 15-minute timeout. Use Fargate or EC2.</li>
              <li><strong>GPU workloads</strong>: Lambda has no GPUs. Use SageMaker or EC2 GPU instances.</li>
            </ul>
            Serverless Python excels at glue code, lightweight inference, and orchestration — the 80% of AI work that isn't model training.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 2: THE GIL ====================
    {
      id: "gil-explained",
      title: "The GIL: Python's Most Misunderstood Feature",
      subtitle: "What it is, why it exists, and why you shouldn't worry",
      content: (
        <>
          <Prose>
            If you've heard one thing about Python performance, it's probably "Python is slow because of the GIL." This is wrong. Let's understand what the GIL actually is and when it matters.
          </Prose>

          <Prose>
            <strong>The Global Interpreter Lock (GIL)</strong> is a mutex — a lock that ensures only one thread executes Python bytecode at a time. If you have 8 CPU cores and 8 Python threads, only one thread runs Python code at any moment. The others wait.
          </Prose>

          <Callout type="analogy" title="The Bathroom Key Analogy">
            Imagine an office with one bathroom key. Everyone can work at their desks simultaneously, but only one person can use the bathroom at a time. The GIL is that key — it serializes access to Python's internals (the "bathroom") while letting threads do other things (work at their desks). Waiting for a web response? You don't need the key. Running Python math? You need the key.
          </Callout>

          <Prose>
            <strong>Why does Python have this?</strong> CPython (the standard Python) uses reference counting for memory management. Every object has a counter of references to it. When the counter hits zero, memory is freed. Without the GIL, two threads could modify the same counter simultaneously, corrupting it. The GIL prevents this without requiring per-object locks (which would be much slower).
          </Prose>

          <ConceptCard
            name="When the GIL Matters"
            oneLiner="CPU-bound pure Python code"
            details="If you're crunching numbers in pure Python loops, threads won't help — they'll fight for the GIL. You need multiprocessing (separate processes, each with its own GIL) for true parallelism."
            example={`
# This WON'T run faster with threads - GIL serializes it
def cpu_bound_work():
    total = 0
    for i in range(10_000_000):
        total += i * i
    return total

# Using threads: still takes ~same time (GIL serializes)
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_bound_work, range(4)))
    # Takes ~4x as long as you'd hope

# Using processes: actually 4x faster (separate GILs)
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_bound_work, range(4)))
    # Takes ~1/4 the time
`}
          />

          <ConceptCard
            name="When the GIL Doesn't Matter"
            oneLiner="I/O operations and C extensions"
            details="The GIL is released during I/O operations (network, disk, database) and during C extension calls (NumPy, PyTorch). This is why threading works great for I/O-bound code and why NumPy is fast despite the GIL."
            example={`
# This WILL run faster with threads - I/O releases the GIL
import requests
from concurrent.futures import ThreadPoolExecutor

def fetch_url(url):
    return requests.get(url)  # GIL released while waiting

urls = ["http://example.com"] * 100

# Sequential: ~30 seconds
results = [fetch_url(url) for url in urls]

# Threaded: ~1 second (100x faster!)
with ThreadPoolExecutor(max_workers=50) as executor:
    results = list(executor.map(fetch_url, urls))
`}
          />

          <Callout type="insight" title="The ML Reality">
            For most ML work, the GIL is irrelevant. NumPy operations happen in C (releases GIL). PyTorch operations happen in C++ (releases GIL). API calls to OpenAI/Bedrock release the GIL. Your bottleneck is usually I/O or the Python glue between library calls — not the GIL.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 3: CONCURRENCY MODELS ====================
    {
      id: "concurrency-mental-models",
      title: "The Three Concurrency Models",
      subtitle: "Threading, multiprocessing, asyncio — and when to use each",
      content: (
        <>
          <Prose>
            Python gives you three ways to do multiple things at once. Each has a mental model that helps you understand when to use it.
          </Prose>

          <ComparisonTable
            items={[
              {
                name: "Threading",
                when: "I/O-bound with blocking libraries",
                example: "requests, psycopg2, file I/O",
                color: "var(--color-accent)",
              },
              {
                name: "Multiprocessing",
                when: "CPU-bound parallelism",
                example: "Data transforms, batch processing",
                color: "var(--color-green)",
              },
              {
                name: "AsyncIO",
                when: "High-concurrency I/O",
                example: "API clients, WebSockets, streaming",
                color: "var(--color-amber)",
              },
            ]}
          />

          <ConceptCard
            name="Threading"
            oneLiner="Multiple workers sharing one office"
            details="Threads share memory within one process. They're lightweight to create but fight for the GIL during Python execution. Perfect for I/O-bound work where threads spend most time waiting (network calls, database queries) — while one thread waits, another runs."
            example={`
from concurrent.futures import ThreadPoolExecutor
import requests

def fetch_and_parse(url):
    response = requests.get(url)  # Thread waits here, releases GIL
    return response.json()

# 10 URLs, 10 workers — all run "simultaneously"
# (really: they take turns waiting for I/O)
with ThreadPoolExecutor(max_workers=10) as executor:
    results = list(executor.map(fetch_and_parse, urls))
`}
          />

          <ConceptCard
            name="Multiprocessing"
            oneLiner="Multiple offices, each with their own staff"
            details="Each process has its own Python interpreter, memory space, and GIL. True parallelism on multiple CPU cores. The tradeoff: processes can't share memory directly — they must serialize data (pickle) to communicate. Process spawning is slower than thread creation."
            example={`
from concurrent.futures import ProcessPoolExecutor

def cpu_intensive(data):
    # Heavy computation that NEEDS the CPU
    return complex_calculation(data)

# 4 processes on 4 cores — true parallelism
# Each process has its own GIL
with ProcessPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(cpu_intensive, large_dataset))

# Note: data is pickled to send to processes, so keep it small
`}
          />

          <ConceptCard
            name="AsyncIO"
            oneLiner="One worker who never waits, always switching tasks"
            details="Single-threaded cooperative multitasking. Instead of multiple workers, one very efficient worker handles many tasks by switching between them at await points. Uses less memory than threads (no thread stacks) and avoids context switching overhead. Best for high-concurrency I/O."
            example={`
import asyncio
import aiohttp

async def fetch_and_parse(session, url):
    async with session.get(url) as response:
        return await response.json()  # Switch to another task while waiting

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_and_parse(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# 1000 URLs with 1 thread — handles them all efficiently
results = asyncio.run(fetch_all(urls))
`}
          />

          <Callout type="tip" title="Decision Framework">
            <ol className="list-decimal pl-4 space-y-1">
              <li><strong>Is it CPU-bound?</strong> → Use <code>ProcessPoolExecutor</code></li>
              <li><strong>Is it I/O-bound with blocking libraries?</strong> → Use <code>ThreadPoolExecutor</code></li>
              <li><strong>Is it high-concurrency I/O (1000s of connections)?</strong> → Use <code>asyncio</code></li>
              <li><strong>Not sure?</strong> → Start with asyncio for new code (modern libraries support it)</li>
            </ol>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 4: ASYNCIO DEEP DIVE ====================
    {
      id: "asyncio-patterns",
      title: "AsyncIO Patterns for Production",
      subtitle: "Rate limiting, error handling, and real-world patterns",
      content: (
        <>
          <Prose>
            AsyncIO is the right choice for most AI applications — you're making many API calls (to LLMs, embedding services, databases) and need high concurrency. But basic <code>await</code> isn't enough for production. Here are the patterns you need.
          </Prose>

          <Prose>
            <strong>The mental model:</strong> Your code runs on one thread. An <strong>event loop</strong> schedules coroutines. When a coroutine hits <code>await</code>, it suspends and the event loop runs another ready coroutine. This is <strong>cooperative multitasking</strong> — coroutines must voluntarily yield. One blocking call (like <code>time.sleep()</code> instead of <code>asyncio.sleep()</code>) freezes everything.
          </Prose>

          <AsyncIOViz />

          <ConceptCard
            name="Rate Limiting with Semaphore"
            oneLiner="Don't overwhelm APIs with concurrent requests"
            details="asyncio.Semaphore limits concurrent operations. Initialize with max concurrent requests, then 'async with semaphore' before each call. The semaphore blocks when at capacity."
            example={`
import asyncio
import aiohttp

async def fetch_with_limit(urls: list[str], max_concurrent: int = 10):
    semaphore = asyncio.Semaphore(max_concurrent)

    async def fetch_one(session, url):
        async with semaphore:  # At most 10 concurrent
            async with session.get(url) as response:
                return await response.json()

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

# 1000 URLs, but only 10 active at once
results = asyncio.run(fetch_with_limit(urls, max_concurrent=10))
`}
          />

          <ConceptCard
            name="Error Handling with gather()"
            oneLiner="Don't let one failure kill all tasks"
            details="By default, asyncio.gather() cancels remaining tasks if one raises. Add return_exceptions=True to continue and collect exceptions in results. Then filter successes from failures."
            example={`
import asyncio

async def might_fail(item):
    if item % 3 == 0:
        raise ValueError(f"Item {item} failed")
    return item * 2

async def process_all(items):
    tasks = [might_fail(i) for i in items]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Separate successes and failures
    successes = [r for r in results if not isinstance(r, Exception)]
    failures = [r for r in results if isinstance(r, Exception)]

    print(f"Succeeded: {len(successes)}, Failed: {len(failures)}")
    return successes

# Items 3, 6, 9 fail; others succeed; all are attempted
asyncio.run(process_all(range(10)))
`}
          />

          <ConceptCard
            name="Timeouts"
            oneLiner="Never wait forever"
            details="Use asyncio.timeout() (Python 3.11+) or asyncio.wait_for() to bound operation time. This prevents hung operations from blocking your entire application."
            example={`
import asyncio

async def slow_operation():
    await asyncio.sleep(60)  # Simulates slow API
    return "done"

async def with_timeout():
    try:
        # Python 3.11+
        async with asyncio.timeout(5):
            return await slow_operation()
    except asyncio.TimeoutError:
        print("Operation timed out after 5 seconds")
        return None

# Alternative for older Python
async def with_wait_for():
    try:
        return await asyncio.wait_for(slow_operation(), timeout=5)
    except asyncio.TimeoutError:
        print("Operation timed out")
        return None
`}
          />

          <Callout type="warning" title="The Blocking Call Trap">
            <strong>Never call blocking functions in async code.</strong> They freeze the event loop.
            <ul className="list-disc pl-4 mt-2">
              <li><code>time.sleep()</code> → <code>asyncio.sleep()</code></li>
              <li><code>requests.get()</code> → <code>aiohttp.ClientSession().get()</code></li>
              <li><code>open().read()</code> → <code>aiofiles.open()</code></li>
            </ul>
            If you must call blocking code, use <code>asyncio.to_thread()</code> to run it in a thread pool.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 5: PYDANTIC ====================
    {
      id: "pydantic-validation",
      title: "Pydantic: Type Safety That Actually Runs",
      subtitle: "From type hints to runtime validation",
      content: (
        <>
          <Prose>
            Python type hints are great for IDE autocomplete and catching bugs before runtime — but they're erased at runtime. <code>def foo(x: int)</code> happily accepts a string. <strong>Pydantic</strong> bridges this gap: it validates data at runtime using type hints as the source of truth.
          </Prose>

          <Prose>
            Think of Pydantic as a bouncer at the door of your function. It checks IDs (types), enforces rules (constraints), and turns away anyone who doesn't belong — before they cause trouble inside.
          </Prose>

          <ConceptCard
            name="Basic Model"
            oneLiner="Define once, validate everywhere"
            details="Pydantic models define expected data shape with type hints. On instantiation, data is validated and coerced. Invalid data raises ValidationError with detailed messages."
            example={`
from pydantic import BaseModel, Field
from decimal import Decimal
from typing import Literal

class TradeOrder(BaseModel):
    symbol: str = Field(..., min_length=1, max_length=10)
    quantity: int = Field(..., gt=0)  # Must be positive
    price: Decimal = Field(..., gt=0, decimal_places=2)
    side: Literal["buy", "sell"]

# Valid - works
order = TradeOrder(symbol="AAPL", quantity=100, price="150.50", side="buy")
print(order.price)  # Decimal('150.50') - string coerced to Decimal

# Invalid - raises ValidationError
try:
    bad = TradeOrder(symbol="", quantity=-5, price=0, side="hold")
except ValidationError as e:
    print(e.errors())  # List of all validation failures
`}
          />

          <ConceptCard
            name="Custom Validators"
            oneLiner="Business logic in your schema"
            details="@field_validator validates/transforms individual fields. @model_validator validates relationships between fields. These run automatically on every instantiation."
            example={`
from pydantic import BaseModel, field_validator, model_validator

class User(BaseModel):
    username: str
    email: str
    password: str
    password_confirm: str

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v):
        if not v.isalnum():
            raise ValueError("Username must be alphanumeric")
        return v.lower()  # Transform to lowercase

    @field_validator("email")
    @classmethod
    def email_valid(cls, v):
        if "@" not in v:
            raise ValueError("Invalid email")
        return v.lower()

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError("Passwords don't match")
        return self
`}
          />

          <ConceptCard
            name="Settings Management"
            oneLiner="Type-safe environment variables"
            details="pydantic-settings reads from environment variables and .env files, validates types, and provides IDE autocomplete for configuration. No more stringly-typed config bugs."
            example={`
from pydantic_settings import BaseSettings
from pydantic import SecretStr, Field
from functools import lru_cache

class Settings(BaseSettings):
    # Required - must be set in environment
    openai_api_key: SecretStr
    database_url: str

    # Optional with defaults
    debug: bool = False
    max_retries: int = Field(default=3, ge=1, le=10)
    batch_size: int = Field(default=100, ge=1, le=1000)

    model_config = {"env_file": ".env"}

@lru_cache  # Singleton - only load once
def get_settings() -> Settings:
    return Settings()

# Usage
settings = get_settings()
print(settings.openai_api_key.get_secret_value())  # Access secret
print(settings.batch_size)  # Validated integer
`}
          />

          <Callout type="tip" title="When to Use What">
            <ul className="list-disc pl-4">
              <li><strong>Pydantic</strong>: External data (API requests, config, files) — validation matters</li>
              <li><strong>@dataclass</strong>: Internal data structures — type checking at dev-time is enough</li>
              <li><strong>TypedDict</strong>: When you need dict syntax but want type hints</li>
            </ul>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 6: LAMBDA DEEP DIVE ====================
    {
      id: "lambda-execution-model",
      title: "Lambda's Execution Model",
      subtitle: "Understanding cold starts and optimization",
      content: (
        <>
          <Prose>
            Lambda seems magical — upload code, it runs. But understanding what happens under the hood transforms you from someone who uses Lambda to someone who <strong>optimizes</strong> Lambda. The key is understanding the container lifecycle.
          </Prose>

          <Prose>
            When you invoke a Lambda that hasn't run recently, AWS must: (1) allocate a container, (2) download your code, (3) start the Python runtime, (4) run your initialization code (imports, client creation), then (5) run your handler. This is a <strong>cold start</strong>. Subsequent invocations on the same container skip steps 1-4 — this is a <strong>warm start</strong>.
          </Prose>

          <LambdaColdStartViz />

          <ConceptCard
            name="Cold Start Anatomy"
            oneLiner="What takes time and how to reduce it"
            details="Cold start latency varies dramatically: 100ms for minimal code, 1-5 seconds with heavy dependencies, 10+ seconds if you add VPC. Most of the time is spent on imports and initialization — not AWS overhead."
            example={`
# SLOW: Heavy imports inside handler
def handler(event, context):
    import pandas as pd  # 500ms import, EVERY cold start
    import torch  # 2s import, EVERY cold start
    # ... use pd and torch

# FAST: Imports at module level (once per container)
import pandas as pd  # Loaded at container init
import torch  # Loaded at container init

def handler(event, context):
    # pd and torch already loaded
    # ... use pd and torch
`}
          />

          <ConceptCard
            name="Warm Start Optimization"
            oneLiner="Initialize outside the handler"
            details="Anything initialized outside the handler persists across invocations. Database connections, API clients, loaded models — initialize once, reuse many times."
            example={`
import boto3
from functools import lru_cache

# Initialize OUTSIDE handler - reused across invocations
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('predictions')

@lru_cache(maxsize=1)
def get_model():
    """Load model on first call, cache forever."""
    import torch  # Lazy import for rarely-used heavy module
    return torch.jit.load('/opt/model.pt')

def handler(event, context):
    # dynamodb client already exists
    # model loaded only if needed, then cached

    model = get_model()  # Free on subsequent calls
    prediction = model(event['features'])

    table.put_item(Item={
        'request_id': context.aws_request_id,
        'prediction': str(prediction)
    })

    return {'statusCode': 200, 'body': str(prediction)}
`}
          />

          <ConceptCard
            name="Error Handling Pattern"
            oneLiner="Validate early, fail gracefully"
            details="Lambda expects specific return formats for API Gateway integration. Validate input with Pydantic, catch specific exceptions, return proper HTTP responses."
            example={`
import json
from pydantic import BaseModel, ValidationError

class Request(BaseModel):
    features: list[float]

def handler(event, context):
    try:
        # Parse and validate
        body = json.loads(event.get('body', '{}'))
        request = Request.model_validate(body)

        # Process
        prediction = get_model()(request.features)

        return {
            'statusCode': 200,
            'body': json.dumps({'prediction': float(prediction)}),
            'headers': {'Content-Type': 'application/json'}
        }

    except ValidationError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'errors': e.errors()})
        }

    except Exception as e:
        print(f"Error: {e}")  # Goes to CloudWatch
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal error'})
        }
`}
          />

          <Callout type="insight" title="Memory = CPU">
            Lambda allocates CPU proportionally to memory. At 1769MB, you get one full vCPU. Below that, you get fractional CPU. For CPU-bound work, increasing memory often <strong>reduces</strong> cost because it completes faster. Experiment with your workload.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 7: EVENT-DRIVEN ARCHITECTURE ====================
    {
      id: "event-driven",
      title: "Event-Driven Architecture",
      subtitle: "SQS, SNS, EventBridge — choosing the right service",
      content: (
        <>
          <Prose>
            Production AI systems are inherently event-driven. Document uploaded? Generate embeddings. Prediction made? Log it. Model updated? Invalidate cache. Event-driven architecture decouples these concerns: producers emit events without knowing consumers; failures in one component don't cascade.
          </Prose>

          <Prose>
            AWS offers three main eventing services. The key is understanding their different purposes:
          </Prose>

          <ConceptCard
            name="SQS (Simple Queue Service)"
            oneLiner="Durable message queue with guaranteed delivery"
            details="Messages persist until processed. Perfect for work that must complete eventually. Standard queues offer high throughput; FIFO queues guarantee order. Use dead-letter queues (DLQ) for failed messages."
            example={`
# Lambda receives SQS batch
def handler(event, context):
    batch_failures = []

    for record in event['Records']:
        try:
            body = json.loads(record['body'])
            process_message(body)
        except Exception as e:
            # Report this message as failed - it will retry
            batch_failures.append({
                'itemIdentifier': record['messageId']
            })

    # Return failures - only these retry
    return {'batchItemFailures': batch_failures}

# Key SQS settings:
# - VisibilityTimeout: 6x Lambda timeout
# - MaxReceiveCount: retries before DLQ (usually 3)
# - BatchSize: messages per Lambda (1-10)
`}
          />

          <ConceptCard
            name="SNS (Simple Notification Service)"
            oneLiner="Pub/sub: one message, many subscribers"
            details="When multiple services need the same event, SNS delivers to all subscribers in parallel. Use filter policies to route specific message types to specific subscribers."
            example={`
# SNS delivers to multiple subscribers:
# - Lambda for real-time processing
# - SQS for batch processing
# - Email for alerts

import boto3
sns = boto3.client('sns')

# Publish event
sns.publish(
    TopicArn='arn:aws:sns:us-east-1:123:predictions',
    Message=json.dumps({
        'model': 'sentiment',
        'prediction': 0.95,
        'entity_id': 'doc-123'
    }),
    MessageAttributes={
        'model': {'DataType': 'String', 'StringValue': 'sentiment'}
    }
)

# Subscriber filter policy (on subscription, not publish):
# {"model": ["sentiment"]}
# Only receives messages where model = "sentiment"
`}
          />

          <ConceptCard
            name="EventBridge"
            oneLiner="Content-based routing with schema validation"
            details="Routes events based on content patterns, not just topics. Integrates with 20+ AWS services as sources. Schema registry validates event structure. Use for complex routing logic."
            example={`
# EventBridge rule pattern
{
  "source": ["my.app"],
  "detail-type": ["Prediction"],
  "detail": {
    "confidence": [{"numeric": [">=", 0.9]}],
    "model": ["sentiment", "toxicity"]
  }
}

# Only routes high-confidence sentiment/toxicity predictions
# No code changes to add new routing rules

# Python: Put event
import boto3
events = boto3.client('events')

events.put_events(Entries=[{
    'Source': 'my.app',
    'DetailType': 'Prediction',
    'Detail': json.dumps({
        'model': 'sentiment',
        'confidence': 0.95,
        'result': 'positive'
    })
}])
`}
          />

          <Callout type="analogy" title="Choosing the Right Service">
            <ul className="list-disc pl-4">
              <li><strong>SQS</strong>: A to-do list. Work items that need to be processed exactly once.</li>
              <li><strong>SNS</strong>: A megaphone. Announce something and let interested parties listen.</li>
              <li><strong>EventBridge</strong>: A smart mail room. Routes messages based on their contents.</li>
            </ul>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 8: DYNAMODB ====================
    {
      id: "dynamodb-modeling",
      title: "DynamoDB: Thinking Differently",
      subtitle: "Access patterns first, schema second",
      content: (
        <>
          <Prose>
            DynamoDB is <strong>not</strong> a relational database. If you try to use it like Postgres, you'll have a bad time. The key insight: <strong>design for your access patterns first</strong>, then model your data to serve them.
          </Prose>

          <Prose>
            In SQL, you model entities (users, orders) and join them at query time. In DynamoDB, you model <strong>queries</strong>. "Get user with their orders" isn't a join — it's a single query that returns both, because you stored them together.
          </Prose>

          <ConceptCard
            name="Single-Table Design"
            oneLiner="Multiple entity types, one table"
            details="Store users, orders, products in one table using composite keys. PK=USER#123, SK=PROFILE for user data; PK=USER#123, SK=ORDER#456 for orders. One query (PK=USER#123) returns both."
            example={`
# Key patterns for single-table design:
# PK: "USER#123", SK: "PROFILE"     → User's profile
# PK: "USER#123", SK: "ORDER#001"   → User's order
# PK: "USER#123", SK: "ORDER#002"   → Another order
# PK: "ORDER#001", SK: "ORDER#001"  → Order by order ID (GSI)

import boto3
from boto3.dynamodb.conditions import Key

table = boto3.resource('dynamodb').Table('app')

# Get user AND their orders in ONE query
response = table.query(
    KeyConditionExpression=Key('PK').eq('USER#123')
)

# Parse results by SK prefix
items = response['Items']
user = next(i for i in items if i['SK'] == 'PROFILE')
orders = [i for i in items if i['SK'].startswith('ORDER#')]

print(f"User: {user['name']}")
print(f"Orders: {len(orders)}")
`}
          />

          <ConceptCard
            name="Global Secondary Indexes (GSI)"
            oneLiner="Additional access patterns"
            details="GSIs project items with different keys, enabling queries the base table doesn't support. Example: base table keyed by user; GSI keyed by order ID allows 'get order by ID'."
            example={`
# Base table: PK=USER#123, SK=ORDER#456
# GSI: PK=ORDER#456, SK=ORDER#456

# Query order by ID (via GSI)
response = table.query(
    IndexName='OrderIndex',
    KeyConditionExpression=Key('GSI_PK').eq('ORDER#456')
)

# Sparse index: only include "active" items
# Add GSI_PK only to active items; inactive items
# don't appear in index (saves money, faster queries)
table.update_item(
    Key={'PK': 'USER#123', 'SK': 'ORDER#456'},
    UpdateExpression='SET GSI_PK = :pk, #status = :s',
    ExpressionAttributeNames={'#status': 'status'},
    ExpressionAttributeValues={
        ':pk': 'ORDER#456',
        ':s': 'active'
    }
)
`}
          />

          <ConceptCard
            name="Conditional Writes"
            oneLiner="Prevent race conditions without locks"
            details="DynamoDB supports conditional operations: 'write only if version matches' or 'increment only if balance >= amount'. This enables optimistic concurrency without distributed locks."
            example={`
from botocore.exceptions import ClientError

# Optimistic locking with version number
def update_with_version(user_id, updates, expected_version):
    try:
        table.update_item(
            Key={'PK': f'USER#{user_id}', 'SK': 'PROFILE'},
            UpdateExpression='SET #name = :name, #ver = :new_ver',
            ConditionExpression='#ver = :expected',
            ExpressionAttributeNames={
                '#name': 'name',
                '#ver': 'version'
            },
            ExpressionAttributeValues={
                ':name': updates['name'],
                ':new_ver': expected_version + 1,
                ':expected': expected_version
            }
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            raise ConcurrentModificationError("Item was modified by another request")
        raise
`}
          />

          <Callout type="warning" title="Hot Partitions">
            DynamoDB distributes data by partition key hash. If many requests hit the same PK ("hot partition"), throughput is limited. <strong>Never use timestamp as PK</strong> — all writes go to the same partition. Use composite keys like <code>entity_id#date_bucket</code>.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 9: S3 PATTERNS ====================
    {
      id: "s3-patterns",
      title: "S3 for Data Pipelines",
      subtitle: "Object storage patterns for ML systems",
      content: (
        <>
          <Prose>
            S3 is the de facto data lake for ML systems. But it's an <strong>object store</strong>, not a filesystem. Objects are immutable (updates rewrite entirely), listing is prefix-based, and pricing is by storage + requests + transfer. Understanding these characteristics drives efficient design.
          </Prose>

          <ConceptCard
            name="Partitioning Strategy"
            oneLiner="Organize for your query patterns"
            details="Partition by the dimensions you filter on. Date-partitioned data enables efficient date-range queries. Entity-partitioned data enables efficient entity lookups."
            example={`
# Date-partitioned (for analytics/batch jobs):
# s3://bucket/events/year=2024/month=03/day=19/data.parquet

# Entity-partitioned (for feature lookups):
# s3://bucket/features/entity_id=12345/features.json

# Both (for time-series per entity):
# s3://bucket/data/entity_id=12345/year=2024/month=03/events.parquet

# Query with Athena (date partition pruning):
SELECT * FROM events
WHERE year = 2024 AND month = 3 AND day = 19
-- Only reads one day's data, not entire dataset
`}
          />

          <ConceptCard
            name="File Formats"
            oneLiner="Parquet for analytics, JSONL for streaming"
            details="Parquet is columnar — reading specific columns skips irrelevant data. Great for analytics. JSONL (one JSON per line) is good for streaming and when you read entire records."
            example={`
import pandas as pd
import pyarrow.parquet as pq

# Write Parquet (columnar, compressed)
df.to_parquet('s3://bucket/data/file.parquet')

# Read only needed columns (fast!)
df = pd.read_parquet(
    's3://bucket/data/file.parquet',
    columns=['user_id', 'prediction']  # Skip other columns
)

# JSONL for streaming
with open('data.jsonl', 'w') as f:
    for record in records:
        f.write(json.dumps(record) + '\\n')

# Read JSONL line-by-line (memory efficient)
with open('data.jsonl') as f:
    for line in f:
        record = json.loads(line)
        process(record)
`}
          />

          <ConceptCard
            name="Event-Driven Processing"
            oneLiner="Process files as they arrive"
            details="S3 events trigger Lambda when files are uploaded. Route through SQS for reliability — if Lambda fails, the message retries. Use dead-letter queues for persistent failures."
            example={`
from urllib.parse import unquote_plus

def handler(event, context):
    for record in event['Records']:
        # Handle SQS wrapper if using S3 -> SQS -> Lambda
        if 'body' in record:
            s3_event = json.loads(record['body'])['Records'][0]
        else:
            s3_event = record

        bucket = s3_event['s3']['bucket']['name']
        key = unquote_plus(s3_event['s3']['object']['key'])

        # Validate key pattern
        if not key.startswith('raw/'):
            print(f"Skipping: {key}")
            continue

        # Process
        s3 = boto3.client('s3')
        response = s3.get_object(Bucket=bucket, Key=key)
        data = response['Body'].read().decode('utf-8')

        # ... process data ...

        # Write to processed location
        output_key = key.replace('raw/', 'processed/')
        s3.put_object(Bucket=bucket, Key=output_key, Body=result)
`}
          />

          <Callout type="tip" title="Cost Optimization">
            <ul className="list-disc pl-4">
              <li><strong>Intelligent-Tiering</strong>: Automatically moves objects to cheaper tiers</li>
              <li><strong>S3 Select</strong>: Push filtering to S3 (returns only matching rows)</li>
              <li><strong>Multipart uploads</strong>: Parallelize uploads for files &gt;100MB</li>
              <li><strong>Same-region access</strong>: No data transfer fees within region</li>
            </ul>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 10: OBSERVABILITY ====================
    {
      id: "observability",
      title: "Observability for ML Systems",
      subtitle: "Logs, metrics, and traces that actually help",
      content: (
        <>
          <Prose>
            A model silently returning wrong predictions looks identical to one working correctly — without observability. The goal isn't collecting data; it's being able to answer "why did this happen?" when things go wrong.
          </Prose>

          <Prose>
            The three pillars: <strong>Logs</strong> capture discrete events ("request received"). <strong>Metrics</strong> track aggregates over time (latency percentiles). <strong>Traces</strong> follow requests across services. Each answers different questions.
          </Prose>

          <ConceptCard
            name="Structured Logging"
            oneLiner="JSON logs you can query"
            details="Output JSON instead of plain text. Include correlation IDs that link related logs across services. Use Lambda Powertools for automatic context injection."
            example={`
from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.metrics import MetricUnit

logger = Logger(service="ml-inference")
tracer = Tracer()
metrics = Metrics(namespace="MLService")

@logger.inject_lambda_context(log_event=True)
@tracer.capture_lambda_handler
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event, context):
    # Correlation ID automatically added to all logs
    logger.info("Processing request", extra={
        "model_version": "v2.1",
        "feature_count": len(event.get("features", []))
    })

    with tracer.capture_method():  # Creates X-Ray subsegment
        prediction = run_inference(event["features"])

    metrics.add_metric(name="Predictions", unit=MetricUnit.Count, value=1)

    logger.info("Inference complete", extra={
        "prediction": prediction,
        "latency_ms": elapsed
    })

    return {"prediction": prediction}
`}
          />

          <ConceptCard
            name="CloudWatch Logs Insights"
            oneLiner="Query logs with SQL-like syntax"
            details="Find errors, calculate percentiles, aggregate by fields. Essential for debugging production issues."
            example={`
# Find all errors in the last hour
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100

# Calculate latency percentiles
fields latency_ms
| stats avg(latency_ms) as avg,
        percentile(latency_ms, 50) as p50,
        percentile(latency_ms, 99) as p99
  by bin(1m)

# Find slow requests with full context
fields @timestamp, request_id, latency_ms, @message
| filter latency_ms > 1000
| sort @timestamp desc
| limit 50

# Aggregate errors by type
fields error_type
| filter @message like /ERROR/
| stats count() by error_type
| sort count desc
`}
          />

          <Callout type="insight" title="What to Log for ML Systems">
            <ul className="list-disc pl-4">
              <li><strong>Inputs</strong>: Feature values, request IDs (for debugging predictions)</li>
              <li><strong>Outputs</strong>: Predictions, confidence scores, model version</li>
              <li><strong>Timing</strong>: Inference latency, preprocessing time, total request time</li>
              <li><strong>Errors</strong>: Validation failures, model errors, external service failures</li>
            </ul>
            Don't log PII or secrets. Log enough to debug without recreating the issue.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 11: SECURITY ====================
    {
      id: "security",
      title: "Security Essentials",
      subtitle: "IAM, secrets, and least privilege",
      content: (
        <>
          <Prose>
            Security isn't about adding walls after building — it's about building correctly from the start. The principle of <strong>least privilege</strong> (grant only what's needed) is the foundation. <strong>Defense in depth</strong> (multiple layers so no single failure is catastrophic) is the strategy.
          </Prose>

          <ConceptCard
            name="IAM Least Privilege"
            oneLiner="Grant specific permissions, not wildcards"
            details="Lambda execution roles define what AWS services the function can access. Grant read to specific DynamoDB tables, not all tables. Grant write to specific S3 prefixes, not entire buckets."
            example={`
# BAD: Overly permissive
{
    "Effect": "Allow",
    "Action": "dynamodb:*",
    "Resource": "*"
}

# GOOD: Specific table, specific actions
{
    "Effect": "Allow",
    "Action": [
        "dynamodb:GetItem",
        "dynamodb:Query"
    ],
    "Resource": "arn:aws:dynamodb:us-east-1:123:table/features"
}

# CDK makes this easy
from aws_cdk import aws_dynamodb as dynamodb

table = dynamodb.Table(...)
table.grant_read_data(lambda_function)  # Just read permission
`}
          />

          <ConceptCard
            name="Secrets Management"
            oneLiner="Never commit secrets to code"
            details="Use AWS Secrets Manager or Parameter Store. Reference secrets by ARN, not value. Rotate credentials regularly. Lambda environment variables should contain references, not secrets."
            example={`
import boto3
from functools import lru_cache

secrets_client = boto3.client('secretsmanager')

@lru_cache  # Cache secret to avoid repeated API calls
def get_api_key() -> str:
    response = secrets_client.get_secret_value(
        SecretId='my-app/openai-api-key'
    )
    return response['SecretString']

# Or use environment variable containing secret ARN
import os
secret_arn = os.environ['OPENAI_SECRET_ARN']
response = secrets_client.get_secret_value(SecretId=secret_arn)

# IAM policy for Lambda to access specific secret
{
    "Effect": "Allow",
    "Action": "secretsmanager:GetSecretValue",
    "Resource": "arn:aws:secretsmanager:us-east-1:123:secret:my-app/*"
}
`}
          />

          <Callout type="warning" title="Security Checklist">
            <ul className="list-disc pl-4">
              <li>Enable <strong>CloudTrail</strong> for API audit logging</li>
              <li>Enable <strong>GuardDuty</strong> for threat detection</li>
              <li>Review <strong>IAM Access Analyzer</strong> findings regularly</li>
              <li>Never log secrets or PII</li>
              <li>Encrypt all data at rest (default in most AWS services)</li>
              <li>Use <strong>VPC endpoints</strong> for sensitive traffic</li>
            </ul>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 12: CDK ====================
    {
      id: "cdk-patterns",
      title: "Infrastructure as Code with CDK",
      subtitle: "Python code that creates AWS infrastructure",
      content: (
        <>
          <Prose>
            <strong>AWS CDK</strong> lets you define infrastructure in Python. Instead of clicking in the console or writing YAML templates, you write code that describes what you want. This code is version-controlled, reviewed, tested, and deployed through pipelines.
          </Prose>

          <Prose>
            CDK synthesizes to CloudFormation, so you get CloudFormation's reliability with Python's expressiveness. Loops, conditionals, abstractions — things impossible in declarative templates.
          </Prose>

          <ConceptCard
            name="Basic Stack"
            oneLiner="Lambda + API Gateway + DynamoDB in Python"
            details="CDK Stacks contain resources. L2 constructs (like lambda_.Function) provide sensible defaults. Grant methods handle IAM permissions automatically."
            example={`
from aws_cdk import (
    Stack, Duration,
    aws_lambda as lambda_,
    aws_apigateway as apigw,
    aws_dynamodb as dynamodb,
)
from constructs import Construct

class MLServiceStack(Stack):
    def __init__(self, scope: Construct, id: str, **kwargs):
        super().__init__(scope, id, **kwargs)

        # DynamoDB table
        table = dynamodb.Table(
            self, "Features",
            partition_key=dynamodb.Attribute(
                name="PK", type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST
        )

        # Lambda function
        fn = lambda_.Function(
            self, "Inference",
            runtime=lambda_.Runtime.PYTHON_3_11,
            handler="main.handler",
            code=lambda_.Code.from_asset("lambda/inference"),
            timeout=Duration.seconds(30),
            environment={"TABLE_NAME": table.table_name}
        )

        # Grant permissions (CDK handles IAM)
        table.grant_read_data(fn)

        # API Gateway
        api = apigw.RestApi(self, "API")
        api.root.add_resource("predict").add_method(
            "POST", apigw.LambdaIntegration(fn)
        )
`}
          />

          <ConceptCard
            name="Custom Constructs"
            oneLiner="Reusable infrastructure patterns"
            details="Create higher-level abstractions that bundle multiple resources. Share across projects. Encode your organization's best practices."
            example={`
class MLEndpoint(Construct):
    """Reusable ML inference endpoint with caching."""

    def __init__(self, scope, id, *, handler, memory=1024):
        super().__init__(scope, id)

        # Cache table
        self.cache = dynamodb.Table(
            self, "Cache",
            partition_key=dynamodb.Attribute(
                name="cache_key", type=dynamodb.AttributeType.STRING
            ),
            time_to_live_attribute="ttl"
        )

        # Lambda
        self.function = lambda_.Function(
            self, "Function",
            runtime=lambda_.Runtime.PYTHON_3_11,
            handler=handler,
            memory_size=memory,
            environment={"CACHE_TABLE": self.cache.table_name}
        )

        self.cache.grant_read_write_data(self.function)

        # API
        self.api = apigw.RestApi(self, "Api")
        self.api.root.add_method("POST", apigw.LambdaIntegration(self.function))

# Usage: one line creates entire stack
endpoint = MLEndpoint(self, "Sentiment", handler="sentiment.handler")
`}
          />

          <Callout type="tip" title="CDK Best Practices">
            <ul className="list-disc pl-4">
              <li>Use <code>cdk diff</code> before <code>cdk deploy</code> to review changes</li>
              <li>Create separate stacks for dev/staging/prod</li>
              <li>Use CDK context or environment variables for configuration</li>
              <li>Store constructs in a shared library for reuse</li>
            </ul>
          </Callout>
        </>
      ),
    },
  ],

  operations: [
    { name: "asyncio.gather()", time: "O(max task)", space: "O(n tasks)", note: "Concurrent await, returns when all complete" },
    { name: "asyncio.Semaphore", time: "O(1)", space: "O(1)", note: "Limits concurrent operations" },
    { name: "Lambda cold start", time: "100ms - 10s", space: "O(pkg size)", note: "Depends on dependencies, VPC" },
    { name: "Lambda warm invoke", time: "1-100ms", space: "O(1)", note: "Handler only, no init" },
    { name: "DynamoDB GetItem", time: "O(1)", space: "O(item)", note: "Single-digit milliseconds" },
    { name: "DynamoDB Query", time: "O(items)", space: "O(items)", note: "Up to 1MB per request" },
    { name: "S3 GET (first byte)", time: "~100ms", space: "O(1)", note: "Higher for large files" },
    { name: "SQS SendMessage", time: "~10ms", space: "O(1)", note: "Durable write" },
    { name: "Pydantic validation", time: "O(fields)", space: "O(1)", note: "Rust-based in v2" },
  ],

  patterns: [
    {
      id: "async-rate-limit",
      name: "AsyncIO Rate Limiting",
      tag: "Essential",
      tagColor: "green",
      description: "Limit concurrent async operations to avoid overwhelming APIs",
      explanation: `**Rate limiting** prevents spawning thousands of simultaneous requests that overwhelm services. Use **asyncio.Semaphore** as a bouncer: only N tasks can hold the semaphore at once.

The pattern wraps each API call in \`async with semaphore\` before the request. Tasks block on acquisition when at capacity. This provides backpressure without complex queuing.`,
      triggers: "rate limit, too many requests, 429, concurrent limit, throttling",
      code: `import asyncio
import aiohttp

async def fetch_with_limit(urls: list[str], max_concurrent: int = 10):
    semaphore = asyncio.Semaphore(max_concurrent)

    async def fetch_one(session, url):
        async with semaphore:  # Limit concurrency
            async with session.get(url) as response:
                return await response.json()

    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)`,
    },
    {
      id: "lambda-partial-batch",
      name: "Lambda SQS Partial Batch Failure",
      tag: "Essential",
      tagColor: "green",
      description: "Report which SQS messages failed so only those retry",
      explanation: `By default, if Lambda raises an exception when processing SQS, **all messages** return to the queue. This causes successfully processed messages to be reprocessed.

**Partial batch failure** lets you report specific failed messages. Enable \`ReportBatchItemFailures\` on the event source mapping and return \`batchItemFailures\` array.`,
      triggers: "SQS batch, partial failure, message retry, batch processing",
      code: `def handler(event, context):
    failures = []

    for record in event['Records']:
        try:
            body = json.loads(record['body'])
            process_message(body)
        except Exception as e:
            failures.append({'itemIdentifier': record['messageId']})

    return {'batchItemFailures': failures}`,
    },
    {
      id: "dynamo-single-table",
      name: "DynamoDB Single-Table Design",
      tag: "Core",
      tagColor: "accent",
      description: "Store multiple entity types in one table using composite keys",
      explanation: `**Single-table design** stores all entities in one table using **composite primary keys** (PK + SK). One query returns multiple entity types, avoiding joins.

Use **prefixes** to distinguish types: PK='USER#123', SK='PROFILE' for user data; PK='USER#123', SK='ORDER#001' for orders. Query PK='USER#123' returns both.`,
      triggers: "DynamoDB, NoSQL, denormalization, composite key, avoid joins",
      code: `# Store user and orders together
table.put_item(Item={
    'PK': 'USER#123', 'SK': 'PROFILE',
    'name': 'Alice', 'email': 'alice@example.com'
})
table.put_item(Item={
    'PK': 'USER#123', 'SK': 'ORDER#001',
    'total': Decimal('99.99'), 'status': 'shipped'
})

# One query gets both
response = table.query(
    KeyConditionExpression=Key('PK').eq('USER#123')
)`,
    },
    {
      id: "exponential-backoff",
      name: "Exponential Backoff with Jitter",
      tag: "Core",
      tagColor: "accent",
      description: "Retry failed operations with increasing delays",
      explanation: `**Exponential backoff** spaces retries over increasing intervals, giving failing services time to recover. **Jitter** (randomness) prevents synchronized retries from thousands of clients.

Retry on transient errors (429, 5xx), not client errors (4xx). Set max retries and max delay to avoid infinite waits.`,
      triggers: "retry, backoff, transient failure, rate limit, 429, 5xx",
      code: `import asyncio
import random

async def with_backoff(func, max_retries=3, base_delay=1.0):
    for attempt in range(max_retries + 1):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries:
                raise
            delay = base_delay * (2 ** attempt)
            delay *= random.uniform(0.5, 1.5)  # Jitter
            await asyncio.sleep(delay)`,
    },
    {
      id: "pydantic-settings",
      name: "Pydantic Settings",
      tag: "Utility",
      tagColor: "amber",
      description: "Type-safe configuration from environment variables",
      explanation: `**Pydantic Settings** reads environment variables, validates types, and provides IDE autocomplete. No more stringly-typed config bugs.

Use **SecretStr** to hide secrets in logs. Cache with **@lru_cache** to avoid re-reading. Works with .env files for local development.`,
      triggers: "configuration, environment variables, settings, .env",
      code: `from pydantic_settings import BaseSettings
from pydantic import SecretStr

class Settings(BaseSettings):
    openai_api_key: SecretStr
    debug: bool = False
    batch_size: int = 100

    model_config = {"env_file": ".env"}

@lru_cache
def get_settings():
    return Settings()`,
    },
    {
      id: "lambda-powertools",
      name: "Lambda Powertools Observability",
      tag: "Utility",
      tagColor: "amber",
      description: "Structured logging, tracing, and metrics for Lambda",
      explanation: `**Lambda Powertools** provides production-ready observability. Logger outputs JSON with correlation IDs. Tracer integrates with X-Ray. Metrics creates CloudWatch EMF without API calls.

Decorators inject Lambda context automatically. Cold starts are tracked. Minimal code changes for full observability.`,
      triggers: "logging, tracing, metrics, CloudWatch, X-Ray, Lambda",
      code: `from aws_lambda_powertools import Logger, Tracer, Metrics

logger = Logger(service="ml-api")
tracer = Tracer()
metrics = Metrics()

@logger.inject_lambda_context
@tracer.capture_lambda_handler
@metrics.log_metrics
def handler(event, context):
    logger.info("Processing", extra={"model": "v2"})
    with tracer.capture_method():
        result = inference(event)
    metrics.add_metric(name="Predictions", value=1)
    return result`,
    },
  ],

  problems: [
    {
      id: "async-batch-processor",
      title: "Async Batch Processor",
      difficulty: "medium",
      description: "Implement an async function that processes items in batches with a maximum batch size and concurrency limit. Handle partial failures gracefully.",
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
        "Chunk items into batches using list slicing",
        "Use asyncio.gather with return_exceptions=True",
        "Flatten results from all batches",
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
    semaphore = asyncio.Semaphore(max_concurrency)

    async def process_batch(batch: list[T]) -> list[R]:
        async with semaphore:
            return await processor(batch)

    batches = [items[i:i+batch_size] for i in range(0, len(items), batch_size)]
    results = await asyncio.gather(
        *[process_batch(b) for b in batches],
        return_exceptions=True
    )

    flat = []
    for r in results:
        if not isinstance(r, Exception):
            flat.extend(r)
    return flat`,
      testCases: [],
    },
    {
      id: "validated-lambda-handler",
      title: "Type-Safe Lambda Handler",
      difficulty: "medium",
      description: "Create a decorator that validates Lambda input/output using Pydantic models, handles errors gracefully, and returns proper HTTP responses.",
      examples: [],
      starterCode: `def validated_handler(
    request_model: Type[BaseModel],
    response_model: Type[BaseModel]
):
    """Decorator for type-safe Lambda handlers."""
    pass`,
      hints: [
        "Parse event['body'] and validate with request_model",
        "Call wrapped function with validated request",
        "Handle ValidationError with 400 status",
        "Handle other exceptions with 500 status",
      ],
      solution: `import json
from functools import wraps
from pydantic import BaseModel, ValidationError

def validated_handler(request_model, response_model):
    def decorator(func):
        @wraps(func)
        def wrapper(event, context):
            try:
                body = json.loads(event.get('body', '{}'))
                request = request_model.model_validate(body)
                result = func(request, context)
                return {
                    'statusCode': 200,
                    'body': result.model_dump_json(),
                    'headers': {'Content-Type': 'application/json'}
                }
            except ValidationError as e:
                return {'statusCode': 400, 'body': json.dumps({'errors': e.errors()})}
            except Exception:
                return {'statusCode': 500, 'body': json.dumps({'error': 'Internal error'})}
        return wrapper
    return decorator`,
      testCases: [],
    },
    {
      id: "dynamo-repository",
      title: "Generic DynamoDB Repository",
      difficulty: "medium",
      description: "Implement a generic repository class for DynamoDB with Pydantic model support, handling type conversions (float to Decimal) and CRUD operations.",
      examples: [],
      starterCode: `class DynamoRepository(Generic[T]):
    def __init__(self, table_name: str, model_class: Type[T], pk_field: str):
        pass

    def create(self, item: T) -> T:
        pass

    def get(self, pk: str) -> T | None:
        pass`,
      hints: [
        "Convert float to Decimal before storing",
        "Use model_validate to convert DynamoDB items to Pydantic models",
        "Handle missing items (get_item returns empty dict)",
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

    def _to_dynamo(self, data):
        if isinstance(data, float):
            return Decimal(str(data))
        if isinstance(data, dict):
            return {k: self._to_dynamo(v) for k, v in data.items()}
        if isinstance(data, list):
            return [self._to_dynamo(v) for v in data]
        return data

    def create(self, item: T) -> T:
        self.table.put_item(Item=self._to_dynamo(item.model_dump()))
        return item

    def get(self, pk: str) -> T | None:
        response = self.table.get_item(Key={self.pk_field: pk})
        if 'Item' not in response:
            return None
        return self.model_class.model_validate(response['Item'])`,
      testCases: [],
    },
  ],
};
