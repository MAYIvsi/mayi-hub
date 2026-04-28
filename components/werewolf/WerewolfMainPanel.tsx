import * as React from "react";
import type { GameConfig, GameState, Player } from "@/types/werewolf";
import { GlassPanel } from "@/components/werewolf/GlassPanel";
import { TimelineConsole } from "@/components/werewolf/TimelineConsole";
import { PlayerMatrix } from "@/components/werewolf/PlayerMatrix";
import { EventEnginePanel } from "@/components/werewolf/EventEnginePanel";
import { RoleTracker } from "@/components/werewolf/RoleTracker";

export function WerewolfMainPanel({
  config,
  players,
  game,
  updatePlayer,
  onPrevDay,
  onNextDay,
  onCycleNextDay,
  onAddEvent,
  onRecordVotes,
  onClearVotes,
}: {
  config: GameConfig;
  players: Player[];
  game: GameState;
  updatePlayer: <K extends keyof Player>(id: number, field: K, value: Player[K]) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onCycleNextDay: () => void;
  onAddEvent: (eventType: "police" | "vote" | "death", detail: string) => void;
  onRecordVotes: (targetId: number, voterIds: number[]) => void;
  onClearVotes: () => void;
}) {
  const seerClaimIds = React.useMemo(
    () => players.filter((p) => p.isSeerClaim).map((p) => p.id),
    [players],
  );

  const logsForDay = React.useMemo(
    () => game.logs.find((l) => l.day === game.currentDay) ?? null,
    [game.logs, game.currentDay],
  );

  return (
    <div className="flex h-screen w-screen gap-4 overflow-hidden p-4">
      <div className="w-1/5 min-w-[220px]">
        <GlassPanel title="剩余角色">
          <RoleTracker setup={config.setup} players={players} />
        </GlassPanel>
      </div>

      <div className="w-[55%] min-w-0 flex-1">
        <div className="flex h-full min-w-0 flex-col gap-4">
          <TimelineConsole
            currentDay={game.currentDay}
            onPrevDay={onPrevDay}
            onNextDay={onNextDay}
            onCycleNextDay={onCycleNextDay}
          />

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-xs font-black tracking-[0.28em] text-white/50">
                PLAYER_MATRIX
              </div>
              <div className="text-xs text-white/35">
                {config.setup} · {config.totalPlayers}人局 · 我是 {config.mySeat} 号
              </div>
            </div>

            <PlayerMatrix
              players={players}
              mySeat={config.mySeat}
              currentDay={game.currentDay}
              seerClaimIds={seerClaimIds}
              updatePlayer={updatePlayer}
            />
          </div>
        </div>
      </div>

      <div className="w-1/4 min-w-[260px]">
        <GlassPanel title="事件流与票型">
          <EventEnginePanel
            day={game.currentDay}
            totalPlayers={config.totalPlayers}
            logsForDay={logsForDay}
            players={players}
            onAddEvent={onAddEvent}
            onRecordVotes={onRecordVotes}
            onClearVotes={onClearVotes}
          />
        </GlassPanel>
      </div>
    </div>
  );
}

