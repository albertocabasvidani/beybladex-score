import { motion } from 'framer-motion';
import { FINISH_SCORES } from '@beybladex/shared';

interface OverEffectProps {
  points?: number;
  onComplete: () => void;
}

export function OverEffect({ points = FINISH_SCORES.over, onComplete }: OverEffectProps) {
  return (
    <motion.div
      className="text-6xl font-black tracking-wider"
      style={{ color: '#3b82f6' }}
      initial={{
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: [0, 0, 1000, 1000],
        y: [0, 0, -100, -100],
        rotate: [0, 0, 45, 45],
        opacity: [1, 1, 1, 0],
        scale: [1, 1, 0.8, 0.8],
      }}
      transition={{
        duration: 12,
        times: [0, 0.042, 0.192, 1],
        ease: ['linear', 'easeOut', 'linear'],
      }}
      onAnimationComplete={onComplete}
    >
      +{points} OVER
    </motion.div>
  );
}
