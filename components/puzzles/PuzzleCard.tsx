import { cn } from "@/lib/cn";
import type { PuzzleItem } from "@/data/puzzlesMock";
import { DifficultyBadge } from "@/components/puzzles/DifficultyBadge";
import { TagPills } from "@/components/puzzles/TagPills";
import Link from "next/link";

export function PuzzleCard({ puzzle, solved }: { puzzle: PuzzleItem; solved: boolean }) {
  return (
    <Link
      href={`/puzzles/${puzzle.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl border bg-bg-surface/70 p-4 backdrop-blur-sm",
        "border-white/5 transition-all duration-200",
        "hover:border-border-pink hover:shadow-glow-pink",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
        )}
      >
        <div className="absolute -left-10 top-6 h-16 w-[120%] -skew-y-3 bg-accent-pink/10 blur-[1px]" />
        <div className="absolute -left-10 top-10 h-16 w-[120%] -skew-y-3 bg-accent-green/8 blur-[1px]" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-black tracking-tight text-text-primary">
              {puzzle.title}
            </div>
            <div className="mt-1 text-sm leading-6 text-text-muted">
              {puzzle.content.slice(0, 48)}...
            </div>
          </div>
          <DifficultyBadge difficulty={puzzle.difficulty} />
        </div>

        <div className="mt-3">
          <TagPills tags={[puzzle.type]} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs font-mono text-text-muted">
            CASE/{puzzle.id.toUpperCase()}
          </div>
          <div
            className={cn(
              "text-xs font-semibold",
              solved ? "text-accent-green" : "text-text-muted",
            )}
          >
            {solved ? "SOLVED" : "UNSOLVED"}
          </div>
        </div>
      </div>
    </Link>
  );
}

