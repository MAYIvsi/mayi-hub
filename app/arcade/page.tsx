import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Binary, Skull } from "lucide-react";

export default function ArcadePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-black tracking-[0.28em] text-text-muted">
            ARCADE
          </div>
          <h1 className="text-2xl font-black tracking-tight text-text-primary">
            娱乐室
          </h1>
          <p className="text-sm text-text-muted">
            把严肃推理放一边，来点硬核外挂。
          </p>
        </div>

        <Link
          href="/arcade/werewolf"
          className="group block overflow-hidden rounded-3xl border border-white/10 bg-bg-surface/50 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition hover:border-border-pink/70 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.35),0_0_36px_rgba(236,72,153,0.22)]"
        >
          <div className="relative p-7 md:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -left-24 top-[-30%] h-[420px] w-[420px] rounded-full bg-accent-pink/15 blur-[90px]" />
              <div className="absolute -right-24 top-[10%] h-[420px] w-[420px] rounded-full bg-accent-green/10 blur-[100px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.10),transparent_55%)]" />
            </div>

            <div className="relative flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-bg-app/70 ring-1 ring-white/10">
                <Skull className="h-6 w-6 text-accent-pink" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-black tracking-[0.28em] text-text-muted/80">
                  WEREWOLF_TRACKER
                </div>
                <div className="mt-2 text-2xl font-black tracking-tight text-text-primary">
                  狼人杀高阶笔记 (Werewolf Tracker)
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  状态机驱动的 12 人局逻辑推演外挂
                </div>
              </div>

              <div className="hidden shrink-0 text-sm font-black tracking-wide text-accent-pink group-hover:mayi-pink-pulse md:block">
                ENTER →
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/arcade/telegraph"
          className="group block overflow-hidden rounded-3xl border border-white/10 bg-bg-surface/50 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_25px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition hover:border-border-green/70 hover:shadow-[0_0_0_1px_rgba(34,197,94,0.30),0_0_36px_rgba(34,197,94,0.18)]"
        >
          <div className="relative p-7 md:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -left-24 top-[-30%] h-[420px] w-[420px] rounded-full bg-accent-green/12 blur-[90px]" />
              <div className="absolute -right-24 top-[10%] h-[420px] w-[420px] rounded-full bg-accent-pink/10 blur-[100px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.10),transparent_55%)]" />
            </div>

            <div className="relative flex items-start gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-bg-app/70 ring-1 ring-white/10">
                <Binary className="h-6 w-6 text-accent-green" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-xs font-black tracking-[0.28em] text-text-muted/80">
                  BINARY_TELEGRAPH
                </div>
                <div className="mt-2 text-2xl font-black tracking-tight text-text-primary">
                  赛博阴阳电报机 (Binary Telegraph)
                </div>
                <div className="mt-2 text-sm text-text-muted">
                  极其抽象的文本加密工具。将你的秘密转化为满屏的“好”与“不好”，懂的都懂。
                </div>
              </div>

              <div className="hidden shrink-0 text-sm font-black tracking-wide text-accent-green md:block">
                ENTER →
              </div>
            </div>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}

