import { motion, AnimatePresence } from "framer-motion";
import type { PlayerId } from "@beybladex/shared";
import { useGameStore } from "../../store/game-store";

interface ScoreDisplayProps {
  playerId: PlayerId;
}

export default function ScoreDisplay({ playerId }: ScoreDisplayProps) {
  const score = useGameStore((state) => state[playerId].score);
  const winScore = useGameStore((state) => state.winScore);

  // Calculate how close to winning (0-1)
  const progress = Math.min(score / winScore, 1);

  // Color gradient from white to gold as approaching victory
  const getScoreColor = () => {
    if (progress >= 1) return "text-amber-400";
    if (progress >= 0.75) return "text-amber-300";
    if (progress >= 0.5) return "text-slate-200";
    return "text-slate-100";
  };

  return (
    <div className="relative flex items-center justify-center px-4 min-w-[120px]">
      {/* Background glow when close to winning */}
      {progress >= 0.75 && (
        <div
          className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-2xl"
          style={{ opacity: progress - 0.5 }}
        />
      )}

      <AnimatePresence mode="popLayout">
        <motion.span
          key={score}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`text-9xl font-black tabular-nums ${getScoreColor()}`}
        >
          {score}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
