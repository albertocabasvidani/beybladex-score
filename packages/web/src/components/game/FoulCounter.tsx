import type { PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

interface Props {
  playerId: PlayerId;
}

export default function FoulCounter({ playerId }: Props) {
  const fouls = useGameStore((state) => state[playerId].fouls);
  const maxFouls = useGameStore((state) => state.maxFouls);
  const winner = useGameStore((state) => state.winner);
  const addFoul = useGameStore((state) => state.addFoul);
  const removeFoul = useGameStore((state) => state.removeFoul);

  const canAdd = !winner;
  const canRemove = fouls > 0;

  const display = maxFouls > 0 ? `F: ${fouls}/${maxFouls}` : `F: ${fouls}`;
  const countColor = fouls === 0 ? 'text-slate-500' : 'text-amber-500';

  return (
    <div className="flex items-center justify-center gap-2 py-0.5">
      <button
        onClick={() => removeFoul(playerId)}
        disabled={!canRemove}
        className="w-[22px] h-[22px] rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-sm font-bold flex items-center justify-center transition-colors"
      >
        -
      </button>

      <span className={`text-[13px] font-bold min-w-[36px] text-center ${countColor}`}>
        {display}
      </span>

      <button
        onClick={() => addFoul(playerId)}
        disabled={!canAdd}
        className="w-[22px] h-[22px] rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-sm font-bold flex items-center justify-center transition-colors"
      >
        +
      </button>
    </div>
  );
}
