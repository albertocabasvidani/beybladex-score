import { useEffect, useRef } from 'react';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { FinishType, PlayerId } from '@beybladex/shared';
import { SpinEffect } from './SpinEffect';
import { BurstEffect } from './BurstEffect';
import { OverEffect } from './OverEffect';
import { XtremeEffect } from './XtremeEffect';
import { logger } from '../../utils/logger';
import { animationTracker } from '../../utils/animation-tracker';

interface Props {
  animation: {
    type: FinishType;
    playerId: PlayerId;
  };
  onComplete: () => void;
}

let animCounter = 0;

export function AnimationOverlay({ animation, onComplete }: Props) {
  const bgOpacity = useSharedValue(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animIdRef = useRef(`anim-${++animCounter}-${animation.type}`);

  useEffect(() => {
    const id = animIdRef.current;
    logger.info('AnimationOverlay mounted', { id, type: animation.type, playerId: animation.playerId });
    animationTracker.start(id, animation.type);

    bgOpacity.value = withTiming(0.6, { duration: 200 });
    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      logger.info('AnimationOverlay unmounting', { id });
      animationTracker.complete(id);
    };
  }, []);

  const handleEffectComplete = () => {
    const id = animIdRef.current;
    logger.info('AnimationOverlay effect complete, fading', { id, type: animation.type });
    animationTracker.phase(id, 'fading');

    bgOpacity.value = withTiming(0, { duration: 300 });
    fadeTimerRef.current = setTimeout(() => {
      logger.info('AnimationOverlay fade done, calling onComplete', { id });
      animationTracker.complete(id);
      try {
        onComplete();
      } catch (e) {
        logger.error('AnimationOverlay onComplete error', {
          id,
          error: (e as Error).message,
        });
      }
    }, 300);
  };

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${bgOpacity.value})`,
  }));

  const renderEffect = () => {
    switch (animation.type) {
      case 'spin':
        return <SpinEffect onComplete={handleEffectComplete} />;
      case 'burst':
        return <BurstEffect onComplete={handleEffectComplete} />;
      case 'over':
        return <OverEffect onComplete={handleEffectComplete} />;
      case 'xtreme':
        return <XtremeEffect onComplete={handleEffectComplete} />;
      default:
        logger.error('AnimationOverlay unknown type', { type: animation.type });
        return null;
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        },
        bgStyle,
      ]}
    >
      {renderEffect()}
    </Animated.View>
  );
}
