import { cn } from "@/lib/cn";

export function Terminal({
  className,
  title = "TERMINAL",
  lines,
}: {
  className?: string;
  title?: string;
  lines: string[];
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border-green bg-bg-app/70 shadow-[0_0_0_1px_rgba(34,197,94,0.2)] backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border-green/40 px-4 py-2">
        <div className="text-xs font-black tracking-[0.25em] text-accent-green text-glow-green">
          {title}
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent-green/80" />
          <span className="h-2 w-2 rounded-full bg-accent-green/50" />
          <span className="h-2 w-2 rounded-full bg-accent-green/30" />
        </div>
      </div>
      <div className="max-h-64 overflow-auto px-4 py-3 font-mono text-sm leading-6 text-accent-green">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            <span className="opacity-60">$</span> {line}
          </div>
        ))}
      </div>
    </div>
  );
}

