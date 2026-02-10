import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { logger } from '../../utils/logger';

const { width, height } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

export function OverEffect({ onComplete }: Props) {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    logger.debug('OverEffect mounted');

    // FIX: single scale sequence (was previously overwritten by two separate assignments)
    scale.value = withSequence(
      withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
      withDelay(50, withTiming(0.8, { duration: 1500 })),
    );

    translateX.value = withDelay(
      350,
      withTiming(width + 200, { duration: 1500, easing: Easing.in(Easing.cubic) }),
    );
    translateY.value = withDelay(
      350,
      withTiming(-100, { duration: 1500 }),
    );
    rotate.value = withDelay(
      350,
      withTiming(45, { duration: 1500 }),
    );

    opacity.value = withDelay(
      800,
      withTiming(0, { duration: 1000 }),
    );

    const timer = setTimeout(() => {
      logger.debug('OverEffect timer fired');
      onComplete();
    }, 2300);
    return () => {
      logger.debug('OverEffect unmounting');
      clearTimeout(timer);
      cancelAnimation(scale);
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          alignSelf: 'center',
          top: height * 0.35,
          fontSize: 80,
          fontWeight: '900',
          color: '#3b82f6',
          textShadowColor: 'rgba(59, 130, 246, 0.6)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
        },
        animatedStyle,
      ]}
    >
      OVER!
    </Animated.Text>
  );
}
