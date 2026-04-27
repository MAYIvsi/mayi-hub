import { AppShell } from "@/components/layout/AppShell";
import { PuzzlesClient } from "@/components/puzzles/PuzzlesClient";

export default function PuzzlesPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <div className="space-y-1">
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            PUZZLE_ARCHIVES
          </div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">
            机密推理档案
          </h1>
          <p className="text-sm text-text-muted">
            Hover 一下试试捏…边框会瞬间亮起来（别被闪瞎就行）
          </p>
        </div>

        <PuzzlesClient />
      </div>
    </AppShell>
  );
}

