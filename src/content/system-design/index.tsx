import type { DataStructure } from "../../types";
import { LoadBalancerViz } from "../../visualizations/system-design/LoadBalancerViz";
import { CacheHitViz } from "../../visualizations/system-design/CacheHitViz";
import { EventDrivenViz } from "../../visualizations/system-design/EventDrivenViz";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed">
    {children}
  </div>
);

export const systemDesignContent: DataStructure = {
  id: "system-design",
  name: "System Design",
  icon: "🏗️",
  color: "accent",
  tagline: "Distributed systems",
  description:
    "Designing scalable, reliable distributed systems. Load balancing, caching, databases, message queues, and architectural patterns for AI applications.",

  sections: [
    {
      id: "scalability",
      title: "Scalability fundamentals",
      subtitle: "Horizontal vs vertical scaling",
      content: (
        <>
          <Prose>
            Scalability is the ability to handle increased load. Two main approaches:
          </Prose>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
                Vertical Scaling (Scale Up)
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• Add more CPU, RAM, storage</li>
                <li>• Simple, no code changes</li>
                <li>• Limited by hardware ceiling</li>
                <li>• Single point of failure</li>
              </ul>
            </div>
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-green)" }}>
                Horizontal Scaling (Scale Out)
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• Add more machines</li>
                <li>• Requires distributed design</li>
                <li>• Theoretically unlimited</li>
                <li>• Better fault tolerance</li>
              </ul>
            </div>
          </div>
          <LoadBalancerViz />
        </>
      ),
    },
    {
      id: "cap-theorem",
      title: "CAP & PACELC",
      subtitle: "Distributed systems tradeoffs",
      content: (
        <>
          <Prose>
            <strong>CAP Theorem:</strong> In a distributed system, you can only guarantee 2 of 3:
            Consistency, Availability, Partition tolerance. Since network partitions are inevitable,
            the real choice is between C and A during partitions.
          </Prose>
          <div className="grid grid-cols-3 gap-3 my-4">
            {[
              { letter: "C", name: "Consistency", desc: "All nodes see same data", example: "Banking" },
              { letter: "A", name: "Availability", desc: "Every request gets response", example: "Social media" },
              { letter: "P", name: "Partition Tolerance", desc: "Works despite network splits", example: "Required" },
            ].map((item) => (
              <div
                key={item.letter}
                className="p-3 rounded-[var(--radius-md)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <p className="text-lg font-bold" style={{ color: "var(--color-accent)" }}>
                  {item.letter}
                </p>
                <p className="text-xs font-medium">{item.name}</p>
                <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  {item.desc}
                </p>
                <p className="text-[10px]" style={{ color: "var(--color-teal)" }}>
                  e.g., {item.example}
                </p>
              </div>
            ))}
          </div>
          <div
            className="rounded-[var(--radius-md)] p-3"
            style={{ background: "var(--color-accent-glow)" }}
          >
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-accent)" }}>PACELC:</strong>{" "}
              Extends CAP to normal operation. If no Partition, choose between Latency and Consistency.
              Most systems choose eventual consistency for lower latency.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "databases",
      title: "Database selection",
      subtitle: "SQL vs NoSQL vs Vector",
      content: (
        <>
          <Prose>
            Choose databases based on data model, query patterns, and consistency requirements.
            Modern systems often use multiple databases (polyglot persistence).
          </Prose>
          <div className="grid grid-cols-3 gap-3 my-4">
            {[
              {
                type: "Relational (SQL)",
                examples: "PostgreSQL, MySQL",
                use: "Structured data, ACID, joins",
                color: "var(--color-accent)",
              },
              {
                type: "Document (NoSQL)",
                examples: "MongoDB, DynamoDB",
                use: "Flexible schema, nested data",
                color: "var(--color-green)",
              },
              {
                type: "Vector DB",
                examples: "Pinecone, Weaviate",
                use: "Embeddings, similarity search",
                color: "var(--color-teal)",
              },
              {
                type: "Key-Value",
                examples: "Redis, Memcached",
                use: "Caching, sessions, fast lookups",
                color: "var(--color-coral)",
              },
              {
                type: "Time Series",
                examples: "InfluxDB, TimescaleDB",
                use: "Metrics, IoT, analytics",
                color: "var(--color-amber)",
              },
              {
                type: "Graph",
                examples: "Neo4j, Neptune",
                use: "Relationships, recommendations",
                color: "var(--color-text-muted)",
              },
            ].map((db) => (
              <div
                key={db.type}
                className="p-2 rounded-[var(--radius-sm)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <p className="text-xs font-semibold" style={{ color: db.color }}>
                  {db.type}
                </p>
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {db.examples}
                </p>
                <p className="text-[10px] mt-1">{db.use}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "caching",
      title: "Caching strategies",
      subtitle: "Trade memory for latency",
      content: (
        <>
          <Prose>
            Caching reduces latency and database load by storing frequently accessed data
            in memory. Key decisions: what to cache, when to invalidate, and cache placement.
          </Prose>
          <CacheHitViz />
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2">Caching Patterns</p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• <strong>Cache-aside:</strong> App manages cache reads/writes</li>
                <li>• <strong>Read-through:</strong> Cache fetches on miss</li>
                <li>• <strong>Write-through:</strong> Write to cache and DB together</li>
                <li>• <strong>Write-behind:</strong> Async DB writes for speed</li>
              </ul>
            </div>
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2">Invalidation Strategies</p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• <strong>TTL:</strong> Expire after time limit</li>
                <li>• <strong>Event-based:</strong> Invalidate on write</li>
                <li>• <strong>LRU:</strong> Evict least recently used</li>
                <li>• <strong>LFU:</strong> Evict least frequently used</li>
              </ul>
            </div>
          </div>
          <div
            className="rounded-[var(--radius-md)] p-3"
            style={{ background: "var(--color-teal-dim)" }}
          >
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-teal)" }}>For LLM apps:</strong>{" "}
              Semantic caching matches similar queries (not exact) using embeddings.
              This can reduce token costs by 50%+ for repeated questions.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "rate-limiting",
      title: "Rate limiting",
      subtitle: "Protect services from overload",
      content: (
        <>
          <Prose>
            Rate limiting protects services from abuse, ensures fair usage, and controls costs.
            Critical for LLM APIs where each request costs money.
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-semibold mb-2">Token Bucket Algorithm</p>
            <pre
              className="text-xs leading-relaxed overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`import time
from threading import Lock

class TokenBucket:
    def __init__(self, rate: float, capacity: int):
        self.rate = rate          # tokens per second
        self.capacity = capacity  # max tokens
        self.tokens = capacity
        self.last_refill = time.time()
        self.lock = Lock()

    def consume(self, tokens: int = 1) -> bool:
        with self.lock:
            # Refill tokens based on elapsed time
            now = time.time()
            elapsed = now - self.last_refill
            self.tokens = min(
                self.capacity,
                self.tokens + elapsed * self.rate
            )
            self.last_refill = now

            # Try to consume
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False`}
            </pre>
          </div>
          <div className="grid grid-cols-3 gap-3 my-4">
            {[
              { name: "Token Bucket", desc: "Smooth, allows bursts" },
              { name: "Sliding Window", desc: "Precise, higher memory" },
              { name: "Fixed Window", desc: "Simple, edge spikes" },
            ].map((algo) => (
              <div
                key={algo.name}
                className="p-2 rounded-[var(--radius-sm)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <p className="text-xs font-medium">{algo.name}</p>
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  {algo.desc}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "event-driven",
      title: "Event-driven architecture",
      subtitle: "Decoupled async systems",
      content: (
        <>
          <Prose>
            Event-driven architecture decouples services through asynchronous message passing.
            Publishers emit events without knowing who consumes them. Enables scalability,
            resilience, and loose coupling.
          </Prose>
          <EventDrivenViz />
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-semibold mb-2">Event Consumer Pattern</p>
            <pre
              className="text-xs leading-relaxed overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`import boto3
import json

class SQSConsumer:
    def __init__(self, queue_url: str):
        self.sqs = boto3.client('sqs')
        self.queue_url = queue_url

    def process_messages(self, handler):
        while True:
            response = self.sqs.receive_message(
                QueueUrl=self.queue_url,
                MaxNumberOfMessages=10,
                WaitTimeSeconds=20  # Long polling
            )

            for message in response.get('Messages', []):
                try:
                    body = json.loads(message['Body'])
                    handler(body)

                    # Delete on success
                    self.sqs.delete_message(
                        QueueUrl=self.queue_url,
                        ReceiptHandle=message['ReceiptHandle']
                    )
                except Exception as e:
                    # Message returns to queue after visibility timeout
                    print(f"Error: {e}")`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "microservices",
      title: "Microservices vs monolith",
      subtitle: "When to split",
      content: (
        <>
          <Prose>
            Start with a modular monolith. Split into microservices when you have clear
            boundaries, different scaling needs, or team autonomy requirements.
          </Prose>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-green)" }}>
                Monolith Advantages
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• Simpler deployment and testing</li>
                <li>• No network latency between components</li>
                <li>• Easier debugging and tracing</li>
                <li>• Better for small teams</li>
              </ul>
            </div>
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
                Microservices Advantages
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• Independent deployment and scaling</li>
                <li>• Technology flexibility per service</li>
                <li>• Team autonomy and ownership</li>
                <li>• Fault isolation</li>
              </ul>
            </div>
          </div>
          <div
            className="rounded-[var(--radius-md)] p-3"
            style={{ background: "var(--color-coral-dim)" }}
          >
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-coral)" }}>Warning:</strong>{" "}
              Microservices add complexity: service discovery, distributed tracing, eventual
              consistency, network failures. Don't adopt prematurely.
            </p>
          </div>
        </>
      ),
    },
  ],

  operations: [
    { name: "Cache lookup (Redis)", time: "O(1)", space: "O(n)", note: "Sub-millisecond" },
    { name: "Load balancer routing", time: "O(1)", space: "O(k)", note: "k=server count" },
    { name: "Message queue enqueue", time: "O(1)", space: "O(n)", note: "Amortized" },
    { name: "Database index lookup", time: "O(log n)", space: "O(n)", note: "B-tree index" },
    { name: "Consistent hashing", time: "O(log k)", space: "O(k)", note: "k=nodes" },
    { name: "Rate limit check", time: "O(1)", space: "O(1)", note: "Token bucket" },
  ],

  patterns: [
    {
      name: "Circuit Breaker",
      description: "Fail fast when downstream is unhealthy",
      code: `import time
from enum import Enum

class State(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open" # Testing recovery

class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 30):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failures = 0
        self.state = State.CLOSED
        self.last_failure_time = 0

    def call(self, func, *args, **kwargs):
        if self.state == State.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = State.HALF_OPEN
            else:
                raise Exception("Circuit is OPEN")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        self.failures = 0
        self.state = State.CLOSED

    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = time.time()
        if self.failures >= self.failure_threshold:
            self.state = State.OPEN`,
    },
    {
      name: "Retry with Backoff",
      description: "Retry failed operations with exponential delay",
      code: `import time
import random
from functools import wraps

def retry_with_backoff(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    jitter: bool = True
):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            while True:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries > max_retries:
                        raise

                    delay = min(
                        base_delay * (exponential_base ** (retries - 1)),
                        max_delay
                    )
                    if jitter:
                        delay *= (0.5 + random.random())

                    print(f"Retry {retries}/{max_retries} after {delay:.2f}s")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry_with_backoff(max_retries=3)
def call_api(url: str):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()`,
    },
    {
      name: "Consistent Hashing",
      description: "Distribute keys across nodes with minimal redistribution",
      code: `import hashlib
from bisect import bisect_left

class ConsistentHash:
    def __init__(self, nodes: list[str], replicas: int = 100):
        self.replicas = replicas
        self.ring: list[int] = []
        self.node_map: dict[int, str] = {}

        for node in nodes:
            self.add_node(node)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str):
        for i in range(self.replicas):
            virtual_key = f"{node}:{i}"
            hash_val = self._hash(virtual_key)
            self.ring.append(hash_val)
            self.node_map[hash_val] = node
        self.ring.sort()

    def remove_node(self, node: str):
        for i in range(self.replicas):
            hash_val = self._hash(f"{node}:{i}")
            self.ring.remove(hash_val)
            del self.node_map[hash_val]

    def get_node(self, key: str) -> str:
        if not self.ring:
            return None
        hash_val = self._hash(key)
        idx = bisect_left(self.ring, hash_val) % len(self.ring)
        return self.node_map[self.ring[idx]]`,
    },
    {
      name: "Distributed Lock",
      description: "Coordinate access across processes",
      code: `import redis
import uuid
import time

class DistributedLock:
    def __init__(self, redis_client, lock_name: str, ttl: int = 10):
        self.redis = redis_client
        self.lock_name = f"lock:{lock_name}"
        self.ttl = ttl
        self.token = str(uuid.uuid4())

    def acquire(self, timeout: float = 5.0) -> bool:
        start = time.time()
        while time.time() - start < timeout:
            # SET NX with TTL (atomic)
            if self.redis.set(self.lock_name, self.token, nx=True, ex=self.ttl):
                return True
            time.sleep(0.1)
        return False

    def release(self):
        # Only release if we own the lock (Lua script for atomicity)
        script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """
        self.redis.eval(script, 1, self.lock_name, self.token)

    def __enter__(self):
        if not self.acquire():
            raise Exception("Failed to acquire lock")
        return self

    def __exit__(self, *args):
        self.release()`,
    },
    {
      name: "API Gateway Pattern",
      description: "Single entry point with routing and auth",
      code: `from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import httpx

app = FastAPI()

SERVICES = {
    "users": "http://user-service:8000",
    "orders": "http://order-service:8000",
    "llm": "http://llm-service:8000",
}

rate_limiters = {}  # Per-client rate limiters

@app.middleware("http")
async def gateway_middleware(request: Request, call_next):
    # Authentication
    token = request.headers.get("Authorization")
    if not token:
        return JSONResponse({"error": "Unauthorized"}, status_code=401)

    # Rate limiting
    client_id = extract_client_id(token)
    if not rate_limiters.get(client_id, TokenBucket(10, 100)).consume():
        return JSONResponse({"error": "Rate limited"}, status_code=429)

    # Route to service
    path_parts = request.url.path.split("/")
    if len(path_parts) < 2:
        return JSONResponse({"error": "Invalid path"}, status_code=400)

    service = path_parts[1]
    if service not in SERVICES:
        return JSONResponse({"error": "Service not found"}, status_code=404)

    # Forward request
    async with httpx.AsyncClient() as client:
        url = SERVICES[service] + "/".join(path_parts[2:])
        response = await client.request(
            method=request.method,
            url=url,
            headers=dict(request.headers),
            content=await request.body()
        )
        return JSONResponse(response.json(), status_code=response.status_code)`,
    },
    {
      name: "Dead Letter Queue",
      description: "Handle failed messages gracefully",
      code: `import boto3
import json
from datetime import datetime

class DLQHandler:
    def __init__(self, main_queue: str, dlq: str, max_retries: int = 3):
        self.sqs = boto3.client('sqs')
        self.main_queue = main_queue
        self.dlq = dlq
        self.max_retries = max_retries

    def process_with_retry(self, handler):
        while True:
            response = self.sqs.receive_message(
                QueueUrl=self.main_queue,
                MaxNumberOfMessages=10,
                MessageAttributeNames=['All']
            )

            for msg in response.get('Messages', []):
                retry_count = int(
                    msg.get('MessageAttributes', {})
                    .get('RetryCount', {})
                    .get('StringValue', '0')
                )

                try:
                    handler(json.loads(msg['Body']))
                    self.sqs.delete_message(
                        QueueUrl=self.main_queue,
                        ReceiptHandle=msg['ReceiptHandle']
                    )
                except Exception as e:
                    if retry_count >= self.max_retries:
                        # Move to DLQ
                        self.sqs.send_message(
                            QueueUrl=self.dlq,
                            MessageBody=msg['Body'],
                            MessageAttributes={
                                'Error': {'StringValue': str(e), 'DataType': 'String'},
                                'FailedAt': {'StringValue': datetime.now().isoformat(), 'DataType': 'String'}
                            }
                        )
                    self.sqs.delete_message(
                        QueueUrl=self.main_queue,
                        ReceiptHandle=msg['ReceiptHandle']
                    )`,
    },
  ],

  problems: [
    {
      id: "rate-limiter",
      title: "Design a rate limiter",
      difficulty: "medium",
      description:
        "Implement a rate limiter using the sliding window algorithm that limits requests per minute.",
      examples: [
        { input: "limiter.is_allowed('user1') x 10", output: "True (first 5), False (next 5)" },
      ],
      starterCode: `from collections import deque
import time

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        # TODO: Initialize rate limiter
        pass

    def is_allowed(self, client_id: str) -> bool:
        # TODO: Check if request is allowed
        pass`,
      hints: [
        "Track timestamps of recent requests",
        "Remove timestamps outside the window",
        "Check if count exceeds limit",
      ],
      solution: `from collections import deque
import time
from threading import Lock

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: dict[str, deque] = {}  # client_id -> timestamps
        self.lock = Lock()

    def is_allowed(self, client_id: str) -> bool:
        with self.lock:
            now = time.time()
            window_start = now - self.window_seconds

            # Initialize queue for new clients
            if client_id not in self.requests:
                self.requests[client_id] = deque()

            queue = self.requests[client_id]

            # Remove old timestamps
            while queue and queue[0] < window_start:
                queue.popleft()

            # Check limit
            if len(queue) >= self.max_requests:
                return False

            # Record request
            queue.append(now)
            return True

    def get_remaining(self, client_id: str) -> int:
        with self.lock:
            if client_id not in self.requests:
                return self.max_requests

            now = time.time()
            window_start = now - self.window_seconds
            queue = self.requests[client_id]

            # Count valid requests
            valid = sum(1 for t in queue if t >= window_start)
            return max(0, self.max_requests - valid)`,
      testCases: [],
    },
    {
      id: "lru-cache",
      title: "Design an LRU cache",
      difficulty: "medium",
      description:
        "Implement an LRU (Least Recently Used) cache with O(1) get and put operations.",
      examples: [
        { input: "cache.put(1, 1); cache.put(2, 2); cache.get(1)", output: "1" },
      ],
      starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        # TODO: Initialize cache
        pass

    def get(self, key: int) -> int:
        # TODO: Get value, return -1 if not found
        pass

    def put(self, key: int, value: int):
        # TODO: Insert/update and evict if needed
        pass`,
      hints: [
        "Use a hash map for O(1) lookups",
        "Use a doubly linked list to track access order",
        "Move accessed items to front",
      ],
      solution: `class Node:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache: dict[int, Node] = {}

        # Dummy head and tail
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: Node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1

        node = self.cache[key]
        # Move to front (most recently used)
        self._remove(node)
        self._add_to_front(node)
        return node.value

    def put(self, key: int, value: int):
        if key in self.cache:
            self._remove(self.cache[key])

        node = Node(key, value)
        self.cache[key] = node
        self._add_to_front(node)

        if len(self.cache) > self.capacity:
            # Remove LRU (before tail)
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
      testCases: [],
    },
    {
      id: "url-shortener",
      title: "Design a URL shortener",
      difficulty: "easy",
      description:
        "Design a URL shortening service like bit.ly. Support creating short URLs and redirecting.",
      examples: [
        { input: "shorten('https://example.com/long/url')", output: "'https://short.url/abc123'" },
      ],
      starterCode: `import string
import random

class URLShortener:
    def __init__(self):
        # TODO: Initialize storage
        pass

    def shorten(self, long_url: str) -> str:
        # TODO: Generate short URL
        pass

    def resolve(self, short_url: str) -> str | None:
        # TODO: Return original URL
        pass`,
      hints: [
        "Generate unique short codes",
        "Use base62 encoding for compact codes",
        "Store mapping in database",
      ],
      solution: `import string
import random

class URLShortener:
    def __init__(self):
        self.url_to_code: dict[str, str] = {}
        self.code_to_url: dict[str, str] = {}
        self.base_url = "https://short.url/"
        self.chars = string.ascii_letters + string.digits

    def _generate_code(self, length: int = 6) -> str:
        while True:
            code = ''.join(random.choices(self.chars, k=length))
            if code not in self.code_to_url:
                return code

    def shorten(self, long_url: str) -> str:
        # Return existing code if URL already shortened
        if long_url in self.url_to_code:
            return self.base_url + self.url_to_code[long_url]

        code = self._generate_code()
        self.url_to_code[long_url] = code
        self.code_to_url[code] = long_url

        return self.base_url + code

    def resolve(self, short_url: str) -> str | None:
        code = short_url.replace(self.base_url, "")
        return self.code_to_url.get(code)

    def get_stats(self, code: str) -> dict:
        # In production, track click counts, geographic data, etc.
        return {
            "code": code,
            "original_url": self.code_to_url.get(code),
            "clicks": 0  # Would be tracked in real system
        }`,
      testCases: [],
    },
    {
      id: "distributed-counter",
      title: "Design a distributed counter",
      difficulty: "hard",
      description:
        "Design a distributed counter that can handle high write throughput while maintaining accuracy.",
      examples: [
        { input: "counter.increment(); counter.increment(); counter.get()", output: "2" },
      ],
      starterCode: `import redis
import random

class DistributedCounter:
    def __init__(self, redis_client, name: str, num_shards: int = 10):
        # TODO: Initialize sharded counter
        pass

    def increment(self, amount: int = 1):
        # TODO: Increment random shard
        pass

    def get(self) -> int:
        # TODO: Aggregate all shards
        pass`,
      hints: [
        "Use sharding to distribute writes",
        "Aggregate counts across shards",
        "Trade accuracy for performance with eventual consistency",
      ],
      solution: `import redis
import random

class DistributedCounter:
    def __init__(self, redis_client, name: str, num_shards: int = 10):
        self.redis = redis_client
        self.name = name
        self.num_shards = num_shards

    def _get_shard_key(self, shard_id: int) -> str:
        return f"counter:{self.name}:shard:{shard_id}"

    def increment(self, amount: int = 1):
        # Write to random shard for load distribution
        shard_id = random.randint(0, self.num_shards - 1)
        self.redis.incrby(self._get_shard_key(shard_id), amount)

    def get(self) -> int:
        # Aggregate across all shards
        total = 0
        pipeline = self.redis.pipeline()

        for i in range(self.num_shards):
            pipeline.get(self._get_shard_key(i))

        results = pipeline.execute()
        return sum(int(r or 0) for r in results)

    def reset(self):
        pipeline = self.redis.pipeline()
        for i in range(self.num_shards):
            pipeline.delete(self._get_shard_key(i))
        pipeline.execute()


# For even higher throughput: local buffering
class BufferedCounter:
    def __init__(self, distributed_counter, flush_interval: int = 100):
        self.counter = distributed_counter
        self.local_count = 0
        self.flush_interval = flush_interval

    def increment(self, amount: int = 1):
        self.local_count += amount
        if self.local_count >= self.flush_interval:
            self.counter.increment(self.local_count)
            self.local_count = 0`,
      testCases: [],
    },
    {
      id: "job-scheduler",
      title: "Design a job scheduler",
      difficulty: "hard",
      description:
        "Design a distributed job scheduler that can run tasks at scheduled times with retries and monitoring.",
      examples: [
        { input: "scheduler.schedule('job1', task, run_at)", output: "Job scheduled for execution" },
      ],
      starterCode: `import heapq
import threading
from datetime import datetime
from typing import Callable

class JobScheduler:
    def __init__(self, num_workers: int = 4):
        # TODO: Initialize scheduler
        pass

    def schedule(self, job_id: str, func: Callable, run_at: datetime, *args):
        # TODO: Schedule a job
        pass

    def start(self):
        # TODO: Start the scheduler loop
        pass`,
      hints: [
        "Use a priority queue ordered by execution time",
        "Support cron expressions for recurring jobs",
        "Implement worker pools with health checks",
      ],
      solution: `import heapq
import time
import threading
from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable
from concurrent.futures import ThreadPoolExecutor

@dataclass(order=True)
class Job:
    run_at: float
    id: str = field(compare=False)
    func: Callable = field(compare=False)
    args: tuple = field(compare=False, default=())
    max_retries: int = field(compare=False, default=3)
    retry_count: int = field(compare=False, default=0)

class JobScheduler:
    def __init__(self, num_workers: int = 4):
        self.jobs: list[Job] = []
        self.lock = threading.Lock()
        self.executor = ThreadPoolExecutor(max_workers=num_workers)
        self.running = False

    def schedule(self, job_id: str, func: Callable, run_at: datetime, *args):
        job = Job(
            run_at=run_at.timestamp(),
            id=job_id,
            func=func,
            args=args
        )
        with self.lock:
            heapq.heappush(self.jobs, job)

    def schedule_recurring(self, job_id: str, func: Callable, interval_seconds: int, *args):
        def recurring_wrapper():
            func(*args)
            # Reschedule
            next_run = datetime.fromtimestamp(time.time() + interval_seconds)
            self.schedule(job_id, func, next_run, *args)

        self.schedule(job_id, recurring_wrapper, datetime.now())

    def _run_job(self, job: Job):
        try:
            job.func(*job.args)
            print(f"Job {job.id} completed")
        except Exception as e:
            print(f"Job {job.id} failed: {e}")
            if job.retry_count < job.max_retries:
                # Retry with exponential backoff
                job.retry_count += 1
                job.run_at = time.time() + (2 ** job.retry_count)
                with self.lock:
                    heapq.heappush(self.jobs, job)

    def start(self):
        self.running = True
        while self.running:
            with self.lock:
                if not self.jobs:
                    time.sleep(0.1)
                    continue

                if self.jobs[0].run_at <= time.time():
                    job = heapq.heappop(self.jobs)
                    self.executor.submit(self._run_job, job)
                else:
                    time.sleep(0.1)`,
      testCases: [],
    },
  ],
};
