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
  viewMode: "concepts",

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

    // ==================== SECTION 2: BOTO3 FUNDAMENTALS ====================
    {
      id: "boto3-fundamentals",
      title: "boto3: The Bridge to AWS",
      subtitle: "How Python talks to AWS services",
      content: (
        <>
          <Prose>
            <strong>boto3</strong> is the official AWS SDK for Python. Every AWS service you'll use — S3, Lambda, DynamoDB, SQS — is accessed through boto3. Understanding its patterns is essential because you'll use them hundreds of times.
          </Prose>

          <Prose>
            When you call a boto3 method like <code>s3.put_object()</code>, here's what actually happens: boto3 constructs an HTTP request, signs it with your AWS credentials using AWS's Signature Version 4 algorithm, sends it to the appropriate AWS API endpoint, parses the response, and returns Python objects. All of this complexity is hidden behind simple method calls. You write <code>s3.upload_file('local.txt', 'bucket', 'key')</code> and boto3 handles the multipart upload, retries, checksums, and error parsing.
          </Prose>

          <Prose>
            boto3 provides two interfaces to AWS services: <strong>clients</strong> and <strong>resources</strong>. Understanding when to use each will save you frustration. Clients provide low-level access that maps directly to AWS API operations — every API call AWS supports has a corresponding client method. Resources provide higher-level, object-oriented abstractions that are more Pythonic but only available for some services.
          </Prose>

          <CodeBlock
            code={`pip install boto3

import boto3

# Create a client (low-level API)
s3_client = boto3.client('s3')

# Create a resource (high-level API)
s3_resource = boto3.resource('s3')
dynamodb = boto3.resource('dynamodb')`}
            language="python"
            title="Installation and Setup"
          />

          <Callout type="insight" title="Client vs Resource: When to Use Each">
            <strong>Client</strong> gives you 1:1 mapping to AWS API calls — more verbose but complete. Every AWS service operation is available. <strong>Resource</strong> gives you object-oriented wrappers — you work with objects like <code>bucket.objects.all()</code> instead of calling <code>list_objects_v2()</code> and paginating manually. Use <strong>resource</strong> when available (S3, DynamoDB, EC2, IAM), fall back to <strong>client</strong> for services without resource support (Lambda, SQS, SNS, most newer services).
          </Callout>

          <Prose>
            <strong>The Credential Chain</strong> — Every AWS API call must be signed with credentials. When you call boto3, it searches for credentials in a specific order called the "credential chain." This design lets the same code run in different environments without modification — locally it might use your CLI credentials, while on Lambda it automatically uses the function's IAM role.
          </Prose>

          <Prose>
            Understanding this chain matters because credential issues are the #1 cause of boto3 problems. When your code works locally but fails on Lambda, or works for you but not your teammate, credentials are usually the culprit. boto3 searches these locations in order and uses the first credentials it finds:
          </Prose>

          <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-4 my-4 font-mono text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-amber)]">1.</span>
                <span>Code: <code>boto3.Session(aws_access_key_id=..., aws_secret_access_key=...)</code></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-amber)]">2.</span>
                <span>Environment: <code>AWS_ACCESS_KEY_ID</code>, <code>AWS_SECRET_ACCESS_KEY</code></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-amber)]">3.</span>
                <span>File: <code>~/.aws/credentials</code> (from AWS CLI)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-amber)]">4.</span>
                <span>IAM Role: Automatic on Lambda/EC2 (best practice)</span>
              </div>
            </div>
          </div>

          <Prose>
            In practice, you should <strong>never use option 1</strong> (hardcoded credentials). For local development, run <code>aws configure</code> to set up option 3 — this creates the credentials file and is how most developers work. For production on AWS, always use option 4 — IAM roles. Lambda functions, EC2 instances, and ECS tasks can all assume IAM roles, meaning credentials are automatically provided and rotated by AWS. Your code doesn't need to know about credentials at all.
          </Prose>

          <Callout type="warning" title="Never Hardcode Credentials">
            Never put <code>aws_access_key_id</code> in your code. Use environment variables locally and IAM roles in production. Credentials in code = credentials in git = security breach. AWS actively scans GitHub for leaked credentials and will alert you, but by then it may be too late.
          </Callout>

          <Prose>
            <strong>Error Handling</strong> — AWS operations fail. Networks hiccup, services throttle, resources don't exist, permissions are misconfigured. Unlike local code where failures are often bugs, with AWS you must design for failure. Every boto3 call can raise a <code>ClientError</code>, and the error code tells you what happened.
          </Prose>

          <Prose>
            The most common errors you'll encounter: <code>404</code> or <code>NoSuchKey</code> means the resource doesn't exist. <code>403</code> or <code>AccessDenied</code> means your IAM permissions are wrong — this is extremely common and the error message often doesn't tell you exactly which permission is missing. <code>ThrottlingException</code> means you're hitting AWS rate limits and should implement exponential backoff. <code>ServiceUnavailable</code> means AWS itself is having issues — retry with backoff.
          </Prose>

          <CodeBlock
            code={`from botocore.exceptions import ClientError

s3 = boto3.client('s3')

try:
    s3.head_object(Bucket='my-bucket', Key='my-key')
except ClientError as e:
    error_code = e.response['Error']['Code']
    if error_code == '404':
        print("Object doesn't exist")
    elif error_code == '403':
        print("Access denied - check IAM permissions")
    else:
        raise  # Re-raise unexpected errors`}
            language="python"
            title="Error Handling Pattern"
          />

          <Prose>
            <strong>Pagination</strong> — Here's a subtle bug that bites everyone once: most AWS "list" operations return at most 1000 items per call. If you have 5000 objects in S3 and you call <code>list_objects_v2()</code>, you only get the first 1000. The response includes a <code>NextToken</code> that you must use to get the next page. boto3 provides <strong>paginators</strong> that handle this automatically — always use them for list operations.
          </Prose>

          <Prose>
            This isn't just about S3. DynamoDB scans, CloudWatch log queries, IAM user lists, EC2 instance lists — almost every "list" or "describe" operation in AWS is paginated. The limit varies by service (DynamoDB returns 1MB of data per page, not 1000 items), but the pattern is the same.
          </Prose>

          <CodeBlock
            code={`# Wrong - only gets first 1000 objects
response = s3.list_objects_v2(Bucket='my-bucket')
objects = response.get('Contents', [])

# Right - gets ALL objects
paginator = s3.get_paginator('list_objects_v2')
for page in paginator.paginate(Bucket='my-bucket'):
    for obj in page.get('Contents', []):
        print(obj['Key'])`}
            language="python"
            title="Pagination Pattern"
          />

          <Callout type="tip" title="Sessions for Multi-Region or Multi-Account">
            <code>boto3.client('s3')</code> uses the default session with default region. When you need to work with multiple regions or assume roles in other accounts, create explicit sessions: <code>session = boto3.Session(region_name='us-west-2')</code> then <code>session.client('s3')</code>. Each session maintains its own configuration and credentials.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 3: S3 WITH PYTHON ====================
    {
      id: "s3-with-python",
      title: "S3 with Python",
      subtitle: "Object storage — the foundation of everything",
      content: (
        <>
          <Prose>
            S3 (Simple Storage Service) is AWS's object storage — and it's everywhere. Lambda deployment packages live in S3. Static websites are hosted on S3. Data lakes are built on S3. ML training data sits in S3. Understanding S3 deeply is foundational because you'll interact with it constantly.
          </Prose>

          <Prose>
            S3 is deceptively simple: store files, get files. But the mental model matters. <strong>S3 is not a filesystem.</strong> There are no directories, no folders, no hierarchy. There are <strong>buckets</strong> (containers) and <strong>objects</strong> (files), each with a <strong>key</strong> (name). This distinction matters because operations that would be fast on a filesystem (listing a directory's contents, moving a folder) work differently on S3.
          </Prose>

          <Callout type="analogy" title="Keys Are Just Strings">
            When you see <code>data/2024/01/report.csv</code> in S3, those slashes are just characters in the key string. The AWS Console shows it like a folder structure for convenience, but <code>data/2024/01/report.csv</code> is a flat key, not a path. No directory exists. You can't "cd" into <code>data/2024/</code> — you can only list objects whose keys start with that prefix. This is why S3 calls it "prefix" not "folder."
          </Callout>

          <Prose>
            <strong>Basic Operations</strong> — S3 offers two ways to upload and download: file-based methods that work with local filesystem paths, and streaming methods that work with bytes in memory. Choose based on whether you're dealing with files on disk or data in your program:
          </Prose>

          <CodeBlock
            code={`import boto3

s3 = boto3.client('s3')

# Upload a file
s3.upload_file('local_file.txt', 'my-bucket', 'path/in/s3/file.txt')

# Upload from memory (bytes or file-like object)
s3.put_object(
    Bucket='my-bucket',
    Key='path/in/s3/data.json',
    Body=json.dumps({'key': 'value'}),
    ContentType='application/json'
)

# Download a file
s3.download_file('my-bucket', 'path/in/s3/file.txt', 'local_file.txt')

# Read directly into memory
response = s3.get_object(Bucket='my-bucket', Key='path/in/s3/data.json')
data = json.loads(response['Body'].read())

# Delete
s3.delete_object(Bucket='my-bucket', Key='path/in/s3/file.txt')`}
            language="python"
            title="S3 CRUD Operations"
          />

          <Prose>
            <strong>Presigned URLs</strong> — Here's a powerful pattern: generate a URL that grants temporary access to a private S3 object without sharing your AWS credentials. The URL contains a cryptographic signature that AWS verifies. Anyone with the URL can access the object, but only until the URL expires.
          </Prose>

          <Prose>
            This solves a common problem: your S3 bucket is private (as it should be), but you need to let users download or upload files. Without presigned URLs, you'd have to proxy everything through your server — user requests file, your server downloads from S3, your server sends to user. That's slow and expensive. With presigned URLs, the user's browser talks directly to S3. Your server just generates the URL.
          </Prose>

          <CodeBlock
            code={`# Generate a download URL (expires in 1 hour)
url = s3.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'my-bucket', 'Key': 'private/report.pdf'},
    ExpiresIn=3600  # seconds
)
print(url)  # Anyone with this URL can download for 1 hour

# Generate an upload URL
upload_url = s3.generate_presigned_url(
    'put_object',
    Params={'Bucket': 'my-bucket', 'Key': 'uploads/user-file.jpg'},
    ExpiresIn=300  # 5 minutes to upload
)`}
            language="python"
            title="Presigned URLs"
          />

          <Callout type="tip" title="Presigned URL Use Cases">
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li><strong>Private file downloads:</strong> Generate a URL when user clicks "download", embed it in the response</li>
              <li><strong>Direct uploads:</strong> Give frontend a presigned upload URL, user uploads directly to S3 (no server bottleneck)</li>
              <li><strong>Time-limited sharing:</strong> Share a link that expires in 24 hours</li>
              <li><strong>Large file handling:</strong> Avoid Lambda's 6MB response limit by redirecting to S3</li>
            </ul>
          </Callout>

          <Prose>
            <strong>Listing Objects</strong> — Because S3 isn't a filesystem, there's no "list this directory" operation. Instead, you list objects with a <strong>prefix filter</strong>. This is actually more powerful — you can filter on any key prefix, not just directory boundaries. But remember: listing is a separate operation from getting object contents. If you need to process many files, list first to get the keys, then get each object.
          </Prose>

          <Prose>
            A common pattern is checking if an object exists before processing. S3 doesn't have an "exists" method, but <code>head_object</code> returns metadata without downloading the content — if it succeeds, the object exists. If it throws a 404, it doesn't. This is the standard pattern:
          </Prose>

          <CodeBlock
            code={`# List all objects under a "prefix" (fake folder)
paginator = s3.get_paginator('list_objects_v2')

for page in paginator.paginate(Bucket='my-bucket', Prefix='data/2024/'):
    for obj in page.get('Contents', []):
        print(f"{obj['Key']} - {obj['Size']} bytes")

# Check if an object exists
def object_exists(bucket, key):
    try:
        s3.head_object(Bucket=bucket, Key=key)
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return False
        raise`}
            language="python"
            title="Listing and Checking Objects"
          />

          <Callout type="warning" title="S3 Consistency Model">
            S3 now provides strong read-after-write consistency for all operations. After a successful PUT, GET immediately returns the new object. After DELETE, GET immediately returns 404. This is a change from S3's original eventual consistency model. However, S3 bucket listings can still take a moment to reflect very recent changes in rare cases.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 4: LAMBDA WITH PYTHON ====================
    {
      id: "lambda-with-python",
      title: "Lambda with Python",
      subtitle: "Your code, their servers",
      content: (
        <>
          <Prose>
            Lambda is AWS's "Function as a Service." You upload code, AWS runs it. No servers to manage, no capacity to plan, no idle costs. You pay only when your code runs — literally per millisecond of execution time. This is the foundation of serverless architecture.
          </Prose>

          <Prose>
            Here's what happens when a Lambda is invoked: AWS allocates a container with your code and runtime (Python, Node, etc.), initializes your code (imports, global variables), calls your handler function with the event data, returns the response, then either keeps the container warm for the next invocation or destroys it. This "execution model" has important implications — initialization code outside your handler runs once per container, not once per request. That's where you put boto3 client creation, database connections, and ML model loading.
          </Prose>

          <Prose>
            <strong>The Handler Function</strong> — Every Lambda needs a handler: a function that AWS calls with two arguments. The <code>event</code> contains input data (what triggered the Lambda), and <code>context</code> contains runtime information (request ID, time remaining, memory limit). What's in <code>event</code> depends entirely on what triggered your Lambda — API Gateway, S3, SQS, and EventBridge all send different event structures.
          </Prose>

          <CodeBlock
            code={`def handler(event, context):
    """
    event: dict - Input data (varies by trigger)
    context: object - Runtime info (request ID, time remaining, etc.)
    """
    # Your code here
    name = event.get('name', 'World')

    return {
        'statusCode': 200,
        'body': f'Hello, {name}!'
    }`}
            language="python"
            title="Basic Lambda Handler"
          />

          <Prose>
            <strong>The Event Object</strong> — This is crucial to understand: your Lambda doesn't know what triggered it. It just receives a Python dictionary. The structure of that dictionary depends entirely on the trigger source. API Gateway sends HTTP request details. S3 sends object information. SQS sends message bodies. You must know the event structure for your trigger source — there's no universal format.
          </Prose>

          <Prose>
            This table shows the most common triggers and where to find the data you need:
          </Prose>

          <ComparisonTable
            items={[
              { name: "API Gateway", when: "HTTP request data", example: "event['body'], event['queryStringParameters']", color: "var(--color-accent)" },
              { name: "S3", when: "Object created/deleted", example: "event['Records'][0]['s3']['object']['key']", color: "var(--color-teal)" },
              { name: "SQS", when: "Queue messages", example: "event['Records'][0]['body']", color: "var(--color-amber)" },
            ]}
          />

          <Prose>
            <strong>The Context Object</strong> — While <code>event</code> contains your input data, <code>context</code> contains runtime metadata. The most important property is <code>get_remaining_time_in_millis()</code> — Lambda will forcibly terminate your function when time runs out, so checking remaining time lets you gracefully handle long-running operations. The <code>aws_request_id</code> is essential for logging — it's the unique identifier that lets you trace this specific invocation through CloudWatch Logs.
          </Prose>

          <CodeBlock
            code={`def handler(event, context):
    # Unique ID for this invocation (for logging/tracing)
    print(f"Request ID: {context.aws_request_id}")

    # Time remaining before Lambda kills your function
    remaining_ms = context.get_remaining_time_in_millis()
    print(f"Time remaining: {remaining_ms}ms")

    # Function metadata
    print(f"Function: {context.function_name}")
    print(f"Memory: {context.memory_limit_in_mb}MB")

    # Use remaining time for long operations
    if remaining_ms < 5000:  # Less than 5 seconds left
        return {'statusCode': 503, 'body': 'Timeout approaching'}`}
            language="python"
            title="Using the Context Object"
          />

          <Callout type="tip" title="Environment Variables Are Your Configuration">
            Never hardcode configuration in Lambda code. Use environment variables for table names, bucket names, API endpoints, feature flags, and anything that might differ between environments. Access them with <code>os.environ['TABLE_NAME']</code>. For secrets (API keys, passwords), store them in AWS Secrets Manager and fetch at runtime — environment variables are visible in the AWS Console.
          </Callout>

          <Prose>
            <strong>Invoking Lambda from Python</strong> — Sometimes you need one Lambda to call another, or you want to trigger a Lambda from a script. There are two invocation types: <strong>synchronous</strong> (wait for response) and <strong>asynchronous</strong> (fire and forget). Synchronous is simpler but creates coupling — if the called Lambda is slow or fails, the caller waits or fails too. Asynchronous is more resilient but you don't get a response.
          </Prose>

          <CodeBlock
            code={`import boto3
import json

lambda_client = boto3.client('lambda')

# Synchronous invocation (wait for response)
response = lambda_client.invoke(
    FunctionName='other-function',
    InvocationType='RequestResponse',  # sync
    Payload=json.dumps({'key': 'value'})
)
result = json.loads(response['Payload'].read())

# Asynchronous invocation (fire and forget)
lambda_client.invoke(
    FunctionName='background-processor',
    InvocationType='Event',  # async - returns immediately
    Payload=json.dumps({'task_id': 123})
)`}
            language="python"
            title="Invoking Lambda Programmatically"
          />

          <Callout type="warning" title="Lambda Limits to Know">
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li><strong>Timeout:</strong> Max 15 minutes</li>
              <li><strong>Memory:</strong> 128 MB to 10 GB</li>
              <li><strong>Package size:</strong> 50 MB zipped, 250 MB unzipped</li>
              <li><strong>/tmp storage:</strong> 512 MB (up to 10 GB)</li>
              <li><strong>Concurrent executions:</strong> 1000 default (can increase)</li>
            </ul>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 5: API GATEWAY + LAMBDA ====================
    {
      id: "api-gateway-lambda",
      title: "API Gateway + Lambda",
      subtitle: "Building HTTP APIs",
      content: (
        <>
          <Prose>
            API Gateway is the service that exposes your Lambda functions as HTTP endpoints. When someone makes an HTTP request to your API, API Gateway receives it, transforms it into a Lambda event, invokes your function, transforms your response back to HTTP, and returns it to the caller. This is how you build REST APIs, webhooks, and web backends with Lambda.
          </Prose>

          <Prose>
            There are two types of API Gateway: <strong>REST API</strong> (older, more features, more expensive) and <strong>HTTP API</strong> (newer, simpler, ~70% cheaper). For most new projects, use HTTP API — it's faster, cheaper, and has everything you need. REST API is only necessary for features like request validation, caching, or WAF integration.
          </Prose>

          <Callout type="insight" title="Lambda Doesn't Know HTTP">
            This is a key mental model shift: your Lambda doesn't receive an HTTP request — it receives a Python dict. Your Lambda doesn't return an HTTP response — it returns a Python dict. API Gateway handles the HTTP protocol entirely. That's why the response must have a specific structure (<code>statusCode</code>, <code>headers</code>, <code>body</code>) — API Gateway needs to know how to build the HTTP response.
          </Callout>

          <Prose>
            <strong>The Event Structure</strong> — When API Gateway invokes your Lambda, it packs all the HTTP request information into the event dict. Path parameters, query strings, headers, and body are all there — you just need to know where to find them:
          </Prose>

          <CodeBlock
            code={`def handler(event, context):
    # HTTP method
    method = event['requestContext']['http']['method']  # GET, POST, etc.

    # Path: /users/123 with route /users/{id}
    user_id = event['pathParameters']['id']  # '123'

    # Query string: ?limit=10&offset=0
    params = event.get('queryStringParameters') or {}
    limit = params.get('limit', '10')

    # Headers (lowercase keys)
    headers = event.get('headers', {})
    auth_token = headers.get('authorization', '')

    # Body (for POST/PUT) - comes as string
    body_str = event.get('body', '{}')
    body = json.loads(body_str) if body_str else {}

    # Respond
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'  # CORS
        },
        'body': json.dumps({'user_id': user_id, 'method': method})
    }`}
            language="python"
            title="API Gateway Event Structure"
          />

          <Prose>
            <strong>Response Format</strong> — Your Lambda must return a dict with a specific structure. API Gateway reads this dict and constructs the HTTP response. The <code>statusCode</code> becomes the HTTP status code. The <code>headers</code> become HTTP headers. The <code>body</code> becomes the response body — and this is where people get tripped up: <strong>body must be a string</strong>, not a dict. If you're returning JSON, you must call <code>json.dumps()</code>.
          </Prose>

          <CodeBlock
            code={`# Success response
return {
    'statusCode': 200,
    'headers': {'Content-Type': 'application/json'},
    'body': json.dumps({'data': result})
}

# Error response
return {
    'statusCode': 404,
    'headers': {'Content-Type': 'application/json'},
    'body': json.dumps({'error': 'User not found'})
}

# IMPORTANT: body must be a STRING, not a dict
# Wrong: 'body': {'key': 'value'}
# Right: 'body': json.dumps({'key': 'value'})`}
            language="python"
            title="Response Format"
          />

          <Prose>
            <strong>CORS: The Most Common API Gateway Issue</strong> — If you're building a web frontend that calls your API from a browser, you'll hit CORS (Cross-Origin Resource Sharing) errors. CORS is a browser security feature that blocks requests to different domains unless the server explicitly allows it. Your API must return specific headers telling the browser "yes, this origin is allowed to call me."
          </Prose>

          <Prose>
            The confusing part: CORS errors show up in the browser console, but the fix is on the server. Your Lambda must return the <code>Access-Control-Allow-Origin</code> header. For development, <code>*</code> allows any origin. For production, specify your actual domain. And you must handle OPTIONS preflight requests — browsers send these before certain requests to check if CORS is allowed.
          </Prose>

          <Callout type="warning" title="CORS Header Pattern">
            Add these headers to every response from your Lambda:
            <CodeBlock
              code={`'headers': {
    'Access-Control-Allow-Origin': '*',  # Or 'https://yourdomain.com'
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
}`}
              language="python"
            />
            Configure API Gateway to automatically handle OPTIONS requests, or add a handler that returns 200 with these headers.
          </Callout>

          <Prose>
            <strong>A Complete CRUD Handler Pattern</strong>:
          </Prose>

          <CodeBlock
            code={`import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def handler(event, context):
    method = event['requestContext']['http']['method']
    path_params = event.get('pathParameters') or {}

    try:
        if method == 'GET' and 'id' in path_params:
            return get_user(path_params['id'])
        elif method == 'GET':
            return list_users()
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            return create_user(body)
        elif method == 'DELETE' and 'id' in path_params:
            return delete_user(path_params['id'])
        else:
            return response(400, {'error': 'Invalid request'})
    except Exception as e:
        return response(500, {'error': str(e)})

def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps(body)
    }`}
            language="python"
            title="CRUD Handler Pattern"
          />
        </>
      ),
    },

    // ==================== SECTION 6: DYNAMODB WITH PYTHON ====================
    {
      id: "dynamodb-with-python",
      title: "DynamoDB with Python",
      subtitle: "NoSQL that scales to any size",
      content: (
        <>
          <Prose>
            DynamoDB is AWS's NoSQL database — and it's unlike any database you've used before. It's fully managed: no servers, no maintenance windows, no storage provisioning. It scales automatically from zero to millions of requests per second. It has single-digit millisecond latency at any scale. It's also the default database for serverless architectures because it's the only AWS database that truly scales to zero cost.
          </Prose>

          <Prose>
            The tradeoff: you must think differently about data modeling. In SQL, you model your entities and relationships, then write queries to get what you need. In DynamoDB, you must know your access patterns upfront and design your data model around them. "Get all orders for user X" and "Get all users who ordered product Y" might require completely different table designs. This is the fundamental shift from SQL thinking.
          </Prose>

          <Prose>
            <strong>Core Concepts</strong> — DynamoDB has different terminology than SQL databases. Understanding these terms is essential:
          </Prose>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-accent)" }}>Table</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Container for items. Like a SQL table.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-accent)" }}>Item</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>A single record. Like a SQL row.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-teal)" }}>Partition Key (PK)</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Required. Determines which partition stores the item. Must be unique (if no sort key).</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-teal)" }}>Sort Key (SK)</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Optional. Enables range queries. PK + SK together must be unique.</p>
            </div>
          </div>

          <Prose>
            <strong>Basic CRUD Operations</strong> — DynamoDB operations are different from SQL. There's no <code>SELECT * FROM users WHERE name = 'Alice'</code>. Instead, you have specific operations: <code>put_item</code> (create/replace), <code>get_item</code> (read by key), <code>update_item</code> (modify), <code>delete_item</code> (remove), <code>query</code> (find by partition key), and <code>scan</code> (read entire table). Each has different performance characteristics.
          </Prose>

          <Prose>
            Notice that <code>get_item</code> requires the exact key — you can't get an item by email, only by <code>user_id</code> (the partition key). This is fundamental: DynamoDB is optimized for key-based access. If you need to find users by email, you need a secondary index or a different data model.
          </Prose>

          <CodeBlock
            code={`import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

# CREATE - put_item
table.put_item(Item={
    'user_id': 'user_123',      # Partition key
    'email': 'alice@example.com',
    'name': 'Alice',
    'created_at': '2024-01-15'
})

# READ - get_item (by exact key)
response = table.get_item(Key={'user_id': 'user_123'})
item = response.get('Item')  # None if not found

# UPDATE - update_item
table.update_item(
    Key={'user_id': 'user_123'},
    UpdateExpression='SET #name = :name, updated_at = :now',
    ExpressionAttributeNames={'#name': 'name'},  # 'name' is reserved
    ExpressionAttributeValues={':name': 'Alice Smith', ':now': '2024-01-20'}
)

# DELETE - delete_item
table.delete_item(Key={'user_id': 'user_123'})`}
            language="python"
            title="DynamoDB CRUD"
          />

          <Prose>
            <strong>Query vs Scan: The Most Important Distinction</strong> — This is where people get burned. <code>Query</code> uses the partition key to find items directly — it's fast (single-digit milliseconds) regardless of table size. <code>Scan</code> reads every single item in the table, checking each one against your filter — it's slow, expensive, and gets worse as your table grows.
          </Prose>

          <Callout type="warning" title="Never Scan in Production">
            If you find yourself scanning in production code, stop. Your data model is wrong for your access pattern. Either add a Global Secondary Index (GSI) that lets you query, or restructure your data. Scans are only acceptable for one-time migrations or admin scripts on small tables.
          </Callout>

          <CodeBlock
            code={`# QUERY: Uses partition key (fast)
# Table: orders, PK: user_id, SK: order_id
response = table.query(
    KeyConditionExpression=Key('user_id').eq('user_123')
)
orders = response['Items']  # All orders for user_123

# Query with sort key condition
response = table.query(
    KeyConditionExpression=
        Key('user_id').eq('user_123') &
        Key('order_id').begins_with('2024-01')
)

# SCAN: Reads entire table (avoid in production)
response = table.scan()  # Gets everything - expensive!`}
            language="python"
            title="Query vs Scan"
          />

          <Prose>
            <strong>Conditional Writes</strong> — DynamoDB doesn't have transactions in the traditional sense (though it now supports limited transactions). Instead, it offers conditional writes: "update this item only if this condition is true." This enables optimistic locking — read an item, modify it locally, write it back only if it hasn't changed since you read it.
          </Prose>

          <Prose>
            The pattern: include a <code>version</code> attribute in your items. When reading, note the version. When writing, include a condition that the version matches what you read. If someone else modified the item (incrementing the version), your write fails with <code>ConditionalCheckFailedException</code>. You then re-read and retry.
          </Prose>

          <CodeBlock
            code={`from botocore.exceptions import ClientError

# Only update if version matches (optimistic locking)
try:
    table.update_item(
        Key={'user_id': 'user_123'},
        UpdateExpression='SET balance = balance - :amount, version = version + :one',
        ConditionExpression='version = :expected_version AND balance >= :amount',
        ExpressionAttributeValues={
            ':amount': 100,
            ':one': 1,
            ':expected_version': 5
        }
    )
except ClientError as e:
    if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
        print("Version mismatch or insufficient balance - retry")
    else:
        raise`}
            language="python"
            title="Conditional Writes"
          />

          <Callout type="tip" title="When to Use Partition + Sort Key">
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li><strong>PK only:</strong> Simple lookups by ID (users, products)</li>
              <li><strong>PK + SK:</strong> One-to-many relationships (user's orders, post's comments)</li>
            </ul>
            Example: PK=<code>user_123</code>, SK=<code>order_2024-01-15-001</code>
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 7: SQS & SNS ====================
    {
      id: "sqs-sns-python",
      title: "SQS & SNS with Python",
      subtitle: "Async messaging for decoupled systems",
      content: (
        <>
          <Prose>
            <strong>Why async messaging?</strong> Imagine your API receives an order. It needs to: charge the card, send a confirmation email, notify the warehouse, update analytics, and generate an invoice. If you do all of this synchronously, the user waits 3 seconds. If any service is slow or down, the API fails. If you need to add a new step later, you modify the API code.
          </Prose>

          <Prose>
            With async messaging, your API does one thing: accept the order and put a message on a queue. Then it returns immediately. Separate workers pull from the queue and do the processing. The user gets a fast response. If a worker is slow, messages queue up. If a worker fails, the message returns to the queue for retry. Adding new processing is just adding a new worker — the API doesn't change. This is decoupling, and it's how production systems are built.
          </Prose>

          <Prose>
            AWS offers two messaging services that work together: <strong>SQS</strong> (Simple Queue Service) for point-to-point queues, and <strong>SNS</strong> (Simple Notification Service) for pub/sub fan-out. Understanding when to use each — and when to combine them — is essential for event-driven architecture.
          </Prose>

          <ComparisonTable
            items={[
              { name: "SQS", when: "Work queues, background jobs", example: "Image processing, email sending", color: "var(--color-teal)" },
              { name: "SNS", when: "Fan-out, notifications", example: "One event triggers multiple consumers", color: "var(--color-amber)" },
              { name: "SNS → SQS", when: "Reliable fan-out", example: "Order placed → notify warehouse, billing, analytics", color: "var(--color-accent)" },
            ]}
          />

          <Prose>
            <strong>SQS Basics</strong> — The mental model is simple: messages go into a queue, workers pull them out and process them. But there are important details. Messages are not automatically deleted — you must explicitly delete them after successful processing. If you don't delete within the "visibility timeout," the message reappears for another worker to try. This is how SQS provides automatic retry.
          </Prose>

          <CodeBlock
            code={`import boto3
import json

sqs = boto3.client('sqs')
queue_url = 'https://sqs.us-east-1.amazonaws.com/123456789/my-queue'

# Send a message
sqs.send_message(
    QueueUrl=queue_url,
    MessageBody=json.dumps({
        'task': 'process_image',
        'image_id': 'img_123',
        'operations': ['resize', 'compress']
    })
)

# Send with delay (message invisible for 60 seconds)
sqs.send_message(
    QueueUrl=queue_url,
    MessageBody=json.dumps({'scheduled': True}),
    DelaySeconds=60
)`}
            language="python"
            title="Sending SQS Messages"
          />

          <CodeBlock
            code={`# Receive messages (long polling)
response = sqs.receive_message(
    QueueUrl=queue_url,
    MaxNumberOfMessages=10,  # Up to 10 at once
    WaitTimeSeconds=20,      # Long poll - wait up to 20s for messages
    VisibilityTimeout=60     # Hide message for 60s while processing
)

for msg in response.get('Messages', []):
    # Process the message
    body = json.loads(msg['Body'])
    print(f"Processing: {body}")

    # Delete after successful processing
    sqs.delete_message(
        QueueUrl=queue_url,
        ReceiptHandle=msg['ReceiptHandle']
    )
    # If you don't delete, message reappears after VisibilityTimeout`}
            language="python"
            title="Receiving and Processing Messages"
          />

          <Callout type="insight" title="Visibility Timeout: How Retries Work">
            When you receive a message, SQS hides it from other consumers for the visibility timeout period (default 30 seconds). If you don't delete it in time, it becomes visible again and another worker receives it. This is "at-least-once delivery" — messages might be processed multiple times if a worker crashes mid-processing. Design your workers to be <strong>idempotent</strong>: processing the same message twice should have the same result as processing it once.
          </Callout>

          <Prose>
            <strong>Lambda + SQS</strong> — The most common pattern is Lambda as an SQS worker. You configure SQS as a Lambda trigger, and AWS automatically polls the queue, batches messages, invokes your Lambda, and handles success/failure. If your Lambda succeeds, AWS deletes the messages. If it fails (throws an exception), the messages return to the queue. You don't write any polling code — just a handler that processes a batch of messages.
          </Prose>

          <CodeBlock
            code={`# Lambda handler for SQS trigger
def handler(event, context):
    # event['Records'] contains the SQS messages
    for record in event['Records']:
        body = json.loads(record['body'])
        message_id = record['messageId']

        try:
            process_message(body)
            # Success - Lambda deletes message automatically
        except Exception as e:
            print(f"Failed to process {message_id}: {e}")
            # Raise to mark as failed - message returns to queue
            raise

    return {'statusCode': 200}`}
            language="python"
            title="Lambda SQS Handler"
          />

          <Prose>
            <strong>Dead Letter Queues (DLQ)</strong> — What happens when a message keeps failing? Maybe the data is malformed, or there's a bug in your code, or a dependency is permanently down. Without a DLQ, the message keeps retrying forever, burning Lambda invocations and potentially blocking the queue. With a DLQ, after N failures (typically 3-5), the message moves to a separate "dead letter" queue where it waits for human investigation.
          </Prose>

          <Prose>
            DLQs are essential for production systems. Set up CloudWatch alarms on DLQ message count — any messages appearing there means something is wrong. You can then investigate the failed messages, fix the issue, and either reprocess them or discard them.
          </Prose>

          <CodeBlock
            code={`# Configure when creating the queue (or in CloudFormation/SAM)
# Main queue redrive policy:
{
    "deadLetterTargetArn": "arn:aws:sqs:us-east-1:123456789:my-dlq",
    "maxReceiveCount": 3  # After 3 failures, send to DLQ
}

# Monitor DLQ - process or alert on messages that land there
dlq_response = sqs.receive_message(QueueUrl=dlq_url)
for msg in dlq_response.get('Messages', []):
    print(f"Failed message: {msg['Body']}")
    # Investigate, fix, and optionally reprocess`}
            language="python"
            title="Dead Letter Queues"
          />

          <Prose>
            <strong>SNS for Fan-Out</strong> — Sometimes one event needs to trigger multiple independent actions. Order placed? Charge the card, send email, notify warehouse, update analytics. Each is independent — you don't want analytics failure to block the email.
          </Prose>

          <Callout type="tip" title="SNS → Multiple SQS Pattern">
            Publish to SNS topic → Multiple SQS queues subscribe → Each has its own Lambda consumer.
            <br /><br />
            Order placed → SNS topic → SQS for warehouse (Lambda), SQS for billing (Lambda), SQS for analytics (Lambda)
            <br /><br />
            Each consumer processes independently at its own pace. If analytics is slow, warehouse and billing aren't affected. If billing fails, it retries from its queue without affecting others. This is how you build resilient event-driven systems.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 8: AWS SAM ====================
    {
      id: "aws-sam-basics",
      title: "AWS SAM Basics",
      subtitle: "Deploy serverless apps with YAML + CLI",
      content: (
        <>
          <Prose>
            <strong>SAM (Serverless Application Model)</strong> is AWS's framework for deploying serverless applications. Instead of clicking through the AWS Console — create Lambda, configure trigger, set permissions, create DynamoDB table, connect them — you define your entire infrastructure in a YAML file and deploy with one command. This is Infrastructure as Code, and it's how production systems are built.
          </Prose>

          <Prose>
            SAM is an extension of CloudFormation, AWS's general Infrastructure as Code service. CloudFormation can deploy anything in AWS but is verbose. SAM adds shortcuts for serverless resources — you can define a Lambda with API Gateway trigger in 10 lines instead of 50. SAM also provides local testing, so you can invoke Lambdas on your machine before deploying.
          </Prose>

          <Prose>
            The workflow is: write code and <code>template.yaml</code> → <code>sam build</code> (packages code and dependencies) → <code>sam deploy</code> (creates/updates AWS resources) → your app is live. Changes to infrastructure are just changes to the YAML file — no Console clicking, no forgetting steps, fully version-controlled and repeatable.
          </Prose>

          <CodeBlock
            code={`# Install SAM CLI
pip install aws-sam-cli

# Create a new project
sam init --runtime python3.11 --name my-app

# This creates:
# my-app/
# ├── template.yaml      # Infrastructure definition
# ├── src/
# │   └── app.py        # Lambda code
# └── requirements.txt   # Dependencies`}
            language="bash"
            title="Getting Started"
          />

          <Prose>
            <strong>The template.yaml</strong> — This is the heart of SAM. It defines every AWS resource your application needs: Lambda functions, API Gateway endpoints, DynamoDB tables, SQS queues, IAM permissions, and how they connect. When you run <code>sam deploy</code>, AWS creates or updates all these resources to match your template.
          </Prose>

          <CodeBlock
            code={`AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: My serverless API

Globals:
  Function:
    Timeout: 30
    Runtime: python3.11

Resources:
  # Lambda function with API Gateway trigger
  ApiFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/app.handler
      MemorySize: 256
      Environment:
        Variables:
          TABLE_NAME: !Ref DataTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref DataTable
      Events:
        GetItems:
          Type: Api
          Properties:
            Path: /items
            Method: get
        PostItem:
          Type: Api
          Properties:
            Path: /items
            Method: post

  # DynamoDB table
  DataTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: my-items
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: id
          AttributeType: S
      KeySchema:
        - AttributeName: id
          KeyType: HASH

Outputs:
  ApiUrl:
    Description: API Gateway URL
    Value: !Sub "https://\${ServerlessRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/"`}
            language="yaml"
            title="template.yaml"
          />

          <Prose>
            <strong>Deploy Commands</strong> — SAM has a small set of commands you'll use constantly. <code>sam build</code> prepares your code for deployment: it installs dependencies from <code>requirements.txt</code>, packages your code, and stages everything in a <code>.aws-sam</code> directory. <code>sam deploy</code> uploads to S3 and creates/updates AWS resources via CloudFormation. The first time you deploy, use <code>--guided</code> to set options interactively — SAM saves your choices to <code>samconfig.toml</code> for future deploys.
          </Prose>

          <Prose>
            Local testing is where SAM shines for development. <code>sam local invoke</code> runs your Lambda in a Docker container that matches the AWS runtime — your code runs locally but in the same environment as production. <code>sam local start-api</code> starts a local API Gateway, so you can test HTTP endpoints with curl or a browser before deploying.
          </Prose>

          <CodeBlock
            code={`# Build the application (installs dependencies, packages code)
sam build

# Deploy (first time - interactive prompts)
sam deploy --guided

# Subsequent deploys (uses saved config)
sam deploy

# Test locally (invokes Lambda on your machine)
sam local invoke ApiFunction --event events/test.json

# Start local API Gateway
sam local start-api
# Now test at http://localhost:3000/items`}
            language="bash"
            title="SAM Commands"
          />

          <Callout type="tip" title="Key SAM Resource Types">
            <ul className="list-disc pl-4 space-y-1 mt-2">
              <li><code>AWS::Serverless::Function</code> — Lambda with event triggers (most common)</li>
              <li><code>AWS::Serverless::Api</code> — API Gateway (often implicit from Function Events)</li>
              <li><code>AWS::Serverless::SimpleTable</code> — Basic DynamoDB table (or use full AWS::DynamoDB::Table)</li>
              <li><code>AWS::SQS::Queue</code> — SQS queue (use standard CloudFormation syntax)</li>
            </ul>
            SAM resources start with <code>AWS::Serverless::</code>. You can mix SAM and standard CloudFormation resources in the same template.
          </Callout>

          <Prose>
            <strong>Environment-Specific Deploys</strong> — Real applications have multiple environments: dev, staging, production. SAM supports this with parameters. Define a parameter in your template, use it in resource names and configuration, and pass different values at deploy time. Each environment gets its own CloudFormation stack, completely isolated.
          </Prose>

          <CodeBlock
            code={`# Deploy to different environments
sam deploy --stack-name my-app-dev --parameter-overrides Environment=dev
sam deploy --stack-name my-app-prod --parameter-overrides Environment=prod

# In template.yaml, use parameters:
Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]

Resources:
  DataTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: !Sub "my-items-\${Environment}"`}
            language="yaml"
            title="Environment Parameters"
          />

          <Callout type="insight" title="SAM vs CDK">
            <strong>SAM:</strong> YAML-based, simpler, purpose-built for serverless. Good for straightforward Lambda/API/DynamoDB apps.
            <br /><br />
            <strong>CDK:</strong> Python/TypeScript code, more powerful, better for complex infrastructure. Good when you need loops, conditionals, or custom constructs.
            <br /><br />
            Start with SAM. Move to CDK when SAM feels limiting.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 9: BEDROCK FUNDAMENTALS ====================
    {
      id: "bedrock-fundamentals",
      title: "Bedrock: Foundation Models as a Service",
      subtitle: "Managed access to Claude, Titan, Llama, and more",
      content: (
        <>
          <Prose>
            <strong>Amazon Bedrock</strong> is AWS's fully managed service for accessing foundation models. Instead of hosting models yourself, you make API calls to AWS and they handle the infrastructure. Claude, Titan, Llama, Mistral — all available through a unified API.
          </Prose>

          <Prose>
            This matters because running your own LLMs is hard. You need GPUs, model weights, inference optimization, and scaling infrastructure. Bedrock abstracts all of that: you send text, you get text back. Pay per token, scale automatically, no model hosting required.
          </Prose>

          <Prose>
            Bedrock has two boto3 clients with different purposes. <code>bedrock</code> handles management operations — listing available models, managing model access. <code>bedrock-runtime</code> handles inference — actually calling the models. You'll use <code>bedrock-runtime</code> 99% of the time.
          </Prose>

          <CodeBlock
            code={`import boto3

# Management client - list models, manage access
bedrock = boto3.client('bedrock', region_name='us-east-1')
models = bedrock.list_foundation_models()['modelSummaries']
for model in models[:5]:
    print(f"{model['modelId']}: {model['modelName']}")

# Runtime client - call models for inference
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')`}
            language="python"
            title="Two Bedrock Clients"
          />

          <Prose>
            <strong>Converse API vs InvokeModel</strong> — There are two ways to call models. <code>InvokeModel</code> is the original API: you format requests according to each model's specific schema (Claude uses one format, Titan uses another). <code>Converse</code> is the newer, unified API: same request format works for all models. Always prefer Converse for new code.
          </Prose>

          <CodeBlock
            code={`# Converse API (recommended) - works with any model
response = bedrock_runtime.converse(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    messages=[
        {'role': 'user', 'content': [{'text': 'Explain serverless in one paragraph.'}]}
    ],
    inferenceConfig={
        'maxTokens': 512,
        'temperature': 0.7,
        'topP': 0.9
    }
)

# Extract the response text
answer = response['output']['message']['content'][0]['text']
print(answer)`}
            language="python"
            title="Converse API (Recommended)"
          />

          <Callout type="warning" title="Enable Model Access First">
            Before you can call a model, you must enable it in the AWS Console. Go to Bedrock → Model access → Request access for the models you need. Some models (like Claude) require clicking through agreements. This is a one-time setup per account/region.
          </Callout>

          <Prose>
            <strong>Understanding Token Pricing</strong> — Bedrock charges per token, with different rates for input and output tokens. Input tokens are what you send (your prompt). Output tokens are what the model generates. A typical rule of thumb: 1 token ≈ 4 characters in English. Longer prompts and responses cost more.
          </Prose>

          <ComparisonTable
            items={[
              { name: "Claude 3 Sonnet", when: "Balanced: smart + affordable", example: "$3 / 1M input, $15 / 1M output", color: "var(--color-accent)" },
              { name: "Claude 3 Haiku", when: "Fast + cheap, simpler tasks", example: "$0.25 / 1M input, $1.25 / 1M output", color: "var(--color-teal)" },
              { name: "Titan Text", when: "AWS native, cost effective", example: "$0.30 / 1M input, $0.40 / 1M output", color: "var(--color-amber)" },
            ]}
          />

          <Callout type="tip" title="Model Selection Strategy">
            Start with Claude 3 Haiku for prototyping — it's fast and cheap. Move to Sonnet when you need better reasoning. Use Opus only for complex tasks where quality justifies cost. Titan is good for simpler text generation at AWS-native prices.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 10: BEDROCK TEXT GENERATION ====================
    {
      id: "bedrock-text-generation",
      title: "Bedrock: Text Generation",
      subtitle: "Prompts, conversations, and streaming",
      content: (
        <>
          <Prose>
            Calling an LLM is more than sending text and getting text back. You need to understand system prompts, multi-turn conversations, streaming, and inference parameters. These determine the quality and behavior of your AI application.
          </Prose>

          <Prose>
            <strong>System Prompts</strong> — The system prompt sets the AI's behavior, personality, and constraints. It's instruction to the model that persists across the conversation. "You are a helpful AWS expert" shapes every response. System prompts are powerful: they can enforce output formats, set guardrails, and establish expertise domains.
          </Prose>

          <CodeBlock
            code={`response = bedrock_runtime.converse(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    messages=[
        {'role': 'user', 'content': [{'text': 'How do I optimize Lambda cold starts?'}]}
    ],
    system=[
        {'text': '''You are an AWS Solutions Architect with 10 years of experience.

Rules:
- Be concise but thorough
- Always mention specific AWS services by name
- Include code examples when relevant
- If you don't know something, say so'''}
    ]
)`}
            language="python"
            title="System Prompts"
          />

          <Prose>
            <strong>Multi-Turn Conversations</strong> — Real conversations have history. The user asks a question, you answer, they follow up. To maintain context, you must send the entire conversation history with each request. The model doesn't remember previous calls — you provide memory by including past messages.
          </Prose>

          <CodeBlock
            code={`# Build conversation history
conversation = [
    {'role': 'user', 'content': [{'text': 'What is DynamoDB?'}]},
    {'role': 'assistant', 'content': [{'text': 'DynamoDB is AWS\\'s fully managed NoSQL database...'}]},
    {'role': 'user', 'content': [{'text': 'How do I model a one-to-many relationship?'}]}
]

# Send full history - model sees the context
response = bedrock_runtime.converse(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    messages=conversation,
    system=[{'text': 'You are a DynamoDB expert.'}]
)

# Add response to history for next turn
conversation.append({
    'role': 'assistant',
    'content': response['output']['message']['content']
})`}
            language="python"
            title="Multi-Turn Conversations"
          />

          <Callout type="insight" title="Context Window Limits">
            Models have context limits (Claude 3 Sonnet: ~200K tokens). Long conversations eventually hit this limit. Strategies: summarize old messages, keep only recent N turns, or use retrieval to pull relevant history. For most applications, keeping the last 10-20 turns is sufficient.
          </Callout>

          <Prose>
            <strong>Streaming Responses</strong> — Waiting 5-10 seconds for a complete response feels slow. Streaming sends tokens as they're generated, so users see text appearing in real-time. This is essential for chat interfaces and dramatically improves perceived performance.
          </Prose>

          <CodeBlock
            code={`# Streaming - tokens arrive as generated
response = bedrock_runtime.converse_stream(
    modelId='anthropic.claude-3-sonnet-20240229-v1:0',
    messages=[{'role': 'user', 'content': [{'text': 'Write a haiku about Lambda'}]}]
)

# Process the stream
for event in response['stream']:
    if 'contentBlockDelta' in event:
        chunk = event['contentBlockDelta']['delta']['text']
        print(chunk, end='', flush=True)  # Print as it arrives
    elif 'messageStop' in event:
        print()  # Done`}
            language="python"
            title="Streaming Responses"
          />

          <Prose>
            <strong>Inference Parameters</strong> — These control how the model generates text:
          </Prose>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-accent)" }}>temperature (0.0-1.0)</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Randomness. 0 = deterministic, 1 = creative. Use 0-0.3 for factual tasks, 0.7+ for creative writing.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-accent)" }}>maxTokens</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Maximum response length. Set appropriately — too low cuts off responses, too high wastes tokens on rambling.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-teal)" }}>topP (0.0-1.0)</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Nucleus sampling. 0.9 = consider tokens in top 90% probability. Usually keep at 0.9-1.0.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-teal)" }}>stopSequences</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Strings that stop generation. Useful for structured output: stop at {'"\u007d"'} for JSON.</p>
            </div>
          </div>

          <Callout type="tip" title="Lambda Integration Pattern">
            In Lambda, create the Bedrock client outside the handler (reused across invocations). For streaming responses, you'll need API Gateway WebSockets or return the full response and let the frontend handle display.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 11: BEDROCK EMBEDDINGS ====================
    {
      id: "bedrock-embeddings",
      title: "Bedrock: Embeddings",
      subtitle: "Vector representations for semantic search",
      content: (
        <>
          <Prose>
            <strong>Embeddings</strong> transform text into vectors — lists of numbers that capture semantic meaning. "How do I deploy Lambda?" and "Lambda deployment guide" have different words but similar meaning. Their embedding vectors will be close together in vector space. This enables semantic search: find content by meaning, not just keyword matching.
          </Prose>

          <Prose>
            Why does this matter? Traditional search is keyword-based: if you search "deploy Lambda," you won't find documents that say "upload function to AWS." With embeddings, you would — because the meaning is similar. This is the foundation of RAG (Retrieval Augmented Generation), where you find relevant documents and feed them to an LLM.
          </Prose>

          <CodeBlock
            code={`import json
import boto3

bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')

def get_embedding(text: str) -> list[float]:
    """Generate embedding vector for text."""
    response = bedrock_runtime.invoke_model(
        modelId='amazon.titan-embed-text-v2:0',
        body=json.dumps({'inputText': text})
    )
    result = json.loads(response['body'].read())
    return result['embedding']  # List of 1024 floats

# Generate embeddings
emb1 = get_embedding("How do I deploy a Lambda function?")
emb2 = get_embedding("Lambda deployment guide")
emb3 = get_embedding("Best pizza recipes")

print(f"Embedding dimension: {len(emb1)}")  # 1024`}
            language="python"
            title="Generating Embeddings"
          />

          <Prose>
            <strong>Cosine Similarity</strong> — To compare embeddings, use cosine similarity. It measures the angle between vectors: 1.0 means identical direction (same meaning), 0 means unrelated, -1 means opposite. Values above 0.8 typically indicate strong similarity.
          </Prose>

          <CodeBlock
            code={`import math

def cosine_similarity(a: list[float], b: list[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    return dot_product / (norm_a * norm_b)

# Compare our embeddings
sim_related = cosine_similarity(emb1, emb2)  # ~0.92 - very similar
sim_unrelated = cosine_similarity(emb1, emb3)  # ~0.45 - not similar

print(f"Lambda deploy vs Lambda guide: {sim_related:.3f}")
print(f"Lambda deploy vs pizza recipes: {sim_unrelated:.3f}")`}
            language="python"
            title="Comparing Embeddings"
          />

          <Callout type="insight" title="Embedding Models">
            Titan Embed v2 produces 1024-dimensional vectors. Each dimension captures some aspect of meaning. More dimensions = more nuance, but also more storage and computation. 1024 is a good balance for most use cases.
          </Callout>

          <Prose>
            <strong>Building a Simple Semantic Search</strong> — The pattern: embed your documents once and store the vectors. When a user searches, embed their query and find the most similar document vectors.
          </Prose>

          <CodeBlock
            code={`# Index: embed documents and store
documents = [
    "Lambda functions run your code without servers",
    "DynamoDB is a NoSQL database service",
    "S3 stores objects with unlimited capacity",
    "API Gateway creates REST and HTTP APIs",
]

# Store document embeddings (in production, use a vector DB)
doc_embeddings = [
    {'text': doc, 'embedding': get_embedding(doc)}
    for doc in documents
]

# Search: find most similar document
def search(query: str, top_k: int = 3) -> list[str]:
    query_embedding = get_embedding(query)

    # Calculate similarity to all documents
    scored = [
        (cosine_similarity(query_embedding, doc['embedding']), doc['text'])
        for doc in doc_embeddings
    ]

    # Return top matches
    scored.sort(reverse=True)
    return [text for score, text in scored[:top_k]]

results = search("How do I store files in AWS?")
# Returns: ["S3 stores objects with unlimited capacity", ...]`}
            language="python"
            title="Simple Semantic Search"
          />

          <Callout type="warning" title="Vector Storage in Production">
            This example stores embeddings in memory — fine for demos, not production. For real applications, use a vector database: OpenSearch with vector search, Pinecone, or Bedrock Knowledge Bases (which handles all of this for you).
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 12: BEDROCK KNOWLEDGE BASES ====================
    {
      id: "bedrock-knowledge-bases",
      title: "Bedrock Knowledge Bases",
      subtitle: "Managed RAG without the infrastructure",
      content: (
        <>
          <Prose>
            <strong>RAG (Retrieval Augmented Generation)</strong> is the pattern of finding relevant documents and including them in your prompt. Instead of the LLM relying only on its training data, you give it specific context: "Here are the relevant docs, now answer the question." This grounds responses in your actual data and reduces hallucinations.
          </Prose>

          <Prose>
            Building RAG yourself requires: chunking documents, generating embeddings, storing vectors, building search, and orchestrating retrieval with generation. Bedrock Knowledge Bases handles all of this. You upload documents to S3, point Knowledge Bases at them, and query with a single API call.
          </Prose>

          <Callout type="analogy" title="RAG = Open Book Exam">
            Without RAG, the LLM answers from memory (training data). With RAG, it's an open-book exam — you hand it the relevant pages, then ask the question. It can reference your specific documentation, policies, or data.
          </Callout>

          <Prose>
            <strong>How Knowledge Bases Work</strong>: You create a data source (S3 bucket with documents), Knowledge Bases automatically chunks the documents, generates embeddings, and stores them in a vector database (OpenSearch Serverless by default). When you query, it retrieves relevant chunks and optionally generates an answer using them.
          </Prose>

          <CodeBlock
            code={`import boto3

# Use bedrock-agent-runtime for Knowledge Bases
bedrock_agent = boto3.client('bedrock-agent-runtime', region_name='us-east-1')

# Just retrieve relevant documents (no generation)
response = bedrock_agent.retrieve(
    knowledgeBaseId='KBXXXXXXXXXX',  # Your Knowledge Base ID
    retrievalQuery={'text': 'What is our refund policy?'},
    retrievalConfiguration={
        'vectorSearchConfiguration': {
            'numberOfResults': 5  # Top 5 most relevant chunks
        }
    }
)

# See what was found
for result in response['retrievalResults']:
    print(f"Score: {result['score']:.3f}")
    print(f"Content: {result['content']['text'][:200]}...")
    print(f"Source: {result['location']['s3Location']['uri']}")
    print()`}
            language="python"
            title="Retrieve Documents"
          />

          <Prose>
            <strong>Retrieve and Generate</strong> — The more common pattern: retrieve relevant documents AND generate an answer using them, all in one call. The response includes citations so you can verify where information came from.
          </Prose>

          <CodeBlock
            code={`# Retrieve AND generate answer
response = bedrock_agent.retrieve_and_generate(
    input={'text': 'What is our refund policy for digital products?'},
    retrieveAndGenerateConfiguration={
        'type': 'KNOWLEDGE_BASE',
        'knowledgeBaseConfiguration': {
            'knowledgeBaseId': 'KBXXXXXXXXXX',
            'modelArn': 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0'
        }
    }
)

# The generated answer
print(response['output']['text'])

# Citations - which documents were used
for citation in response.get('citations', []):
    for ref in citation.get('retrievedReferences', []):
        print(f"Source: {ref['location']['s3Location']['uri']}")`}
            language="python"
            title="Retrieve and Generate (Full RAG)"
          />

          <Callout type="tip" title="Setting Up Knowledge Bases">
            Create via Console (Bedrock → Knowledge Bases → Create) or Infrastructure as Code. Steps: 1) Create S3 bucket with documents, 2) Create Knowledge Base pointing to bucket, 3) Sync to ingest documents, 4) Query via API. Documents are automatically chunked and embedded.
          </Callout>

          <Prose>
            <strong>Supported Data Sources</strong>: S3 (PDFs, Word docs, text, HTML, markdown), Web crawlers, Confluence, SharePoint, Salesforce. Knowledge Bases automatically extracts text, handles chunking (you can configure chunk size), and keeps the index updated when documents change.
          </Prose>

          <Callout type="warning" title="Sync After Updates">
            When you add or update documents in S3, you must trigger a sync for Knowledge Bases to process the changes. This isn't automatic. In production, trigger syncs via API or EventBridge when S3 objects change.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 13: BEDROCK AGENTS ====================
    {
      id: "bedrock-agents",
      title: "Bedrock Agents",
      subtitle: "AI assistants that take actions",
      content: (
        <>
          <Prose>
            Regular LLM calls are stateless — you send a prompt, get a response. <strong>Agents</strong> go further: they can reason about tasks, decide which tools to use, and take actions. "Book a flight from NYC to LA" isn't just a text response — the agent calls your flight booking API.
          </Prose>

          <Prose>
            Bedrock Agents are AWS's managed agent service. You define the agent's capabilities through <strong>action groups</strong> (what it can do) and connect them to Lambda functions (how it does it). The agent handles the reasoning: figuring out which actions to take and in what order.
          </Prose>

          <Callout type="insight" title="Agents = LLM + Tools + Reasoning">
            An agent is an LLM that can: 1) Understand a task, 2) Decide which tools to use, 3) Call those tools, 4) Interpret results, 5) Continue or respond. The LLM is the brain; tools are the hands; the agent loop orchestrates them.
          </Callout>

          <Prose>
            <strong>Creating an Agent (Console Workflow)</strong>: 1) Create agent with instructions (system prompt), 2) Add action groups with OpenAPI schemas, 3) Connect Lambda functions to handle actions, 4) Create an alias for deployment, 5) Invoke via API.
          </Prose>

          <CodeBlock
            code={`import boto3
import json

bedrock_agent = boto3.client('bedrock-agent-runtime', region_name='us-east-1')

# Invoke the agent
response = bedrock_agent.invoke_agent(
    agentId='AGENTID',
    agentAliasId='ALIASID',  # Use alias, not agent ID directly
    sessionId='user-123-session',  # Maintains conversation state
    inputText='What flights are available from NYC to LA next Friday?'
)

# Stream the response (agents always stream)
full_response = ""
for event in response['completion']:
    if 'chunk' in event:
        chunk_text = event['chunk']['bytes'].decode('utf-8')
        full_response += chunk_text
        print(chunk_text, end='')

print()  # Done`}
            language="python"
            title="Invoking a Bedrock Agent"
          />

          <Prose>
            <strong>How the Agent Calls Your Lambda</strong>: When the agent decides to use a tool, it invokes your Lambda with action details. Your Lambda does the work and returns the result. The agent then uses this result to continue reasoning or respond.
          </Prose>

          <CodeBlock
            code={`# Lambda handler for agent actions
def handler(event, context):
    action_group = event['actionGroup']
    function = event['function']
    parameters = event.get('parameters', [])

    # Route to the right function
    if action_group == 'FlightBooking':
        if function == 'searchFlights':
            origin = get_param(parameters, 'origin')
            destination = get_param(parameters, 'destination')
            date = get_param(parameters, 'date')

            # Your actual flight search logic
            flights = search_flights_api(origin, destination, date)

            return {
                'response': {
                    'actionGroup': action_group,
                    'function': function,
                    'functionResponse': {
                        'responseBody': {
                            'TEXT': {'body': json.dumps(flights)}
                        }
                    }
                }
            }

def get_param(params, name):
    for p in params:
        if p['name'] == name:
            return p['value']
    return None`}
            language="python"
            title="Lambda Action Handler"
          />

          <Callout type="tip" title="Session Management">
            The <code>sessionId</code> maintains conversation state. Use the same session ID for multi-turn conversations. Different users should have different session IDs. Sessions expire after 1 hour of inactivity.
          </Callout>

          <Prose>
            <strong>When to Use Bedrock Agents</strong>: Best for task-oriented assistants with defined capabilities. Customer support bots, booking systems, data lookup tools. For complex multi-step workflows or custom agent logic, consider Strands SDK or building your own.
          </Prose>
        </>
      ),
    },

    // ==================== SECTION 14: STRANDS SDK ====================
    {
      id: "strands-sdk",
      title: "Strands SDK",
      subtitle: "Open-source agent framework from AWS",
      content: (
        <>
          <Prose>
            <strong>Strands</strong> is AWS's open-source SDK for building AI agents in Python. While Bedrock Agents are configured in the Console, Strands is code-first — you build agents programmatically with full control over behavior. It's model-agnostic: works with Bedrock, but also OpenAI, Anthropic API, Ollama, and more.
          </Prose>

          <Prose>
            Why Strands over Bedrock Agents? <strong>Flexibility.</strong> You can customize every aspect of agent behavior, use any model provider, build multi-agent systems, and integrate with any tool. Strands is what teams at AWS use internally — Amazon Q Developer, AWS Glue, and VPC Reachability Analyzer are built on it.
          </Prose>

          <CodeBlock
            code={`# pip install strands-agents strands-agents-tools

from strands import Agent
from strands.models import BedrockModel
from strands_tools import calculator

# Create a simple agent
agent = Agent(
    model=BedrockModel(model_id="anthropic.claude-3-sonnet-20240229-v1:0"),
    tools=[calculator],
    system_prompt="You are a helpful assistant that can do math."
)

# Run the agent
response = agent.run("What is 15% of $847.50?")
print(response)

# The agent will:
# 1. Understand it needs to calculate
# 2. Use the calculator tool
# 3. Return the formatted result`}
            language="python"
            title="Basic Strands Agent"
          />

          <Prose>
            <strong>Custom Tools</strong> — Define tools as decorated functions. The docstring becomes the tool description that the LLM uses to decide when to call it.
          </Prose>

          <CodeBlock
            code={`from strands import Agent, tool
from strands.models import BedrockModel

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a city.

    Args:
        city: The city name to get weather for
    """
    # Your actual weather API call here
    return f"Weather in {city}: 72°F, sunny, humidity 45%"

@tool
def search_flights(origin: str, destination: str, date: str) -> str:
    """Search for available flights.

    Args:
        origin: Departure airport code (e.g., 'JFK')
        destination: Arrival airport code (e.g., 'LAX')
        date: Travel date in YYYY-MM-DD format
    """
    # Your flight search API
    return f"Found 5 flights from {origin} to {destination} on {date}..."

agent = Agent(
    model=BedrockModel(model_id="anthropic.claude-3-sonnet-20240229-v1:0"),
    tools=[get_weather, search_flights],
    system_prompt="You help users plan trips."
)

response = agent.run(
    "I want to fly from NYC to Miami next Friday. What's the weather like there?"
)
# Agent will call search_flights AND get_weather, then synthesize`}
            language="python"
            title="Custom Tools"
          />

          <Prose>
            <strong>Streaming Responses</strong> — For real-time output, use the stream method:
          </Prose>

          <CodeBlock
            code={`# Stream tokens as they're generated
for chunk in agent.stream("Explain quantum computing in simple terms"):
    print(chunk, end='', flush=True)
print()  # Done`}
            language="python"
            title="Streaming"
          />

          <Prose>
            <strong>Multi-Agent Orchestration</strong> — Strands supports multiple patterns for coordinating agents: swarms (collaborative), graphs (workflows), and agents-as-tools (hierarchical).
          </Prose>

          <CodeBlock
            code={`from strands import Agent, Swarm
from strands.models import BedrockModel

# Specialized agents
researcher = Agent(
    model=BedrockModel(model_id="anthropic.claude-3-sonnet-20240229-v1:0"),
    system_prompt="You research topics deeply, finding key facts and sources."
)

writer = Agent(
    model=BedrockModel(model_id="anthropic.claude-3-sonnet-20240229-v1:0"),
    system_prompt="You write clear, engaging content based on research."
)

editor = Agent(
    model=BedrockModel(model_id="anthropic.claude-3-sonnet-20240229-v1:0"),
    system_prompt="You edit for clarity, accuracy, and tone."
)

# Swarm orchestration
swarm = Swarm(agents=[researcher, writer, editor])
result = swarm.run("Write a blog post about serverless computing trends")

# Each agent contributes its expertise`}
            language="python"
            title="Multi-Agent Swarm"
          />

          <Callout type="insight" title="Strands vs Bedrock Agents">
            <strong>Bedrock Agents:</strong> Console-configured, managed, quick to start, limited customization.
            <br /><br />
            <strong>Strands:</strong> Code-first, open-source, full control, any model provider, multi-agent capable.
            <br /><br />
            Use Bedrock Agents for simple, single-purpose assistants. Use Strands when you need flexibility, custom logic, or multi-agent systems.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 15: AGENTCORE ====================
    {
      id: "agentcore",
      title: "AgentCore",
      subtitle: "Production infrastructure for AI agents",
      content: (
        <>
          <Prose>
            You've built an agent with Strands (or LangChain, or custom code). Now what? How do you deploy it? Handle concurrent users? Manage sessions? Store memory? <strong>AgentCore</strong> is AWS's answer: production infrastructure for running AI agents at scale.
          </Prose>

          <Prose>
            Think of AgentCore as "Lambda for agents." You write agent code, AgentCore handles deployment, scaling, session isolation, memory, and observability. It's framework-agnostic — works with Strands, LangChain, CrewAI, or your own agent implementation.
          </Prose>

          <Callout type="insight" title="The Agent Stack">
            <strong>Bedrock</strong> = Foundation models (the brain)
            <br />
            <strong>Strands/LangChain</strong> = Agent framework (how to think)
            <br />
            <strong>AgentCore</strong> = Production runtime (where to run)
            <br /><br />
            You can use any combination. AgentCore handles the infrastructure so you focus on agent logic.
          </Callout>

          <Prose>
            <strong>AgentCore Services</strong>:
          </Prose>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-accent)" }}>Runtime</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Serverless compute with session isolation. 8-hour max execution. Fast cold starts.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-accent)" }}>Memory</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Short-term (conversation) and long-term (episodic) memory. Agents learn across sessions.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-teal)" }}>Gateway</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Converts REST APIs and Lambda functions into MCP tools. Connect existing services.</p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--color-bg-tertiary)" }}>
              <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-teal)" }}>Code Interpreter</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Sandboxed Python/JS execution. Agents can write and run code safely.</p>
            </div>
          </div>

          <CodeBlock
            code={`# pip install bedrock-agentcore

from bedrock_agentcore import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

@app.entrypoint
async def handler(request):
    """Main agent entrypoint."""
    prompt = request.get("prompt")
    session_id = request.get("session_id")

    # Your agent logic (Strands, LangChain, custom)
    from strands import Agent
    from strands.models import BedrockModel

    agent = Agent(
        model=BedrockModel(model_id="anthropic.claude-3-sonnet-20240229-v1:0"),
        tools=[...],
        system_prompt="You are a helpful assistant."
    )

    # Stream responses
    async for event in agent.stream_async(prompt):
        yield event

# Run locally for development
if __name__ == "__main__":
    app.run()

# Deploy with: agentcore deploy`}
            language="python"
            title="Basic AgentCore App"
          />

          <Prose>
            <strong>Episodic Memory</strong> — AgentCore can store what agents learn across sessions. An agent helping with your codebase remembers past conversations, your preferences, and context. This is configurable — you control what's remembered.
          </Prose>

          <CodeBlock
            code={`# Access memory in your agent
from bedrock_agentcore import Memory

memory = Memory(session_id="user-123")

# Store something
await memory.store({
    "key": "user_preferences",
    "value": {"timezone": "EST", "language": "python"}
})

# Retrieve later (even in a new session)
prefs = await memory.retrieve("user_preferences")

# Episodic memory - agent remembers experiences
await memory.add_episode(
    "User asked about DynamoDB modeling. Explained single-table design."
)

# Later, agent can recall relevant episodes
episodes = await memory.recall("database design")`}
            language="python"
            title="AgentCore Memory"
          />

          <Callout type="tip" title="When to Use AgentCore">
            Use AgentCore when you need: production deployment, multi-user isolation, persistent memory, observability, or long-running agent sessions (up to 8 hours). For simple agents or prototypes, direct Strands or Bedrock Agents may be simpler.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 16: STEP FUNCTIONS ====================
    {
      id: "step-functions",
      title: "Step Functions",
      subtitle: "Orchestrating ML workflows",
      content: (
        <>
          <Prose>
            AI applications often involve multi-step workflows: ingest document → extract text → generate embeddings → store in database → notify user. Each step can fail, and you need retries, error handling, and visibility. <strong>Step Functions</strong> is AWS's orchestration service for exactly this.
          </Prose>

          <Prose>
            Step Functions are state machines defined in JSON/YAML. You define states (steps) and transitions (what happens next). AWS handles execution, retries, error routing, and provides a visual console to debug workflows. It integrates natively with Lambda, Bedrock, DynamoDB, and 200+ AWS services.
          </Prose>

          <Callout type="analogy" title="Step Functions = Flowchart as Code">
            Think of Step Functions as an executable flowchart. Each box is a state (Lambda call, Bedrock invocation, wait, choice). Arrows are transitions. When something fails, the flowchart handles it — retry, go to error handler, or fail gracefully.
          </Callout>

          <CodeBlock
            code={`import boto3
import json

sfn = boto3.client('stepfunctions')

# Start a workflow execution
response = sfn.start_execution(
    stateMachineArn='arn:aws:states:us-east-1:123456789:stateMachine:DocumentProcessor',
    name='process-doc-123',  # Unique execution name
    input=json.dumps({
        'document_id': 'doc-123',
        's3_bucket': 'my-documents',
        's3_key': 'uploads/report.pdf'
    })
)

execution_arn = response['executionArn']
print(f"Started: {execution_arn}")

# Check status
status = sfn.describe_execution(executionArn=execution_arn)
print(f"Status: {status['status']}")  # RUNNING, SUCCEEDED, FAILED`}
            language="python"
            title="Starting a Step Function"
          />

          <Prose>
            <strong>State Types</strong>: Task (do work), Choice (if/else), Parallel (concurrent branches), Map (iterate over array), Wait (pause), Pass (transform data), Succeed/Fail (terminal states).
          </Prose>

          <CodeBlock
            code={`# Step Function definition (in SAM template.yaml)
DocumentProcessor:
  Type: AWS::Serverless::StateMachine
  Properties:
    DefinitionBody:
      StartAt: ExtractText
      States:
        ExtractText:
          Type: Task
          Resource: !GetAtt ExtractFunction.Arn
          Next: GenerateEmbeddings
          Retry:
            - ErrorEquals: ["States.ALL"]
              MaxAttempts: 3
              BackoffRate: 2
          Catch:
            - ErrorEquals: ["States.ALL"]
              Next: HandleError

        GenerateEmbeddings:
          Type: Task
          Resource: arn:aws:states:::bedrock:invokeModel
          Parameters:
            ModelId: amazon.titan-embed-text-v2:0
            Body:
              inputText.$: $.extracted_text
          Next: StoreResults

        StoreResults:
          Type: Task
          Resource: !GetAtt StoreFunction.Arn
          End: true

        HandleError:
          Type: Task
          Resource: !GetAtt ErrorHandler.Arn
          End: true`}
            language="yaml"
            title="Step Function Definition"
          />

          <Callout type="tip" title="Native Bedrock Integration">
            Step Functions can call Bedrock directly — no Lambda required. Use <code>arn:aws:states:::bedrock:invokeModel</code> for synchronous calls. This reduces latency and cost for simple LLM invocations.
          </Callout>

          <Prose>
            <strong>Express vs Standard Workflows</strong>: Standard workflows are for long-running processes (up to 1 year), exactly-once execution, full history. Express workflows are for high-volume, short-duration (5 minutes max), at-least-once execution. Use Express for real-time, Standard for batch and critical processes.
          </Prose>

          <Callout type="insight" title="When to Use Step Functions">
            Use Step Functions when: multiple steps with dependencies, need for retries and error handling, long-running processes, visual debugging matters, or you're orchestrating multiple AWS services. For simple sequential Lambda calls, direct invocation may be simpler.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 17: SECRETS MANAGER ====================
    {
      id: "secrets-manager",
      title: "Secrets Manager",
      subtitle: "Managing API keys and credentials securely",
      content: (
        <>
          <Prose>
            Your AI application needs API keys: Anthropic, OpenAI, third-party services. Where do you put them? <strong>Not in code</strong> (gets committed to git). <strong>Not in environment variables</strong> (visible in AWS Console, can't rotate easily). Use <strong>Secrets Manager</strong> — AWS's service for storing, rotating, and accessing secrets securely.
          </Prose>

          <Prose>
            Secrets Manager encrypts secrets at rest (KMS), controls access via IAM, provides rotation capabilities, and logs all access in CloudTrail. Your Lambda requests a secret, IAM checks permissions, Secrets Manager returns the value. If the secret is compromised, rotate it in one place — all services get the new value automatically.
          </Prose>

          <CodeBlock
            code={`import boto3
import json

secrets = boto3.client('secretsmanager')

# Retrieve a secret
response = secrets.get_secret_value(SecretId='prod/api/anthropic')

# Secrets are typically stored as JSON strings
secret = json.loads(response['SecretString'])
api_key = secret['api_key']

# Use the secret
import anthropic
client = anthropic.Anthropic(api_key=api_key)`}
            language="python"
            title="Retrieving Secrets"
          />

          <Callout type="warning" title="Cache Secrets in Lambda">
            Fetching secrets adds latency and cost. In Lambda, fetch once outside the handler and cache. The secret stays cached across warm invocations.
          </Callout>

          <CodeBlock
            code={`import boto3
import json
from functools import lru_cache

secrets = boto3.client('secretsmanager')

@lru_cache(maxsize=1)
def get_api_secrets():
    """Fetch and cache secrets. Called once per Lambda container."""
    response = secrets.get_secret_value(SecretId='prod/api/keys')
    return json.loads(response['SecretString'])

# In Lambda handler
def handler(event, context):
    secrets = get_api_secrets()  # Cached after first call
    anthropic_key = secrets['anthropic_api_key']
    openai_key = secrets['openai_api_key']

    # Use secrets...`}
            language="python"
            title="Caching Secrets in Lambda"
          />

          <Prose>
            <strong>Secrets Manager vs Parameter Store</strong>: Both store configuration. Parameter Store is free (for standard parameters), good for non-sensitive config. Secrets Manager costs ($0.40/secret/month), but offers automatic rotation and is designed for sensitive data. Use Parameter Store for feature flags and config; Secrets Manager for API keys and credentials.
          </Prose>

          <ComparisonTable
            items={[
              { name: "Secrets Manager", when: "API keys, passwords, credentials", example: "Anthropic key, DB password", color: "var(--color-accent)" },
              { name: "Parameter Store", when: "Config, feature flags", example: "Model ID, rate limits", color: "var(--color-teal)" },
              { name: "Environment Vars", when: "Non-sensitive, rarely changed", example: "Region, log level", color: "var(--color-amber)" },
            ]}
          />

          <CodeBlock
            code={`# In SAM template - grant Lambda access to secret
MyFunction:
  Type: AWS::Serverless::Function
  Properties:
    Handler: app.handler
    Policies:
      - Version: '2012-10-17'
        Statement:
          - Effect: Allow
            Action:
              - secretsmanager:GetSecretValue
            Resource: !Sub 'arn:aws:secretsmanager:\${AWS::Region}:\${AWS::AccountId}:secret:prod/api/*'`}
            language="yaml"
            title="IAM Policy for Secrets Access"
          />

          <Callout type="tip" title="Secret Rotation">
            Secrets Manager can automatically rotate secrets on a schedule. For database passwords, AWS provides rotation Lambda functions. For API keys, you may need custom rotation logic. Even if you don't auto-rotate, centralizing secrets means you rotate in one place when needed.
          </Callout>
        </>
      ),
    },

    // ==================== SECTION 18: THE GIL (was Section 9) ====================
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
