import * as React from "react";

export function TimelineConsole({
  currentDay,
  onPrevDay,
  onNextDay,
  onCycleNextDay,
}: {
  currentDay: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onCycleNextDay: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex justify-center">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 backdrop-blur-2xl">
        <button
          type="button"
          onClick={onPrevDay}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-black text-white/80 hover:border-white/20 hover:bg-white/7.5"
        >
          {"< 上一天"}
        </button>
        <div className="min-w-[120px] select-none text-center text-sm font-black tracking-wide text-emerald-200/90">
          第 {currentDay} 天
        </div>
        <button
          type="button"
          onClick={onNextDay}
          className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-black text-white/80 hover:border-white/20 hover:bg-white/7.5"
        >
          {"下一天 >"}
        </button>

        <button
          type="button"
          onClick={onCycleNextDay}
          className="ml-2 rounded-xl border border-border-pink/60 bg-fuchsia-500/15 px-3 py-2 text-sm font-black text-fuchsia-100 shadow-[0_0_0_1px_rgba(236,72,153,0.18),0_0_28px_rgba(236,72,153,0.22)] transition hover:border-border-pink/80 hover:bg-fuchsia-500/20 hover:shadow-glow-pink"
          title="进入下一天（清空上票）"
        >
          🌙 天黑请闭眼 (进入下一天)
        </button>
      </div>
    </div>
  );
}

