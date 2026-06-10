import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
} from 'react-native-reanimated';
import { useCountdownAudio } from '../../hooks/useCountdownAudio';

export function CountdownButton() {
  const { play, isPlaying } = useCountdownAudio();

  const scaleValue = useSharedValue(1);
  const pulseValue = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 350 }),
          withTiming(1, { duration: 350 }),
        ),
        -1,
      );
    } else {
      cancelAnimation(pulseValue);
      pulseValue.value = withTiming(1, { duration: 150 });
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value * pulseValue.value }],
  }));

  const handlePressIn = () => {
    scaleValue.value = withTiming(0.94, { duration: 120 });
  };

  const handlePressOut = () => {
    scaleValue.value = withTiming(1, { duration: 120 });
  };

  return (
    <Pressable
      onPress={play}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isPlaying}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: '#334155',
            borderRadius: 8,
            borderWidth: 2,
            borderColor: isPlaying ? '#fbbf24' : '#475569',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 3,
          },
          animatedStyle,
        ]}
      >
        <Text
          allowFontScaling={false}
          style={{ color: isPlaying ? '#fbbf24' : '#e2e8f0', fontSize: 12 }}
        >
          ▶
        </Text>
        <Text
          allowFontScaling={false}
          style={{
            color: isPlaying ? '#fbbf24' : '#e2e8f0',
            fontSize: 14,
            fontWeight: '900',
            letterSpacing: 1,
          }}
        >
          3·2·1
        </Text>
      </Animated.View>
    </Pressable>
  );
}
