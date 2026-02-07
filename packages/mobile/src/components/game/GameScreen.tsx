import { View, TouchableOpacity, Text } from 'react-native';
import { PlayerPanel } from './PlayerPanel';
import { VictoryOverlay } from './VictoryOverlay';
import { AnimationOverlay } from '../animations';
import { useGameStore } from '../../store/game-store';

export function GameScreen() {
  const { undo, reset, canUndo } = useGameStore();
  const winner = useGameStore((state) => state.winner);
  const currentAnimation = useGameStore((state) => state.currentAnimation);
  const clearAnimation = useGameStore((state) => state.clearAnimation);
  const canUndoValue = canUndo();

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Main content - two player panels side by side */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Player 1 */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PlayerPanel playerId="player1" />
        </View>

        {/* Player 2 */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PlayerPanel playerId="player2" />
        </View>
      </View>

      {/* Game Controls at bottom */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}
      >
        {/* Undo button */}
        <TouchableOpacity
          onPress={undo}
          disabled={!canUndoValue}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: canUndoValue ? '#334155' : '#1e293b',
            borderRadius: 8,
            opacity: canUndoValue ? 1 : 0.4,
          }}
        >
          {/* Undo icon */}
          <Text style={{ color: '#e2e8f0', fontSize: 16 }}>↩</Text>
          <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '600' }}>
            Annulla
          </Text>
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity
          onPress={reset}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 10,
            paddingHorizontal: 16,
            backgroundColor: 'rgba(127, 29, 29, 0.5)',
            borderRadius: 8,
          }}
        >
          {/* Reset icon */}
          <Text style={{ color: '#fecaca', fontSize: 16 }}>↻</Text>
          <Text style={{ color: '#fecaca', fontSize: 14, fontWeight: '600' }}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Animation Overlay */}
      {currentAnimation && (
        <AnimationOverlay
          animation={currentAnimation}
          onComplete={clearAnimation}
        />
      )}

      {/* Victory Overlay */}
      {winner && <VictoryOverlay winnerId={winner} />}
    </View>
  );
}
