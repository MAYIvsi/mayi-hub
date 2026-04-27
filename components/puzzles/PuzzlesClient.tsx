"use client";

import { useEffect, useState } from "react";

import { PuzzleGrid } from "@/components/puzzles/PuzzleGrid";
import { getSolvedPuzzleIds } from "@/lib/solvedPuzzles";
import { puzzlesMock } from "@/data/puzzlesMock";

export function PuzzlesClient() {
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  useEffect(() => {
    setSolvedIds(getSolvedPuzzleIds());

    const onStorage = () => setSolvedIds(getSolvedPuzzleIds());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return <PuzzleGrid puzzles={puzzlesMock} solvedIds={solvedIds} />;
}

