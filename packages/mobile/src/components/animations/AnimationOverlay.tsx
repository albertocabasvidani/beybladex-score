import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { FinishType, PlayerId } from '@beybladex/shared';
import { SpinEffect } from './SpinEffect';
import { BurstEffect } from './BurstEffect';
import { OverEffect } from './OverEffect';
import { XtremeEffect } from './XtremeEffect';

interface Props {
  animation: {
    type: FinishType;
    playerId: PlayerId;
  };
  onComplete: () => void;
}

export function AnimationOverlay({ animation, onComplete }: Props) {
  const renderEffect = () => {
    switch (animation.type) {
      case 'spin':
        return <SpinEffect onComplete={onComplete} />;
      case 'burst':
        return <BurstEffect onComplete={onComplete} />;
      case 'over':
        return <OverEffect onComplete={onComplete} />;
      case 'xtreme':
        return <XtremeEffect onComplete={onComplete} />;
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      {renderEffect()}
    </Animated.View>
  );
}
