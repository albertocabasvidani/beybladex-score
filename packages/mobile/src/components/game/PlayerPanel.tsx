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
        flex: 1,
        paddingHorizontal: 4,
        paddingVertical: 2,
      }}
    >
      {/* Player Name */}
      <Text
        style={{
          color: '#e2e8f0',
          fontSize: 18,
          fontWeight: '800',
          textAlign: 'center',
          paddingVertical: 2,
        }}
      >
        {player.name}
      </Text>

      {/* Layout: [Spin/Burst] - SCORE - [Over/Xtreme] */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: 6,
          paddingBottom: 2,
        }}
      >
        {/* Left buttons */}
        <View style={{ flex: 2, gap: 4 }}>
          <FinishButton playerId={playerId} finishType="spin" />
          <FinishButton playerId={playerId} finishType="burst" />
        </View>

        {/* Center score */}
        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
          <ScoreDisplay playerId={playerId} />
        </View>

        {/* Right buttons */}
        <View style={{ flex: 2, gap: 4 }}>
          <FinishButton playerId={playerId} finishType="over" />
          <FinishButton playerId={playerId} finishType="xtreme" />
        </View>
      </View>
    </View>
  );
}
