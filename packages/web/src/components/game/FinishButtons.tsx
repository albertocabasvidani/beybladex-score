import { useTranslation } from 'react-i18next';
import type { PlayerId, FinishType } from '@beybladex/shared';
import { FINISH_ORDER, FINISH_INFO, FINISH_SCORES } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

interface FinishButtonsProps {
  playerId: PlayerId;
}

export default function FinishButtons({ playerId }: FinishButtonsProps) {
  const { t } = useTranslation();
  const score = useGameStore((state) => state.score);
  const winner = useGameStore((state) => state.winner);

  const handleScore = (finishType: FinishType) => {
    if (winner) return;
    score(playerId, finishType);
  };

  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-md mx-auto">
      {FINISH_ORDER.map((finishType) => {
        const info = FINISH_INFO[finishType];
        const points = FINISH_SCORES[finishType];

        return (
          <button
            key={finishType}
            onClick={() => handleScore(finishType)}
            disabled={winner !== null}
            className="flex flex-col items-center justify-center py-3 px-2 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: info.bgColor,
              boxShadow: `0 4px 0 ${info.hoverColor}`,
            }}
          >
            <span className="text-xs uppercase tracking-wide opacity-80">
              {t(info.labelKey)}
            </span>
            <span className="text-2xl">+{points}</span>
          </button>
        );
      })}
    </div>
  );
}
