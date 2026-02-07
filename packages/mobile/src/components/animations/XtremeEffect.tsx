import { useEffect, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  onComplete: () => void;
}

function XtremeParticle({ index, total }: { index: number; total: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const angle = (index / total) * Math.PI * 2;
  const distance = 120 + Math.random() * 180;

  useEffect(() => {
    // Particles burst at 1100ms
    scale.value = withDelay(1100, withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0, { duration: 200 }),
    ));
    opacity.value = withDelay(1100, withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 250 }),
    ));
    translateX.value = withDelay(
      1100,
      withTiming(Math.cos(angle) * distance, { duration: 300 }),
    );
    translateY.value = withDelay(
      1100,
      withTiming(Math.sin(angle) * distance, { duration: 300 }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: width / 2 - 5,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#f59e0b',
        },
        animatedStyle,
      ]}
    />
  );
}

export function XtremeEffect({ onComplete }: Props) {
  // Flash
  const flashOpacity = useSharedValue(0);
  // Text
  const textScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateX = useSharedValue(0);
  // Glow
  const glowOpacity = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    // Phase 1: Flash white (0-100ms)
    flashOpacity.value = withSequence(
      withTiming(0.8, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );

    // Phase 2: Text scale in (100-250ms)
    textOpacity.value = withDelay(100, withTiming(1, { duration: 50 }));
    textScale.value = withDelay(
      100,
      withTiming(1.3, { duration: 150, easing: Easing.out(Easing.back(2)) }),
    );

    // Phase 3: Shake (250-650ms) - 8 alternations decreasing
    textTranslateX.value = withDelay(250, withSequence(
      withTiming(15, { duration: 50 }),
      withTiming(-12, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(2, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    ));

    // Phase 4: Glow (650-1100ms) - pulsing glow behind text
    glowOpacity.value = withDelay(650, withSequence(
      withTiming(0.8, { duration: 150 }),
      withTiming(0.3, { duration: 150 }),
      withTiming(0.8, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    ));
    glowScale.value = withDelay(650, withSequence(
      withTiming(1.5, { duration: 150 }),
      withTiming(1.2, { duration: 150 }),
      withTiming(1.5, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    ));

    // Phase 6: Fade out (1100-1300ms)
    textOpacity.value = withDelay(1100, withTiming(0, { duration: 200 }));
    textScale.value = withDelay(1100, withTiming(0.8, { duration: 200 }));

    const timer = setTimeout(onComplete, 1300);
    return () => clearTimeout(timer);
  }, []);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: textScale.value },
      { translateX: textTranslateX.value },
    ],
    opacity: textOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Flash overlay */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
          },
          flashStyle,
        ]}
      />

      {/* Glow behind text */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            alignSelf: 'center',
            top: height * 0.35 - 20,
            width: 250,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(245, 158, 11, 0.4)',
          },
          glowStyle,
        ]}
      />

      {/* Particles */}
      <View style={{ position: 'absolute', top: height * 0.35 + 20, left: 0, right: 0 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <XtremeParticle key={i} index={i} total={20} />
        ))}
      </View>

      {/* Text */}
      <Animated.Text
        style={[
          {
            position: 'absolute',
            alignSelf: 'center',
            top: height * 0.35,
            fontSize: 72,
            fontWeight: '900',
            color: '#f59e0b',
            textShadowColor: 'rgba(245, 158, 11, 0.8)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 25,
          },
          textStyle,
        ]}
      >
        XTREME!
      </Animated.Text>
    </View>
  );
}
