import type { PlayerId } from "@beybladex/shared";
import NameInput from "./NameInput";
import ScoreDisplay from "./ScoreDisplay";
import FinishButton from "./FinishButton";

interface PlayerPanelProps {
  playerId: PlayerId;
}

export default function PlayerPanel({ playerId }: PlayerPanelProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0 px-1">
      <div className="mb-0.5">
        <NameInput playerId={playerId} />
      </div>

      {/* Layout orizzontale: [Spin][Burst] - PUNTEGGIO - [Over][Xtreme] */}
      <div className="flex items-center justify-center gap-1.5 w-full">
        {/* Pulsanti sinistri */}
        <div className="flex flex-col gap-1.5">
          <FinishButton playerId={playerId} finishType="spin" />
          <FinishButton playerId={playerId} finishType="burst" />
        </div>

        {/* Punteggio centrale grande */}
        <ScoreDisplay playerId={playerId} />

        {/* Pulsanti destri */}
        <div className="flex flex-col gap-1.5">
          <FinishButton playerId={playerId} finishType="over" />
          <FinishButton playerId={playerId} finishType="xtreme" />
        </div>
      </div>
    </div>
  );
}
