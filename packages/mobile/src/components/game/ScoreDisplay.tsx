import { View, Text } from 'react-native';
import { useGameStore } from '../../store/game-store';

export function ScoreDisplay() {
  const { player1, player2 } = useGameStore();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24 }}>{player1.name}</Text>
        <Text style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>
          {player1.score}
        </Text>
      </View>
      <Text style={{ color: 'white', fontSize: 32 }}>VS</Text>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 24 }}>{player2.name}</Text>
        <Text style={{ color: 'white', fontSize: 48, fontWeight: 'bold' }}>
          {player2.score}
        </Text>
      </View>
    </View>
  );
}
