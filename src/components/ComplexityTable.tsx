import type { Operation } from "../types";

interface Props {
  operations: Operation[];
}

const complexityColor = (c: string) => {
  if (c.includes("O(1)")) return "var(--color-green)";
  if (c.includes("log")) return "var(--color-teal)";
  if (c.includes("O(n)") && !c.includes("²")) return "var(--color-amber)";
  return "var(--color-coral)";
};

export function ComplexityTable({ operations }: Props) {
  // Detect which format the operations use
  const usesTimeSpace = operations.length > 0 && operations[0].time !== undefined;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--color-bg-tertiary)]">
            <th className="text-left px-5 py-3 text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">
              Operation
            </th>
            <th className="text-center px-5 py-3 text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">
              {usesTimeSpace ? "Time" : "Average"}
            </th>
            <th className="text-center px-5 py-3 text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">
              {usesTimeSpace ? "Space" : "Worst"}
            </th>
            <th className="text-left px-5 py-3 text-[var(--color-text-muted)] font-medium text-xs uppercase tracking-wider">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {operations.map((op, i) => {
            const col1 = usesTimeSpace ? op.time : op.average;
            const col2 = usesTimeSpace ? op.space : op.worst;

            return (
              <tr
                key={op.name}
                className="border-t border-[var(--color-border)]"
                style={{
                  background:
                    i % 2 === 0
                      ? "var(--color-bg-secondary)"
                      : "var(--color-bg-primary)",
                }}
              >
                <td className="px-5 py-3 font-medium">{op.name}</td>
                <td className="px-5 py-3 text-center">
                  <code
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{
                      color: complexityColor(col1 || ""),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {col1}
                  </code>
                </td>
                <td className="px-5 py-3 text-center">
                  <code
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{
                      color: complexityColor(col2 || ""),
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {col2}
                  </code>
                </td>
                <td className="px-5 py-3 text-[var(--color-text-secondary)] text-xs">
                  {op.note}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
