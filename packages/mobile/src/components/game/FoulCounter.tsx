import { View, Text, TouchableOpacity } from 'react-native';
import type { PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';

interface Props {
  playerId: PlayerId;
}

export function FoulCounter({ playerId }: Props) {
  const fouls = useGameStore((state) => state[playerId].fouls);
  const maxFouls = useGameStore((state) => state.maxFouls);
  const winner = useGameStore((state) => state.winner);
  const addFoul = useGameStore((state) => state.addFoul);
  const removeFoul = useGameStore((state) => state.removeFoul);

  const canAdd = !winner;
  const canRemove = fouls > 0;

  // Color based on foul state
  const countColor = fouls === 0 ? '#64748b' : '#f59e0b'; // slate-500 / amber-500

  // Display: "F: 1/2" with limit, "F: 1" without
  const display = maxFouls > 0 ? `F: ${fouls}/${maxFouls}` : `F: ${fouls}`;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 1,
      }}
    >
      <TouchableOpacity
        onPress={() => removeFoul(playerId)}
        disabled={!canRemove}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: canRemove ? '#334155' : '#1e293b',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: canRemove ? 1 : 0.3,
        }}
      >
        <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginTop: -1 }}>-</Text>
      </TouchableOpacity>

      <Text
        style={{
          color: countColor,
          fontSize: 13,
          fontWeight: '700',
          minWidth: 36,
          textAlign: 'center',
        }}
      >
        {display}
      </Text>

      <TouchableOpacity
        onPress={() => addFoul(playerId)}
        disabled={!canAdd}
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: canAdd ? '#334155' : '#1e293b',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: canAdd ? 1 : 0.3,
        }}
      >
        <Text style={{ color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginTop: -1 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
