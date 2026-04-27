import type { PuzzleItem } from "@/data/puzzlesMock";
import { PuzzleCard } from "@/components/puzzles/PuzzleCard";

export function PuzzleGrid({
  puzzles,
  solvedIds,
}: {
  puzzles: PuzzleItem[];
  solvedIds: string[];
}) {
  const solved = new Set(solvedIds);
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {puzzles.map((p) => (
        <PuzzleCard key={p.id} puzzle={p} solved={solved.has(p.id)} />
      ))}
    </div>
  );
}

