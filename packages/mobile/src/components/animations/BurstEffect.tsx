import { useEffect, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
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

function AnimatedLetter({ char, index, total }: { char: string; index: number; total: number }) {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Random scatter direction
  const scatterX = useMemo(() => (Math.random() - 0.5) * 800, []);
  const scatterY = useMemo(() => (Math.random() - 0.5) * 600, []);
  const scatterRotate = useMemo(() => (Math.random() - 0.5) * 720, []);

  useEffect(() => {
    // Scale in with stagger
    scale.value = withDelay(
      index * 40,
      withTiming(1.3, { duration: 200, easing: Easing.out(Easing.back(2)) }),
    );

    // Hold then scatter at 320ms
    translateX.value = withDelay(320, withTiming(scatterX, { duration: 800 }));
    translateY.value = withDelay(320, withTiming(scatterY, { duration: 800 }));
    rotate.value = withDelay(320, withTiming(scatterRotate, { duration: 800 }));
    opacity.value = withDelay(600, withTiming(0, { duration: 600 }));
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

  // Offset each letter horizontally
  const letterOffset = (index - (total - 1) / 2) * 40;

  return (
    <Animated.Text
      style={[
        {
          position: 'absolute',
          left: width / 2 + letterOffset - 20,
          fontSize: 80,
          fontWeight: '900',
          color: '#ef4444',
          textShadowColor: 'rgba(239, 68, 68, 0.6)',
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 15,
        },
        animatedStyle,
      ]}
    >
      {char}
    </Animated.Text>
  );
}

function Particle({ index }: { index: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const angle = (index / 12) * Math.PI * 2;
  const distance = 150 + Math.random() * 200;

  useEffect(() => {
    translateX.value = withDelay(
      200,
      withTiming(Math.cos(angle) * distance, { duration: 800 }),
    );
    translateY.value = withDelay(
      200,
      withTiming(Math.sin(angle) * distance, { duration: 800 }),
    );
    scale.value = withDelay(200, withTiming(0, { duration: 800 }));
    opacity.value = withDelay(600, withTiming(0, { duration: 400 }));
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
          left: width / 2 - 6,
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: '#ef4444',
        },
        animatedStyle,
      ]}
    />
  );
}

export function BurstEffect({ onComplete }: Props) {
  const letters = 'BURST!'.split('');

  useEffect(() => {
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        top: height * 0.35,
        left: 0,
        right: 0,
        height: 100,
      }}
    >
      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Particle key={`p-${i}`} index={i} />
      ))}

      {/* Letters */}
      {letters.map((char, i) => (
        <AnimatedLetter
          key={`l-${i}`}
          char={char}
          index={i}
          total={letters.length}
        />
      ))}
    </View>
  );
}
