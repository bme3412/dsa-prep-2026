import type { DataStructure } from "../../types";
import { MLPipelineViz } from "../../visualizations/production-ml/MLPipelineViz";
import { RAGFlowViz } from "../../visualizations/production-ml/RAGFlowViz";
import { EmbeddingSpaceViz } from "../../visualizations/production-ml/EmbeddingSpaceViz";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed">
    {children}
  </div>
);

export const productionMLContent: DataStructure = {
  id: "production-ml",
  name: "Production ML",
  icon: "⚙️",
  color: "green",
  tagline: "ML systems at scale",
  description:
    "Building reliable, scalable machine learning systems for production environments. From feature engineering to model serving, monitoring, and RAG architectures.",

  sections: [
    {
      id: "ml-system-architecture",
      title: "ML system architecture",
      subtitle: "Training vs serving separation",
      content: (
        <>
          <Prose>
            Production ML systems separate <strong>training</strong> (batch, expensive, offline)
            from <strong>serving</strong> (real-time, cheap, online). Key components:
          </Prose>
          <MLPipelineViz />
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-green)" }}>
                Training Pipeline
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• Feature engineering at scale</li>
                <li>• Model training & hyperparameter tuning</li>
                <li>• Evaluation & validation</li>
                <li>• Model registry & versioning</li>
              </ul>
            </div>
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
                Serving Infrastructure
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• Model loading & inference</li>
                <li>• Feature retrieval (feature store)</li>
                <li>• Request batching & caching</li>
                <li>• A/B testing & canary deployments</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "feature-engineering",
      title: "Feature engineering",
      subtitle: "From raw data to model inputs",
      content: (
        <>
          <Prose>
            Features are the inputs to ML models. In production, feature engineering must be:
            <strong> consistent</strong> (same logic for training and serving),
            <strong> scalable</strong> (handle large datasets), and
            <strong> fresh</strong> (timely for real-time use cases).
          </Prose>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-semibold mb-2">Feature Store Pattern</p>
            <pre
              className="text-xs leading-relaxed overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`class FeatureStore:
    def __init__(self, offline_store, online_store):
        self.offline = offline_store  # For training (S3/BigQuery)
        self.online = online_store    # For serving (Redis/DynamoDB)

    def materialize(self, feature_view: str, start: datetime, end: datetime):
        """Compute features for a time range and store them."""
        raw_data = self.offline.read(start, end)
        features = compute_features(raw_data)
        self.offline.write(features)
        self.online.write(features.latest())  # Most recent for serving

    def get_online_features(self, entity_ids: list[str]) -> dict:
        """Low-latency feature retrieval for inference."""
        return self.online.batch_get(entity_ids)

    def get_training_data(self, feature_view: str, label: str) -> DataFrame:
        """Point-in-time correct training data."""
        return self.offline.join(feature_view, label, point_in_time=True)`}
            </pre>
          </div>
          <Prose>
            <strong>Point-in-time correctness</strong> is critical: training data must only use
            features available at prediction time to avoid data leakage.
          </Prose>
        </>
      ),
    },
    {
      id: "model-serving",
      title: "Model serving patterns",
      subtitle: "Batch vs real-time inference",
      content: (
        <>
          <Prose>
            Model serving depends on latency requirements and scale. Choose the right pattern:
          </Prose>
          <div className="grid grid-cols-3 gap-3 my-4">
            {[
              {
                title: "Batch Inference",
                latency: "Minutes-hours",
                use: "Recommendations, reports",
                color: "var(--color-teal)",
              },
              {
                title: "Real-time API",
                latency: "< 100ms",
                use: "Fraud detection, pricing",
                color: "var(--color-accent)",
              },
              {
                title: "Streaming",
                latency: "< 1s",
                use: "Anomaly detection",
                color: "var(--color-amber)",
              },
            ].map((pattern) => (
              <div
                key={pattern.title}
                className="p-3 rounded-[var(--radius-md)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <p className="text-xs font-semibold" style={{ color: pattern.color }}>
                  {pattern.title}
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  Latency: {pattern.latency}
                </p>
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  Use case: {pattern.use}
                </p>
              </div>
            ))}
          </div>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-semibold mb-2">Model Server Pattern</p>
            <pre
              className="text-xs leading-relaxed overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`class ModelServer:
    def __init__(self, model_path: str):
        self.model = load_model(model_path)
        self.feature_store = FeatureStore()
        self.cache = LRUCache(maxsize=10000)

    async def predict(self, entity_id: str) -> Prediction:
        # Check cache first
        if cached := self.cache.get(entity_id):
            return cached

        # Get features and predict
        features = await self.feature_store.get_online_features([entity_id])
        prediction = self.model.predict(features)

        self.cache.set(entity_id, prediction, ttl=300)
        return prediction

    async def predict_batch(self, entity_ids: list[str]) -> list[Prediction]:
        """Batch predictions for efficiency."""
        features = await self.feature_store.get_online_features(entity_ids)
        return self.model.predict_batch(features)`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "rag-systems",
      title: "RAG systems",
      subtitle: "Retrieval-augmented generation",
      content: (
        <>
          <Prose>
            RAG combines retrieval with generation to ground LLM responses in external knowledge.
            Critical for reducing hallucination and providing up-to-date information.
          </Prose>
          <RAGFlowViz />
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2">Chunking Strategies</p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• <strong>Fixed-size:</strong> Simple, may break context</li>
                <li>• <strong>Semantic:</strong> Respect paragraph/section boundaries</li>
                <li>• <strong>Recursive:</strong> Split on headers, then paragraphs</li>
                <li>• <strong>Overlap:</strong> Include context from neighbors</li>
              </ul>
            </div>
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2">Retrieval Tuning</p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• <strong>k value:</strong> More chunks = more context, higher cost</li>
                <li>• <strong>Threshold:</strong> Filter low-similarity results</li>
                <li>• <strong>Reranking:</strong> Cross-encoder for precision</li>
                <li>• <strong>Hybrid:</strong> Combine vector + keyword search</li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "embeddings",
      title: "Embeddings & vector databases",
      subtitle: "Semantic similarity at scale",
      content: (
        <>
          <Prose>
            Embeddings map text to dense vectors where similar concepts are close together.
            Vector databases enable efficient similarity search over millions of vectors.
          </Prose>
          <EmbeddingSpaceViz />
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-semibold mb-2">Vector Search Implementation</p>
            <pre
              className="text-xs leading-relaxed overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`from pinecone import Pinecone
from openai import OpenAI

class VectorStore:
    def __init__(self):
        self.pc = Pinecone()
        self.index = self.pc.Index("documents")
        self.embedder = OpenAI()

    def embed(self, text: str) -> list[float]:
        response = self.embedder.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def upsert(self, doc_id: str, text: str, metadata: dict):
        embedding = self.embed(text)
        self.index.upsert([(doc_id, embedding, metadata)])

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        query_embedding = self.embed(query)
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        return [{"id": m.id, "score": m.score, **m.metadata}
                for m in results.matches]`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "monitoring",
      title: "ML monitoring & observability",
      subtitle: "Detecting model degradation",
      content: (
        <>
          <Prose>
            ML models degrade over time due to <strong>data drift</strong> (input distribution changes)
            and <strong>concept drift</strong> (relationship between inputs and outputs changes).
            Monitoring is essential for production reliability.
          </Prose>
          <div className="grid grid-cols-2 gap-4 my-4">
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-coral)" }}>
                What to Monitor
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• <strong>Input drift:</strong> Feature distributions</li>
                <li>• <strong>Prediction drift:</strong> Output distributions</li>
                <li>• <strong>Performance:</strong> Accuracy, latency, throughput</li>
                <li>• <strong>Business metrics:</strong> Revenue impact, user engagement</li>
              </ul>
            </div>
            <div
              className="p-3 rounded-[var(--radius-md)]"
              style={{ background: "var(--color-bg-tertiary)" }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-green)" }}>
                Detection Methods
              </p>
              <ul className="text-xs space-y-1" style={{ color: "var(--color-text-secondary)" }}>
                <li>• <strong>Statistical tests:</strong> KS test, PSI</li>
                <li>• <strong>Windowed comparison:</strong> Rolling vs baseline</li>
                <li>• <strong>Threshold alerts:</strong> P95 latency, error rate</li>
                <li>• <strong>Shadow scoring:</strong> Compare model versions</li>
              </ul>
            </div>
          </div>
          <div
            className="rounded-[var(--radius-md)] p-4 my-4"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-semibold mb-2">Drift Detection</p>
            <pre
              className="text-xs leading-relaxed overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-primary)" }}
            >
{`from scipy import stats
import numpy as np

class DriftDetector:
    def __init__(self, baseline_data: np.ndarray):
        self.baseline = baseline_data
        self.threshold = 0.05  # p-value threshold

    def detect_drift(self, current_data: np.ndarray) -> dict:
        """Detect drift using Kolmogorov-Smirnov test."""
        results = {}
        for i, feature_name in enumerate(self.feature_names):
            statistic, p_value = stats.ks_2samp(
                self.baseline[:, i],
                current_data[:, i]
            )
            results[feature_name] = {
                "statistic": statistic,
                "p_value": p_value,
                "drift_detected": p_value < self.threshold
            }
        return results`}
            </pre>
          </div>
        </>
      ),
    },
    {
      id: "ab-testing",
      title: "A/B testing for models",
      subtitle: "Experimentation in production",
      content: (
        <>
          <Prose>
            A/B testing compares model versions in production with real traffic. Key considerations:
            sample size, metric selection, and statistical significance.
          </Prose>
          <div className="grid grid-cols-3 gap-3 my-4">
            {[
              { title: "Canary", desc: "1-5% traffic to new model", color: "var(--color-amber)" },
              { title: "Shadow", desc: "Log predictions, don't serve", color: "var(--color-teal)" },
              { title: "Interleaving", desc: "Mix results from both models", color: "var(--color-accent)" },
            ].map((strategy) => (
              <div
                key={strategy.title}
                className="p-3 rounded-[var(--radius-md)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <p className="text-xs font-semibold" style={{ color: strategy.color }}>
                  {strategy.title}
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  {strategy.desc}
                </p>
              </div>
            ))}
          </div>
          <div
            className="rounded-[var(--radius-md)] p-3"
            style={{ background: "var(--color-green-dim)" }}
          >
            <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <strong style={{ color: "var(--color-green)" }}>Best practice:</strong>{" "}
              Start with shadow mode to validate predictions without user impact. Graduate to
              canary (small %), then ramp up traffic as confidence grows.
            </p>
          </div>
        </>
      ),
    },
  ],

  operations: [
    { name: "Embedding generation", time: "O(n)", space: "O(d)", note: "n=tokens, d=embedding dim" },
    { name: "Vector search (HNSW)", time: "O(log n)", space: "O(n)", note: "Approximate nearest neighbor" },
    { name: "Batch inference", time: "O(b × m)", space: "O(b)", note: "b=batch size, m=model complexity" },
    { name: "Feature retrieval", time: "O(k)", space: "O(k)", note: "k=number of features" },
    { name: "Model loading", time: "O(m)", space: "O(m)", note: "m=model size" },
    { name: "Drift detection", time: "O(n log n)", space: "O(n)", note: "KS test complexity" },
  ],

  patterns: [
    {
      name: "RAG Pipeline",
      description: "Retrieval-augmented generation pattern",
      code: `class RAGPipeline:
    def __init__(self, vector_store, llm):
        self.vector_store = vector_store
        self.llm = llm

    async def query(self, question: str, top_k: int = 5) -> str:
        # Retrieve relevant chunks
        chunks = await self.vector_store.search(question, top_k=top_k)

        # Build context
        context = "\\n\\n".join([c["text"] for c in chunks])

        # Generate response
        prompt = f"""Answer based on the following context:

{context}

Question: {question}
Answer:"""

        response = await self.llm.generate(prompt)
        return response`,
    },
    {
      name: "Feature Pipeline",
      description: "Scalable feature computation",
      code: `from pyspark.sql import SparkSession

def compute_features(spark: SparkSession, date: str):
    """Compute daily features using Spark."""
    raw_data = spark.read.parquet(f"s3://data/raw/{date}")

    features = raw_data.groupBy("user_id").agg(
        F.count("event").alias("event_count"),
        F.avg("value").alias("avg_value"),
        F.max("timestamp").alias("last_seen"),
        F.collect_list("category").alias("categories")
    )

    # Write to feature store
    features.write.mode("overwrite").parquet(
        f"s3://features/daily/{date}"
    )

    # Update online store
    update_online_store(features.collect())`,
    },
    {
      name: "Model Registry",
      description: "Version and track models",
      code: `import mlflow

class ModelRegistry:
    def __init__(self, tracking_uri: str):
        mlflow.set_tracking_uri(tracking_uri)

    def register(self, model, name: str, metrics: dict):
        with mlflow.start_run():
            mlflow.log_metrics(metrics)
            mlflow.sklearn.log_model(model, name)
            mlflow.register_model(
                f"runs:/{mlflow.active_run().info.run_id}/{name}",
                name
            )

    def promote(self, name: str, version: int, stage: str):
        """Promote model to staging/production."""
        client = mlflow.tracking.MlflowClient()
        client.transition_model_version_stage(
            name=name, version=version, stage=stage
        )

    def load(self, name: str, stage: str = "Production"):
        return mlflow.pyfunc.load_model(f"models:/{name}/{stage}")`,
    },
    {
      name: "Semantic Cache",
      description: "Cache similar LLM queries",
      code: `class SemanticCache:
    def __init__(self, vector_store, similarity_threshold: float = 0.95):
        self.vector_store = vector_store
        self.threshold = similarity_threshold
        self.cache = {}

    async def get(self, query: str) -> str | None:
        # Search for similar queries
        results = await self.vector_store.search(query, top_k=1)

        if results and results[0]["score"] >= self.threshold:
            cache_key = results[0]["id"]
            return self.cache.get(cache_key)

        return None

    async def set(self, query: str, response: str):
        # Store query embedding and response
        query_id = hash(query)
        await self.vector_store.upsert(str(query_id), query, {})
        self.cache[str(query_id)] = response`,
    },
    {
      name: "Canary Deployment",
      description: "Gradual model rollout",
      code: `import random

class CanaryRouter:
    def __init__(self, production_model, canary_model, canary_percent: float):
        self.production = production_model
        self.canary = canary_model
        self.canary_percent = canary_percent
        self.metrics = {"production": [], "canary": []}

    def predict(self, features: dict) -> dict:
        # Route traffic
        use_canary = random.random() < self.canary_percent
        model = self.canary if use_canary else self.production
        variant = "canary" if use_canary else "production"

        # Get prediction and log
        start = time.time()
        prediction = model.predict(features)
        latency = time.time() - start

        self.metrics[variant].append({
            "latency": latency,
            "prediction": prediction
        })

        return {"prediction": prediction, "variant": variant}`,
    },
    {
      name: "Batch Prediction Job",
      description: "Scheduled batch inference",
      code: `from prefect import flow, task

@task
def load_data(date: str) -> DataFrame:
    return spark.read.parquet(f"s3://data/features/{date}")

@task
def run_inference(data: DataFrame, model) -> DataFrame:
    predictions = model.predict(data)
    return data.withColumn("prediction", predictions)

@task
def write_results(results: DataFrame, date: str):
    results.write.parquet(f"s3://predictions/{date}")

@flow
def batch_prediction_pipeline(date: str):
    model = load_model("s3://models/production/latest")
    data = load_data(date)
    results = run_inference(data, model)
    write_results(results, date)

# Schedule: run daily at 2am
batch_prediction_pipeline.serve(cron="0 2 * * *")`,
    },
  ],

  problems: [
    {
      id: "rag-basic",
      title: "Implement basic RAG",
      difficulty: "medium",
      description:
        "Implement a simple RAG system that retrieves relevant chunks and generates a response.",
      examples: [
        { input: "query('What is the capital of France?')", output: "Paris is the capital of France." },
      ],
      starterCode: `class SimpleRAG:
    def __init__(self, documents: list[str], embed_fn, generate_fn):
        # TODO: Initialize the RAG system
        pass

    def retrieve(self, query: str, k: int = 3) -> list[str]:
        # TODO: Return top-k relevant documents
        pass

    def query(self, question: str) -> str:
        # TODO: Retrieve context and generate answer
        pass`,
      hints: [
        "Embed the query and search for similar documents",
        "Build context from retrieved chunks",
        "Generate response with the LLM",
      ],
      solution: `class SimpleRAG:
    def __init__(self, documents: list[str], embed_fn, generate_fn):
        self.embed_fn = embed_fn
        self.generate_fn = generate_fn

        # Build index
        self.documents = documents
        self.embeddings = [embed_fn(doc) for doc in documents]

    def cosine_similarity(self, a: list[float], b: list[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = sum(x ** 2 for x in a) ** 0.5
        norm_b = sum(x ** 2 for x in b) ** 0.5
        return dot / (norm_a * norm_b)

    def retrieve(self, query: str, k: int = 3) -> list[str]:
        query_embedding = self.embed_fn(query)

        # Score all documents
        scores = [
            (i, self.cosine_similarity(query_embedding, emb))
            for i, emb in enumerate(self.embeddings)
        ]

        # Return top-k
        scores.sort(key=lambda x: x[1], reverse=True)
        return [self.documents[i] for i, _ in scores[:k]]

    def query(self, question: str) -> str:
        chunks = self.retrieve(question)
        context = "\\n\\n".join(chunks)

        prompt = f"Context:\\n{context}\\n\\nQuestion: {question}\\nAnswer:"
        return self.generate_fn(prompt)`,
      testCases: [],
    },
    {
      id: "chunking-strategy",
      title: "Document chunking",
      difficulty: "medium",
      description:
        "Implement a recursive text chunker that splits on headers, then paragraphs, with overlap.",
      examples: [
        { input: "recursive_chunk('# Header\\n\\nParagraph 1\\n\\nParagraph 2', 100)", output: "['# Header', 'Paragraph 1', 'Paragraph 2']" },
      ],
      starterCode: `def recursive_chunk(
    text: str,
    max_chunk_size: int = 500,
    overlap: int = 50
) -> list[str]:
    # TODO: Split text into overlapping chunks
    pass`,
      hints: [
        "First split on headers (##, ###)",
        "Then split large sections on paragraphs",
        "Add overlap between chunks for context",
      ],
      solution: `def recursive_chunk(
    text: str,
    max_chunk_size: int = 500,
    overlap: int = 50
) -> list[str]:
    chunks = []

    # First split on headers
    import re
    header_pattern = r'\\n#{1,3} '
    sections = re.split(header_pattern, text)

    for section in sections:
        if len(section) <= max_chunk_size:
            chunks.append(section.strip())
        else:
            # Split on paragraphs
            paragraphs = section.split('\\n\\n')
            current_chunk = ""

            for para in paragraphs:
                if len(current_chunk) + len(para) <= max_chunk_size:
                    current_chunk += para + "\\n\\n"
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = para + "\\n\\n"

            if current_chunk:
                chunks.append(current_chunk.strip())

    # Add overlap
    overlapped_chunks = []
    for i, chunk in enumerate(chunks):
        if i > 0:
            # Add end of previous chunk
            prev_words = chunks[i-1].split()[-overlap//10:]
            chunk = " ".join(prev_words) + " " + chunk
        overlapped_chunks.append(chunk)

    return overlapped_chunks`,
      testCases: [],
    },
    {
      id: "drift-detection",
      title: "Feature drift detection",
      difficulty: "hard",
      description:
        "Implement a drift detector that uses KS test to detect changes in feature distributions.",
      examples: [
        { input: "detector.detect(current_data)", output: "[DriftResult(feature='age', drifted=True), ...]" },
      ],
      starterCode: `from scipy import stats
import numpy as np
from dataclasses import dataclass

@dataclass
class DriftResult:
    feature: str
    statistic: float
    p_value: float
    drifted: bool

class FeatureDriftDetector:
    def __init__(self, baseline: np.ndarray, feature_names: list[str], threshold: float = 0.05):
        # TODO: Store baseline data
        pass

    def detect(self, current: np.ndarray) -> list[DriftResult]:
        # TODO: Detect drift in each feature
        pass`,
      hints: [
        "Compare current window to baseline",
        "Use scipy.stats.ks_2samp for the test",
        "Return which features have drifted",
      ],
      solution: `from scipy import stats
import numpy as np
from dataclasses import dataclass

@dataclass
class DriftResult:
    feature: str
    statistic: float
    p_value: float
    drifted: bool

class FeatureDriftDetector:
    def __init__(self, baseline: np.ndarray, feature_names: list[str], threshold: float = 0.05):
        self.baseline = baseline
        self.feature_names = feature_names
        self.threshold = threshold

    def detect(self, current: np.ndarray) -> list[DriftResult]:
        results = []

        for i, name in enumerate(self.feature_names):
            baseline_col = self.baseline[:, i]
            current_col = current[:, i]

            statistic, p_value = stats.ks_2samp(baseline_col, current_col)

            results.append(DriftResult(
                feature=name,
                statistic=statistic,
                p_value=p_value,
                drifted=p_value < self.threshold
            ))

        return results

    def summary(self, current: np.ndarray) -> dict:
        results = self.detect(current)
        drifted = [r for r in results if r.drifted]

        return {
            "total_features": len(results),
            "drifted_features": len(drifted),
            "drifted_names": [r.feature for r in drifted],
            "alert": len(drifted) > 0
        }`,
      testCases: [],
    },
    {
      id: "ab-test-analysis",
      title: "A/B test significance",
      difficulty: "medium",
      description:
        "Implement a function to determine if an A/B test result is statistically significant.",
      examples: [
        { input: "ab_test_significance(100, 1000, 120, 1000)", output: "{'significant': True, 'lift': 0.2, ...}" },
      ],
      starterCode: `import math
from scipy import stats

def ab_test_significance(
    control_conversions: int,
    control_total: int,
    treatment_conversions: int,
    treatment_total: int,
    alpha: float = 0.05
) -> dict:
    # TODO: Calculate significance
    pass`,
      hints: [
        "Use a two-proportion z-test",
        "Calculate the z-statistic and p-value",
        "Account for sample size",
      ],
      solution: `import math
from scipy import stats

def ab_test_significance(
    control_conversions: int,
    control_total: int,
    treatment_conversions: int,
    treatment_total: int,
    alpha: float = 0.05
) -> dict:
    # Calculate proportions
    p_control = control_conversions / control_total
    p_treatment = treatment_conversions / treatment_total

    # Pooled proportion
    p_pooled = (control_conversions + treatment_conversions) / (control_total + treatment_total)

    # Standard error
    se = math.sqrt(p_pooled * (1 - p_pooled) * (1/control_total + 1/treatment_total))

    # Z-statistic
    z = (p_treatment - p_control) / se

    # P-value (two-tailed)
    p_value = 2 * (1 - stats.norm.cdf(abs(z)))

    # Relative lift
    lift = (p_treatment - p_control) / p_control if p_control > 0 else 0

    return {
        "control_rate": p_control,
        "treatment_rate": p_treatment,
        "lift": lift,
        "z_statistic": z,
        "p_value": p_value,
        "significant": p_value < alpha,
        "winner": "treatment" if z > 0 and p_value < alpha else "control" if z < 0 and p_value < alpha else "inconclusive"
    }`,
      testCases: [],
    },
    {
      id: "model-versioning",
      title: "Model version rollback",
      difficulty: "easy",
      description:
        "Implement a model registry that supports versioning and rollback to previous versions.",
      examples: [
        { input: "registry.register(model, metrics); registry.rollback(1)", output: "Model v1 restored to production" },
      ],
      starterCode: `from dataclasses import dataclass
from datetime import datetime
from typing import Any

class ModelRegistry:
    def __init__(self):
        # TODO: Initialize registry
        pass

    def register(self, model: Any, metrics: dict) -> int:
        # TODO: Register new model version
        pass

    def promote(self, version: int):
        # TODO: Promote version to production
        pass

    def rollback(self, version: int):
        # TODO: Rollback to previous version
        pass`,
      hints: [
        "Store models with version numbers",
        "Track which version is in production",
        "Implement rollback by changing the active version",
      ],
      solution: `from dataclasses import dataclass
from datetime import datetime
from typing import Any

@dataclass
class ModelVersion:
    version: int
    model: Any
    metrics: dict
    created_at: datetime
    stage: str  # "staging" | "production" | "archived"

class ModelRegistry:
    def __init__(self):
        self.versions: dict[int, ModelVersion] = {}
        self.next_version = 1
        self.production_version: int | None = None

    def register(self, model: Any, metrics: dict) -> int:
        version = self.next_version
        self.versions[version] = ModelVersion(
            version=version,
            model=model,
            metrics=metrics,
            created_at=datetime.now(),
            stage="staging"
        )
        self.next_version += 1
        return version

    def promote(self, version: int):
        if version not in self.versions:
            raise ValueError(f"Version {version} not found")

        # Demote current production
        if self.production_version:
            self.versions[self.production_version].stage = "archived"

        # Promote new version
        self.versions[version].stage = "production"
        self.production_version = version

    def rollback(self, to_version: int | None = None):
        if to_version is None:
            # Rollback to previous version
            versions = sorted([v for v in self.versions.keys() if v < self.production_version], reverse=True)
            if not versions:
                raise ValueError("No previous version to rollback to")
            to_version = versions[0]

        self.promote(to_version)

    def get_production_model(self) -> Any:
        if not self.production_version:
            raise ValueError("No production model")
        return self.versions[self.production_version].model`,
      testCases: [],
    },
  ],
};
