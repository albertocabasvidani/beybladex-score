import { useEffect, useMemo } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  FadeIn,
  cancelAnimation,
} from 'react-native-reanimated';
import type { PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

const { width, height } = Dimensions.get('window');

const CONFETTI_COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7'];

function ConfettiParticle({ index }: { index: number }) {
  const translateX = useSharedValue(Math.random() * width);
  const translateY = useSharedValue(-20 - Math.random() * 100);
  const rotate = useSharedValue(Math.random() * 360);
  const opacity = useSharedValue(1);

  const color = useMemo(() => CONFETTI_COLORS[index % CONFETTI_COLORS.length], [index]);
  const particleWidth = useMemo(() => 6 + Math.random() * 8, []);
  const particleHeight = useMemo(() => 10 + Math.random() * 12, []);

  useEffect(() => {
    const delay = index * 50;

    translateY.value = withDelay(
      delay,
      withTiming(height + 50, { duration: 3000, easing: Easing.in(Easing.quad) }),
    );
    translateX.value = withDelay(
      delay,
      withTiming(
        translateX.value + (Math.random() - 0.5) * 200,
        { duration: 3000 },
      ),
    );
    rotate.value = withDelay(
      delay,
      withTiming(rotate.value + 360 * (Math.random() > 0.5 ? 1 : -1), { duration: 3000 }),
    );
    opacity.value = withDelay(2500, withTiming(0, { duration: 500 }));

    return () => {
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
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: particleWidth,
          height: particleHeight,
          backgroundColor: color,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

function TrophyBounce() {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { stiffness: 300, damping: 15 });

    rotate.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(5, { duration: 600 }),
          withTiming(-5, { duration: 600 }),
        ),
        6,
        true,
      ),
    );

    return () => {
      cancelAnimation(scale);
      cancelAnimation(rotate);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.Text
      style={[
        {
          fontSize: 80,
          textAlign: 'center',
        },
        animatedStyle,
      ]}
    >
      🏆
    </Animated.Text>
  );
}

interface SlideInProps {
  delay: number;
  children: React.ReactNode;
}

function SlideInView({ delay, children }: SlideInProps) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}

interface Props {
  winnerId: PlayerId;
}

export function VictoryOverlay({ winnerId }: Props) {
  const player = useGameStore((state) => state[winnerId]);
  const reset = useGameStore((state) => state.reset);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200,
      }}
    >
      {/* Confetti - reduced from 50 to 20 */}
      {Array.from({ length: 20 }).map((_, i) => (
        <ConfettiParticle key={i} index={i} />
      ))}

      <TrophyBounce />

      <SlideInView delay={400}>
        <Text
          style={{
            color: '#fbbf24',
            fontSize: 36,
            fontWeight: '900',
            textAlign: 'center',
            marginTop: 16,
            textShadowColor: 'rgba(251, 191, 36, 0.5)',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 15,
          }}
        >
          {player.name}
        </Text>
      </SlideInView>

      <SlideInView delay={500}>
        <Text
          style={{
            color: '#e2e8f0',
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          WINS!
        </Text>
      </SlideInView>

      <SlideInView delay={500}>
        <Text
          style={{
            color: '#94a3b8',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Score: {player.score}
        </Text>
      </SlideInView>

      <SlideInView delay={600}>
        <Pressable
          onPress={reset}
          style={{
            marginTop: 32,
            paddingVertical: 14,
            paddingHorizontal: 32,
            backgroundColor: '#f59e0b',
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: '#0f172a',
              fontSize: 18,
              fontWeight: '800',
            }}
          >
            New Game
          </Text>
        </Pressable>
      </SlideInView>
    </Animated.View>
  );
}
