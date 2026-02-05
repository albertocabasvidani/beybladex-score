import type { FinishType, PlayerId } from '@beybladex/shared';
import { motion } from 'framer-motion';
import { SpinEffect } from './SpinEffect';
import { BurstEffect } from './BurstEffect';
import { OverEffect } from './OverEffect';
import { XtremeEffect } from './XtremeEffect';
import { FINISH_SCORES } from '@beybladex/shared';

interface AnimationOverlayProps {
  animation: {
    type: FinishType;
    playerId: PlayerId;
  } | null;
  onComplete: () => void;
}

export function AnimationOverlay({ animation, onComplete }: AnimationOverlayProps) {
  if (!animation) return null;

  const { type } = animation;
  const points = FINISH_SCORES[type];

  const renderAnimation = () => {
    switch (type) {
      case 'spin':
        return <SpinEffect points={points} onComplete={onComplete} />;
      case 'burst':
        return <BurstEffect points={points} onComplete={onComplete} />;
      case 'over':
        return <OverEffect points={points} onComplete={onComplete} />;
      case 'xtreme':
        return <XtremeEffect points={points} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  const getDuration = () => {
    switch (type) {
      case 'over':
        return 12;
      case 'spin':
      case 'burst':
      case 'xtreme':
      default:
        return 2;
    }
  };

  const duration = getDuration();

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 9999 }}
      initial={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      animate={{
        backgroundColor: type === 'over'
          ? ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0)']
          : 'rgba(0, 0, 0, 0.7)'
      }}
      transition={{
        duration,
        times: type === 'over' ? [0, 0.192, 1] : undefined,
      }}
    >
      {renderAnimation()}
    </motion.div>
  );
}
