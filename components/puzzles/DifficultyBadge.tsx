import { Badge } from "@/components/ui/Badge";
import type { PuzzleDifficulty } from "@/data/puzzlesMock";

export function DifficultyBadge({ difficulty }: { difficulty: PuzzleDifficulty }) {
  if (difficulty === "白给级") return <Badge variant="green">白给级</Badge>;
  if (difficulty === "脑洞级") return <Badge variant="pink">脑洞级</Badge>;
  return <Badge variant="red">逻辑崩坏级</Badge>;
}

