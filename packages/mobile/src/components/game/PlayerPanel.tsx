import { View, Text } from 'react-native';
import type { PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';
import { ScoreDisplay } from './ScoreDisplay';
import { FinishButton } from './FinishButton';

interface Props {
  playerId: PlayerId;
}

export function PlayerPanel({ playerId }: Props) {
  const player = useGameStore((state) => state[playerId]);

  return (
    <View
      style={{
        alignItems: 'center',
        gap: 4,
        paddingVertical: 4,
        paddingHorizontal: 8,
      }}
    >
      {/* Player Name */}
      <Text
        style={{
          color: '#e2e8f0',
          fontSize: 16,
          fontWeight: '700',
          marginBottom: 4,
        }}
      >
        {player.name}
      </Text>

      {/* Layout: [Spin/Burst] - SCORE - [Over/Xtreme] */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        {/* Left buttons */}
        <View style={{ gap: 8 }}>
          <FinishButton playerId={playerId} finishType="spin" />
          <FinishButton playerId={playerId} finishType="burst" />
        </View>

        {/* Center score */}
        <ScoreDisplay playerId={playerId} />

        {/* Right buttons */}
        <View style={{ gap: 8 }}>
          <FinishButton playerId={playerId} finishType="over" />
          <FinishButton playerId={playerId} finishType="xtreme" />
        </View>
      </View>
    </View>
  );
}
