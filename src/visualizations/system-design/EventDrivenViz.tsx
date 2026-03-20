import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  topic: string;
  payload: string;
}

interface Consumer {
  id: string;
  name: string;
  topic: string;
  processed: number;
}

const TOPICS = ["orders", "payments", "notifications"];

const INITIAL_CONSUMERS: Consumer[] = [
  { id: "c1", name: "Order Service", topic: "orders", processed: 0 },
  { id: "c2", name: "Payment Service", topic: "payments", processed: 0 },
  { id: "c3", name: "Email Service", topic: "notifications", processed: 0 },
  { id: "c4", name: "Analytics", topic: "orders", processed: 0 },
];

const TOPIC_COLORS: Record<string, string> = {
  orders: "var(--color-accent)",
  payments: "var(--color-green)",
  notifications: "var(--color-amber)",
};

export function EventDrivenViz() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>(INITIAL_CONSUMERS);
  const [nextId, setNextId] = useState(1);
  const [queuedMessages, setQueuedMessages] = useState<Record<string, Message[]>>({
    orders: [],
    payments: [],
    notifications: [],
  });

  const publishMessage = (topic: string) => {
    const msg: Message = {
      id: nextId,
      topic,
      payload: `event_${nextId}`,
    };

    setMessages((prev) => [...prev, msg]);
    setNextId((prev) => prev + 1);

    // Add to queue
    setQueuedMessages((prev) => ({
      ...prev,
      [topic]: [...prev[topic], msg],
    }));

    // Animate message flying to queue
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    }, 600);

    // Process by consumers after delay
    setTimeout(() => {
      setConsumers((prev) =>
        prev.map((c) =>
          c.topic === topic ? { ...c, processed: c.processed + 1 } : c
        )
      );

      // Remove from queue
      setQueuedMessages((prev) => ({
        ...prev,
        [topic]: prev[topic].slice(1),
      }));
    }, 1200);
  };

  return (
    <div
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 my-4"
      style={{ background: "var(--color-bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            Event-Driven Architecture — Pub/Sub
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            Publishers send events to topics, subscribers consume asynchronously
          </p>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        {/* Publishers */}
        <div className="w-28">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
            Publishers
          </p>
          <div className="space-y-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => publishMessage(topic)}
                className="w-full px-2 py-2 rounded-[var(--radius-sm)] text-xs font-medium capitalize"
                style={{
                  background: TOPIC_COLORS[topic],
                  color: "white",
                }}
              >
                Publish {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Message broker / queues */}
        <div className="flex-1 relative">
          <p className="text-xs font-medium mb-2 text-center" style={{ color: "var(--color-text-muted)" }}>
            Message Broker (Kafka/SQS)
          </p>

          {/* Flying messages */}
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className="absolute w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                style={{
                  background: TOPIC_COLORS[msg.topic],
                  color: "white",
                  left: 0,
                  top: TOPICS.indexOf(msg.topic) * 32 + 28,
                }}
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 100, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                ✉
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Topic queues */}
          <div className="space-y-2">
            {TOPICS.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)]"
                style={{ background: "var(--color-bg-tertiary)" }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: TOPIC_COLORS[topic] }}
                />
                <span className="text-[10px] font-medium capitalize w-20">{topic}</span>
                <div className="flex-1 flex gap-1">
                  {queuedMessages[topic].slice(0, 5).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded flex items-center justify-center text-[8px]"
                      style={{ background: TOPIC_COLORS[topic], color: "white" }}
                    >
                      {msg.id}
                    </motion.div>
                  ))}
                  {queuedMessages[topic].length === 0 && (
                    <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                      empty
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumers */}
        <div className="w-36">
          <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
            Consumers
          </p>
          <div className="space-y-2">
            {consumers.map((consumer) => (
              <motion.div
                key={consumer.id}
                className="p-2 rounded-[var(--radius-sm)]"
                style={{
                  background: "var(--color-bg-tertiary)",
                  borderLeft: `3px solid ${TOPIC_COLORS[consumer.topic]}`,
                }}
                animate={{
                  scale: queuedMessages[consumer.topic].length > 0 ? [1, 1.02, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[10px] font-medium">{consumer.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>
                    topic: {consumer.topic}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1 rounded"
                    style={{ background: "var(--color-bg-primary)" }}
                  >
                    {consumer.processed}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {[
          { label: "Decoupled", desc: "Services independent" },
          { label: "Scalable", desc: "Add consumers easily" },
          { label: "Resilient", desc: "Retry on failure" },
        ].map((benefit) => (
          <div
            key={benefit.label}
            className="p-2 rounded-[var(--radius-sm)] text-center"
            style={{ background: "var(--color-bg-tertiary)" }}
          >
            <p className="text-xs font-medium">{benefit.label}</p>
            <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              {benefit.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--color-amber-dim)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
          <strong style={{ color: "var(--color-amber)" }}>Key insight:</strong>{" "}
          Event-driven decouples producers from consumers. Multiple consumers can subscribe
          to the same topic. Messages persist in queues for reliability and replay.
        </p>
      </div>
    </div>
  );
}
