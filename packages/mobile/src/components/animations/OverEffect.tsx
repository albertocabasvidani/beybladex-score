import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';

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
    // Scale in
    scale.value = withTiming(1.2, { duration: 300, easing: Easing.out(Easing.back(1.5)) });

    // Hold 50ms, then fly right with rotation
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
    scale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withDelay(50, withTiming(0.8, { duration: 1500 })),
    );

    // Fade out
    opacity.value = withDelay(
      800,
      withTiming(0, { duration: 1000 }),
    );

    const timer = setTimeout(onComplete, 2300);
    return () => clearTimeout(timer);
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
