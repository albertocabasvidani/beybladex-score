import { TouchableOpacity, Text, View } from 'react-native';
import type { FinishType, PlayerId } from '@beybladex/shared';
import { FINISH_SCORES } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

interface Props {
  finishType: FinishType;
  playerId: PlayerId;
}

// Stile manga vibrante per ogni tipo di finish
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

  const handlePress = () => {
    if (!isDisabled) {
      score(playerId, finishType);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={{
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <View
        style={{
          minWidth: 100,
          minHeight: 70,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 12,
          borderWidth: 3,
          borderColor: style.borderColor,
          backgroundColor: style.bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          // Shadow effect
          shadowColor: style.shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        {/* Label */}
        <Text
          style={{
            color: 'white',
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 2,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {style.label}
        </Text>

        {/* Points */}
        <Text
          style={{
            color: 'white',
            fontSize: 32,
            fontWeight: '900',
            lineHeight: 36,
            textShadowColor: 'rgba(0,0,0,0.4)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          }}
        >
          +{points}
        </Text>

        {/* Decorative line */}
        <View
          style={{
            position: 'absolute',
            bottom: 4,
            left: 8,
            right: 8,
            height: 2,
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.3)',
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
