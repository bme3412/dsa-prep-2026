import type { DataStructure } from "../../types";
import { LoadBalancerViz } from "../../visualizations/system-design/LoadBalancerViz";
import { CacheHitViz } from "../../visualizations/system-design/CacheHitViz";
import { EventDrivenViz } from "../../visualizations/system-design/EventDrivenViz";
import { MLSystemViz } from "../../visualizations/system-design/MLSystemViz";
import { DataPipelineViz } from "../../visualizations/system-design/DataPipelineViz";
import { CodeBlock } from "../../components/CodeBlock";

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

export const systemDesignContent: DataStructure = {
  id: "system-design",
  name: "System Design",
  icon: "🏗️",
  color: "accent",
  tagline: "Build scalable, reliable distributed systems on AWS for AI and financial applications.",
  description: "Deep dive into distributed systems architecture, AWS services, ML infrastructure, data pipelines, and production patterns for enterprise AI systems.",
  viewMode: "pattern-first",

  sections: [
    {
      id: "scalability",
      title: "Scalability Fundamentals",
      subtitle: "Horizontal vs vertical scaling",
      content: (
        <Prose>
          <p>
            <strong>Scalability</strong> is the ability to handle increased load by adding resources. Two fundamental approaches exist: <strong>vertical scaling</strong> (scale up) adds more power to existing machines—more CPU, RAM, or faster storage. <strong>Horizontal scaling</strong> (scale out) adds more machines to distribute the load. Modern cloud-native systems strongly favor horizontal scaling because it removes single points of failure and has no hardware ceiling.
          </p>
          <p>
            In AWS, horizontal scaling is achieved through <strong>Auto Scaling Groups</strong> for EC2, <strong>Lambda</strong> for serverless (scales to thousands of concurrent executions), and <strong>DynamoDB on-demand</strong> for databases. The key insight is that horizontal scaling requires your application to be <strong>stateless</strong>—any instance can handle any request. State must be externalized to databases, caches, or object storage.
          </p>
          <LoadBalancerViz />
          <p>
            <strong>Load balancers</strong> distribute traffic across instances. <strong>Application Load Balancer (ALB)</strong> operates at Layer 7 (HTTP) with path-based routing, ideal for microservices. <strong>Network Load Balancer (NLB)</strong> operates at Layer 4 (TCP) with ultra-low latency, ideal for financial trading systems. Both support health checks to route traffic only to healthy instances.
          </p>
          <Callout type="insight" title="For financial systems">
            Investment firms often need <strong>both</strong> scaling strategies. Real-time pricing uses horizontal scaling for throughput, while quantitative models may need vertical scaling for in-memory computation. Design systems to scale each component appropriately.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "cap-theorem",
      title: "CAP & PACELC Theorems",
      subtitle: "Distributed systems tradeoffs",
      content: (
        <Prose>
          <p>
            The <strong>CAP theorem</strong> states that in a distributed system, you can only guarantee two of three properties: <strong>Consistency</strong> (all nodes see the same data), <strong>Availability</strong> (every request receives a response), and <strong>Partition tolerance</strong> (system works despite network splits). Since network partitions are inevitable in distributed systems, the real choice is between consistency and availability <strong>during</strong> a partition.
          </p>
          <p>
            <strong>CP systems</strong> (like DynamoDB with strong consistency) sacrifice availability during partitions—they refuse requests rather than return stale data. This is critical for financial systems where incorrect data can cause compliance violations or trading losses. <strong>AP systems</strong> (like DynamoDB with eventual consistency) remain available but may return stale data temporarily.
          </p>
          <p>
            <strong>PACELC</strong> extends CAP to normal operation: if there's no Partition, you choose between Latency and Consistency. Most systems choose eventual consistency for lower latency during normal operation. DynamoDB lets you choose per-request: <code>ConsistentRead=True</code> for strong consistency (higher latency), or eventual consistency for faster reads.
          </p>
          <Callout type="warning" title="Financial implications">
            Portfolio valuations often need <strong>strong consistency</strong>—showing different NAVs to different users is unacceptable. However, market data feeds can tolerate <strong>eventual consistency</strong> since prices update frequently anyway. Design your consistency requirements per data type, not system-wide.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "aws-architecture",
      title: "AWS Architecture for AI Systems",
      subtitle: "Lambda, DynamoDB, S3, Step Functions",
      content: (
        <Prose>
          <p>
            Modern AI systems on AWS follow a <strong>serverless-first</strong> approach where possible. <strong>Lambda</strong> handles inference requests with automatic scaling, <strong>API Gateway</strong> provides the HTTP interface with authentication and throttling, <strong>DynamoDB</strong> stores feature data with single-digit millisecond latency, and <strong>S3</strong> stores models, training data, and artifacts. <strong>Step Functions</strong> orchestrates complex workflows like model training pipelines.
          </p>
          <MLSystemViz />
          <p>
            For ML inference, the choice between <strong>Lambda</strong> and <strong>SageMaker Endpoints</strong> depends on latency requirements and model size. Lambda has a 15-minute timeout and 10GB memory limit, making it suitable for lightweight models. SageMaker Endpoints support GPU inference, larger models, and persistent instances for ultra-low latency. Many production systems use both: Lambda for simple models, SageMaker for complex ones.
          </p>
          <Code title="Lambda inference handler with DynamoDB feature lookup">
{`import boto3
import json
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities.typing import LambdaContext

logger = Logger()
tracer = Tracer()
dynamodb = boto3.resource("dynamodb")
feature_table = dynamodb.Table("ml-features")

@logger.inject_lambda_context
@tracer.capture_lambda_handler
def handler(event: dict, context: LambdaContext) -> dict:
    """ML inference with feature store lookup."""
    body = json.loads(event["body"])
    entity_id = body["entity_id"]

    # Fetch features from DynamoDB (sub-ms latency)
    with tracer.capture_method("fetch_features"):
        response = feature_table.get_item(
            Key={"entity_id": entity_id},
            ConsistentRead=False  # Eventual consistency for speed
        )
        features = response.get("Item", {}).get("features", {})

    # Run inference
    with tracer.capture_method("run_inference"):
        prediction = model.predict(features)

    # Log for monitoring
    logger.info("Inference complete", extra={
        "entity_id": entity_id,
        "prediction": prediction,
        "feature_count": len(features)
    })

    return {
        "statusCode": 200,
        "body": json.dumps({"prediction": prediction})
    }`}
          </Code>
          <Callout type="tip" title="Lambda Powertools">
            <strong>AWS Lambda Powertools</strong> provides structured logging, distributed tracing (X-Ray), and metrics out of the box. Use it for all production Lambda functions—it's the enterprise standard for observability.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "databases",
      title: "Database Selection",
      subtitle: "SQL vs NoSQL vs Vector vs Time Series",
      content: (
        <Prose>
          <p>
            Database selection depends on <strong>data model</strong>, <strong>query patterns</strong>, <strong>consistency requirements</strong>, and <strong>scale</strong>. Modern systems often use <strong>polyglot persistence</strong>—different databases for different workloads. For financial AI systems, typical combinations include: <strong>PostgreSQL/Aurora</strong> for transactional data, <strong>DynamoDB</strong> for high-throughput key-value access, <strong>OpenSearch</strong> for vector similarity and full-text search, and <strong>TimescaleDB/Timestream</strong> for market data time series.
          </p>
          <p>
            <strong>DynamoDB</strong> is the workhorse for serverless applications. It provides single-digit millisecond latency at any scale with automatic replication across availability zones. Key design decisions: <strong>partition key</strong> determines data distribution (choose high cardinality), <strong>sort key</strong> enables range queries within a partition. Use <strong>GSIs</strong> (Global Secondary Indexes) for alternative access patterns, but be aware they add cost and latency.
          </p>
          <Code title="DynamoDB single-table design for portfolio system">
{`import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("portfolio-system")

# Single table with multiple entity types
# PK: PORTFOLIO#<id> or POSITION#<id> or TRADE#<id>
# SK: METADATA or POSITION#<symbol> or TRADE#<timestamp>

def get_portfolio_with_positions(portfolio_id: str) -> dict:
    """Fetch portfolio and all positions in single query."""
    response = table.query(
        KeyConditionExpression=Key("PK").eq(f"PORTFOLIO#{portfolio_id}"),
        # Returns: METADATA item + all POSITION#<symbol> items
    )

    portfolio = None
    positions = []
    for item in response["Items"]:
        if item["SK"] == "METADATA":
            portfolio = item
        elif item["SK"].startswith("POSITION#"):
            positions.append(item)

    return {"portfolio": portfolio, "positions": positions}

def record_trade(portfolio_id: str, trade: dict):
    """Record trade with conditional write for optimistic locking."""
    table.put_item(
        Item={
            "PK": f"PORTFOLIO#{portfolio_id}",
            "SK": f"TRADE#{trade['timestamp']}",
            "symbol": trade["symbol"],
            "quantity": Decimal(str(trade["quantity"])),
            "price": Decimal(str(trade["price"])),
            "side": trade["side"],
            "GSI1PK": f"SYMBOL#{trade['symbol']}",  # Query trades by symbol
            "GSI1SK": trade["timestamp"],
        },
        ConditionExpression="attribute_not_exists(PK)"  # Prevent duplicates
    )`}
          </Code>
          <Callout type="insight" title="Vector databases for AI">
            For RAG and semantic search, <strong>OpenSearch</strong> (managed Elasticsearch) or <strong>pgvector</strong> (PostgreSQL extension) are common choices on AWS. OpenSearch integrates with Bedrock Knowledge Bases for managed RAG. For pure vector workloads, <strong>Pinecone</strong> or <strong>Weaviate</strong> offer simpler operations but less AWS integration.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "caching",
      title: "Caching Strategies",
      subtitle: "Trade memory for latency and cost",
      content: (
        <Prose>
          <p>
            Caching reduces latency and database load by storing frequently accessed data in memory. <strong>ElastiCache (Redis)</strong> is the standard choice for AWS—it provides sub-millisecond latency, persistence options, and cluster mode for horizontal scaling. Key caching patterns: <strong>cache-aside</strong> (application manages cache explicitly), <strong>read-through</strong> (cache fetches from database on miss), <strong>write-through</strong> (writes go to cache and database together), and <strong>write-behind</strong> (async database writes for speed).
          </p>
          <CacheHitViz />
          <p>
            <strong>Cache invalidation</strong> is famously hard. Options include: <strong>TTL-based expiration</strong> (simple but may serve stale data), <strong>event-driven invalidation</strong> (invalidate on database writes via DynamoDB Streams or SNS), and <strong>versioned keys</strong> (include version in cache key, increment on write). For financial data, TTL is often unacceptable—use event-driven invalidation with short fallback TTLs.
          </p>
          <Code title="Redis caching with write-through invalidation">
{`import redis
import json
import hashlib
from functools import wraps
from typing import Callable, Any

redis_client = redis.Redis(host="elasticache-endpoint", port=6379, decode_responses=True)

def cache_with_invalidation(ttl: int = 300, prefix: str = "cache"):
    """Cache decorator with event-driven invalidation support."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # Generate cache key from function name and arguments
            key_data = f"{func.__name__}:{args}:{sorted(kwargs.items())}"
            cache_key = f"{prefix}:{hashlib.md5(key_data.encode()).hexdigest()}"

            # Check cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)

            # Execute function
            result = func(*args, **kwargs)

            # Store in cache with TTL
            redis_client.setex(cache_key, ttl, json.dumps(result))

            # Track key for invalidation (store reverse mapping)
            entity_id = kwargs.get("entity_id") or args[0] if args else None
            if entity_id:
                redis_client.sadd(f"invalidation:{entity_id}", cache_key)

            return result
        return wrapper
    return decorator

def invalidate_entity(entity_id: str):
    """Invalidate all cache entries for an entity (call on writes)."""
    invalidation_key = f"invalidation:{entity_id}"
    cache_keys = redis_client.smembers(invalidation_key)

    if cache_keys:
        redis_client.delete(*cache_keys)
        redis_client.delete(invalidation_key)

# Semantic caching for LLM responses
def semantic_cache_lookup(query: str, threshold: float = 0.92) -> str | None:
    """Check if similar query exists in cache using embeddings."""
    query_embedding = embed_text(query)

    # Search in vector index (e.g., Redis Search or dedicated vector DB)
    results = vector_search(query_embedding, top_k=1)

    if results and results[0].score >= threshold:
        return results[0].cached_response
    return None`}
          </Code>
          <Callout type="tip" title="Semantic caching for LLMs">
            For LLM applications, <strong>semantic caching</strong> matches similar queries (not exact) using embeddings. This can reduce token costs by 40-80% for repeated questions with slight variations. Implement with vector search on query embeddings.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "data-pipelines",
      title: "Data Pipeline Architecture",
      subtitle: "Batch vs streaming, ETL vs ELT",
      content: (
        <Prose>
          <p>
            Data pipelines move data from sources to destinations with transformations. The fundamental choice is between <strong>batch processing</strong> (process data in scheduled chunks) and <strong>stream processing</strong> (process data continuously as it arrives). Batch is simpler and cheaper for analytics workloads; streaming is necessary for real-time applications like live trading signals or fraud detection.
          </p>
          <DataPipelineViz />
          <p>
            On AWS, <strong>batch pipelines</strong> typically use: S3 as the data lake, <strong>Glue</strong> or <strong>EMR</strong> for Spark-based transformations, and <strong>Redshift</strong> or <strong>Athena</strong> for analytics. <strong>Streaming pipelines</strong> use: <strong>Kinesis Data Streams</strong> for ingestion, <strong>Kinesis Data Analytics</strong> (Flink) or <strong>Lambda</strong> for processing, and <strong>DynamoDB</strong> or <strong>OpenSearch</strong> for real-time serving. The <strong>Lambda architecture</strong> combines both: batch for accuracy, streaming for speed.
          </p>
          <Code title="Kinesis stream processing with Lambda">
{`import boto3
import json
import base64
from aws_lambda_powertools import Logger
from decimal import Decimal

logger = Logger()
dynamodb = boto3.resource("dynamodb")
signals_table = dynamodb.Table("trading-signals")

def handler(event: dict, context) -> dict:
    """Process market data stream and generate trading signals."""
    processed = 0
    failed = 0

    for record in event["Records"]:
        try:
            # Decode Kinesis record
            payload = base64.b64decode(record["kinesis"]["data"])
            data = json.loads(payload)

            # Process market data
            signal = process_market_data(data)

            if signal:
                # Write signal to DynamoDB for downstream consumers
                signals_table.put_item(Item={
                    "symbol": signal["symbol"],
                    "timestamp": signal["timestamp"],
                    "signal_type": signal["type"],
                    "strength": Decimal(str(signal["strength"])),
                    "ttl": int(signal["timestamp"]) + 3600  # 1 hour TTL
                })

            processed += 1

        except Exception as e:
            logger.error(f"Failed to process record: {e}")
            failed += 1

    logger.info(f"Processed {processed} records, {failed} failures")

    # Return batch item failures for retry
    return {
        "batchItemFailures": [
            {"itemIdentifier": record["kinesis"]["sequenceNumber"]}
            for record in event["Records"][:failed]
        ]
    }

def process_market_data(data: dict) -> dict | None:
    """Generate trading signal from market data."""
    # Example: Simple moving average crossover
    symbol = data["symbol"]
    price = data["price"]

    # Fetch recent prices from cache/DB
    recent_prices = get_recent_prices(symbol, window=20)
    recent_prices.append(price)

    sma_5 = sum(recent_prices[-5:]) / 5
    sma_20 = sum(recent_prices) / len(recent_prices)

    if sma_5 > sma_20 * 1.02:  # 2% above
        return {"symbol": symbol, "type": "BUY", "strength": 0.8, "timestamp": data["timestamp"]}
    elif sma_5 < sma_20 * 0.98:  # 2% below
        return {"symbol": symbol, "type": "SELL", "strength": 0.8, "timestamp": data["timestamp"]}

    return None`}
          </Code>
          <Callout type="insight" title="Feature engineering at scale">
            For ML systems, data pipelines feed <strong>feature stores</strong>. Batch pipelines compute features from historical data (offline store), while streaming pipelines update features in real-time (online store). SageMaker Feature Store or a custom DynamoDB-based solution provides both.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "event-driven",
      title: "Event-Driven Architecture",
      subtitle: "Decoupled async systems with SNS, SQS, EventBridge",
      content: (
        <Prose>
          <p>
            Event-driven architecture decouples services through asynchronous message passing. <strong>Publishers</strong> emit events without knowing who consumes them. <strong>Consumers</strong> process events independently. This enables scalability (consumers scale independently), resilience (failures don't cascade), and loose coupling (services can evolve independently).
          </p>
          <EventDrivenViz />
          <p>
            AWS provides three core event services: <strong>SNS</strong> (Simple Notification Service) for pub/sub fan-out—one message to many subscribers. <strong>SQS</strong> (Simple Queue Service) for point-to-point queuing with guaranteed delivery and dead-letter queues. <strong>EventBridge</strong> for event routing with content-based filtering—the most flexible option for complex event-driven systems. A common pattern: EventBridge for routing, SQS for buffering, Lambda for processing.
          </p>
          <Code title="EventBridge-driven order processing">
{`import boto3
import json
from dataclasses import dataclass, asdict
from datetime import datetime
from aws_lambda_powertools import Logger

logger = Logger()
eventbridge = boto3.client("events")

@dataclass
class OrderEvent:
    order_id: str
    symbol: str
    side: str  # BUY or SELL
    quantity: float
    price: float
    status: str
    timestamp: str = None

    def __post_init__(self):
        self.timestamp = self.timestamp or datetime.utcnow().isoformat()

def publish_order_event(order: OrderEvent, event_type: str):
    """Publish order event to EventBridge."""
    eventbridge.put_events(
        Entries=[{
            "Source": "trading.orders",
            "DetailType": event_type,  # e.g., "OrderCreated", "OrderFilled"
            "Detail": json.dumps(asdict(order)),
            "EventBusName": "trading-events",
        }]
    )
    logger.info(f"Published {event_type}", extra={"order_id": order.order_id})

# EventBridge rule (in CDK/CloudFormation):
# Pattern: {"source": ["trading.orders"], "detail-type": ["OrderFilled"]}
# Target: SQS queue for risk calculation

def risk_calculator_handler(event: dict, context):
    """Process filled orders for risk calculation (SQS consumer)."""
    for record in event["Records"]:
        body = json.loads(record["body"])
        order_detail = json.loads(body["detail"])

        # Update portfolio risk metrics
        update_portfolio_risk(
            order_id=order_detail["order_id"],
            symbol=order_detail["symbol"],
            quantity=order_detail["quantity"],
            side=order_detail["side"]
        )

        # Publish risk update event
        eventbridge.put_events(
            Entries=[{
                "Source": "trading.risk",
                "DetailType": "RiskUpdated",
                "Detail": json.dumps({
                    "portfolio_id": get_portfolio_id(order_detail["order_id"]),
                    "new_var": calculate_var(),
                    "timestamp": datetime.utcnow().isoformat()
                }),
                "EventBusName": "trading-events",
            }]
        )`}
          </Code>
          <Callout type="warning" title="Eventual consistency">
            Event-driven systems are <strong>eventually consistent</strong> by nature. Events may arrive out of order, be duplicated, or be delayed. Design consumers to be <strong>idempotent</strong> (safe to process the same event twice) and handle out-of-order delivery. Use event timestamps and version numbers for ordering.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "ml-infrastructure",
      title: "ML System Infrastructure",
      subtitle: "Model serving, feature stores, inference pipelines",
      content: (
        <Prose>
          <p>
            Production ML systems have three core components beyond the model itself: <strong>feature stores</strong> that provide consistent features for training and serving, <strong>model registries</strong> that version and deploy models, and <strong>inference pipelines</strong> that serve predictions with low latency. Each component needs careful design for reliability, performance, and cost.
          </p>
          <MLSystemViz />
          <p>
            <strong>Feature stores</strong> solve the training-serving skew problem. They provide an <strong>offline store</strong> (S3/data warehouse) for training with point-in-time correctness, and an <strong>online store</strong> (DynamoDB/Redis) for low-latency serving. SageMaker Feature Store is the managed option; for more control, build on DynamoDB with Lambda triggers to sync from batch pipelines.
          </p>
          <Code title="Feature store with online/offline sync">
{`import boto3
from datetime import datetime
from decimal import Decimal
import pandas as pd

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")

class FeatureStore:
    """Simple feature store with online and offline stores."""

    def __init__(self, table_name: str, s3_bucket: str):
        self.online_table = dynamodb.Table(table_name)
        self.s3_bucket = s3_bucket

    def get_online_features(self, entity_id: str, feature_names: list[str]) -> dict:
        """Get features from online store (DynamoDB) for inference."""
        response = self.online_table.get_item(
            Key={"entity_id": entity_id},
            ProjectionExpression=", ".join(feature_names)
        )
        return response.get("Item", {})

    def put_features(self, entity_id: str, features: dict, event_time: datetime = None):
        """Write features to online store with event time."""
        event_time = event_time or datetime.utcnow()

        item = {
            "entity_id": entity_id,
            "event_time": event_time.isoformat(),
            **{k: Decimal(str(v)) if isinstance(v, float) else v
               for k, v in features.items()}
        }

        self.online_table.put_item(Item=item)

    def get_historical_features(
        self,
        entity_ids: list[str],
        feature_names: list[str],
        as_of_time: datetime
    ) -> pd.DataFrame:
        """Get point-in-time correct features from offline store for training."""
        # Query S3/Athena for historical data
        # Filter to features available as of as_of_time
        # This prevents data leakage in training

        query = f"""
        SELECT entity_id, {', '.join(feature_names)}, event_time
        FROM feature_store_offline
        WHERE entity_id IN ({', '.join(f"'{e}'" for e in entity_ids)})
          AND event_time <= '{as_of_time.isoformat()}'
        """

        # Execute via Athena and return DataFrame
        return run_athena_query(query)

    def batch_ingest(self, df: pd.DataFrame, entity_id_col: str, event_time_col: str):
        """Batch ingest features from training pipeline."""
        # Write to S3 for offline store
        s3_key = f"features/{datetime.utcnow().strftime('%Y/%m/%d')}/batch.parquet"
        df.to_parquet(f"s3://{self.s3_bucket}/{s3_key}")

        # Optionally update online store for latest values
        latest = df.sort_values(event_time_col).groupby(entity_id_col).last()
        for entity_id, row in latest.iterrows():
            self.put_features(entity_id, row.to_dict())`}
          </Code>
          <Callout type="tip" title="Model serving tradeoffs">
            <strong>SageMaker real-time endpoints</strong>: Persistent instances, lowest latency, higher cost. <strong>SageMaker serverless</strong>: Cold starts but auto-scaling to zero. <strong>Lambda</strong>: Simple models under 10GB, 15-minute timeout. <strong>Batch transform</strong>: Offline scoring, 50% cost savings. Choose based on latency SLA and cost requirements.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "agentic-ai",
      title: "Agentic AI Architecture",
      subtitle: "Designing autonomous AI workflows",
      content: (
        <Prose>
          <p>
            <strong>Agentic AI</strong> systems go beyond simple request-response: they autonomously plan, execute tools, observe results, and iterate until a goal is achieved. The core loop is <strong>Perceive → Plan → Act → Observe</strong>, repeated until completion or failure. This requires fundamentally different architecture than traditional ML inference.
          </p>
          <p>
            The agent runtime manages the loop: it passes context to the LLM, parses tool calls from the response, executes tools, and feeds results back. <strong>Tool orchestration</strong> is critical — tools must be well-documented (the LLM reads descriptions), idempotent (safe to retry), and return structured results. Common tools include database queries, API calls, code execution, and web search.
          </p>
          <Code title="Basic agent loop with tool execution">
{`from dataclasses import dataclass
from typing import Callable, Any
import json

@dataclass
class Tool:
    name: str
    description: str
    parameters: dict  # JSON schema
    function: Callable

class AgentRuntime:
    """Core agent runtime with tool orchestration."""

    def __init__(self, model_client, tools: list[Tool], system_prompt: str):
        self.model = model_client
        self.tools = {t.name: t for t in tools}
        self.system_prompt = system_prompt
        self.max_iterations = 10

    def run(self, user_input: str) -> str:
        """Execute agent loop until completion."""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": user_input}
        ]

        for iteration in range(self.max_iterations):
            # Get model response
            response = self.model.generate(
                messages=messages,
                tools=[self._tool_schema(t) for t in self.tools.values()]
            )

            # Check if done (no tool calls)
            if not response.tool_calls:
                return response.content

            # Execute each tool call
            tool_results = []
            for call in response.tool_calls:
                tool = self.tools.get(call.name)
                if not tool:
                    result = {"error": f"Unknown tool: {call.name}"}
                else:
                    try:
                        result = tool.function(**call.arguments)
                    except Exception as e:
                        result = {"error": str(e)}

                tool_results.append({
                    "tool_call_id": call.id,
                    "result": json.dumps(result)
                })

            # Add assistant message and tool results
            messages.append({"role": "assistant", "content": response.content, "tool_calls": response.tool_calls})
            messages.append({"role": "tool", "tool_results": tool_results})

        return "Max iterations reached"

    def _tool_schema(self, tool: Tool) -> dict:
        return {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.parameters
        }`}
          </Code>
          <p>
            <strong>Memory systems</strong> enable agents to work across sessions and handle long tasks. <strong>Short-term memory</strong> is the conversation context — limited by token windows. <strong>Long-term memory</strong> uses vector stores to retrieve relevant past interactions or knowledge. <strong>Episodic memory</strong> remembers specific sessions and user preferences. AWS AgentCore provides managed memory services for production agents.
          </p>
          <Code title="Agent memory architecture">
{`from typing import Optional
import numpy as np

class AgentMemory:
    """Multi-tier memory for agentic systems."""

    def __init__(self, vector_store, session_store):
        self.vectors = vector_store  # Long-term semantic memory
        self.sessions = session_store  # Episodic memory (DynamoDB)
        self.context = []  # Short-term (conversation)

    def add_to_context(self, role: str, content: str):
        """Add to short-term conversation memory."""
        self.context.append({"role": role, "content": content})

        # Trim if too long (keep system + recent)
        if len(self.context) > 50:
            self.context = self.context[:1] + self.context[-40:]

    def recall_relevant(self, query: str, k: int = 5) -> list[str]:
        """Retrieve from long-term memory using semantic search."""
        results = self.vectors.search(query, top_k=k)
        return [r.content for r in results]

    def save_episode(self, session_id: str, summary: str, outcome: str):
        """Save session to episodic memory for learning."""
        self.sessions.put_item(Item={
            "session_id": session_id,
            "summary": summary,
            "outcome": outcome,  # success/failure
            "timestamp": datetime.utcnow().isoformat()
        })

    def get_context_with_memory(self, query: str) -> list[dict]:
        """Build context with relevant long-term memories."""
        memories = self.recall_relevant(query)

        # Inject memories into context
        memory_text = "\\n".join(f"- {m}" for m in memories)
        enhanced_context = self.context.copy()

        if memories:
            enhanced_context.insert(1, {
                "role": "system",
                "content": f"Relevant information from memory:\\n{memory_text}"
            })

        return enhanced_context`}
          </Code>
          <p>
            <strong>Multi-agent systems</strong> coordinate multiple specialized agents. Patterns include: <strong>swarms</strong> (parallel agents that vote or aggregate), <strong>hierarchies</strong> (manager agent delegates to workers), and <strong>workflows</strong> (sequential handoffs). AWS Strands SDK and frameworks like CrewAI provide multi-agent orchestration.
          </p>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Investment Research Agents</h3>
          <p>
            <strong>Investment research agents</strong> follow a structured workflow: receive thesis → gather evidence → analyze data → produce recommendation with citations. The key difference from generic agents is <strong>evidence tracking</strong> — every claim must cite its source for compliance and reproducibility.
          </p>
          <Code title="Investment research agent with citation tracking">
{`from dataclasses import dataclass, field
from typing import Optional
from datetime import datetime
from enum import Enum

@dataclass
class Citation:
    source_type: str  # "sec_filing", "earnings_call", "market_data", "news"
    source_id: str    # e.g., "AAPL-10K-2024", "AAPL-Q4-2024-call"
    excerpt: str      # Relevant quote
    timestamp: datetime

@dataclass
class ResearchFinding:
    claim: str
    confidence: float  # 0-1
    citations: list[Citation]
    methodology: str   # How was this derived?

@dataclass
class ResearchReport:
    thesis: str
    recommendation: str  # "buy", "sell", "hold", "no_opinion"
    confidence: float
    findings: list[ResearchFinding]
    risks: list[str]
    data_as_of: datetime

class InvestmentResearchAgent:
    """Agent for systematic investment research with full citation tracking."""

    def __init__(self, model_client, tools: dict):
        self.model = model_client
        self.tools = tools
        self.citations = []  # Track all sources accessed

    def research(self, thesis: str, symbol: str) -> ResearchReport:
        """Execute research workflow with evidence gathering."""

        # Step 1: Gather fundamental data
        financials = self._with_citation(
            self.tools["sec_filings"].get_latest_10k(symbol),
            "sec_filing"
        )

        # Step 2: Analyze recent earnings
        earnings = self._with_citation(
            self.tools["earnings"].get_transcript(symbol, quarters=4),
            "earnings_call"
        )

        # Step 3: Check market data and technicals
        market = self._with_citation(
            self.tools["market_data"].get_fundamentals(symbol),
            "market_data"
        )

        # Step 4: Scan news and sentiment
        news = self._with_citation(
            self.tools["news"].search(symbol, days=30),
            "news"
        )

        # Step 5: Synthesize with LLM
        analysis = self.model.generate(
            messages=[
                {"role": "system", "content": self._research_prompt()},
                {"role": "user", "content": f"Thesis: {thesis}\\n\\nData:\\n{self._format_data(financials, earnings, market, news)}"}
            ],
            response_format=ResearchReport  # Structured output
        )

        # Attach citations to findings
        analysis.findings = self._attach_citations(analysis.findings)

        return analysis

    def _with_citation(self, data: dict, source_type: str) -> dict:
        """Track data source for citation."""
        citation = Citation(
            source_type=source_type,
            source_id=data.get("source_id", "unknown"),
            excerpt=data.get("summary", "")[:500],
            timestamp=datetime.utcnow()
        )
        self.citations.append(citation)
        return data

    def _attach_citations(self, findings: list[ResearchFinding]) -> list[ResearchFinding]:
        """Match findings to their supporting citations."""
        # In production: use semantic similarity to match claims to sources
        for finding in findings:
            finding.citations = [c for c in self.citations
                                 if c.source_type in finding.methodology]
        return findings`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Financial Tool Design</h3>
          <p>
            Tools for financial agents require special design: <strong>read-only vs write</strong> separation (queries vs trades), <strong>parameter constraints</strong> (max amounts, allowed symbols), <strong>idempotency</strong> (safe retries), and <strong>approval gates</strong> (high-impact actions require human review).
          </p>
          <Code title="Tool design with financial constraints">
{`from dataclasses import dataclass
from typing import Callable, Optional
from functools import wraps

@dataclass
class ToolConstraints:
    read_only: bool = True
    requires_approval: bool = False
    max_amount: Optional[float] = None
    allowed_symbols: Optional[list[str]] = None  # None = all allowed
    rate_limit_per_minute: int = 60
    cache_ttl_seconds: int = 0  # 0 = no caching

def financial_tool(constraints: ToolConstraints):
    """Decorator for financial agent tools with safety constraints."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Validate constraints before execution
            if constraints.allowed_symbols:
                symbol = kwargs.get("symbol") or (args[0] if args else None)
                if symbol and symbol not in constraints.allowed_symbols:
                    raise ValueError(f"Symbol {symbol} not in allowed list")

            if constraints.max_amount:
                amount = kwargs.get("amount") or kwargs.get("quantity", 0)
                price = kwargs.get("price", 1)
                if amount * price > constraints.max_amount:
                    raise ValueError(f"Amount exceeds max: {constraints.max_amount}")

            # Check if approval required
            if constraints.requires_approval:
                return {
                    "status": "pending_approval",
                    "action": func.__name__,
                    "params": kwargs,
                    "constraints": constraints
                }

            return func(*args, **kwargs)

        wrapper._constraints = constraints
        wrapper._is_read_only = constraints.read_only
        return wrapper
    return decorator

# Read-only tools (safe for agents to call freely)
@financial_tool(ToolConstraints(read_only=True, cache_ttl_seconds=300))
def get_price(symbol: str) -> dict:
    """Get current price for symbol. Cached for 5 minutes."""
    return market_data_client.get_quote(symbol)

@financial_tool(ToolConstraints(read_only=True, cache_ttl_seconds=3600))
def get_fundamentals(symbol: str, metrics: list[str]) -> dict:
    """Get fundamental data. Cached for 1 hour."""
    return market_data_client.get_fundamentals(symbol, metrics)

@financial_tool(ToolConstraints(read_only=True))
def get_sec_filing(symbol: str, filing_type: str, year: int) -> dict:
    """Retrieve SEC filing content."""
    return sec_client.get_filing(symbol, filing_type, year)

@financial_tool(ToolConstraints(read_only=True))
def get_portfolio(portfolio_id: str) -> dict:
    """Get current portfolio positions."""
    return portfolio_service.get_positions(portfolio_id)

# Write tools (require approval above thresholds)
@financial_tool(ToolConstraints(
    read_only=False,
    requires_approval=True,
    max_amount=100000,
    rate_limit_per_minute=10
))
def submit_order(symbol: str, side: str, quantity: int, price: float) -> dict:
    """Submit trade order. Requires approval for amounts > $100k."""
    return order_service.submit({
        "symbol": symbol,
        "side": side,
        "quantity": quantity,
        "price": price,
        "type": "limit"
    })

# Tool registry with safety classification
class FinancialToolRegistry:
    """Registry that enforces tool safety at runtime."""

    def __init__(self):
        self.tools = {}
        self.read_only_tools = set()
        self.write_tools = set()

    def register(self, tool: Callable):
        name = tool.__name__
        self.tools[name] = tool

        if hasattr(tool, "_is_read_only") and tool._is_read_only:
            self.read_only_tools.add(name)
        else:
            self.write_tools.add(name)

    def get_safe_tools(self) -> list[Callable]:
        """Return only read-only tools (safe for autonomous use)."""
        return [self.tools[name] for name in self.read_only_tools]

    def execute(self, name: str, **kwargs) -> dict:
        """Execute tool with constraint checking."""
        if name not in self.tools:
            raise ValueError(f"Unknown tool: {name}")
        return self.tools[name](**kwargs)`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Agent Reliability for High-Stakes</h3>
          <p>
            Financial agents must be <strong>deterministic</strong> (same input → same output), produce <strong>structured outputs</strong> (validated schemas), and <strong>gracefully defer</strong> to humans when uncertain. These properties enable auditing, debugging, and regulatory compliance.
          </p>
          <Code title="Reliable agent with structured outputs and confidence">
{`from pydantic import BaseModel, Field, validator
from typing import Union, Literal
from enum import Enum

class Recommendation(str, Enum):
    BUY = "buy"
    SELL = "sell"
    HOLD = "hold"
    DEFER = "defer_to_human"

class InvestmentDecision(BaseModel):
    """Structured output schema for investment decisions."""

    symbol: str
    recommendation: Recommendation
    confidence: float = Field(ge=0, le=1)
    reasoning: str = Field(min_length=50, max_length=2000)
    key_factors: list[str] = Field(min_items=1, max_items=5)
    risks: list[str] = Field(min_items=1, max_items=5)
    position_size_pct: float = Field(ge=0, le=0.1)  # Max 10% of portfolio

    @validator("recommendation", pre=True, always=True)
    def check_confidence_threshold(cls, v, values):
        """Auto-defer if confidence too low."""
        confidence = values.get("confidence", 0)
        if confidence < 0.7 and v != Recommendation.DEFER:
            return Recommendation.DEFER
        return v

class DeferralReason(BaseModel):
    """When agent defers to human."""
    reason: str
    uncertainty_sources: list[str]
    suggested_questions: list[str]
    partial_analysis: str

class ReliableInvestmentAgent:
    """Agent with reliability guarantees for financial decisions."""

    def __init__(self, model_client, tools: list):
        self.model = model_client
        self.tools = tools
        self.config = {
            "temperature": 0,           # Deterministic
            "seed": 42,                 # Reproducible
            "max_retries": 3,           # Retry on failures
            "confidence_threshold": 0.7  # Defer below this
        }

    def analyze(self, context: dict) -> Union[InvestmentDecision, DeferralReason]:
        """Analyze investment with reliability guarantees."""

        # Run with retries for transient failures
        for attempt in range(self.config["max_retries"]):
            try:
                response = self.model.generate(
                    messages=self._build_messages(context),
                    response_format=InvestmentDecision,
                    temperature=self.config["temperature"],
                    seed=self.config["seed"]
                )

                # Validate output
                decision = InvestmentDecision.model_validate(response)

                # Check confidence threshold
                if decision.confidence < self.config["confidence_threshold"]:
                    return DeferralReason(
                        reason=f"Confidence {decision.confidence:.2f} below threshold",
                        uncertainty_sources=self._identify_uncertainty(context),
                        suggested_questions=[
                            "What is the catalyst timeline?",
                            "Are there regulatory risks?",
                            "How does this compare to sector peers?"
                        ],
                        partial_analysis=decision.reasoning
                    )

                return decision

            except ValidationError as e:
                if attempt == self.config["max_retries"] - 1:
                    return DeferralReason(
                        reason=f"Failed to produce valid output: {e}",
                        uncertainty_sources=["Output validation failed"],
                        suggested_questions=["Please review the data manually"],
                        partial_analysis=""
                    )

    def _identify_uncertainty(self, context: dict) -> list[str]:
        """Identify sources of uncertainty in analysis."""
        sources = []
        if context.get("data_age_hours", 0) > 24:
            sources.append("Data may be stale")
        if context.get("news_sentiment_mixed", False):
            sources.append("Mixed news sentiment")
        if context.get("earnings_surprise", False):
            sources.append("Recent earnings surprise")
        return sources`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Agent Observability & Audit</h3>
          <p>
            Every agent decision must be <strong>fully traceable</strong> for debugging and compliance. Log: input context, all tool calls with results, LLM reasoning, final output, and metadata (latency, tokens, cost). Store in immutable audit logs with retention policies.
          </p>
          <Code title="Agent tracing for compliance and debugging">
{`from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
import hashlib
import json
import boto3

@dataclass
class ToolCall:
    tool_name: str
    arguments: dict
    result: Any
    latency_ms: float
    cached: bool

@dataclass
class AgentTrace:
    """Complete trace of an agent decision for audit."""

    trace_id: str
    agent_id: str
    agent_version: str
    timestamp: datetime

    # Input
    user_input: str
    context: dict

    # Execution
    tool_calls: list[ToolCall] = field(default_factory=list)
    llm_calls: list[dict] = field(default_factory=list)

    # Output
    output: Any = None
    output_type: str = ""  # "decision", "deferral", "error"

    # Metadata
    total_latency_ms: float = 0
    total_tokens: int = 0
    estimated_cost_usd: float = 0
    error: str = None

    def to_audit_record(self) -> dict:
        """Convert to immutable audit record."""
        return {
            "trace_id": self.trace_id,
            "agent_id": self.agent_id,
            "agent_version": self.agent_version,
            "timestamp": self.timestamp.isoformat(),
            "input_hash": hashlib.sha256(self.user_input.encode()).hexdigest(),
            "output_hash": hashlib.sha256(json.dumps(self.output, default=str).encode()).hexdigest(),
            "output_type": self.output_type,
            "tool_calls_count": len(self.tool_calls),
            "total_latency_ms": self.total_latency_ms,
            "total_tokens": self.total_tokens,
            "cost_usd": self.estimated_cost_usd,
            "success": self.error is None
        }

class AgentTracer:
    """Observability layer for agent execution."""

    def __init__(self, dynamodb_table, s3_bucket):
        self.db = dynamodb_table  # Audit index
        self.s3 = boto3.client("s3")
        self.bucket = s3_bucket  # Full trace storage

    def start_trace(self, agent_id: str, agent_version: str, user_input: str, context: dict) -> AgentTrace:
        """Initialize trace for new agent execution."""
        return AgentTrace(
            trace_id=f"trace-{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}",
            agent_id=agent_id,
            agent_version=agent_version,
            timestamp=datetime.utcnow(),
            user_input=user_input,
            context=context
        )

    def record_tool_call(self, trace: AgentTrace, tool_name: str, args: dict, result: Any, latency_ms: float, cached: bool):
        """Record tool execution."""
        trace.tool_calls.append(ToolCall(
            tool_name=tool_name,
            arguments=args,
            result=result,
            latency_ms=latency_ms,
            cached=cached
        ))

    def record_llm_call(self, trace: AgentTrace, messages: list, response: str, tokens: int, latency_ms: float):
        """Record LLM call."""
        trace.llm_calls.append({
            "messages": messages,
            "response": response,
            "tokens": tokens,
            "latency_ms": latency_ms
        })
        trace.total_tokens += tokens

    def complete_trace(self, trace: AgentTrace, output: Any, output_type: str):
        """Finalize and persist trace."""
        trace.output = output
        trace.output_type = output_type
        trace.total_latency_ms = (datetime.utcnow() - trace.timestamp).total_seconds() * 1000

        # Calculate cost
        trace.estimated_cost_usd = self._estimate_cost(trace.total_tokens)

        # Store full trace in S3 (immutable)
        self.s3.put_object(
            Bucket=self.bucket,
            Key=f"traces/{trace.timestamp:%Y/%m/%d}/{trace.trace_id}.json",
            Body=json.dumps(trace.__dict__, default=str),
            ContentType="application/json"
        )

        # Store audit index in DynamoDB
        self.db.put_item(Item=trace.to_audit_record())

    def replay_trace(self, trace_id: str) -> AgentTrace:
        """Retrieve trace for debugging or audit."""
        # Lookup in DynamoDB to get S3 path
        response = self.db.get_item(Key={"trace_id": trace_id})
        timestamp = datetime.fromisoformat(response["Item"]["timestamp"])

        # Fetch full trace from S3
        s3_key = f"traces/{timestamp:%Y/%m/%d}/{trace_id}.json"
        obj = self.s3.get_object(Bucket=self.bucket, Key=s3_key)
        return json.loads(obj["Body"].read())`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Agent Evaluation & Testing</h3>
          <p>
            Before deploying agents to production, evaluate them against <strong>historical cases</strong> with known outcomes. Track metrics: accuracy, confidence calibration (is 80% confidence correct 80% of the time?), coverage (how often does it defer?), and cost.
          </p>
          <Code title="Agent evaluation framework">
{`from dataclasses import dataclass
from typing import Optional
import numpy as np

@dataclass
class EvalCase:
    """Historical case for agent evaluation."""
    case_id: str
    input_context: dict
    expected_recommendation: str
    actual_outcome: str  # What actually happened (for backtesting)
    outcome_return: float  # If we followed this, what was return?

@dataclass
class EvalResults:
    """Aggregated evaluation metrics."""
    accuracy: float              # % correct recommendations
    calibration_error: float     # Difference between confidence and actual accuracy
    coverage: float              # % of cases with non-deferred decisions
    avg_confidence: float
    avg_latency_ms: float
    avg_cost_usd: float
    confusion_matrix: dict
    calibration_buckets: dict    # confidence bucket -> actual accuracy

class AgentEvaluator:
    """Evaluate agent performance on historical data."""

    def __init__(self, agent, tracer: AgentTracer):
        self.agent = agent
        self.tracer = tracer

    def evaluate(self, cases: list[EvalCase]) -> EvalResults:
        """Run agent on all cases and compute metrics."""
        predictions = []
        confidences = []
        actuals = []
        deferred = 0
        latencies = []
        costs = []

        for case in cases:
            trace = self.tracer.start_trace(
                self.agent.id, self.agent.version,
                str(case.input_context), case.input_context
            )

            result = self.agent.analyze(case.input_context)

            self.tracer.complete_trace(trace, result, type(result).__name__)
            latencies.append(trace.total_latency_ms)
            costs.append(trace.estimated_cost_usd)

            if hasattr(result, "recommendation"):
                predictions.append(result.recommendation.value)
                confidences.append(result.confidence)
                actuals.append(case.expected_recommendation)
            else:
                deferred += 1

        # Calculate metrics
        correct = sum(1 for p, a in zip(predictions, actuals) if p == a)
        accuracy = correct / len(predictions) if predictions else 0

        # Calibration: group by confidence bucket, check actual accuracy
        calibration = self._calculate_calibration(confidences, predictions, actuals)

        return EvalResults(
            accuracy=accuracy,
            calibration_error=calibration["error"],
            coverage=len(predictions) / len(cases),
            avg_confidence=np.mean(confidences) if confidences else 0,
            avg_latency_ms=np.mean(latencies),
            avg_cost_usd=np.mean(costs),
            confusion_matrix=self._confusion_matrix(predictions, actuals),
            calibration_buckets=calibration["buckets"]
        )

    def _calculate_calibration(self, confidences, predictions, actuals) -> dict:
        """Check if stated confidence matches actual accuracy."""
        buckets = {
            "0.5-0.6": {"correct": 0, "total": 0},
            "0.6-0.7": {"correct": 0, "total": 0},
            "0.7-0.8": {"correct": 0, "total": 0},
            "0.8-0.9": {"correct": 0, "total": 0},
            "0.9-1.0": {"correct": 0, "total": 0},
        }

        for conf, pred, actual in zip(confidences, predictions, actuals):
            bucket = self._get_bucket(conf)
            buckets[bucket]["total"] += 1
            if pred == actual:
                buckets[bucket]["correct"] += 1

        # Calculate calibration error
        errors = []
        for bucket, stats in buckets.items():
            if stats["total"] > 0:
                expected = float(bucket.split("-")[0])
                actual_acc = stats["correct"] / stats["total"]
                errors.append(abs(expected - actual_acc))

        return {
            "buckets": buckets,
            "error": np.mean(errors) if errors else 0
        }

    def backtest_returns(self, cases: list[EvalCase]) -> dict:
        """What returns would we have achieved following agent advice?"""
        agent_returns = []
        baseline_returns = []

        for case in cases:
            result = self.agent.analyze(case.input_context)

            if hasattr(result, "recommendation") and result.recommendation.value != "hold":
                # Agent made a directional call
                if result.recommendation.value == case.actual_outcome:
                    agent_returns.append(abs(case.outcome_return))
                else:
                    agent_returns.append(-abs(case.outcome_return))
            else:
                agent_returns.append(0)  # Held or deferred

            baseline_returns.append(case.outcome_return)

        return {
            "agent_total_return": sum(agent_returns),
            "baseline_total_return": sum(baseline_returns),
            "agent_sharpe": np.mean(agent_returns) / np.std(agent_returns) if agent_returns else 0,
            "hit_rate": sum(1 for r in agent_returns if r > 0) / len(agent_returns)
        }`}
          </Code>

          <h3 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--color-text-primary)" }}>Production Deployment Patterns</h3>
          <p>
            Scale agents with <strong>stateless execution</strong> (no in-memory state between calls), <strong>session persistence</strong> (DynamoDB for multi-turn), <strong>version tracking</strong> (which agent version made each decision), and <strong>cost controls</strong> (budget limits per agent/user).
          </p>
          <Code title="Production agent deployment">
{`import boto3
from datetime import datetime
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
sessions_table = dynamodb.Table("agent-sessions")
budgets_table = dynamodb.Table("agent-budgets")

class ProductionAgentRuntime:
    """Production-ready agent runtime with scaling and cost control."""

    def __init__(self, agent_registry: dict, tracer: AgentTracer):
        self.agents = agent_registry  # version -> agent instance
        self.tracer = tracer
        self.default_budget_usd = 10.0  # Per session

    def invoke(
        self,
        agent_id: str,
        agent_version: str,
        session_id: str,
        user_input: str,
        user_id: str
    ) -> dict:
        """Invoke agent with session management and cost control."""

        # Check budget
        budget = self._get_remaining_budget(user_id, session_id)
        if budget <= 0:
            return {"error": "Budget exceeded", "remaining_budget": 0}

        # Load session state (multi-turn memory)
        session = self._load_session(session_id)

        # Get agent version
        agent = self.agents.get(f"{agent_id}:{agent_version}")
        if not agent:
            return {"error": f"Agent not found: {agent_id}:{agent_version}"}

        # Start trace
        trace = self.tracer.start_trace(
            agent_id, agent_version, user_input,
            {"session": session, "user_id": user_id}
        )

        # Execute agent
        try:
            result = agent.run(
                user_input=user_input,
                context=session.get("context", {}),
                history=session.get("history", [])
            )

            # Update session
            session["history"].append({
                "role": "user", "content": user_input
            })
            session["history"].append({
                "role": "assistant", "content": str(result)
            })
            self._save_session(session_id, session)

            # Complete trace and deduct cost
            self.tracer.complete_trace(trace, result, type(result).__name__)
            self._deduct_cost(user_id, session_id, trace.estimated_cost_usd)

            return {
                "result": result,
                "trace_id": trace.trace_id,
                "cost_usd": trace.estimated_cost_usd,
                "remaining_budget": budget - trace.estimated_cost_usd
            }

        except Exception as e:
            trace.error = str(e)
            self.tracer.complete_trace(trace, None, "error")
            return {"error": str(e), "trace_id": trace.trace_id}

    def _load_session(self, session_id: str) -> dict:
        """Load session from DynamoDB."""
        response = sessions_table.get_item(Key={"session_id": session_id})
        if "Item" in response:
            return response["Item"]
        return {"session_id": session_id, "context": {}, "history": [], "created_at": datetime.utcnow().isoformat()}

    def _save_session(self, session_id: str, session: dict):
        """Save session to DynamoDB."""
        session["updated_at"] = datetime.utcnow().isoformat()
        sessions_table.put_item(Item=session)

    def _get_remaining_budget(self, user_id: str, session_id: str) -> float:
        """Get remaining budget for user/session."""
        response = budgets_table.get_item(Key={"user_id": user_id})
        if "Item" in response:
            return float(response["Item"].get("remaining", self.default_budget_usd))
        return self.default_budget_usd

    def _deduct_cost(self, user_id: str, session_id: str, cost: float):
        """Deduct cost from budget."""
        budgets_table.update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET remaining = if_not_exists(remaining, :default) - :cost",
            ExpressionAttributeValues={
                ":cost": Decimal(str(cost)),
                ":default": Decimal(str(self.default_budget_usd))
            }
        )

# Lambda handler for serverless deployment
def lambda_handler(event, context):
    """AWS Lambda entry point for agent invocation."""
    runtime = ProductionAgentRuntime(AGENT_REGISTRY, TRACER)

    return runtime.invoke(
        agent_id=event["agent_id"],
        agent_version=event.get("version", "latest"),
        session_id=event["session_id"],
        user_input=event["input"],
        user_id=event["user_id"]
    )`}
          </Code>

          <Callout type="insight" title="Investment application">
            Research agents can gather data from multiple sources (SEC filings, earnings calls, news), analyze patterns, and propose investment theses — with human approval before any action. The key is designing clear tool boundaries, structured outputs with citations, and full audit trails for compliance.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "human-in-the-loop",
      title: "Human-in-the-Loop Systems",
      subtitle: "Keeping humans in control of AI decisions",
      content: (
        <Prose>
          <p>
            <strong>Human-in-the-loop (HITL)</strong> systems ensure AI decisions are reviewed by humans before execution. This is essential for high-stakes domains like finance, healthcare, and legal — where AI errors have real consequences. The architecture balances automation benefits with human oversight requirements.
          </p>
          <p>
            The core pattern is an <strong>approval workflow</strong>: AI proposes an action, it enters a review queue, a human approves/rejects/modifies, then the system executes (or doesn't). Key design decisions: <strong>what requires approval</strong> (threshold-based: amount, confidence, novelty), <strong>who approves</strong> (role-based routing), <strong>timeout handling</strong> (escalation or auto-reject), and <strong>feedback capture</strong> (improve the AI from corrections).
          </p>
          <Code title="Human approval workflow with Step Functions">
{`import boto3
import json
from datetime import datetime
from enum import Enum

sfn = boto3.client("stepfunctions")
dynamodb = boto3.resource("dynamodb")
approvals_table = dynamodb.Table("pending-approvals")

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ESCALATED = "escalated"

class ApprovalWorkflow:
    """Human-in-the-loop approval system."""

    def __init__(self, approval_rules: dict):
        self.rules = approval_rules  # Thresholds for auto-approve vs require review

    def submit_for_approval(
        self,
        action_type: str,
        payload: dict,
        proposed_by: str,
        task_token: str  # Step Functions callback token
    ) -> str:
        """Submit action for human review."""
        approval_id = f"approval-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{action_type}"

        # Check if auto-approval is possible
        if self._can_auto_approve(action_type, payload):
            self._complete_approval(task_token, approved=True, approver="AUTO")
            return approval_id

        # Determine approver based on rules
        required_approver = self._get_required_approver(action_type, payload)

        # Store pending approval
        approvals_table.put_item(Item={
            "approval_id": approval_id,
            "action_type": action_type,
            "payload": json.dumps(payload),
            "proposed_by": proposed_by,
            "required_approver": required_approver,
            "task_token": task_token,
            "status": ApprovalStatus.PENDING.value,
            "created_at": datetime.utcnow().isoformat(),
            "ttl": int(datetime.utcnow().timestamp()) + 86400  # 24h expiry
        })

        # Notify approver (SNS, Slack, email)
        self._notify_approver(approval_id, required_approver, action_type, payload)

        return approval_id

    def process_decision(
        self,
        approval_id: str,
        approved: bool,
        approver: str,
        comments: str = None
    ):
        """Process human decision on pending approval."""
        # Get pending approval
        response = approvals_table.get_item(Key={"approval_id": approval_id})
        item = response.get("Item")

        if not item or item["status"] != ApprovalStatus.PENDING.value:
            raise ValueError(f"Invalid or already processed: {approval_id}")

        # Update approval record
        approvals_table.update_item(
            Key={"approval_id": approval_id},
            UpdateExpression="SET #status = :status, approver = :approver, decided_at = :now, comments = :comments",
            ExpressionAttributeNames={"#status": "status"},
            ExpressionAttributeValues={
                ":status": ApprovalStatus.APPROVED.value if approved else ApprovalStatus.REJECTED.value,
                ":approver": approver,
                ":now": datetime.utcnow().isoformat(),
                ":comments": comments
            }
        )

        # Resume Step Functions workflow
        self._complete_approval(item["task_token"], approved, approver)

        # Log for audit trail
        self._log_audit_event(approval_id, approved, approver, comments)

    def _complete_approval(self, task_token: str, approved: bool, approver: str):
        """Send result back to Step Functions."""
        if approved:
            sfn.send_task_success(
                taskToken=task_token,
                output=json.dumps({"approved": True, "approver": approver})
            )
        else:
            sfn.send_task_failure(
                taskToken=task_token,
                error="ActionRejected",
                cause=f"Rejected by {approver}"
            )

    def _can_auto_approve(self, action_type: str, payload: dict) -> bool:
        """Check if action meets auto-approval criteria."""
        rules = self.rules.get(action_type, {})
        max_auto_amount = rules.get("max_auto_amount", 0)
        amount = payload.get("amount", float("inf"))
        return amount <= max_auto_amount

    def _get_required_approver(self, action_type: str, payload: dict) -> str:
        """Determine who should approve based on rules."""
        rules = self.rules.get(action_type, {})
        amount = payload.get("amount", 0)

        # Escalation tiers
        if amount > rules.get("senior_threshold", float("inf")):
            return "investment_committee"
        elif amount > rules.get("manager_threshold", float("inf")):
            return "portfolio_manager"
        else:
            return "analyst"`}
          </Code>
          <p>
            <strong>Confidence-based routing</strong> is a powerful pattern: AI decisions with high confidence proceed automatically, while low-confidence decisions require human review. This maximizes automation while catching uncertain cases. Track accuracy per confidence bucket to calibrate thresholds.
          </p>
          <Code title="Confidence-based approval routing">
{`class ConfidenceRouter:
    """Route decisions based on AI confidence levels."""

    def __init__(self, thresholds: dict):
        # Example: {"auto_approve": 0.95, "single_review": 0.80, "committee": 0.60}
        self.thresholds = thresholds

    def route_decision(self, prediction: dict) -> str:
        """Determine routing based on confidence."""
        confidence = prediction.get("confidence", 0)

        if confidence >= self.thresholds["auto_approve"]:
            return "auto_approve"
        elif confidence >= self.thresholds["single_review"]:
            return "single_review"
        elif confidence >= self.thresholds["committee"]:
            return "committee_review"
        else:
            return "reject_low_confidence"

    def update_thresholds_from_feedback(self, feedback_data: list[dict]):
        """Adjust thresholds based on human feedback accuracy."""
        # Track: for each confidence bucket, what % were correct?
        # If high-confidence decisions are often overturned, lower threshold

        buckets = {
            "0.9-1.0": {"correct": 0, "total": 0},
            "0.8-0.9": {"correct": 0, "total": 0},
            "0.6-0.8": {"correct": 0, "total": 0},
        }

        for item in feedback_data:
            conf = item["confidence"]
            human_agreed = item["human_approved"] == item["ai_recommended"]

            bucket = self._get_bucket(conf)
            buckets[bucket]["total"] += 1
            if human_agreed:
                buckets[bucket]["correct"] += 1

        # Adjust auto-approve threshold to maintain 98% accuracy
        for bucket, stats in buckets.items():
            if stats["total"] > 100:  # Enough data
                accuracy = stats["correct"] / stats["total"]
                if accuracy < 0.98 and bucket == "0.9-1.0":
                    self.thresholds["auto_approve"] = 0.98  # Raise bar`}
          </Code>
          <p>
            <strong>Audit trails</strong> are non-negotiable for regulated industries. Every AI decision must be logged with: what was proposed, what context was available, what the AI reasoned, who approved it, and what actually happened. Use immutable storage (S3 with versioning or append-only DynamoDB tables).
          </p>
          <Callout type="warning" title="Compliance requirement">
            In financial services, regulators require demonstrable human oversight of AI systems. The audit trail must prove that humans reviewed and approved significant decisions. Design your HITL system with regulatory audits in mind.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "llm-infrastructure",
      title: "LLM System Architecture",
      subtitle: "Production infrastructure for language models",
      content: (
        <Prose>
          <p>
            Production LLM systems require infrastructure beyond the model itself: <strong>prompt management</strong> (versioning, A/B testing), <strong>retrieval augmentation</strong> (RAG pipelines), <strong>semantic caching</strong> (cost reduction), <strong>model routing</strong> (cost/latency optimization), and <strong>streaming infrastructure</strong> (real-time responses). Each component needs careful design for reliability and cost control.
          </p>
          <p>
            <strong>Prompt management</strong> treats prompts as code: version controlled, tested, and deployed through CI/CD. Separate prompt templates from application code. A/B test prompt variations to optimize for quality metrics. Roll back bad prompts quickly without code deployments.
          </p>
          <Code title="Prompt management system">
{`import json
from dataclasses import dataclass
from typing import Optional
import hashlib

@dataclass
class PromptVersion:
    id: str
    template: str
    version: int
    variables: list[str]
    metadata: dict

class PromptManager:
    """Versioned prompt management with A/B testing."""

    def __init__(self, dynamodb_table, s3_bucket):
        self.db = dynamodb_table
        self.s3 = s3_bucket
        self.cache = {}  # Local cache for hot prompts

    def get_prompt(self, prompt_id: str, version: Optional[int] = None) -> PromptVersion:
        """Get prompt template, optionally specific version."""
        cache_key = f"{prompt_id}:{version or 'latest'}"

        if cache_key in self.cache:
            return self.cache[cache_key]

        if version:
            response = self.db.get_item(Key={"prompt_id": prompt_id, "version": version})
        else:
            # Get latest version
            response = self.db.query(
                KeyConditionExpression="prompt_id = :pid",
                ExpressionAttributeValues={":pid": prompt_id},
                ScanIndexForward=False,
                Limit=1
            )
            response = {"Item": response["Items"][0]} if response["Items"] else {}

        item = response.get("Item")
        if not item:
            raise ValueError(f"Prompt not found: {prompt_id}")

        prompt = PromptVersion(
            id=item["prompt_id"],
            template=item["template"],
            version=item["version"],
            variables=item.get("variables", []),
            metadata=item.get("metadata", {})
        )

        self.cache[cache_key] = prompt
        return prompt

    def render(self, prompt_id: str, variables: dict, version: Optional[int] = None) -> str:
        """Render prompt with variables."""
        prompt = self.get_prompt(prompt_id, version)

        # Validate all required variables provided
        missing = set(prompt.variables) - set(variables.keys())
        if missing:
            raise ValueError(f"Missing variables: {missing}")

        return prompt.template.format(**variables)

    def create_version(self, prompt_id: str, template: str, variables: list[str], metadata: dict = None) -> int:
        """Create new prompt version."""
        # Get current latest version
        try:
            current = self.get_prompt(prompt_id)
            new_version = current.version + 1
        except ValueError:
            new_version = 1

        self.db.put_item(Item={
            "prompt_id": prompt_id,
            "version": new_version,
            "template": template,
            "variables": variables,
            "metadata": metadata or {},
            "created_at": datetime.utcnow().isoformat()
        })

        # Invalidate cache
        self.cache.pop(f"{prompt_id}:latest", None)

        return new_version

    def get_ab_variant(self, prompt_id: str, user_id: str) -> PromptVersion:
        """Get A/B test variant based on user bucketing."""
        # Consistent hashing for stable bucket assignment
        bucket = int(hashlib.md5(f"{prompt_id}:{user_id}".encode()).hexdigest(), 16) % 100

        # Get active experiment config
        experiment = self.db.get_item(Key={"prompt_id": f"experiment:{prompt_id}"}).get("Item")

        if not experiment or not experiment.get("active"):
            return self.get_prompt(prompt_id)

        # Route to variant based on bucket
        for variant in experiment["variants"]:
            if bucket < variant["bucket_end"]:
                return self.get_prompt(prompt_id, variant["version"])

        return self.get_prompt(prompt_id)`}
          </Code>
          <p>
            <strong>Semantic caching</strong> stores responses for similar queries, not just exact matches. Hash the prompt embedding and check for near-matches. This can reduce token costs by 40-80% for repetitive workloads. Key considerations: cache TTL (information freshness), similarity threshold (precision/recall tradeoff), and cache invalidation (when source data changes).
          </p>
          <Code title="Semantic caching for LLM responses">
{`import hashlib
import numpy as np
from typing import Optional

class SemanticCache:
    """Cache LLM responses using semantic similarity."""

    def __init__(self, vector_store, redis_client, similarity_threshold: float = 0.92):
        self.vectors = vector_store
        self.redis = redis_client
        self.threshold = similarity_threshold

    def get(self, query: str, context_hash: str = "") -> Optional[str]:
        """Check cache for semantically similar query."""
        # Generate embedding for query
        query_embedding = self._embed(query)

        # Search for similar queries in vector store
        results = self.vectors.search(
            vector=query_embedding,
            top_k=1,
            filter={"context_hash": context_hash} if context_hash else None
        )

        if results and results[0].score >= self.threshold:
            # Cache hit - retrieve response from Redis
            cache_key = results[0].metadata["cache_key"]
            cached = self.redis.get(cache_key)
            if cached:
                return cached.decode()

        return None

    def set(self, query: str, response: str, context_hash: str = "", ttl: int = 3600):
        """Store query-response pair in cache."""
        query_embedding = self._embed(query)
        cache_key = hashlib.sha256(f"{query}:{context_hash}".encode()).hexdigest()

        # Store embedding in vector store
        self.vectors.upsert(
            id=cache_key,
            vector=query_embedding,
            metadata={
                "cache_key": cache_key,
                "context_hash": context_hash,
                "query_preview": query[:100]
            }
        )

        # Store response in Redis with TTL
        self.redis.setex(cache_key, ttl, response)

    def invalidate_by_context(self, context_hash: str):
        """Invalidate all cache entries for a context (e.g., when source docs change)."""
        # Query all entries with this context
        results = self.vectors.query(
            filter={"context_hash": context_hash},
            top_k=1000
        )

        # Delete from both stores
        for r in results:
            self.redis.delete(r.metadata["cache_key"])
            self.vectors.delete(r.id)

    def _embed(self, text: str) -> list[float]:
        # Use embedding model (Bedrock Titan, OpenAI, etc.)
        return embedding_model.embed(text)`}
          </Code>
          <p>
            <strong>Model routing</strong> selects the optimal model per request based on complexity, cost, and latency requirements. Simple queries go to fast/cheap models (GPT-4o-mini), complex reasoning to capable models (Claude), and sensitive data to on-premise models. A classifier (often a small LLM) determines routing.
          </p>
          <Callout type="tip" title="Cost optimization">
            Combine semantic caching + model routing for maximum savings. In production, semantic caching alone can reduce costs by 50%+. Adding model routing for simple queries saves another 30-40%. Monitor cache hit rates and model distribution to optimize thresholds.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "guardrails",
      title: "Guardrails & Safety Patterns",
      subtitle: "Preventing AI systems from causing harm",
      content: (
        <Prose>
          <p>
            <strong>AI guardrails</strong> are defensive measures that prevent AI systems from causing harm — whether through malicious input, hallucinations, excessive costs, or unauthorized actions. Defense in depth applies: multiple layers of validation at input, processing, output, and action stages.
          </p>
          <p>
            <strong>Input validation</strong> is the first line of defense. Detect prompt injection attacks (attempts to override system instructions), validate input schemas, enforce rate limits, and check content policies. AWS Bedrock Guardrails provides managed input filtering; for custom logic, implement pre-processing Lambda functions.
          </p>
          <Code title="Input validation layer">
{`import re
from dataclasses import dataclass
from typing import Optional
from enum import Enum

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    BLOCKED = "blocked"

@dataclass
class ValidationResult:
    allowed: bool
    risk_level: RiskLevel
    issues: list[str]
    sanitized_input: Optional[str] = None

class InputGuardrails:
    """Input validation and sanitization for LLM requests."""

    # Patterns that may indicate prompt injection
    INJECTION_PATTERNS = [
        r"ignore (all )?(previous|prior|above) instructions",
        r"disregard (all )?(previous|prior|above)",
        r"you are now",
        r"new persona",
        r"override.*system",
        r"forget everything",
        r"\\[INST\\]",  # Llama instruction markers
        r"<\\|.*\\|>",  # Special tokens
    ]

    def __init__(self, max_length: int = 10000, blocked_terms: list[str] = None):
        self.max_length = max_length
        self.blocked_terms = blocked_terms or []
        self.injection_regex = re.compile("|".join(self.INJECTION_PATTERNS), re.IGNORECASE)

    def validate(self, user_input: str, context: dict = None) -> ValidationResult:
        """Validate user input and return risk assessment."""
        issues = []
        risk_level = RiskLevel.LOW

        # Length check
        if len(user_input) > self.max_length:
            issues.append(f"Input exceeds max length ({self.max_length})")
            risk_level = RiskLevel.BLOCKED
            return ValidationResult(False, risk_level, issues)

        # Prompt injection detection
        if self.injection_regex.search(user_input):
            issues.append("Potential prompt injection detected")
            risk_level = RiskLevel.HIGH

        # Blocked terms
        for term in self.blocked_terms:
            if term.lower() in user_input.lower():
                issues.append(f"Blocked term detected: {term}")
                risk_level = RiskLevel.BLOCKED

        # Check for attempts to access restricted data
        if context and context.get("user_role") != "admin":
            restricted_patterns = [
                r"(all|every) (user|customer|client)",
                r"(salary|compensation|ssn|social security)",
                r"(password|credential|secret|key)",
            ]
            for pattern in restricted_patterns:
                if re.search(pattern, user_input, re.IGNORECASE):
                    issues.append("Attempted access to restricted data")
                    risk_level = max(risk_level, RiskLevel.MEDIUM, key=lambda x: list(RiskLevel).index(x))

        # Determine if allowed
        allowed = risk_level != RiskLevel.BLOCKED

        return ValidationResult(
            allowed=allowed,
            risk_level=risk_level,
            issues=issues,
            sanitized_input=user_input if allowed else None
        )`}
          </Code>
          <p>
            <strong>Output validation</strong> catches problems in AI responses before they reach users. Key checks: hallucination detection (verify facts against source documents), PII detection (mask or block sensitive data), format validation (ensure structured outputs match schema), and toxicity filtering.
          </p>
          <Code title="Output validation and grounding">
{`import json
import re
from typing import Optional

class OutputGuardrails:
    """Validate and filter LLM outputs before delivery."""

    # PII patterns
    PII_PATTERNS = {
        "ssn": r"\\b\\d{3}-\\d{2}-\\d{4}\\b",
        "credit_card": r"\\b\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}\\b",
        "email": r"\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
        "phone": r"\\b\\d{3}[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b",
    }

    def __init__(self, source_documents: list[str] = None):
        self.sources = source_documents or []
        self.pii_regex = {k: re.compile(v) for k, v in self.PII_PATTERNS.items()}

    def validate_output(self, response: str, expected_schema: dict = None) -> dict:
        """Validate LLM output and return filtered result."""
        issues = []
        filtered_response = response

        # PII detection and masking
        pii_found = self._detect_pii(response)
        if pii_found:
            issues.append(f"PII detected: {list(pii_found.keys())}")
            filtered_response = self._mask_pii(filtered_response, pii_found)

        # Schema validation (for structured outputs)
        if expected_schema:
            try:
                parsed = json.loads(response)
                schema_errors = self._validate_schema(parsed, expected_schema)
                if schema_errors:
                    issues.extend(schema_errors)
            except json.JSONDecodeError:
                issues.append("Response is not valid JSON")

        # Factual grounding check
        if self.sources:
            ungrounded_claims = self._check_grounding(response)
            if ungrounded_claims:
                issues.append(f"Potentially ungrounded claims: {len(ungrounded_claims)}")

        return {
            "original": response,
            "filtered": filtered_response,
            "issues": issues,
            "passed": len(issues) == 0
        }

    def _detect_pii(self, text: str) -> dict[str, list[str]]:
        """Detect PII in text."""
        found = {}
        for pii_type, regex in self.pii_regex.items():
            matches = regex.findall(text)
            if matches:
                found[pii_type] = matches
        return found

    def _mask_pii(self, text: str, pii: dict[str, list[str]]) -> str:
        """Mask detected PII."""
        masked = text
        for pii_type, values in pii.items():
            for value in values:
                mask = f"[{pii_type.upper()}_REDACTED]"
                masked = masked.replace(value, mask)
        return masked

    def _check_grounding(self, response: str) -> list[str]:
        """Check if claims in response are grounded in source documents."""
        # Extract factual claims (sentences with numbers, dates, names)
        claim_pattern = r"[^.]*\\d+[^.]*\\."
        claims = re.findall(claim_pattern, response)

        ungrounded = []
        for claim in claims:
            # Check if claim appears in or is supported by sources
            if not any(self._is_supported(claim, source) for source in self.sources):
                ungrounded.append(claim.strip())

        return ungrounded

    def _is_supported(self, claim: str, source: str) -> bool:
        """Check if claim is supported by source document."""
        # Simplified: check for key term overlap
        # Production: use entailment model or semantic similarity
        claim_terms = set(claim.lower().split())
        source_terms = set(source.lower().split())
        overlap = len(claim_terms & source_terms) / len(claim_terms)
        return overlap > 0.5`}
          </Code>
          <p>
            <strong>Action safeguards</strong> prevent AI from taking harmful actions even if it "decides" to. Implement allowlists (only permitted tools), parameter limits (max trade size, max budget), confirmation gates (high-impact actions require human approval), and automatic rollback triggers.
          </p>
          <Callout type="warning" title="Defense in depth">
            No single guardrail is sufficient. Layer input validation + processing constraints + output validation + action safeguards. Monitor all layers and alert on anomalies. Assume each layer will occasionally fail — the others must catch it.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "backtesting",
      title: "Backtesting Infrastructure",
      subtitle: "Testing strategies without risking real capital",
      content: (
        <Prose>
          <p>
            <strong>Backtesting</strong> evaluates trading strategies on historical data to estimate future performance. The cardinal sin is <strong>look-ahead bias</strong> — using information that wouldn't have been available at the time. A production backtesting system must enforce <strong>point-in-time correctness</strong>: at any simulated time T, only data available before T can be used.
          </p>
          <p>
            <strong>Data versioning</strong> is essential because data changes over time. Company financials get restated. Stock splits are applied retroactively. Economic indicators are revised. Your backtest at time T must use the data <em>as it was known</em> at time T, not the current "corrected" values. This requires storing data with <strong>as-of timestamps</strong> and querying with temporal filters.
          </p>
          <Code title="Point-in-time data access">
{`from datetime import datetime, timedelta
from decimal import Decimal
from typing import Optional

class PointInTimeDataStore:
    """Historical data with point-in-time correctness."""

    def __init__(self, dynamodb_table, s3_bucket):
        self.db = dynamodb_table  # For fast lookups
        self.s3 = s3_bucket  # For bulk historical data

    def get_price(self, symbol: str, as_of: datetime) -> Optional[Decimal]:
        """Get price as known at a specific point in time."""
        # Query for most recent price BEFORE as_of
        response = self.db.query(
            KeyConditionExpression="symbol = :sym AND event_time <= :ts",
            ExpressionAttributeValues={
                ":sym": symbol,
                ":ts": as_of.isoformat()
            },
            ScanIndexForward=False,
            Limit=1
        )

        if response["Items"]:
            return response["Items"][0]["price"]
        return None

    def get_fundamental(
        self,
        symbol: str,
        metric: str,
        as_of: datetime,
        lag_days: int = 0
    ) -> Optional[dict]:
        """Get fundamental data with publication lag.

        Fundamentals aren't known until published. For quarterly earnings,
        data for Q1 (ending March 31) might not be available until May 15.
        The lag_days parameter enforces this delay.
        """
        effective_date = as_of - timedelta(days=lag_days)

        response = self.db.query(
            IndexName="fundamentals-index",
            KeyConditionExpression="symbol_metric = :key AND publication_date <= :ts",
            ExpressionAttributeValues={
                ":key": f"{symbol}#{metric}",
                ":ts": effective_date.isoformat()
            },
            ScanIndexForward=False,
            Limit=1
        )

        if response["Items"]:
            return {
                "value": response["Items"][0]["value"],
                "period_end": response["Items"][0]["period_end"],
                "publication_date": response["Items"][0]["publication_date"]
            }
        return None

    def get_prices_bulk(
        self,
        symbols: list[str],
        start: datetime,
        end: datetime
    ) -> dict[str, list[dict]]:
        """Bulk fetch price history for multiple symbols."""
        # For bulk historical data, read from S3/Parquet
        # Partitioned by date for efficient range queries

        result = {}
        for symbol in symbols:
            # Query Athena or read Parquet directly
            prices = self._query_s3_prices(symbol, start, end)
            result[symbol] = prices

        return result

    def validate_no_lookahead(self, query_time: datetime, data_time: datetime) -> bool:
        """Validate that data access doesn't have look-ahead bias."""
        if data_time > query_time:
            raise ValueError(
                f"Look-ahead bias detected: querying {data_time} from {query_time}"
            )
        return True`}
          </Code>
          <p>
            <strong>Simulation engines</strong> execute strategies against historical data. Two main approaches: <strong>event-driven</strong> (process each market event in sequence, more realistic) and <strong>vectorized</strong> (compute signals on entire arrays, much faster). Event-driven catches timing bugs; vectorized enables rapid parameter sweeps. Many systems use vectorized for screening, event-driven for final validation.
          </p>
          <Code title="Event-driven backtest engine">
{`from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from typing import Callable
from enum import Enum

class OrderSide(Enum):
    BUY = "buy"
    SELL = "sell"

@dataclass
class Order:
    symbol: str
    side: OrderSide
    quantity: Decimal
    order_type: str = "market"
    limit_price: Optional[Decimal] = None

@dataclass
class Fill:
    symbol: str
    side: OrderSide
    quantity: Decimal
    price: Decimal
    timestamp: datetime
    commission: Decimal

@dataclass
class Portfolio:
    cash: Decimal = Decimal("1000000")
    positions: dict[str, Decimal] = field(default_factory=dict)
    trades: list[Fill] = field(default_factory=list)

    def update(self, fill: Fill):
        """Update portfolio with fill."""
        multiplier = 1 if fill.side == OrderSide.BUY else -1
        cost = fill.quantity * fill.price * multiplier + fill.commission

        self.cash -= cost
        current = self.positions.get(fill.symbol, Decimal("0"))
        self.positions[fill.symbol] = current + (fill.quantity * multiplier)
        self.trades.append(fill)

    def get_value(self, prices: dict[str, Decimal]) -> Decimal:
        """Calculate total portfolio value."""
        positions_value = sum(
            qty * prices.get(sym, Decimal("0"))
            for sym, qty in self.positions.items()
        )
        return self.cash + positions_value

class BacktestEngine:
    """Event-driven backtesting engine."""

    def __init__(
        self,
        data_store: PointInTimeDataStore,
        strategy: Callable,
        commission_rate: Decimal = Decimal("0.001"),
        slippage_rate: Decimal = Decimal("0.0005")
    ):
        self.data = data_store
        self.strategy = strategy
        self.commission_rate = commission_rate
        self.slippage_rate = slippage_rate

    def run(
        self,
        symbols: list[str],
        start: datetime,
        end: datetime,
        frequency: str = "1d"
    ) -> dict:
        """Run backtest over date range."""
        portfolio = Portfolio()
        daily_values = []

        # Generate timestamps
        timestamps = self._generate_timestamps(start, end, frequency)

        for ts in timestamps:
            # Get current prices (point-in-time correct)
            prices = {
                sym: self.data.get_price(sym, ts)
                for sym in symbols
            }

            # Build market state for strategy
            market_state = {
                "timestamp": ts,
                "prices": prices,
                "portfolio": portfolio,
            }

            # Get strategy signals
            orders = self.strategy(market_state)

            # Execute orders with slippage
            for order in orders:
                fill = self._execute_order(order, prices, ts)
                if fill:
                    portfolio.update(fill)

            # Record daily value
            daily_values.append({
                "date": ts,
                "value": portfolio.get_value(prices),
                "cash": portfolio.cash
            })

        return {
            "final_portfolio": portfolio,
            "daily_values": daily_values,
            "metrics": self._calculate_metrics(daily_values)
        }

    def _execute_order(
        self,
        order: Order,
        prices: dict[str, Decimal],
        ts: datetime
    ) -> Optional[Fill]:
        """Execute order with slippage and commission."""
        if order.symbol not in prices or prices[order.symbol] is None:
            return None

        base_price = prices[order.symbol]

        # Apply slippage (worse price for us)
        if order.side == OrderSide.BUY:
            exec_price = base_price * (1 + self.slippage_rate)
        else:
            exec_price = base_price * (1 - self.slippage_rate)

        commission = exec_price * order.quantity * self.commission_rate

        return Fill(
            symbol=order.symbol,
            side=order.side,
            quantity=order.quantity,
            price=exec_price,
            timestamp=ts,
            commission=commission
        )

    def _calculate_metrics(self, daily_values: list[dict]) -> dict:
        """Calculate performance metrics."""
        values = [d["value"] for d in daily_values]
        returns = [(values[i] / values[i-1]) - 1 for i in range(1, len(values))]

        total_return = (values[-1] / values[0]) - 1
        volatility = np.std(returns) * np.sqrt(252)  # Annualized
        sharpe = (np.mean(returns) * 252) / volatility if volatility > 0 else 0

        # Max drawdown
        peak = values[0]
        max_dd = 0
        for v in values:
            peak = max(peak, v)
            dd = (peak - v) / peak
            max_dd = max(max_dd, dd)

        return {
            "total_return": float(total_return),
            "annualized_volatility": float(volatility),
            "sharpe_ratio": float(sharpe),
            "max_drawdown": float(max_dd),
            "num_trades": len(daily_values[0]["portfolio"].trades) if daily_values else 0
        }`}
          </Code>
          <p>
            <strong>Parallel backtesting</strong> enables testing thousands of parameter combinations. Use AWS Batch or Step Functions Map state to run backtests in parallel. Store results in DynamoDB or S3 for analysis. Track <strong>reproducibility</strong>: log all parameters, data versions, and code versions so any backtest can be recreated exactly.
          </p>
          <Callout type="insight" title="Overfitting warning">
            More backtests = higher risk of overfitting. If you test 1000 parameter combinations, some will look good by chance. Use holdout periods, walk-forward optimization, and out-of-sample testing to validate strategies. Track how many tests you've run.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "investment-data",
      title: "Investment Data Architecture",
      subtitle: "Managing the data that drives decisions",
      content: (
        <Prose>
          <p>
            Investment systems consume massive amounts of data from diverse sources: <strong>market data</strong> (prices, volumes, order books), <strong>fundamental data</strong> (financials, filings, estimates), <strong>alternative data</strong> (sentiment, satellite imagery, web scraping), and <strong>reference data</strong> (tickers, exchanges, corporate actions). Each has different latency requirements, update frequencies, and quality challenges.
          </p>
          <p>
            <strong>Market data architecture</strong> must handle high-frequency updates with low latency. Real-time feeds (from exchanges or vendors like Bloomberg/Refinitiv) come via WebSocket or FIX protocol. Use Kinesis for ingestion, Redis for current prices, and S3/TimescaleDB for historical. <strong>Corporate actions</strong> (splits, dividends, mergers) require retroactive adjustments to historical data.
          </p>
          <Code title="Market data ingestion pipeline">
{`import asyncio
import json
from datetime import datetime
from decimal import Decimal
import boto3

kinesis = boto3.client("kinesis")
redis = redis.Redis(host="elasticache-endpoint")

class MarketDataIngester:
    """Real-time market data ingestion pipeline."""

    def __init__(self, stream_name: str, symbols: list[str]):
        self.stream_name = stream_name
        self.symbols = set(symbols)
        self.handlers = []

    async def connect_to_feed(self, feed_url: str):
        """Connect to market data WebSocket feed."""
        async with websockets.connect(feed_url) as ws:
            # Subscribe to symbols
            await ws.send(json.dumps({
                "action": "subscribe",
                "symbols": list(self.symbols)
            }))

            async for message in ws:
                await self._process_message(json.loads(message))

    async def _process_message(self, data: dict):
        """Process incoming market data message."""
        msg_type = data.get("type")

        if msg_type == "quote":
            await self._handle_quote(data)
        elif msg_type == "trade":
            await self._handle_trade(data)
        elif msg_type == "corporate_action":
            await self._handle_corporate_action(data)

    async def _handle_quote(self, data: dict):
        """Handle quote update."""
        symbol = data["symbol"]
        timestamp = data["timestamp"]

        # Update Redis for current price (sub-ms latency access)
        quote_data = {
            "bid": str(data["bid"]),
            "ask": str(data["ask"]),
            "bid_size": str(data["bid_size"]),
            "ask_size": str(data["ask_size"]),
            "timestamp": timestamp
        }
        redis.hset(f"quote:{symbol}", mapping=quote_data)

        # Publish to Kinesis for downstream processing
        kinesis.put_record(
            StreamName=self.stream_name,
            Data=json.dumps({
                "type": "quote",
                "symbol": symbol,
                "data": quote_data
            }),
            PartitionKey=symbol  # Co-locate same symbol
        )

    async def _handle_trade(self, data: dict):
        """Handle trade tick."""
        symbol = data["symbol"]

        # Update last trade in Redis
        redis.hset(f"trade:{symbol}", mapping={
            "price": str(data["price"]),
            "size": str(data["size"]),
            "timestamp": data["timestamp"]
        })

        # Stream to Kinesis
        kinesis.put_record(
            StreamName=self.stream_name,
            Data=json.dumps({"type": "trade", **data}),
            PartitionKey=symbol
        )

    async def _handle_corporate_action(self, data: dict):
        """Handle corporate action (split, dividend, etc.)."""
        # Corporate actions require special handling
        # - Apply adjustment factor to historical prices
        # - Notify portfolio systems to adjust positions
        # - Update reference data

        action_type = data["action_type"]
        symbol = data["symbol"]

        if action_type == "split":
            # Queue adjustment job
            await self._queue_price_adjustment(
                symbol=symbol,
                adjustment_factor=Decimal(str(data["ratio"])),
                effective_date=data["effective_date"]
            )

        # Publish to corporate actions topic
        kinesis.put_record(
            StreamName=f"{self.stream_name}-corp-actions",
            Data=json.dumps(data),
            PartitionKey=symbol
        )`}
          </Code>
          <p>
            <strong>Signal generation</strong> transforms raw data into trading signals. The pipeline: raw data → features → alphas (predictive signals) → scores → positions. Each stage has its own storage: raw in S3, features in feature store, alphas in time-series DB, positions in operational DB. Signals have <strong>decay</strong> — they become stale — so freshness is critical.
          </p>
          <Code title="Alpha signal pipeline">
{`from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from typing import Optional
import numpy as np

@dataclass
class AlphaSignal:
    symbol: str
    alpha_id: str
    value: float  # Typically standardized, e.g., z-score
    confidence: float
    timestamp: datetime
    decay_hours: int = 24  # How long signal is valid

    @property
    def is_stale(self) -> bool:
        age_hours = (datetime.utcnow() - self.timestamp).total_seconds() / 3600
        return age_hours > self.decay_hours

class AlphaGenerator:
    """Generate trading signals from features."""

    def __init__(self, feature_store, alpha_store):
        self.features = feature_store
        self.alphas = alpha_store

    def generate_momentum_alpha(self, symbol: str, lookback_days: int = 20) -> AlphaSignal:
        """Simple momentum alpha: recent returns predict future returns."""
        prices = self.features.get_price_history(symbol, days=lookback_days + 1)

        if len(prices) < lookback_days:
            return None

        # Calculate momentum
        returns = np.diff(prices) / prices[:-1]
        momentum = np.sum(returns)  # Total return over period

        # Standardize to z-score
        z_score = (momentum - self._get_universe_mean()) / self._get_universe_std()

        return AlphaSignal(
            symbol=symbol,
            alpha_id="momentum_20d",
            value=float(z_score),
            confidence=0.6,  # Historical Sharpe of this signal
            timestamp=datetime.utcnow(),
            decay_hours=24
        )

    def generate_value_alpha(self, symbol: str) -> AlphaSignal:
        """Value alpha: cheap stocks outperform."""
        fundamentals = self.features.get_fundamentals(symbol)

        if not fundamentals or "pe_ratio" not in fundamentals:
            return None

        pe = fundamentals["pe_ratio"]
        sector = fundamentals.get("sector", "unknown")

        # Compare to sector average
        sector_pe = self._get_sector_average_pe(sector)
        relative_pe = pe / sector_pe if sector_pe else 1.0

        # Lower PE = higher signal (inverse relationship)
        z_score = (1 / relative_pe - 1) * 2  # Scale factor

        return AlphaSignal(
            symbol=symbol,
            alpha_id="value_pe",
            value=float(z_score),
            confidence=0.5,
            timestamp=datetime.utcnow(),
            decay_hours=168  # Weekly refresh
        )

    def combine_alphas(self, signals: list[AlphaSignal]) -> float:
        """Combine multiple alpha signals into composite score."""
        if not signals:
            return 0.0

        # Filter stale signals
        fresh_signals = [s for s in signals if not s.is_stale]

        if not fresh_signals:
            return 0.0

        # Confidence-weighted average
        total_weight = sum(s.confidence for s in fresh_signals)
        weighted_sum = sum(s.value * s.confidence for s in fresh_signals)

        return weighted_sum / total_weight if total_weight > 0 else 0.0

class PositionSizer:
    """Convert alpha scores to target positions."""

    def __init__(self, risk_budget: Decimal, max_position_pct: float = 0.05):
        self.risk_budget = risk_budget
        self.max_position_pct = max_position_pct

    def calculate_target_weights(
        self,
        scores: dict[str, float],
        volatilities: dict[str, float]
    ) -> dict[str, Decimal]:
        """Convert scores to target portfolio weights."""
        # Risk parity: higher vol = smaller position
        raw_weights = {}
        for symbol, score in scores.items():
            vol = volatilities.get(symbol, 0.2)  # Default 20% vol
            raw_weights[symbol] = score / vol if vol > 0 else 0

        # Normalize to sum to risk budget
        total = sum(abs(w) for w in raw_weights.values())
        if total == 0:
            return {}

        scale = float(self.risk_budget) / total
        normalized = {
            sym: Decimal(str(min(w * scale, self.max_position_pct)))
            for sym, w in raw_weights.items()
        }

        return normalized`}
          </Code>
          <p>
            <strong>Data reconciliation</strong> ensures internal records match external sources. Position reconciliation compares your positions against broker statements daily. Price reconciliation verifies market data against multiple sources. Breaks (discrepancies) must be investigated and resolved — they can indicate bugs, missed fills, or corporate actions.
          </p>
          <Callout type="warning" title="Data quality">
            Garbage in, garbage out. Investment decisions based on bad data are dangerous. Implement automated data quality checks: missing data detection, outlier detection, staleness alerts, and cross-source validation. Alert immediately on quality issues — don't discover them during trading.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "observability",
      title: "Observability at Scale",
      subtitle: "Distributed tracing, metrics, alerting",
      content: (
        <Prose>
          <p>
            Observability has three pillars: <strong>logs</strong> (what happened), <strong>metrics</strong> (how much/how fast), and <strong>traces</strong> (request flow across services). For distributed systems, <strong>traces</strong> are essential—they show how a single request flows through multiple services, where time is spent, and where failures occur.
          </p>
          <p>
            On AWS, <strong>CloudWatch</strong> provides logs and metrics, <strong>X-Ray</strong> provides distributed tracing, and <strong>CloudWatch Alarms</strong> with <strong>SNS</strong> handle alerting. <strong>Lambda Powertools</strong> integrates all three with minimal code. For complex systems, add <strong>CloudWatch Insights</strong> for log analysis and <strong>CloudWatch ServiceLens</strong> for service maps.
          </p>
          <Code title="Comprehensive observability with Lambda Powertools">
{`from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.metrics import MetricUnit
from aws_lambda_powertools.utilities.typing import LambdaContext
import time

logger = Logger(service="portfolio-service")
tracer = Tracer(service="portfolio-service")
metrics = Metrics(service="portfolio-service", namespace="PortfolioApp")

@logger.inject_lambda_context(log_event=True)
@tracer.capture_lambda_handler
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event: dict, context: LambdaContext) -> dict:
    """Handler with full observability."""

    # Add custom dimensions for filtering
    metrics.add_dimension(name="Environment", value="prod")

    start_time = time.time()

    try:
        # Business logic with tracing
        with tracer.capture_method("validate_request"):
            portfolio_id = validate_request(event)

        with tracer.capture_method("fetch_portfolio"):
            portfolio = fetch_portfolio(portfolio_id)

        with tracer.capture_method("calculate_metrics"):
            result = calculate_portfolio_metrics(portfolio)

        # Record success metrics
        latency = (time.time() - start_time) * 1000
        metrics.add_metric(name="RequestLatency", unit=MetricUnit.Milliseconds, value=latency)
        metrics.add_metric(name="SuccessCount", unit=MetricUnit.Count, value=1)

        # Structured logging with context
        logger.info("Portfolio calculated", extra={
            "portfolio_id": portfolio_id,
            "position_count": len(portfolio.get("positions", [])),
            "total_value": result.get("total_value"),
            "latency_ms": latency
        })

        return {"statusCode": 200, "body": result}

    except ValidationError as e:
        metrics.add_metric(name="ValidationErrors", unit=MetricUnit.Count, value=1)
        logger.warning("Validation failed", extra={"error": str(e)})
        return {"statusCode": 400, "body": {"error": str(e)}}

    except Exception as e:
        metrics.add_metric(name="ErrorCount", unit=MetricUnit.Count, value=1)
        logger.exception("Unexpected error")  # Includes stack trace
        tracer.put_annotation("error", str(e))
        raise

# CloudWatch Alarm (in CDK):
# alarm = cloudwatch.Alarm(
#     metric=metrics.metric("ErrorCount"),
#     threshold=10,
#     evaluation_periods=1,
#     alarm_actions=[sns_topic]
# )`}
          </Code>
          <Callout type="insight" title="Key metrics for ML systems">
            Beyond standard metrics, ML systems need: <strong>prediction latency</strong> (p50, p95, p99), <strong>cache hit rate</strong>, <strong>feature freshness</strong>, <strong>prediction distribution drift</strong>, and <strong>model version</strong>. Alert on latency SLA breaches and prediction drift—these indicate model degradation.
          </Callout>
        </Prose>
      ),
    },
    {
      id: "financial-patterns",
      title: "Financial System Patterns",
      subtitle: "Low-latency, compliance, risk management",
      content: (
        <Prose>
          <p>
            Financial systems have unique requirements: <strong>ultra-low latency</strong> for trading (microseconds to milliseconds), <strong>strong consistency</strong> for positions and balances, <strong>audit trails</strong> for compliance, and <strong>risk controls</strong> that cannot be bypassed. These requirements often conflict with cloud-native patterns—you may need dedicated instances, synchronous calls, and pessimistic locking where serverless and eventual consistency would normally be preferred.
          </p>
          <p>
            For <strong>market data distribution</strong>, use <strong>Kinesis</strong> for ingestion and <strong>ElastiCache (Redis) pub/sub</strong> for fan-out to consumers. For <strong>order management</strong>, use <strong>Aurora PostgreSQL</strong> with synchronous replication for ACID guarantees. For <strong>position calculations</strong>, use <strong>DynamoDB</strong> with conditional writes for atomic updates. For <strong>risk limits</strong>, implement checks both pre-trade (reject violating orders) and post-trade (alert on breaches).
          </p>
          <Code title="Position management with atomic updates">
{`import boto3
from decimal import Decimal
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource("dynamodb")
positions_table = dynamodb.Table("positions")

class PositionManager:
    """Atomic position updates with risk limit checks."""

    def __init__(self, risk_limits: dict):
        self.risk_limits = risk_limits  # symbol -> max_position

    def update_position(
        self,
        portfolio_id: str,
        symbol: str,
        quantity_delta: Decimal,
        price: Decimal
    ) -> dict:
        """Atomically update position with risk limit check."""
        max_position = Decimal(str(self.risk_limits.get(symbol, float("inf"))))

        try:
            # Atomic update with condition check
            response = positions_table.update_item(
                Key={
                    "portfolio_id": portfolio_id,
                    "symbol": symbol
                },
                UpdateExpression="""
                    SET quantity = if_not_exists(quantity, :zero) + :delta,
                        last_price = :price,
                        updated_at = :now
                """,
                ConditionExpression=(
                    Attr("quantity").not_exists() |
                    (Attr("quantity") + Attr(":delta")).between(-max_position, max_position)
                ),
                ExpressionAttributeValues={
                    ":delta": quantity_delta,
                    ":price": price,
                    ":now": datetime.utcnow().isoformat(),
                    ":zero": Decimal("0"),
                },
                ReturnValues="ALL_NEW"
            )

            return {
                "status": "success",
                "position": response["Attributes"]
            }

        except dynamodb.meta.client.exceptions.ConditionalCheckFailedException:
            # Position limit would be breached
            return {
                "status": "rejected",
                "reason": f"Would exceed position limit of {max_position} for {symbol}"
            }

    def get_portfolio_risk(self, portfolio_id: str) -> dict:
        """Calculate portfolio-level risk metrics."""
        response = positions_table.query(
            KeyConditionExpression=Key("portfolio_id").eq(portfolio_id)
        )

        positions = response["Items"]
        total_exposure = sum(
            abs(p["quantity"] * p["last_price"]) for p in positions
        )

        return {
            "total_exposure": total_exposure,
            "position_count": len(positions),
            "largest_position": max(positions, key=lambda p: abs(p["quantity"] * p["last_price"]))
        }`}
          </Code>
          <Callout type="warning" title="Compliance requirements">
            Financial systems must maintain <strong>complete audit trails</strong>. Use DynamoDB Streams or change data capture to record all state changes to an immutable audit log (S3 with versioning, or a separate audit table). Include: who made the change, when, what changed, and why (order ID, approval ID, etc.).
          </Callout>
        </Prose>
      ),
    },
  ],

  operations: [
    { name: "Cache lookup (Redis)", time: "O(1)", space: "O(n)", note: "Sub-millisecond" },
    { name: "DynamoDB get item", time: "O(1)", space: "O(1)", note: "Single-digit ms" },
    { name: "DynamoDB query", time: "O(log n + k)", space: "O(k)", note: "k = results" },
    { name: "Load balancer routing", time: "O(1)", space: "O(k)", note: "k = servers" },
    { name: "Kinesis put record", time: "O(1)", space: "O(n)", note: "~5ms" },
    { name: "Lambda cold start", time: "O(1)", space: "O(1)", note: "100ms-1s" },
    { name: "S3 get object", time: "O(1)", space: "O(n)", note: "~50-100ms" },
    { name: "Consistent hashing", time: "O(log k)", space: "O(k)", note: "k = nodes" },
  ],

  patterns: [
    {
      name: "Circuit Breaker",
      description: "Fail fast when downstream services are unhealthy to prevent cascade failures.",
      explanation: `The **circuit breaker** pattern prevents cascade failures in distributed systems. When a downstream service starts failing, the circuit breaker "opens" and immediately rejects requests instead of waiting for timeouts. After a recovery period, it enters "half-open" state to test if the service recovered.

In financial systems, circuit breakers are critical for external API calls (market data providers, execution venues). Without them, a slow or failing external service can exhaust connection pools and bring down your entire system. Implement circuit breakers around all external calls with configurable thresholds.

AWS provides managed circuit breakers in **App Mesh** and **API Gateway**. For Lambda, implement in code using libraries like **tenacity** or custom state in DynamoDB/ElastiCache. Track circuit state in metrics for operational visibility.`,
      triggers: "external API calls, downstream services, cascade failures, resilience, fault tolerance",
      code: `from enum import Enum
from dataclasses import dataclass
import time
import threading

class CircuitState(Enum):
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Failing, reject requests
    HALF_OPEN = "half_open" # Testing recovery

@dataclass
class CircuitBreaker:
    """Circuit breaker with thread-safe state management."""

    failure_threshold: int = 5
    recovery_timeout: float = 30.0
    half_open_max_calls: int = 3

    def __post_init__(self):
        self.failures = 0
        self.successes_in_half_open = 0
        self.state = CircuitState.CLOSED
        self.last_failure_time = 0.0
        self.lock = threading.Lock()

    def call(self, func, *args, **kwargs):
        with self.lock:
            if self.state == CircuitState.OPEN:
                if time.time() - self.last_failure_time > self.recovery_timeout:
                    self.state = CircuitState.HALF_OPEN
                    self.successes_in_half_open = 0
                else:
                    raise CircuitOpenError("Circuit breaker is OPEN")

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise

    def _on_success(self):
        with self.lock:
            if self.state == CircuitState.HALF_OPEN:
                self.successes_in_half_open += 1
                if self.successes_in_half_open >= self.half_open_max_calls:
                    self.state = CircuitState.CLOSED
                    self.failures = 0
            else:
                self.failures = 0

    def _on_failure(self):
        with self.lock:
            self.failures += 1
            self.last_failure_time = time.time()
            if self.failures >= self.failure_threshold:
                self.state = CircuitState.OPEN

# Usage
market_data_circuit = CircuitBreaker(failure_threshold=3, recovery_timeout=60)

def get_market_data(symbol: str):
    return market_data_circuit.call(external_api.get_price, symbol)`,
    },
    {
      name: "Retry with Exponential Backoff",
      description: "Retry failed operations with increasing delays to handle transient failures.",
      explanation: `**Exponential backoff** handles transient failures by retrying with increasing delays. Each retry waits longer: 1s, 2s, 4s, 8s, etc. Add **jitter** (random variation) to prevent thundering herd problems when many clients retry simultaneously.

Critical for AWS API calls which have rate limits and transient errors. DynamoDB, S3, and Bedrock all recommend exponential backoff in their SDKs. The AWS SDK includes automatic retries, but you may need custom retry logic for business-specific conditions.

Key considerations: set a **maximum retry count** (typically 3-5), set a **maximum delay** cap (e.g., 60 seconds), and make operations **idempotent** since retries may execute multiple times. For financial transactions, use idempotency keys to prevent duplicate processing.`,
      triggers: "transient failures, rate limiting, API calls, resilience, thundering herd",
      code: `import time
import random
from functools import wraps
from typing import Callable, Type

def retry_with_backoff(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    jitter: bool = True,
    retryable_exceptions: tuple[Type[Exception], ...] = (Exception,)
):
    """Decorator for retry with exponential backoff and jitter."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except retryable_exceptions as e:
                    last_exception = e

                    if attempt == max_retries:
                        raise

                    # Calculate delay with exponential backoff
                    delay = min(
                        base_delay * (exponential_base ** attempt),
                        max_delay
                    )

                    # Add jitter to prevent thundering herd
                    if jitter:
                        delay *= (0.5 + random.random())

                    print(f"Retry {attempt + 1}/{max_retries} after {delay:.2f}s: {e}")
                    time.sleep(delay)

            raise last_exception
        return wrapper
    return decorator

# Usage with idempotency for financial operations
@retry_with_backoff(
    max_retries=3,
    retryable_exceptions=(ConnectionError, TimeoutError)
)
def submit_order(order: dict, idempotency_key: str):
    """Submit order with idempotency key for safe retries."""
    return trading_api.submit(
        order=order,
        headers={"Idempotency-Key": idempotency_key}
    )`,
    },
    {
      name: "DynamoDB Single-Table Design",
      description: "Store multiple entity types in one table for efficient access patterns.",
      explanation: `**Single-table design** stores multiple entity types (users, orders, products) in one DynamoDB table using composite keys. This enables fetching related entities in a single query, reducing latency and cost. The tradeoff is complexity—you need to carefully design key schemas and use GSIs for alternative access patterns.

The pattern uses **overloaded keys**: partition key might be "USER#123" or "ORDER#456", sort key might be "METADATA" or "ITEM#789". Query by partition key to get all related items. For example, PK="PORTFOLIO#123" returns the portfolio metadata and all positions in one query.

For financial systems, single-table design is excellent for portfolios (portfolio + positions + trades), orders (order + fills + amendments), and client data (client + accounts + preferences). Use GSIs sparingly—they add cost and have eventual consistency.`,
      triggers: "DynamoDB, NoSQL, data modeling, access patterns, query optimization",
      code: `import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal
from typing import TypedDict

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("financial-data")

# Key schema examples:
# PK: PORTFOLIO#<id>, SK: METADATA | POSITION#<symbol> | TRADE#<timestamp>
# PK: CLIENT#<id>, SK: METADATA | ACCOUNT#<id> | PREFERENCE#<key>

class SingleTableAccess:
    """Access patterns for single-table design."""

    @staticmethod
    def get_portfolio_with_positions(portfolio_id: str) -> dict:
        """Single query: portfolio + all positions."""
        response = table.query(
            KeyConditionExpression=Key("PK").eq(f"PORTFOLIO#{portfolio_id}")
        )

        result = {"portfolio": None, "positions": []}
        for item in response["Items"]:
            if item["SK"] == "METADATA":
                result["portfolio"] = item
            elif item["SK"].startswith("POSITION#"):
                result["positions"].append(item)

        return result

    @staticmethod
    def get_trades_for_symbol(symbol: str, limit: int = 100) -> list:
        """Query trades by symbol using GSI."""
        response = table.query(
            IndexName="GSI1",
            KeyConditionExpression=Key("GSI1PK").eq(f"SYMBOL#{symbol}"),
            ScanIndexForward=False,  # Most recent first
            Limit=limit
        )
        return response["Items"]

    @staticmethod
    def put_position(portfolio_id: str, symbol: str, quantity: Decimal, price: Decimal):
        """Upsert position with conditional write."""
        table.put_item(
            Item={
                "PK": f"PORTFOLIO#{portfolio_id}",
                "SK": f"POSITION#{symbol}",
                "symbol": symbol,
                "quantity": quantity,
                "avg_price": price,
                "market_value": quantity * price,
                "GSI1PK": f"SYMBOL#{symbol}",  # For querying by symbol
                "GSI1SK": portfolio_id,
                "entity_type": "POSITION"
            }
        )

    @staticmethod
    def record_trade(portfolio_id: str, trade: dict):
        """Record trade with TTL for historical cleanup."""
        import time
        timestamp = trade["timestamp"]

        table.put_item(
            Item={
                "PK": f"PORTFOLIO#{portfolio_id}",
                "SK": f"TRADE#{timestamp}",
                "symbol": trade["symbol"],
                "side": trade["side"],
                "quantity": Decimal(str(trade["quantity"])),
                "price": Decimal(str(trade["price"])),
                "GSI1PK": f"SYMBOL#{trade['symbol']}",
                "GSI1SK": timestamp,
                "entity_type": "TRADE",
                "ttl": int(time.time()) + (365 * 24 * 3600)  # 1 year TTL
            }
        )`,
    },
    {
      name: "Step Functions Workflow",
      description: "Orchestrate complex multi-step workflows with built-in error handling.",
      explanation: `**AWS Step Functions** orchestrates complex workflows as state machines. Each step can invoke Lambda, call AWS services directly, or wait for human approval. Built-in error handling, retries, and timeouts make it ideal for long-running processes that need durability.

For ML systems, Step Functions orchestrates training pipelines: data validation → feature engineering → model training → evaluation → deployment. For financial systems, it handles trade workflows: validation → risk check → approval → execution → settlement. The workflow state persists automatically—if a step fails, you can resume from where it left off.

Use **Express workflows** for high-volume, short-duration tasks (under 5 minutes). Use **Standard workflows** for long-running processes (up to 1 year). Integrate with EventBridge for event-driven triggering.`,
      triggers: "workflows, orchestration, long-running processes, state machines, error handling",
      code: `import boto3
import json
from datetime import datetime

sfn = boto3.client("stepfunctions")

# Step Functions state machine definition (JSON in CDK/CloudFormation)
STATE_MACHINE_DEFINITION = {
    "StartAt": "ValidateOrder",
    "States": {
        "ValidateOrder": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:validate-order",
            "Next": "CheckRiskLimits",
            "Retry": [{"ErrorEquals": ["States.TaskFailed"], "MaxAttempts": 2}],
            "Catch": [{"ErrorEquals": ["ValidationError"], "Next": "RejectOrder"}]
        },
        "CheckRiskLimits": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:check-risk",
            "Next": "RequiresApproval"
        },
        "RequiresApproval": {
            "Type": "Choice",
            "Choices": [
                {
                    "Variable": "$.requires_approval",
                    "BooleanEquals": True,
                    "Next": "WaitForApproval"
                }
            ],
            "Default": "ExecuteOrder"
        },
        "WaitForApproval": {
            "Type": "Task",
            "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
            "Parameters": {
                "FunctionName": "request-approval",
                "Payload": {"order.$": "$", "token.$": "$$.Task.Token"}
            },
            "TimeoutSeconds": 86400,  # 24 hour approval timeout
            "Next": "ExecuteOrder"
        },
        "ExecuteOrder": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:execute-order",
            "End": True
        },
        "RejectOrder": {
            "Type": "Task",
            "Resource": "arn:aws:lambda:...:reject-order",
            "End": True
        }
    }
}

def start_order_workflow(order: dict) -> str:
    """Start order workflow execution."""
    response = sfn.start_execution(
        stateMachineArn="arn:aws:states:...:order-workflow",
        name=f"order-{order['id']}-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        input=json.dumps(order)
    )
    return response["executionArn"]

def approve_order(task_token: str, approved: bool, approver: str):
    """Complete approval task from external system (e.g., Slack button)."""
    if approved:
        sfn.send_task_success(
            taskToken=task_token,
            output=json.dumps({"approved": True, "approver": approver})
        )
    else:
        sfn.send_task_failure(
            taskToken=task_token,
            error="OrderRejected",
            cause=f"Rejected by {approver}"
        )`,
    },
    {
      name: "Kinesis Stream Processing",
      description: "Process real-time data streams with exactly-once semantics.",
      explanation: `**Kinesis Data Streams** ingests and processes real-time data at scale. Data is organized into **shards**—each shard handles up to 1MB/s write and 2MB/s read. Lambda can consume Kinesis streams with automatic shard management and checkpointing.

For market data, a typical pattern: market data providers → Kinesis → Lambda (enrichment/filtering) → DynamoDB (current state) + S3 (historical). Use **enhanced fan-out** for dedicated throughput per consumer. Use **Kinesis Data Analytics** (Flink) for complex stream processing like windowed aggregations.

Key considerations: **ordering is per-shard** (use partition key to route related events to same shard), **duplicates are possible** (design idempotent consumers), and **retention is 24 hours default** (extend to 7 days or 365 days for replay capability).`,
      triggers: "streaming, real-time, market data, event processing, Kinesis",
      code: `import boto3
import json
import base64
from aws_lambda_powertools import Logger, Tracer
from decimal import Decimal

logger = Logger()
tracer = Tracer()
kinesis = boto3.client("kinesis")
dynamodb = boto3.resource("dynamodb")
prices_table = dynamodb.Table("current-prices")

@tracer.capture_lambda_handler
def handler(event: dict, context) -> dict:
    """Process market data stream from Kinesis."""
    batch_item_failures = []

    for record in event["Records"]:
        try:
            # Decode and parse record
            payload = base64.b64decode(record["kinesis"]["data"])
            data = json.loads(payload)

            # Process market data
            process_price_update(data)

        except Exception as e:
            logger.error(f"Failed to process record: {e}")
            batch_item_failures.append({
                "itemIdentifier": record["kinesis"]["sequenceNumber"]
            })

    # Return failures for automatic retry
    return {"batchItemFailures": batch_item_failures}

@tracer.capture_method
def process_price_update(data: dict):
    """Update current price in DynamoDB with conditional write."""
    symbol = data["symbol"]
    price = Decimal(str(data["price"]))
    timestamp = data["timestamp"]

    # Only update if newer than existing
    prices_table.update_item(
        Key={"symbol": symbol},
        UpdateExpression="SET price = :price, updated_at = :ts, bid = :bid, ask = :ask",
        ConditionExpression="attribute_not_exists(updated_at) OR updated_at < :ts",
        ExpressionAttributeValues={
            ":price": price,
            ":ts": timestamp,
            ":bid": Decimal(str(data.get("bid", price))),
            ":ask": Decimal(str(data.get("ask", price)))
        }
    )

def publish_to_stream(stream_name: str, records: list[dict]):
    """Publish batch of records to Kinesis stream."""
    kinesis.put_records(
        StreamName=stream_name,
        Records=[
            {
                "Data": json.dumps(record).encode(),
                "PartitionKey": record["symbol"]  # Route by symbol for ordering
            }
            for record in records
        ]
    )`,
    },
    {
      name: "Consistent Hashing",
      description: "Distribute keys across nodes with minimal redistribution when nodes change.",
      explanation: `**Consistent hashing** distributes data across nodes such that adding or removing a node only redistributes K/N keys (where K is total keys and N is nodes), rather than rehashing everything. This is essential for distributed caches and databases.

The algorithm places nodes on a hash ring. To find which node stores a key, hash the key and walk clockwise to the nearest node. **Virtual nodes** (multiple positions per physical node) improve distribution uniformity. When a node fails, only its keys move to the next node on the ring.

Used internally by DynamoDB, ElastiCache Redis Cluster, and Cassandra. You rarely implement it yourself, but understanding it helps debug hot partition issues and capacity planning.`,
      triggers: "distributed systems, data distribution, partitioning, hash ring, load balancing",
      code: `import hashlib
from bisect import bisect_left
from typing import Optional

class ConsistentHash:
    """Consistent hashing with virtual nodes for uniform distribution."""

    def __init__(self, nodes: list[str] = None, replicas: int = 100):
        self.replicas = replicas  # Virtual nodes per physical node
        self.ring: list[int] = []
        self.node_map: dict[int, str] = {}

        for node in (nodes or []):
            self.add_node(node)

    def _hash(self, key: str) -> int:
        """Consistent hash function."""
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str):
        """Add node with virtual replicas."""
        for i in range(self.replicas):
            virtual_key = f"{node}:replica:{i}"
            hash_val = self._hash(virtual_key)
            self.ring.append(hash_val)
            self.node_map[hash_val] = node
        self.ring.sort()

    def remove_node(self, node: str):
        """Remove node and all its virtual replicas."""
        for i in range(self.replicas):
            hash_val = self._hash(f"{node}:replica:{i}")
            self.ring.remove(hash_val)
            del self.node_map[hash_val]

    def get_node(self, key: str) -> Optional[str]:
        """Find the node responsible for a key."""
        if not self.ring:
            return None

        hash_val = self._hash(key)
        # Find first node clockwise from hash position
        idx = bisect_left(self.ring, hash_val) % len(self.ring)
        return self.node_map[self.ring[idx]]

    def get_nodes(self, key: str, count: int = 3) -> list[str]:
        """Get multiple nodes for replication."""
        if not self.ring:
            return []

        hash_val = self._hash(key)
        idx = bisect_left(self.ring, hash_val)

        nodes = []
        seen = set()
        for i in range(len(self.ring)):
            node = self.node_map[self.ring[(idx + i) % len(self.ring)]]
            if node not in seen:
                nodes.append(node)
                seen.add(node)
                if len(nodes) >= count:
                    break

        return nodes`,
    },
    {
      name: "Distributed Lock with Redis",
      description: "Coordinate access to shared resources across processes.",
      explanation: `**Distributed locks** prevent concurrent access to shared resources across multiple processes or servers. Redis provides atomic operations (SET NX with TTL) for simple locking. For stronger guarantees, use **Redlock** (locks across multiple Redis instances) or **DynamoDB conditional writes**.

Critical for financial systems: preventing double-spending, ensuring only one process updates a position, coordinating rebalancing across accounts. Always use TTLs to prevent deadlocks if the lock holder crashes. Use unique tokens to ensure only the lock owner can release.

For AWS serverless, consider **DynamoDB-based locks** (work without ElastiCache) or **Step Functions** (implicit coordination through workflow state). For high-frequency trading, dedicated Redis clusters with minimal network latency.`,
      triggers: "coordination, mutual exclusion, concurrency, Redis, leader election",
      code: `import redis
import uuid
import time
from contextlib import contextmanager

class DistributedLock:
    """Distributed lock using Redis with automatic release."""

    def __init__(self, redis_client: redis.Redis, lock_name: str, ttl: int = 10):
        self.redis = redis_client
        self.lock_key = f"lock:{lock_name}"
        self.ttl = ttl
        self.token = str(uuid.uuid4())
        self.acquired = False

    def acquire(self, blocking: bool = True, timeout: float = 5.0) -> bool:
        """Acquire the lock, optionally blocking until available."""
        start = time.time()

        while True:
            # SET NX with TTL (atomic)
            if self.redis.set(self.lock_key, self.token, nx=True, ex=self.ttl):
                self.acquired = True
                return True

            if not blocking:
                return False

            if time.time() - start > timeout:
                return False

            time.sleep(0.05)  # Small delay before retry

    def release(self) -> bool:
        """Release lock only if we own it (Lua script for atomicity)."""
        if not self.acquired:
            return False

        # Lua script ensures atomic check-and-delete
        script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """
        result = self.redis.eval(script, 1, self.lock_key, self.token)
        self.acquired = False
        return result == 1

    def extend(self, additional_ttl: int) -> bool:
        """Extend lock TTL if we still own it."""
        script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("expire", KEYS[1], ARGV[2])
        else
            return 0
        end
        """
        return self.redis.eval(script, 1, self.lock_key, self.token, additional_ttl) == 1

    def __enter__(self):
        if not self.acquire():
            raise Exception(f"Failed to acquire lock: {self.lock_key}")
        return self

    def __exit__(self, *args):
        self.release()

# Usage
redis_client = redis.Redis(host="elasticache-endpoint", port=6379)

def rebalance_portfolio(portfolio_id: str):
    """Rebalance with distributed lock to prevent concurrent updates."""
    lock = DistributedLock(redis_client, f"rebalance:{portfolio_id}", ttl=300)

    with lock:
        portfolio = load_portfolio(portfolio_id)
        trades = calculate_rebalance_trades(portfolio)
        execute_trades(trades)`,
    },
    {
      name: "API Gateway with Rate Limiting",
      description: "Single entry point with authentication, rate limiting, and routing.",
      explanation: `**API Gateway** provides a single entry point for all API requests with cross-cutting concerns: authentication, rate limiting, request validation, and routing. AWS API Gateway integrates with Lambda authorizers for custom auth, usage plans for rate limiting, and VPC links for private backends.

For ML inference APIs, API Gateway handles: API key authentication, per-client rate limiting (prevent abuse), request/response transformation, and caching of repeated predictions. Use **usage plans** to set different quotas for different client tiers. Use **WAF** integration for DDoS protection.

For financial APIs with strict SLAs, consider **Network Load Balancer** for lower latency (bypasses API Gateway overhead) or **API Gateway with edge-optimized endpoints** for global distribution.`,
      triggers: "API design, authentication, rate limiting, routing, security",
      code: `from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.security import APIKeyHeader
import time
from collections import defaultdict
import threading

app = FastAPI()
api_key_header = APIKeyHeader(name="X-API-Key")

# In-memory rate limiting (use Redis in production)
class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.rpm = requests_per_minute
        self.requests = defaultdict(list)
        self.lock = threading.Lock()

    def is_allowed(self, client_id: str) -> bool:
        now = time.time()
        window_start = now - 60

        with self.lock:
            # Remove old requests
            self.requests[client_id] = [
                t for t in self.requests[client_id] if t > window_start
            ]

            if len(self.requests[client_id]) >= self.rpm:
                return False

            self.requests[client_id].append(now)
            return True

rate_limiter = RateLimiter(requests_per_minute=100)

# API key validation
VALID_API_KEYS = {
    "key-123": {"client": "client-a", "tier": "premium"},
    "key-456": {"client": "client-b", "tier": "standard"},
}

async def validate_api_key(api_key: str = Depends(api_key_header)) -> dict:
    if api_key not in VALID_API_KEYS:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return VALID_API_KEYS[api_key]

async def check_rate_limit(request: Request, client: dict = Depends(validate_api_key)):
    if not rate_limiter.is_allowed(client["client"]):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded",
            headers={"Retry-After": "60"}
        )
    return client

@app.post("/predict")
async def predict(
    request: dict,
    client: dict = Depends(check_rate_limit)
):
    """ML inference endpoint with auth and rate limiting."""
    # Route to appropriate model based on client tier
    if client["tier"] == "premium":
        result = run_premium_model(request)
    else:
        result = run_standard_model(request)

    return {"prediction": result, "client": client["client"]}`,
    },
    {
      name: "Dead Letter Queue Pattern",
      description: "Handle failed messages gracefully without losing data.",
      explanation: `**Dead letter queues (DLQ)** capture messages that fail processing after multiple retries. Instead of losing failed messages or blocking the queue, they're moved to a separate queue for investigation and reprocessing. Essential for any production message-driven system.

In AWS, SQS has built-in DLQ support: configure maxReceiveCount and a DLQ ARN. After the specified number of receive attempts, messages automatically move to the DLQ. Lambda event source mappings also support DLQ/on-failure destinations.

For financial systems, DLQs are critical for compliance—you must not lose trade messages. Implement monitoring and alerting on DLQ depth. Build tooling to inspect failed messages, fix the issue, and replay them.`,
      triggers: "error handling, message queues, reliability, SQS, retry",
      code: `import boto3
import json
from datetime import datetime
from aws_lambda_powertools import Logger

logger = Logger()
sqs = boto3.client("sqs")

MAIN_QUEUE_URL = "https://sqs.../main-queue"
DLQ_URL = "https://sqs.../dlq"

def process_messages(handler, max_retries: int = 3):
    """Process SQS messages with DLQ support."""
    while True:
        response = sqs.receive_message(
            QueueUrl=MAIN_QUEUE_URL,
            MaxNumberOfMessages=10,
            MessageAttributeNames=["All"],
            WaitTimeSeconds=20  # Long polling
        )

        for msg in response.get("Messages", []):
            # Get retry count from message attributes
            attrs = msg.get("MessageAttributes", {})
            retry_count = int(attrs.get("RetryCount", {}).get("StringValue", "0"))

            try:
                handler(json.loads(msg["Body"]))

                # Success - delete message
                sqs.delete_message(
                    QueueUrl=MAIN_QUEUE_URL,
                    ReceiptHandle=msg["ReceiptHandle"]
                )

            except Exception as e:
                logger.error(f"Processing failed: {e}", extra={"retry": retry_count})

                if retry_count >= max_retries:
                    # Move to DLQ with error context
                    send_to_dlq(msg, str(e))
                else:
                    # Requeue with incremented retry count
                    requeue_with_retry(msg, retry_count + 1)

                # Delete original message
                sqs.delete_message(
                    QueueUrl=MAIN_QUEUE_URL,
                    ReceiptHandle=msg["ReceiptHandle"]
                )

def send_to_dlq(original_msg: dict, error: str):
    """Send failed message to DLQ with error context."""
    sqs.send_message(
        QueueUrl=DLQ_URL,
        MessageBody=original_msg["Body"],
        MessageAttributes={
            "OriginalMessageId": {
                "StringValue": original_msg["MessageId"],
                "DataType": "String"
            },
            "Error": {
                "StringValue": error[:256],  # Truncate for attribute limit
                "DataType": "String"
            },
            "FailedAt": {
                "StringValue": datetime.utcnow().isoformat(),
                "DataType": "String"
            }
        }
    )
    logger.warning("Message sent to DLQ", extra={"message_id": original_msg["MessageId"]})

def replay_dlq_messages(handler, limit: int = 100):
    """Replay messages from DLQ back to main queue."""
    replayed = 0

    while replayed < limit:
        response = sqs.receive_message(
            QueueUrl=DLQ_URL,
            MaxNumberOfMessages=10
        )

        messages = response.get("Messages", [])
        if not messages:
            break

        for msg in messages:
            # Send back to main queue
            sqs.send_message(
                QueueUrl=MAIN_QUEUE_URL,
                MessageBody=msg["Body"],
                MessageAttributes={"RetryCount": {"StringValue": "0", "DataType": "String"}}
            )

            sqs.delete_message(QueueUrl=DLQ_URL, ReceiptHandle=msg["ReceiptHandle"])
            replayed += 1

    return replayed`,
    },
  ],

  problems: [
    {
      id: "rate-limiter",
      title: "Design a Rate Limiter",
      difficulty: "medium",
      description: "Implement a rate limiter using the sliding window algorithm that limits requests per minute per client.",
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
        "Track timestamps of recent requests per client",
        "Remove timestamps outside the sliding window",
        "Check if count exceeds limit before recording",
      ],
      solution: `from collections import deque
import time
from threading import Lock

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: dict[str, deque] = {}
        self.lock = Lock()

    def is_allowed(self, client_id: str) -> bool:
        with self.lock:
            now = time.time()
            window_start = now - self.window_seconds

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
            return True`,
      testCases: [],
    },
    {
      id: "lru-cache",
      title: "Design an LRU Cache",
      difficulty: "medium",
      description: "Implement an LRU (Least Recently Used) cache with O(1) get and put operations.",
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
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]`,
      testCases: [],
    },
    {
      id: "feature-store",
      title: "Design an ML Feature Store",
      difficulty: "hard",
      description: "Design a feature store with online (low-latency) and offline (batch) stores, supporting point-in-time correct feature retrieval for training.",
      examples: [
        { input: "store.get_online('user_123', ['age', 'tenure'])", output: "{'age': 25, 'tenure': 12}" },
      ],
      starterCode: `from datetime import datetime
import pandas as pd

class FeatureStore:
    def __init__(self, online_table, offline_bucket: str):
        # TODO: Initialize stores
        pass

    def get_online_features(self, entity_id: str, features: list[str]) -> dict:
        # TODO: Low-latency feature lookup
        pass

    def get_historical_features(
        self, entity_ids: list[str], features: list[str], as_of_time: datetime
    ) -> pd.DataFrame:
        # TODO: Point-in-time correct feature retrieval
        pass

    def ingest_features(self, df: pd.DataFrame, entity_col: str, timestamp_col: str):
        # TODO: Ingest features to both stores
        pass`,
      hints: [
        "Online store: DynamoDB for sub-ms latency",
        "Offline store: S3/Parquet for batch access",
        "Point-in-time: filter by event_time <= as_of_time",
        "Sync: DynamoDB Streams or batch job",
      ],
      solution: `import boto3
from datetime import datetime
from decimal import Decimal
import pandas as pd

class FeatureStore:
    def __init__(self, dynamodb_table, s3_bucket: str):
        self.online = dynamodb_table
        self.bucket = s3_bucket
        self.s3 = boto3.client("s3")

    def get_online_features(self, entity_id: str, features: list[str]) -> dict:
        response = self.online.get_item(
            Key={"entity_id": entity_id},
            ProjectionExpression=", ".join(features)
        )
        return {k: float(v) if isinstance(v, Decimal) else v
                for k, v in response.get("Item", {}).items()}

    def get_historical_features(
        self, entity_ids: list[str], features: list[str], as_of_time: datetime
    ) -> pd.DataFrame:
        # Query Athena for point-in-time features
        query = f"""
        WITH ranked AS (
            SELECT *, ROW_NUMBER() OVER (
                PARTITION BY entity_id ORDER BY event_time DESC
            ) as rn
            FROM feature_store
            WHERE entity_id IN ({','.join(f"'{e}'" for e in entity_ids)})
              AND event_time <= '{as_of_time.isoformat()}'
        )
        SELECT entity_id, {', '.join(features)}
        FROM ranked WHERE rn = 1
        """
        return self._run_athena_query(query)

    def ingest_features(self, df: pd.DataFrame, entity_col: str, ts_col: str):
        # Write to offline store (S3)
        path = f"s3://{self.bucket}/features/{datetime.utcnow():%Y/%m/%d}/data.parquet"
        df.to_parquet(path)

        # Update online store with latest values
        latest = df.sort_values(ts_col).groupby(entity_col).last()
        with self.online.batch_writer() as batch:
            for entity_id, row in latest.iterrows():
                batch.put_item(Item={
                    "entity_id": entity_id,
                    "event_time": row[ts_col].isoformat(),
                    **{k: Decimal(str(v)) for k, v in row.items() if k != ts_col}
                })`,
      testCases: [],
    },
    {
      id: "portfolio-valuation",
      title: "Design a Real-time Portfolio Valuation System",
      difficulty: "hard",
      description: "Design a system that computes portfolio valuations in real-time as market prices update, serving thousands of portfolios with sub-second latency.",
      examples: [
        { input: "get_portfolio_value('portfolio_123')", output: "{'total_value': 1234567.89, 'as_of': '2024-01-15T10:30:00Z'}" },
      ],
      starterCode: `class PortfolioValuationSystem:
    def __init__(self, positions_table, prices_stream):
        # TODO: Initialize system
        pass

    def on_price_update(self, symbol: str, price: float, timestamp: str):
        # TODO: Handle real-time price update
        pass

    def get_portfolio_value(self, portfolio_id: str) -> dict:
        # TODO: Return current portfolio valuation
        pass

    def subscribe_to_valuations(self, portfolio_id: str, callback):
        # TODO: Real-time valuation updates
        pass`,
      hints: [
        "Cache positions and prices in Redis for speed",
        "Use pub/sub for real-time updates to subscribers",
        "Pre-compute affected portfolios when price changes",
        "Use DynamoDB Streams for position changes",
      ],
      solution: `import redis
import json
from decimal import Decimal
from datetime import datetime

class PortfolioValuationSystem:
    def __init__(self, positions_table, redis_client: redis.Redis):
        self.positions = positions_table
        self.redis = redis_client

        # Cache: prices, positions, portfolio->symbols mapping
        # Redis keys:
        # price:{symbol} -> current price
        # positions:{portfolio_id} -> {symbol: quantity, ...}
        # portfolios_by_symbol:{symbol} -> set of portfolio_ids

    def on_price_update(self, symbol: str, price: float, timestamp: str):
        # Update price cache
        self.redis.hset(f"price:{symbol}", mapping={
            "price": price, "timestamp": timestamp
        })

        # Find affected portfolios
        portfolio_ids = self.redis.smembers(f"portfolios_by_symbol:{symbol}")

        # Recompute and publish valuations
        for portfolio_id in portfolio_ids:
            valuation = self._compute_valuation(portfolio_id.decode())

            # Cache new valuation
            self.redis.set(
                f"valuation:{portfolio_id.decode()}",
                json.dumps(valuation)
            )

            # Publish to subscribers
            self.redis.publish(
                f"valuation_updates:{portfolio_id.decode()}",
                json.dumps(valuation)
            )

    def _compute_valuation(self, portfolio_id: str) -> dict:
        positions = json.loads(
            self.redis.get(f"positions:{portfolio_id}") or "{}"
        )

        total = Decimal("0")
        holdings = []

        for symbol, quantity in positions.items():
            price_data = self.redis.hgetall(f"price:{symbol}")
            price = Decimal(price_data.get(b"price", b"0").decode())
            value = Decimal(str(quantity)) * price
            total += value
            holdings.append({"symbol": symbol, "quantity": quantity, "value": float(value)})

        return {
            "portfolio_id": portfolio_id,
            "total_value": float(total),
            "holdings": holdings,
            "as_of": datetime.utcnow().isoformat()
        }

    def get_portfolio_value(self, portfolio_id: str) -> dict:
        cached = self.redis.get(f"valuation:{portfolio_id}")
        if cached:
            return json.loads(cached)
        return self._compute_valuation(portfolio_id)

    def subscribe_to_valuations(self, portfolio_id: str, callback):
        pubsub = self.redis.pubsub()
        pubsub.subscribe(f"valuation_updates:{portfolio_id}")
        for message in pubsub.listen():
            if message["type"] == "message":
                callback(json.loads(message["data"]))`,
      testCases: [],
    },
    {
      id: "distributed-counter",
      title: "Design a Distributed Counter",
      difficulty: "medium",
      description: "Design a distributed counter that can handle high write throughput while maintaining accuracy.",
      examples: [
        { input: "counter.increment(); counter.increment(); counter.get()", output: "2" },
      ],
      starterCode: `import redis

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
        "Shard the counter across multiple Redis keys",
        "Write to random shard for load distribution",
        "Read aggregates all shards",
      ],
      solution: `import redis
import random

class DistributedCounter:
    def __init__(self, redis_client: redis.Redis, name: str, num_shards: int = 10):
        self.redis = redis_client
        self.name = name
        self.num_shards = num_shards

    def _shard_key(self, shard_id: int) -> str:
        return f"counter:{self.name}:shard:{shard_id}"

    def increment(self, amount: int = 1):
        shard_id = random.randint(0, self.num_shards - 1)
        self.redis.incrby(self._shard_key(shard_id), amount)

    def get(self) -> int:
        pipeline = self.redis.pipeline()
        for i in range(self.num_shards):
            pipeline.get(self._shard_key(i))
        results = pipeline.execute()
        return sum(int(r or 0) for r in results)

    def reset(self):
        pipeline = self.redis.pipeline()
        for i in range(self.num_shards):
            pipeline.delete(self._shard_key(i))
        pipeline.execute()`,
      testCases: [],
    },
  ],
};
