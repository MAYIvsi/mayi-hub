import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/AppShell";
import { PuzzleDetailClient } from "@/components/puzzles/PuzzleDetailClient";
import { puzzlesMock } from "@/data/puzzlesMock";

export default async function PuzzleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puzzle = puzzlesMock.find((p) => p.id === id);
  if (!puzzle) notFound();

  return (
    <AppShell>
      <PuzzleDetailClient puzzle={puzzle} />
    </AppShell>
  );
}

