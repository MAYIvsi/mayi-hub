import { GlowContainer } from "@/components/ui/GlowContainer";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  unit,
  progress,
  accent = "green",
}: {
  label: string;
  value: number | string;
  unit?: string;
  progress: number;
  accent?: "green" | "pink";
}) {
  const titleAccent =
    accent === "green" ? "text-accent-green" : "text-accent-pink";

  return (
    <GlowContainer variant={accent} className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            {label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div
              className={cn(
                "text-2xl font-black tracking-tight",
                titleAccent,
                accent === "green" ? "text-glow-green" : "text-glow-pink",
              )}
            >
              {value}
            </div>
            {unit ? (
              <div className="text-xs font-semibold text-text-muted">{unit}</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-lg border border-white/5 bg-bg-app/40 px-2 py-1 text-xs font-semibold text-text-muted">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="mt-4">
        <Progress value={progress} className="ring-1 ring-border-green/25" />
      </div>
    </GlowContainer>
  );
}

