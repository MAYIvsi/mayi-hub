"use client";

import * as React from "react";
import type {
  GameConfig,
  GameState,
  LogEventType,
  Player,
  RoleOption,
  SetupTemplate,
} from "@/types/werewolf";
import { WerewolfMainPanel } from "@/components/werewolf/WerewolfMainPanel";
import { generateWerewolfPrompt } from "@/components/werewolf/generateWerewolfPrompt";

type Mode = "setup" | "playing";

type TrackerState = {
  mode: Mode;
  config: GameConfig;
  players: Player[];
  game: GameState | null;
};

type Action =
  | { type: "config/totalPlayers"; value: 9 | 10 | 12 }
  | { type: "config/setup"; value: SetupTemplate }
  | { type: "config/mySeat"; value: number }
  | { type: "config/myRole"; value: RoleOption }
  | { type: "game/prevDay" }
  | { type: "game/nextDay" }
  | { type: "game/cycleNextDay" }
  | { type: "logs/addEvent"; day: number; eventType: LogEventType; detail: string }
  | { type: "votes/record"; targetId: number; voterIds: number[] }
  | { type: "votes/clear" }
  | { type: "player/update"; id: number; patch: Partial<Player> }
  | { type: "start" }
  | { type: "reset" };

const TOTAL_PLAYERS_OPTIONS = [9, 10, 12] as const;
const SETUP_OPTIONS: SetupTemplate[] = ["预女猎白", "预女猎守", "狼王守卫", "纯白夜影"];
const ROLE_OPTIONS: RoleOption[] = ["平民", "狼人", "预言家", "女巫", "猎人", "白痴"];

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function initPlayers(totalPlayers: number, mySeat: number, myRole: string): Player[] {
  const players = Array.from({ length: totalPlayers }, (_, i) => ({
    id: i + 1,
    isAlive: true,
    role: "unknown",
    side: null,
    voteFor: null,
    notes: "",
    isSeerClaim: false,
    deadDay: null,
  })) satisfies Player[];

  const idx = mySeat - 1;
  if (idx >= 0 && idx < players.length) {
    players[idx] = { ...players[idx], role: myRole };
  }
  return players;
}

function reducer(state: TrackerState, action: Action): TrackerState {
  switch (action.type) {
    case "config/totalPlayers": {
      const totalPlayers = action.value;
      const mySeat = clampInt(state.config.mySeat, 1, totalPlayers);
      return {
        ...state,
        config: {
          ...state.config,
          totalPlayers,
          mySeat,
        },
      };
    }
    case "config/setup":
      return { ...state, config: { ...state.config, setup: action.value } };
    case "config/mySeat": {
      const mySeat = clampInt(action.value, 1, state.config.totalPlayers);
      return { ...state, config: { ...state.config, mySeat } };
    }
    case "config/myRole":
      return { ...state, config: { ...state.config, myRole: action.value } };
    case "game/prevDay": {
      if (!state.game) return state;
      const currentDay = Math.max(1, state.game.currentDay - 1);
      return { ...state, game: { ...state.game, currentDay } };
    }
    case "game/nextDay": {
      if (!state.game) return state;
      const currentDay = state.game.currentDay + 1;
      return { ...state, game: { ...state.game, currentDay } };
    }
    case "game/cycleNextDay": {
      if (!state.game) return state;
      const currentDay = state.game.currentDay + 1;
      const players = state.players.map((p) => ({ ...p, voteFor: null }));
      return { ...state, players, game: { ...state.game, currentDay } };
    }
    case "logs/addEvent": {
      if (!state.game) return state;
      const logs = [...state.game.logs];
      const idx = logs.findIndex((l) => l.day === action.day);
      if (idx === -1) {
        logs.push({
          day: action.day,
          events: [{ type: action.eventType, detail: action.detail }],
        });
      } else {
        logs[idx] = {
          ...logs[idx],
          events: [...logs[idx].events, { type: action.eventType, detail: action.detail }],
        };
      }
      return { ...state, game: { ...state.game, logs } };
    }
    case "votes/record": {
      const { targetId, voterIds } = action;
      const players = state.players.map((p) =>
        voterIds.includes(p.id) ? { ...p, voteFor: targetId } : p,
      );
      return { ...state, players };
    }
    case "votes/clear": {
      const players = state.players.map((p) => ({ ...p, voteFor: null }));
      return { ...state, players };
    }
    case "player/update": {
      const players = state.players.map((p) =>
        p.id === action.id ? { ...p, ...action.patch } : p,
      );
      return { ...state, players };
    }
    case "start": {
      const totalPlayers = state.config.totalPlayers;
      const mySeat = clampInt(state.config.mySeat, 1, totalPlayers);
      const players = initPlayers(totalPlayers, mySeat, state.config.myRole);
      const game: GameState = {
        currentDay: 1,
        phase: "night",
        logs: [],
      };
      return {
        mode: "playing",
        config: { ...state.config, mySeat },
        players,
        game,
      };
    }
    case "reset":
      return initialState();
    default:
      return state;
  }
}

