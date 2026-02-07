import { View, Text } from 'react-native';
import { useGameStore } from '../../store/game-store';
import type { PlayerId } from '@beybladex/shared';

interface Props {
  playerId: PlayerId;
}

export function ScoreDisplay({ playerId }: Props) {
  const player = useGameStore((state) => state[playerId]);
  const winScore = useGameStore((state) => state.winScore);

  // Calculate progress to winning
  const progress = Math.min(player.score / winScore, 1);

  // Color based on progress
  const getScoreColor = () => {
    if (progress >= 1) return '#fbbf24'; // amber-400
    if (progress >= 0.75) return '#fcd34d'; // amber-300
    if (progress >= 0.5) return '#e2e8f0'; // slate-200
    return '#f1f5f9'; // slate-100
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        minWidth: 100,
      }}
    >
      {/* Glow effect when close to winning */}
      {progress >= 0.75 && (
        <View
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            opacity: progress - 0.5,
          }}
        />
      )}

      <Text
        style={{
          color: getScoreColor(),
          fontSize: 72,
          fontWeight: '900',
          textShadowColor: 'rgba(0,0,0,0.3)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
        }}
      >
        {player.score}
      </Text>
    </View>
  );
}
