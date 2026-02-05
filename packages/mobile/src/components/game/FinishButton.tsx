import { TouchableOpacity, Text } from 'react-native';
import type { FinishType, PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

interface Props {
  finishType: FinishType;
  playerId: PlayerId;
}

const colors = {
  spin: '#22c55e',
  burst: '#ef4444',
  over: '#3b82f6',
  xtreme: '#f59e0b',
};

export function FinishButton({ finishType, playerId }: Props) {
  const score = useGameStore((state) => state.score);

  return (
    <TouchableOpacity
      onPress={() => score(playerId, finishType)}
      style={{
        backgroundColor: colors[finishType],
        padding: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }}
      >
        {finishType}
      </Text>
    </TouchableOpacity>
  );
}
