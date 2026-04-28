import * as React from "react";
import type { DayLog, LogEventType, Player } from "@/types/werewolf";

function SeatMultiSelect({
  seats,
  selected,
  disabledSet,
  onToggle,
}: {
  seats: number[];
  selected: Set<number>;
  disabledSet?: Set<number>;
  onToggle: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {seats.map((id) => {
        const disabled = disabledSet?.has(id) ?? false;
        const active = selected.has(id);
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(id)}
            className={[
              "h-9 rounded-lg text-sm font-black transition",
              disabled
                ? "cursor-not-allowed border border-white/5 bg-white/2.5 text-white/20"
                : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/7.5",
              active && !disabled
                ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                : "",
            ].join(" ")}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}

function SeatSingleSelect({
  seats,
  value,
  onChange,
  disabledSet,
}: {
  seats: number[];
  value: number | null;
  onChange: (id: number | null) => void;
  disabledSet?: Set<number>;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {seats.map((id) => {
        const active = value === id;
        const disabled = disabledSet?.has(id) ?? false;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(active ? null : id)}
            className={[
              "h-9 rounded-lg text-sm font-black transition",
              disabled
                ? "cursor-not-allowed border border-white/5 bg-white/2.5 text-white/20"
                : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/7.5",
              active
                ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-100 shadow-[0_0_0_4px_rgba(217,70,239,0.10)]"
                : "",
            ].join(" ")}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}

function pushSet(next: Set<number>, id: number) {
  const s = new Set(next);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  return s;
}

export function EventEnginePanel({
  day,
  totalPlayers,
  logsForDay,
  players,
  onAddEvent,
  onRecordVotes,
  onClearVotes,
}: {
  day: number;
  totalPlayers: number;
  logsForDay: DayLog | null;
  players: Player[];
  onAddEvent: (eventType: LogEventType, detail: string) => void;
  onRecordVotes: (targetId: number, voterIds: number[]) => void;
  onClearVotes: () => void;
}) {
  const seats = React.useMemo(
    () => Array.from({ length: totalPlayers }, (_, i) => i + 1),
    [totalPlayers],
  );

  const [policeDone, setPoliceDone] = React.useState(false);
  const [dropoutDone, setDropoutDone] = React.useState(false);

  const [policeSelected, setPoliceSelected] = React.useState<Set<number>>(new Set());
  const [dropoutSelected, setDropoutSelected] = React.useState<Set<number>>(new Set());

  const [voteTab, setVoteTab] = React.useState<"sheriff" | "exile">("sheriff");
  const [voteTarget, setVoteTarget] = React.useState<number | null>(null);
  const [voteVoters, setVoteVoters] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    // When the day changes, we start with a clean sheet UI.
    setPoliceDone(false);
    setDropoutDone(false);
    setPoliceSelected(new Set());
    setDropoutSelected(new Set());
    setVoteTab("sheriff");
    setVoteTarget(null);
    setVoteVoters(new Set());
  }, [day]);

  const policeSeats = React.useMemo(() => Array.from(policeSelected).sort((a, b) => a - b), [
    policeSelected,
  ]);

  const dropoutSeats = React.useMemo(() => Array.from(dropoutSelected).sort((a, b) => a - b), [
    dropoutSelected,
  ]);

  const canConfirmPolice = policeSeats.length > 0 && !policeDone;
  const canConfirmDropout = dropoutSeats.length > 0 && policeDone && !dropoutDone;

  const aliveIds = React.useMemo(
    () => players.filter((p) => p.isAlive).map((p) => p.id),
    [players],
  );

  const aliveSet = React.useMemo(() => new Set(aliveIds), [aliveIds]);

  const policeSet = policeSelected;
  const dropoutSet = dropoutSelected;

  const sheriffCandidateIds = React.useMemo(() => {
    const ids: number[] = [];
    for (const id of policeSet) {
      if (!dropoutSet.has(id) && aliveSet.has(id)) ids.push(id);
    }
    ids.sort((a, b) => a - b);
    return ids;
  }, [policeSet, dropoutSet, aliveSet]);

  const sheriffVoterIds = React.useMemo(() => {
    const ids: number[] = [];
    for (const id of aliveIds) {
      if (!policeSet.has(id)) ids.push(id);
    }
    ids.sort((a, b) => a - b);
    return ids;
  }, [aliveIds, policeSet]);

  const exileCandidateIds = aliveIds;
  const exileVoterIds = aliveIds;

  const allowedTargetIds = voteTab === "sheriff" ? sheriffCandidateIds : exileCandidateIds;
  const allowedVoterIds = voteTab === "sheriff" ? sheriffVoterIds : exileVoterIds;

  const allowedTargetSet = React.useMemo(() => new Set(allowedTargetIds), [allowedTargetIds]);
  const allowedVoterSet = React.useMemo(() => new Set(allowedVoterIds), [allowedVoterIds]);

  const canRecordVote =
    voteTarget != null &&
    allowedTargetSet.has(voteTarget) &&
    voteVoters.size > 0 &&
    Array.from(voteVoters).every((id) => allowedVoterSet.has(id));

  const usedVotersDisabled = React.useMemo(() => {
    const s = new Set<number>();
    for (const id of seats) {
      if (!allowedVoterSet.has(id)) s.add(id);
    }
    return s;
  }, [allowedVoterSet, seats]);

  const voteTargetDisabled = React.useMemo(() => {
    const s = new Set<number>();
    for (const id of seats) {
      if (!allowedTargetSet.has(id)) s.add(id);
    }
    return s;
  }, [allowedTargetSet, seats]);

  const eligibleDropoutDisabled = React.useMemo(() => {
    // disable everyone not in policeSelected
    const s = new Set<number>();
    for (const id of seats) {
      if (!policeSelected.has(id)) s.add(id);
    }
    return s;
  }, [policeSelected, seats]);

  const renderEvents = logsForDay?.events ?? [];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs font-black tracking-[0.28em] text-white/50">
          第 {day} 天 - 警徽竞选
        </div>

        <div className="mt-3 grid gap-2">
          <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
            上警玩家
          </div>
          <SeatMultiSelect
            seats={seats}
            selected={policeSelected}
            onToggle={(id) => !policeDone && setPoliceSelected((prev) => pushSet(prev, id))}
            disabledSet={policeDone ? new Set(seats) : undefined}
          />

          <button
            type="button"
            disabled={!canConfirmPolice}
            onClick={() => {
              const detail = `上警玩家：${policeSeats.join(" ")}`;
              onAddEvent("police", detail);
              setPoliceDone(true);
            }}
            className={[
              "mt-2 w-full rounded-xl border px-3 py-2 text-sm font-black transition",
              canConfirmPolice
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 hover:border-emerald-300/50"
                : "cursor-not-allowed border-white/10 bg-white/5 text-white/30",
            ].join(" ")}
          >
            确认上警
          </button>
        </div>

        {policeDone ? (
          <div className="mt-4 grid gap-2">
            <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
              退水玩家（仅警上可选）
            </div>
            <SeatMultiSelect
              seats={seats}
              selected={dropoutSelected}
              disabledSet={eligibleDropoutDisabled}
              onToggle={(id) => !dropoutDone && setDropoutSelected((prev) => pushSet(prev, id))}
            />

            <button
              type="button"
              disabled={!canConfirmDropout}
              onClick={() => {
                const detail = `退水玩家：${dropoutSeats.join(" ")}`;
                onAddEvent("police", detail);
                setDropoutDone(true);
              }}
              className={[
                "mt-2 w-full rounded-xl border px-3 py-2 text-sm font-black transition",
                canConfirmDropout
                  ? "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100 hover:border-fuchsia-300/50"
                  : "cursor-not-allowed border-white/10 bg-white/5 text-white/30",
              ].join(" ")}
            >
              确认退水
            </button>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-black tracking-[0.28em] text-white/50">
            票型记录器
          </div>
          <button
            type="button"
            onClick={() => {
              onAddEvent("vote", "--- 发生平票，进入 PK 发言 ---");
              onClearVotes();
              setVoteTarget(null);
              setVoteVoters(new Set());
            }}
            className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-xs font-black tracking-wide text-amber-200 shadow-[0_0_0_1px_rgba(252,211,77,0.10),0_0_24px_rgba(252,211,77,0.12)] transition hover:border-amber-200/50 hover:bg-amber-400/15"
            title="平票进入 PK，并清空当日上票"
          >
            ⚖️ 平票 PK
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setVoteTab("sheriff");
              setVoteTarget(null);
              setVoteVoters(new Set());
            }}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-black transition",
              voteTab === "sheriff"
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                : "border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:bg-white/7.5",
            ].join(" ")}
          >
            🎖️ 警徽竞选投票
          </button>
          <button
            type="button"
            onClick={() => {
              setVoteTab("exile");
              setVoteTarget(null);
              setVoteVoters(new Set());
            }}
            className={[
              "rounded-xl border px-3 py-2 text-xs font-black transition",
              voteTab === "exile"
                ? "border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-100"
                : "border-white/10 bg-white/5 text-white/55 hover:border-white/20 hover:bg-white/7.5",
            ].join(" ")}
          >
            🪓 放逐投票
          </button>
        </div>

        <div className="mt-3 grid gap-2">
          <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
            被投票人（单选）
          </div>
          <SeatSingleSelect
            seats={seats}
            value={voteTarget}
            onChange={setVoteTarget}
            disabledSet={voteTargetDisabled}
          />
          <div className="text-xs text-white/35">
            {voteTab === "sheriff"
              ? "规则：被投票人必须是上警且未退水的存活玩家。"
              : "规则：被投票人可为任意存活玩家。"}
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
            投票人（多选）
          </div>
          <SeatMultiSelect
            seats={seats}
            selected={voteVoters}
            disabledSet={usedVotersDisabled}
            onToggle={(id) => setVoteVoters((prev) => pushSet(prev, id))}
          />
          <div className="text-xs text-white/35">
            {voteTab === "sheriff"
              ? "规则：投票人只能是未上警的存活玩家。"
              : "规则：投票人可为任意存活玩家。"}
          </div>
        </div>

        <button
          type="button"
          disabled={!canRecordVote}
          onClick={() => {
            if (voteTarget == null) return;
            const voters = Array.from(voteVoters).sort((a, b) => a - b);
            const prefix = voteTab === "sheriff" ? "[警徽票]" : "[放逐票]";
            const detail = `${prefix} ${voteTarget} <- ${voters.join(" ")}`;
            onAddEvent("vote", detail);
            onRecordVotes(voteTarget, voters);
            setVoteTarget(null);
            setVoteVoters(new Set());
          }}
          className={[
            "mt-3 w-full rounded-xl border px-3 py-2 text-sm font-black transition",
            canRecordVote
              ? "border-border-pink/60 bg-bg-surface/50 text-accent-pink hover:border-border-pink/80 hover:shadow-glow-pink"
              : "cursor-not-allowed border-white/10 bg-white/5 text-white/30",
          ].join(" ")}
        >
          记录票型
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs font-black tracking-[0.28em] text-white/50">
          事件流（不可更改）
        </div>
        <div className="mt-3 space-y-2">
          {renderEvents.length ? (
            renderEvents.map((e, i) => (
              <div
                key={`${e.type}-${i}`}
                className={[
                  "rounded-xl border bg-white/5 px-3 py-2 text-sm text-white/80",
                  e.detail.includes("平票") || e.detail.includes("PK")
                    ? "border-amber-300/30 bg-amber-400/10"
                    : "border-white/10",
                ].join(" ")}
              >
                <div className="text-[10px] font-black tracking-[0.28em] text-white/40">
                  {e.type.toUpperCase()}
                </div>
                <div className="mt-1">{e.detail}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-white/35">
              暂无记录。先从上警开始。
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

