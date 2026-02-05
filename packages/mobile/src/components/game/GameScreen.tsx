import { View, TouchableOpacity, Text } from 'react-native';
import { ScoreDisplay } from './ScoreDisplay';
import { FinishButton } from './FinishButton';
import { useGameStore } from '../../store/game-store';

export function GameScreen() {
  const { undo, reset, canUndo } = useGameStore();

  return (
    <View style={{ flex: 1, backgroundColor: '#1a1a2e' }}>
      <ScoreDisplay />

      <View style={{ flex: 1, flexDirection: 'row', gap: 16, padding: 16 }}>
        {/* Player 1 */}
        <View style={{ flex: 1, gap: 8 }}>
          <FinishButton finishType="spin" playerId="player1" />
          <FinishButton finishType="burst" playerId="player1" />
          <FinishButton finishType="over" playerId="player1" />
          <FinishButton finishType="xtreme" playerId="player1" />
        </View>

        {/* Player 2 */}
        <View style={{ flex: 1, gap: 8 }}>
          <FinishButton finishType="spin" playerId="player2" />
          <FinishButton finishType="burst" playerId="player2" />
          <FinishButton finishType="over" playerId="player2" />
          <FinishButton finishType="xtreme" playerId="player2" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 16, padding: 16 }}>
        <TouchableOpacity
          onPress={undo}
          disabled={!canUndo()}
          style={{
            flex: 1,
            backgroundColor: canUndo() ? '#3b82f6' : '#6b7280',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={reset}
          style={{
            flex: 1,
            backgroundColor: '#ef4444',
            padding: 16,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
