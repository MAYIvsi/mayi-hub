import * as React from "react";
import type { Player } from "@/types/werewolf";

type RoleCount = {
  key: string;
  label: string;
  icon: string;
  total: number;
};

function roleCatalog(): Record<string, Omit<RoleCount, "total">> {
  return {
    狼人: { key: "狼人", label: "狼人", icon: "🐺" },
    平民: { key: "平民", label: "平民", icon: "👨‍🌾" },
    预言家: { key: "预言家", label: "预言家", icon: "🔮" },
    女巫: { key: "女巫", label: "女巫", icon: "🧪" },
    猎人: { key: "猎人", label: "猎人", icon: "🔫" },
    白痴: { key: "白痴", label: "白痴", icon: "🎭" },
    守卫: { key: "守卫", label: "守卫", icon: "🛡️" },
    狼王: { key: "狼王", label: "狼王", icon: "👑" },
    夜影: { key: "夜影", label: "夜影", icon: "🌑" },
  };
}

function normalizeRole(role: string) {
  const r = (role ?? "").trim();
  if (!r || r === "unknown" || r === "未知") return "unknown";
  return r;
}

export function parseSetup(setup: string): RoleCount[] {
  const catalog = roleCatalog();

  const baseByTemplate: Record<string, Record<string, number>> = {
    预女猎白: { 狼人: 4, 平民: 4, 预言家: 1, 女巫: 1, 猎人: 1, 白痴: 1 },
    预女猎守: { 狼人: 4, 平民: 4, 预言家: 1, 女巫: 1, 猎人: 1, 守卫: 1 },
    狼王守卫: { 狼王: 1, 狼人: 3, 平民: 4, 预言家: 1, 女巫: 1, 猎人: 1, 守卫: 1 },
    纯白夜影: { 夜影: 1, 狼人: 3, 平民: 4, 预言家: 1, 女巫: 1, 猎人: 1, 白痴: 1 },
  };

  const counts = baseByTemplate[setup] ?? baseByTemplate["预女猎白"];

  return Object.entries(counts).map(([key, total]) => {
    const meta = catalog[key] ?? { key, label: key, icon: "•" };
    return { ...meta, total };
  });
}

export function RoleTracker({
  setup,
  players,
}: {
  setup: string;
  players: Player[];
}) {
  const initial = React.useMemo(() => parseSetup(setup), [setup]);

  const deadKnownCounts = React.useMemo(() => {
    const acc = new Map<string, number>();
    for (const p of players) {
      if (p.isAlive) continue;
      const role = normalizeRole(p.role);
      if (role === "unknown") continue;
      acc.set(role, (acc.get(role) ?? 0) + 1);
    }
    return acc;
  }, [players]);

  const rows = initial.map((r) => {
    const deadKnown = deadKnownCounts.get(r.key) ?? 0;
    const remaining = Math.max(0, r.total - deadKnown);
    return { ...r, remaining };
  });

  return (
    <div className="space-y-3">
      <div className="text-xs font-black tracking-[0.28em] text-white/50">
        ROLE_TRACKER
      </div>
      <div className="space-y-2">
        {rows.map((r) => {
          const depleted = r.remaining <= 0;
          return (
            <div
              key={r.key}
              className={[
                "flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3",
                depleted ? "line-through text-zinc-600" : "text-white/85",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className={depleted ? "opacity-50" : ""}>{r.icon}</span>
                <span className="text-sm font-black tracking-wide">
                  {r.label}
                </span>
              </div>
              <div className="text-sm font-black">
                剩余 {r.remaining}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

