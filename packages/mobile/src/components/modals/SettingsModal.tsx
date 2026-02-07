import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useGameStore } from '../../store/game-store';
import { MIN_WIN_SCORE, MAX_WIN_SCORE } from '@beybladex/shared';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: Props) {
  const winScore = useGameStore((state) => state.winScore);
  const setWinScoreValue = useGameStore((state) => state.setWinScoreValue);

  const decrease = () => {
    if (winScore > MIN_WIN_SCORE) setWinScoreValue(winScore - 1);
  };

  const increase = () => {
    if (winScore < MAX_WIN_SCORE) setWinScoreValue(winScore + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: '#1e293b',
            borderRadius: 16,
            padding: 24,
            width: 320,
            borderWidth: 1,
            borderColor: '#334155',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>
              Impostazioni
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Text style={{ color: '#94a3b8', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Win Score */}
          <Text style={{ color: '#cbd5e1', fontSize: 14, fontWeight: '600', marginBottom: 12 }}>
            Punteggio Vittoria
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <TouchableOpacity
              onPress={decrease}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: winScore > MIN_WIN_SCORE ? '#334155' : '#1e293b',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: winScore > MIN_WIN_SCORE ? 1 : 0.3,
              }}
            >
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>-</Text>
            </TouchableOpacity>

            <Text style={{ color: 'white', fontSize: 48, fontWeight: '900', minWidth: 60, textAlign: 'center' }}>
              {winScore}
            </Text>

            <TouchableOpacity
              onPress={increase}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: winScore < MAX_WIN_SCORE ? '#334155' : '#1e293b',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: winScore < MAX_WIN_SCORE ? 1 : 0.3,
              }}
            >
              <Text style={{ color: 'white', fontSize: 24, fontWeight: '700' }}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 8 }}>
            {MIN_WIN_SCORE} - {MAX_WIN_SCORE}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
