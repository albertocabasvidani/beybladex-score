import { motion } from 'framer-motion';
import { FINISH_SCORES } from '@beybladex/shared';

interface SpinEffectProps {
  points?: number;
  onComplete: () => void;
}

export function SpinEffect({ points = FINISH_SCORES.spin, onComplete }: SpinEffectProps) {
  return (
    <motion.div
      className="text-6xl font-black tracking-wider"
      style={{ color: '#22c55e' }}
      initial={{ scale: 0, rotate: 0, opacity: 1 }}
      animate={{
        scale: [0, 1.3, 1, 0.8],
        rotate: [0, 360],
        opacity: [1, 1, 1, 0]
      }}
      transition={{
        duration: 1.2,
        times: [0, 0.25, 0.75, 1],
        ease: 'easeOut'
      }}
      onAnimationComplete={onComplete}
    >
      +{points} SPIN
    </motion.div>
  );
}
