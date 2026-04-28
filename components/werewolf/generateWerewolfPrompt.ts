import type { DayLog, GameConfig, Player } from "@/types/werewolf";

function roleLabel(role: string) {
  const r = (role ?? "").trim();
  if (!r || r === "unknown" || r === "未知") return "未知";
  return r;
}

function stanceLabel(side: string | null) {
  if (!side) return "—";
  if (side === "摇摆") return "摇摆";
  return `站${side}`;
}

function sortNums(xs: number[]) {
  return [...xs].sort((a, b) => a - b);
}

function formatDayEvents(logs: DayLog[], day: number) {
  const dayLog = logs.find((l) => l.day === day);
  if (!dayLog || !dayLog.events.length) return "无";
  return dayLog.events.map((e) => `- ${e.detail}`).join("\n");
}

export function generateWerewolfPrompt({
  config,
  players,
  logs,
}: {
  config: GameConfig;
  players: Player[];
  logs: DayLog[];
}) {
  const alive = sortNums(players.filter((p) => p.isAlive).map((p) => p.id));
  const dead = players
    .filter((p) => !p.isAlive)
    .map((p) => `${p.id}号(${roleLabel(p.role)}，死于第${p.deadDay ?? "?"}天)`);

  const seerClaims = sortNums(players.filter((p) => p.isSeerClaim).map((p) => p.id));

  const playerMarks = players
    .map((p) => {
      const parts = [
        `${p.id}号`,
        p.isAlive ? "存活" : "死亡",
        `身份=${roleLabel(p.role)}`,
        `站边=${stanceLabel(p.side)}`,
        p.voteFor ? `上票=投给${p.voteFor}` : "上票=—",
        p.isSeerClaim ? "起跳=是" : "起跳=否",
      ];
      return `- ${parts.join("，")}`;
    })
    .join("\n");

  const days = sortNums(Array.from(new Set(logs.map((l) => l.day))));
  const maxDay = days.length ? Math.max(...days) : 1;

  const daySections = Array.from({ length: maxDay }, (_, i) => i + 1)
    .map((day) => `第${day}天事件：\n${formatDayEvents(logs, day)}`)
    .join("\n\n");

  return [
    `梅子，帮我复盘现在的狼人杀局势。配置是「${config.setup}」，我是 ${config.mySeat} 号，底牌是「${config.myRole}」。`,
    ``,
    `当前存活座位：${alive.length ? alive.join(" ") : "无"}`,
    `当前死亡信息：${dead.length ? dead.join("；") : "无"}`,
    ``,
    `当前起跳预言家/信息位的玩家：${seerClaims.length ? seerClaims.join(" ") : "无"}`,
    ``,
    `按天事件流（票型/上警/退水/PK 等）：`,
    daySections,
    ``,
    `玩家标记总表（含身份/站边/上票/起跳）：`,
    playerMarks,
    ``,
    `请严格只根据以上数据进行逻辑推演，不要胡编乱造没出现过的信息。`,
    `请你重点回答：`,
    `1) 如果有多人起跳预言家，谁更像真预？为什么？`,
    `2) 结合票型与站边，盘出最可能的狼坑位（给出 2-3 套备选坑位）。`,
    `3) 指出任何明显的逻辑漏洞（如狼踩狼、倒钩、冲票、脏链）。`,
    `4) 给我下一轮最稳的发言/投票建议。`,
    `用你大一女生的口吻输出，可以适当吐槽这些离谱的票型，但不要编数据。`,
  ].join("\n");
}

