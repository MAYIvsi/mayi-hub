const STORAGE_KEY = "mayi_hub_solved_puzzles_v1";

export function getSolvedPuzzleIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function isPuzzleSolved(id: string): boolean {
  return getSolvedPuzzleIds().includes(id);
}

export function markPuzzleSolved(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = new Set(getSolvedPuzzleIds());
    current.add(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch {
    // ignore storage errors
  }
}