function initialState(): TrackerState {
  return {
    mode: "setup",
    config: {
      totalPlayers: 12,
      setup: "预女猎白",
      mySeat: 1,
      myRole: "平民",
    },
    players: [],
    game: null,
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-black tracking-[0.28em] text-white/60">
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none ring-0 backdrop-blur focus:border-fuchsia-400/60 focus:shadow-[0_0_0_4px_rgba(217,70,239,0.18)]"
    >
      {children}
    </select>
  );
}

function TextInput({
  value,
  onChange,
  inputMode,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputMode={inputMode}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none backdrop-blur focus:border-emerald-400/60 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.16)]"
    />
  );
}

function SeatGrid({
  totalPlayers,
  value,
  onChange,
}: {
  totalPlayers: number;
  value: number;
  onChange: (n: number) => void;
}) {
  const seats = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-6 gap-2">
      {seats.map((n) => {
        const disabled = n > totalPlayers;
        const active = n === value;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            className={[
              "h-9 rounded-lg text-sm font-bold transition",
              disabled
                ? "cursor-not-allowed border border-white/5 bg-white/2.5 text-white/20"
                : "border border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/7.5",
              active && !disabled
                ? "border-fuchsia-400/70 bg-fuchsia-500/10 text-white shadow-[0_0_0_4px_rgba(217,70,239,0.12)]"
                : "",
            ].join(" ")}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function SetupModal({
  state,
  dispatch,
}: {
  state: TrackerState;
  dispatch: React.Dispatch<Action>;
}) {
  const cfg = state.config;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="mb-5">
          <div className="text-xs font-black tracking-[0.28em] text-white/60">
            WEREWOLF_TRACKER
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-white">
            赛前配置大厅
          </div>
          <div className="mt-1 text-sm text-white/50">
            接入赛博圆桌之前，把关键参数锁死。
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <FieldLabel>总人数</FieldLabel>
            <Select
              value={String(cfg.totalPlayers)}
              onChange={(v) =>
                dispatch({
                  type: "config/totalPlayers",
                  value: Number(v) as 9 | 10 | 12,
                })
              }
            >
              {TOTAL_PLAYERS_OPTIONS.map((n) => (
                <option key={n} value={n} className="bg-zinc-900 text-zinc-100">
                  {n} 人局
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <FieldLabel>板子选择</FieldLabel>
            <Select
              value={cfg.setup}
              onChange={(v) => dispatch({ type: "config/setup", value: v as SetupTemplate })}
            >
              {SETUP_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                  {s}
                </option>
              ))}
            </Select>
          </div>

          <div className="grid gap-2">
            <FieldLabel>我的座位号</FieldLabel>
            <div className="grid gap-3">
              <SeatGrid
                totalPlayers={cfg.totalPlayers}
                value={cfg.mySeat}
                onChange={(n) => dispatch({ type: "config/mySeat", value: n })}
              />
              <TextInput
                value={String(cfg.mySeat)}
                inputMode="numeric"
                onChange={(v) =>
                  dispatch({ type: "config/mySeat", value: Number(v.replace(/[^\d]/g, "")) })
                }
                placeholder="1-12"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <FieldLabel>我的底牌</FieldLabel>
            <Select
              value={cfg.myRole}
              onChange={(v) => dispatch({ type: "config/myRole", value: v as RoleOption })}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r} className="bg-zinc-900 text-zinc-100">
                  {r}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => dispatch({ type: "start" })}
            className="group relative w-full overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/15 px-5 py-4 text-base font-black tracking-wide text-fuchsia-100 shadow-[0_0_0_1px_rgba(217,70,239,0.10),0_30px_90px_rgba(217,70,239,0.16)] transition hover:border-fuchsia-300/50 hover:bg-fuchsia-500/20"
          >
            <span className="relative z-10">接入赛博圆桌 (Start Game)</span>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <span className="absolute -left-12 top-0 h-full w-24 rotate-12 bg-white/15 blur-xl" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WerewolfPage() {
  const [state, dispatch] = React.useReducer(reducer, undefined, initialState);
  const [oracleOpen, setOracleOpen] = React.useState(false);
  const [oracleText, setOracleText] = React.useState("");
  const [oracleLoading, setOracleLoading] = React.useState(false);
  const oracleAbortRef = React.useRef<AbortController | null>(null);

  const updatePlayer = React.useCallback(
    <K extends keyof Player>(id: number, field: K, value: Player[K]) => {
      dispatch({ type: "player/update", id, patch: { [field]: value } as Partial<Player> });
    },
    [],
  );

  const runOracle = React.useCallback(async () => {
    if (!state.game) return;
    oracleAbortRef.current?.abort();
    const controller = new AbortController();
    oracleAbortRef.current = controller;

    setOracleText("");
    setOracleLoading(true);

    try {
      const prompt = generateWerewolfPrompt({
        config: state.config,
        players: state.players,
        logs: state.game.logs,
      });

      const res = await fetch("/api/werewolf/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const msg = `分析失败：HTTP ${res.status}`;
        setOracleText(msg);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          setOracleText((prev) => prev + decoder.decode(value, { stream: true }));
        }
      }
    } catch (e) {
      const err = e as Error;
      if (err?.name !== "AbortError") {
        setOracleText(`分析异常：${err?.message ?? "unknown error"}`);
      }
    } finally {
      setOracleLoading(false);
    }
  }, [state.config, state.game, state.players]);

  React.useEffect(() => {
    return () => {
      oracleAbortRef.current?.abort();
    };
  }, []);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#09090b] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-40 top-[-10%] h-[480px] w-[480px] rounded-full bg-fuchsia-500/20 blur-[90px]" />
        <div className="absolute -right-40 top-[10%] h-[520px] w-[520px] rounded-full bg-emerald-400/15 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-1/3 h-[520px] w-[520px] rounded-full bg-sky-400/10 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]" />
      </div>

      {state.mode === "setup" ? (
        <div className="relative flex min-h-dvh w-full items-center justify-center px-4 py-10">
          <SetupModal state={state} dispatch={dispatch} />
        </div>
      ) : state.game ? (
        <>
          <WerewolfMainPanel
            config={state.config}
            players={state.players}
            game={state.game}
            updatePlayer={updatePlayer}
            onPrevDay={() => dispatch({ type: "game/prevDay" })}
            onNextDay={() => dispatch({ type: "game/nextDay" })}
            onCycleNextDay={() => dispatch({ type: "game/cycleNextDay" })}
            onAddEvent={(eventType, detail) =>
              dispatch({
                type: "logs/addEvent",
                day: state.game?.currentDay ?? 1,
                eventType,
                detail,
              })
            }
            onRecordVotes={(targetId, voterIds) =>
              dispatch({ type: "votes/record", targetId, voterIds })
            }
            onClearVotes={() => dispatch({ type: "votes/clear" })}
          />

          <button
            type="button"
            onClick={() => setOracleOpen(true)}
            className="fixed bottom-6 right-6 z-40 rounded-2xl border border-border-pink/60 bg-fuchsia-500/15 px-5 py-4 text-sm font-black tracking-wide text-fuchsia-100 shadow-[0_0_0_1px_rgba(236,72,153,0.20),0_0_38px_rgba(236,72,153,0.22)] backdrop-blur-2xl transition hover:border-border-pink/80 hover:bg-fuchsia-500/20 hover:shadow-glow-pink mayi-pink-pulse"
          >
            🧠 呼叫梅子复盘 (Request Oracle)
          </button>

          {oracleOpen ? (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  oracleAbortRef.current?.abort();
                  setOracleLoading(false);
                  setOracleOpen(false);
                }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              />

              <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#09090b]/90 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black tracking-[0.28em] text-white/50">
                      MEIZI_ORACLE
                    </div>
                    <div className="mt-2 text-xl font-black tracking-tight text-white">
                      梅子的逻辑终端
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      oracleAbortRef.current?.abort();
                      setOracleLoading(false);
                      setOracleOpen(false);
                    }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white/70 hover:border-white/20 hover:bg-white/7.5"
                  >
                    关闭
                  </button>
                </div>

                <textarea
                  readOnly
                  value={oracleText}
                  placeholder="点击「开始分析」后，这里会流式输出梅子的推演结果…"
                  className="mt-4 h-80 w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85 placeholder:text-white/25 outline-none backdrop-blur"
                />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="text-xs text-white/40">
                    提示：梅子只会基于你提供的票型与标记推演，不会编造数据。
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={oracleLoading}
                      onClick={() => void runOracle()}
                      className={[
                        "rounded-xl border border-border-pink/60 bg-fuchsia-500/15 px-4 py-2 text-sm font-black text-fuchsia-100 shadow-[0_0_0_1px_rgba(236,72,153,0.18),0_0_28px_rgba(236,72,153,0.18)] transition hover:border-border-pink/80 hover:bg-fuchsia-500/20",
                        oracleLoading ? "cursor-not-allowed opacity-50" : "",
                      ].join(" ")}
                    >
                      {oracleLoading ? "分析中…" : "开始分析"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        oracleAbortRef.current?.abort();
                        setOracleLoading(false);
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-white/70 hover:border-white/20 hover:bg-white/7.5"
                    >
                      停止
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

