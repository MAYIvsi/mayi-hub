import { cn } from "@/lib/cn";

export function Progress({
  className,
  value,
}: {
  className?: string;
  value: number; // 0..100
}) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-bg-app/60 ring-1 ring-border-green/25",
        className,
      )}
      aria-label="progress"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-accent-green shadow-glow-green transition-[width] duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

