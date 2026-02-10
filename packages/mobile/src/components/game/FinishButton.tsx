import { useState, useCallback } from 'react';
import { Pressable, Text, type LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import type { FinishType, PlayerId } from '@beybladex/shared';
import { FINISH_SCORES } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

interface Props {
  finishType: FinishType;
  playerId: PlayerId;
}

const MANGA_STYLES: Record<FinishType, {
  bgColor: string;
  shadowColor: string;
  borderColor: string;
  label: string;
}> = {
  spin: {
    bgColor: '#16a34a',
    shadowColor: '#14532d',
    borderColor: '#4ade80',
    label: 'SPIN',
  },
  burst: {
    bgColor: '#dc2626',
    shadowColor: '#7f1d1d',
    borderColor: '#f87171',
    label: 'BURST',
  },
  over: {
    bgColor: '#2563eb',
    shadowColor: '#1e3a8a',
    borderColor: '#60a5fa',
    label: 'OVER',
  },
  xtreme: {
    bgColor: '#ea580c',
    shadowColor: '#7c2d12',
    borderColor: '#fb923c',
    label: 'XTREME',
  },
};

export function FinishButton({ finishType, playerId }: Props) {
  const score = useGameStore((state) => state.score);
  const winner = useGameStore((state) => state.winner);

  const points = FINISH_SCORES[finishType];
  const style = MANGA_STYLES[finishType];
  const isDisabled = winner !== null;

  const [btnSize, setBtnSize] = useState({ w: 0, h: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBtnSize({ w: width, h: height });
  }, []);

  // Font e angolo calcolati sulla diagonale reale del pulsante
  const diagonal = Math.sqrt(btnSize.w * btnSize.w + btnSize.h * btnSize.h);
  const diagAngle = btnSize.w > 0
    ? Math.atan2(btnSize.h, btnSize.w) * (180 / Math.PI)
    : 45;
  const labelFontSize = btnSize.w > 0
    ? Math.floor(diagonal * 0.85 / (style.label.length * 0.6))
    : 0;

  const scaleValue = useSharedValue(1);
  const translateYValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleValue.value },
      { translateY: translateYValue.value },
    ],
  }));

  const handlePressIn = () => {
    scaleValue.value = withTiming(0.95, { duration: 150 });
    translateYValue.value = withTiming(4, { duration: 150 });
  };

  const handlePressOut = () => {
    scaleValue.value = withTiming(1, { duration: 150 });
    translateYValue.value = withTiming(0, { duration: 150 });
  };

  const handlePress = () => {
    if (!isDisabled) {
      score(playerId, finishType);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={{ flex: 1 }}
    >
      <Animated.View
        onLayout={onLayout}
        style={[
          {
            flex: 1,
            borderRadius: 12,
            borderWidth: 3,
            borderColor: style.borderColor,
            backgroundColor: style.bgColor,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isDisabled ? 0.4 : 1,
            shadowColor: style.shadowColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 8,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        {/* Diagonal label background */}
        {labelFontSize > 0 && (
          <Text
            style={{
              position: 'absolute',
              width: diagonal * 3,
              textAlign: 'center',
              fontSize: labelFontSize,
              fontWeight: '900',
              color: 'rgba(255,255,255,0.18)',
              letterSpacing: labelFontSize * 0.05,
              transform: [{ rotate: `${-diagAngle}deg` }],
            }}
          >
            {style.label}
          </Text>
        )}

        {/* Points foreground */}
        <Text
          style={{
            color: 'white',
            fontSize: 32,
            fontWeight: '900',
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}
        >
          +{points}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
