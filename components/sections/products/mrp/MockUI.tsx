import type { MrpCell, MrpTable, MrpTagTone } from "@/lib/constants";

/**
 * Shared building blocks for the illustrative product screens on the MRP
 * page - the dashboard mock and the small tables beside each feature.
 *
 * These are DECORATION, not data. They render fixed sample rows from
 * lib/constants.ts to show what the software looks like; nothing here talks
 * to anything. Swap a whole block for a real screenshot when there is one.
 *
 * Everything is painted from the semantic theme tokens, so it inverts with
 * the light/dark toggle. The one exception is the movement-type tags below,
 * which need to be distinguishable from each other and from the brand
 * orange - those use Tailwind palette hues at low opacity, with a lighter
 * text shade in dark mode so they clear contrast in both themes.
 */

/** Movement type -> pill colour. Semantic: the colour IS the meaning here. */
const TAG_TONE: Record<MrpTagTone, string> = {
  receipt:
    "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-300",
  issue:
    "border-primary/40 bg-primary/10 text-primary-dark dark:text-primary-light",
  transfer:
    "border-sky-600/30 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:text-sky-300",
  adjust:
    "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:border-amber-400/30 dark:text-amber-300",
  low: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:border-amber-400/30 dark:text-amber-300",
};

export function MockTag({
  tone,
  children,
}: {
  tone: MrpTagTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded border px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.09em] ${TAG_TONE[tone]}`}
    >
      {children}
    </span>
  );
}

/** A bordered card with a title bar - the frame every mock sits in. */
export function MockPanel({
  title,
  meta,
  children,
  className = "",
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-ink/10 bg-surface/60 ${className}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
        <span className="text-[13px] font-bold text-ink">{title}</span>
        {meta ? (
          <span className="font-mono text-[10px] tracking-[0.08em] text-muted-dim">
            {meta}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function cellContent(cell: MrpCell) {
  if (cell.kind === "tag" && cell.tone) {
    return <MockTag tone={cell.tone}>{cell.text}</MockTag>;
  }
  return cell.text;
}

function cellClass(cell: MrpCell) {
  switch (cell.kind) {
    case "code":
      return "font-mono text-xs text-ink";
    case "num":
      return "text-right font-mono tabular-nums text-ink";
    default:
      return "text-muted";
  }
}

/**
 * Sample table. Always wrapped in its own horizontal scroller: the mock is
 * denser than a phone is wide, and the page body must never scroll sideways.
 */
export function MockTable({ table }: { table: MrpTable }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[24rem] border-collapse text-[13px]">
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th
                key={column.label}
                className={`whitespace-nowrap border-b border-ink/10 px-4 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-muted-dim ${
                  column.kind === "num" ? "text-right" : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Fixed sample data - index keys are safe, nothing reorders. */}
          {table.rows.map((row, rowIndex) => (
            // The final row drops its rule so it doesn't double up with the
            // panel's own bottom edge.
            <tr key={rowIndex} className="last:[&>td]:border-b-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`whitespace-nowrap border-b border-ink/[0.06] px-4 py-2.5 ${cellClass(cell)}`}
                >
                  {cellContent(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
