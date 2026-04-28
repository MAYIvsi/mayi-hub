import * as React from "react";
import type {
  Player,
  PlayerIdentity,
  PlayerNightAction,
  PlayerStance,
} from "@/types/werewolf";
import { NotesModal } from "@/components/werewolf/NotesModal";

const NIGHT_ACTIONS: Array<{ value: PlayerNightAction; label: string }> = [
  { value: "", label: "空" },
  { value: "倒牌", label: "倒牌" },
  { value: "出局", label: "出局" },
  { value: "盲狙", label: "盲狙" },
  { value: "救", label: "救" },
  { value: "毒", label: "毒" },
];

const IDENTITIES: PlayerIdentity[] = [
  "未知",
  "狼人",
  "预言家",
  "女巫",
  "猎人",
  "白痴",
  "平民",
];

function SmallSelect({
  value,
  onChange,
  children,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-2 py-1.5 text-xs font-bold text-zinc-100 outline-none backdrop-blur focus:border-emerald-400/60 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.14)]"
    >
      {children}
    </select>
  );
}

function Tag({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onClick()}
      className={[
        "rounded-lg border px-2 py-1 text-xs font-black transition",
        active
          ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-100 shadow-[0_0_0_4px_rgba(217,70,239,0.10)]"
          : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/7.5",
        disabled ? "cursor-not-allowed opacity-50 hover:border-white/10 hover:bg-white/5" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function PlayerCard({
  player,
  isMe,
  currentDay,
  seerClaimIds,
  onUpdate,
}: {
  player: Player;
  isMe: boolean;
  currentDay: number;
  seerClaimIds: number[];
  onUpdate: <K extends keyof Player>(id: number, field: K, value: Player[K]) => void;
}) {
  const [notesOpen, setNotesOpen] = React.useState(false);
  const nightAction = (player.nightAction ?? "") as PlayerNightAction;
  const stance = (player.side ?? null) as PlayerStance | null;
  const deadByDay = player.deadDay != null && currentDay >= player.deadDay;
  const deadByAction = nightAction === "倒牌" || nightAction === "出局";
  const dead = deadByDay || !player.isAlive || deadByAction;
  const showStance = seerClaimIds.length > 0 && !player.isSeerClaim;
  const disabled = deadByDay;

  return (
    <>
      <div
        className={[
          "relative rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl transition",
          player.isSeerClaim ? "ring-2 ring-emerald-400/25 shadow-[0_0_0_1px_rgba(16,185,129,0.20)]" : "",
          dead ? "bg-white/2.5 opacity-70" : "hover:border-white/20",
          disabled ? "opacity-50 grayscale" : "",
          dead ? "line-through decoration-red-500/80 decoration-2" : "",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={[
                "rounded-lg border px-2 py-1 text-xs font-black tracking-wide",
                isMe
                  ? "border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-100 shadow-[0_0_0_4px_rgba(217,70,239,0.10)]"
                  : "border-white/10 bg-black/20 text-white/80",
              ].join(" ")}
            >
              {player.id}号{isMe ? " · 我" : ""}
            </div>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onUpdate(player.id, "isSeerClaim", !player.isSeerClaim)}
              className={[
                "rounded-lg border px-2 py-1 text-xs font-black transition",
                player.isSeerClaim
                  ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-100 shadow-[0_0_0_4px_rgba(16,185,129,0.10)]"
                  : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/7.5",
                disabled ? "cursor-not-allowed opacity-50 hover:border-white/10 hover:bg-white/5" : "",
              ].join(" ")}
              title="起跳预言家/信息位"
            >
              📢 起跳
            </button>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => setNotesOpen(true)}
            className={[
              "rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs font-black text-white/75 hover:border-white/20 hover:bg-white/7.5",
              disabled ? "cursor-not-allowed opacity-50 hover:border-white/10 hover:bg-white/5" : "",
            ].join(" ")}
            aria-label="Notes"
            title="速记"
          >
            📝
          </button>
        </div>

        <div className="mt-3 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
                昨晚行为
              </div>
              <SmallSelect
                value={nightAction}
                onChange={(v) => {
                  const nv = v as PlayerNightAction;
                  onUpdate(player.id, "nightAction", nv);
                  if (nv === "倒牌" || nv === "出局") {
                    onUpdate(player.id, "isAlive", false);
                    onUpdate(player.id, "deadDay", currentDay);
                  } else {
                    // allow reverting before day-end; once day progresses, deadByDay will lock interactions anyway.
                    if (!player.isAlive) onUpdate(player.id, "isAlive", true);
                    if (player.deadDay === currentDay) onUpdate(player.id, "deadDay", null);
                  }
                }}
                disabled={disabled}
              >
                {NIGHT_ACTIONS.map((a) => (
                  <option
                    key={a.value || "empty"}
                    value={a.value}
                    className="bg-zinc-900 text-zinc-100"
                  >
                    {a.label}
                  </option>
                ))}
              </SmallSelect>
            </div>

            <div className="grid gap-1.5">
              <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
                身份
              </div>
              <SmallSelect
                value={(player.role || "unknown").replace("unknown", "未知")}
                onChange={(v) => {
                  const vv = v === "未知" ? "unknown" : v;
                  onUpdate(player.id, "role", vv);
                }}
                disabled={disabled}
              >
                {IDENTITIES.map((r) => (
                  <option key={r} value={r} className="bg-zinc-900 text-zinc-100">
                    {r}
                  </option>
                ))}
              </SmallSelect>
            </div>
          </div>

          {showStance ? (
            <div className="grid gap-1.5">
              <div className="text-[10px] font-black tracking-[0.28em] text-white/45">
                站边
              </div>
              <div className="flex flex-wrap gap-2">
                {seerClaimIds.map((id) => {
                  const label = `站${id}`;
                  const val = String(id) as PlayerStance;
                  return (
                    <Tag
                      key={id}
                      active={stance === val}
                      disabled={disabled}
                      onClick={() => onUpdate(player.id, "side", stance === val ? null : val)}
                    >
                      {label}
                    </Tag>
                  );
                })}
                <Tag
                  active={stance === "摇摆"}
                  disabled={disabled}
                  onClick={() => onUpdate(player.id, "side", stance === "摇摆" ? null : "摇摆")}
                >
                  摇摆
                </Tag>
              </div>
            </div>
          ) : null}

          <div className="text-xs text-white/35">上票：{player.voteFor ? `投给 ${player.voteFor}` : "—"}</div>
        </div>

        {dead ? (
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-red-500/25" />
        ) : null}
      </div>

      <NotesModal
        open={notesOpen}
        title={`${player.id}号玩家发言速记`}
        value={player.notes}
        onChange={(v) => onUpdate(player.id, "notes", v)}
        onClose={() => setNotesOpen(false)}
        onSave={() => setNotesOpen(false)}
      />
    </>
  );
}

