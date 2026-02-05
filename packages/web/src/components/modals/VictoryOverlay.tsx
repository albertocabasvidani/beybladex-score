import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/game-store';
import { useShare } from '../../hooks/useShare';

// Simple confetti particle
function Confetti({ delay }: { delay: number }) {
  const colors = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.random() * 100;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ y: -20, x: `${x}vw`, rotate: 0, opacity: 1 }}
      animate={{
        y: '100vh',
        rotate: rotation + 360,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        ease: 'linear',
      }}
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: color, left: 0 }}
    />
  );
}

export default function VictoryOverlay() {
  const { t } = useTranslation();
  const winner = useGameStore((state) => state.winner);
  const player1 = useGameStore((state) => state.player1);
  const player2 = useGameStore((state) => state.player2);
  const reset = useGameStore((state) => state.reset);
  const { shareResult, showCopiedToast } = useShare();

  const [confetti, setConfetti] = useState<number[]>([]);

  const winnerPlayer = winner === 'player1' ? player1 : player2;
  const loserPlayer = winner === 'player1' ? player2 : player1;

  useEffect(() => {
    if (winner) {
      // Generate confetti
      setConfetti(Array.from({ length: 50 }, (_, i) => i));
    } else {
      setConfetti([]);
    }
  }, [winner]);

  const handleShare = () => {
    shareResult(
      winnerPlayer.name,
      loserPlayer.name,
      winnerPlayer.score,
      loserPlayer.score
    );
  };

  const handleNewGame = () => {
    reset();
  };

  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 overflow-hidden"
        >
          {/* Confetti */}
          {confetti.map((i) => (
            <Confetti key={i} delay={i * 0.05} />
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="relative z-10 flex flex-col items-center gap-6 p-8"
          >
            {/* Trophy */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className="text-7xl"
            >
              🏆
            </motion.div>

            {/* Winner name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-white text-center"
            >
              {t('game.winner', { name: winnerPlayer.name })}
            </motion.h1>

            {/* Score */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-slate-300"
            >
              {winnerPlayer.score} - {loserPlayer.score}
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 mt-4"
            >
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
                {showCopiedToast ? '✓' : t('buttons.share')}
              </button>

              <button
                onClick={handleNewGame}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {t('buttons.newGame')}
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
