import * as React from "react";
import type { Player } from "@/types/werewolf";
import { PlayerCard } from "@/components/werewolf/PlayerCard";

export function PlayerMatrix({
  players,
  mySeat,
  currentDay,
  seerClaimIds,
  updatePlayer,
}: {
  players: Player[];
  mySeat: number;
  currentDay: number;
  seerClaimIds: number[];
  updatePlayer: <K extends keyof Player>(id: number, field: K, value: Player[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {players.map((p) => (
        <PlayerCard
          key={p.id}
          player={p}
          isMe={p.id === mySeat}
          currentDay={currentDay}
          seerClaimIds={seerClaimIds}
          onUpdate={updatePlayer}
        />
      ))}
    </div>
  );
}

