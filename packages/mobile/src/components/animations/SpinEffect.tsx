import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

export function SpinEffect({ onComplete }: Props) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Scale: 0 → 1.3 → 1 → 0.8
    scale.value = withSequence(
      withTiming(1.3, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
      withTiming(1, { duration: 200 }),
      withTiming(0.8, { duration: 700 }),
    );

    // Rotate 360°
    rotate.value = withTiming(360, { duration: 1000, easing: Easing.out(Easing.cubic) });

    // Fade out at 900ms
    opacity.value = withSequence(
      withTiming(1, { duration: 900 }),
      withTiming(0, { duration: 300 }),
    );

    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
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
          color: '#22c55e',
          textShadowColor: 'rgba(34, 197, 94, 0.6)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
        },
        animatedStyle,
      ]}
    >
      SPIN!
    </Animated.Text>
  );
}
