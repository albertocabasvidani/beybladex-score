import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useGameStore } from '../../store/game-store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ResetTrophiesModal({ visible, onClose }: Props) {
  const resetWins = useGameStore((state) => state.resetWins);

  const handleConfirm = () => {
    resetWins();
    onClose();
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
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
            Azzerare i trofei?
          </Text>

          <Text style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
            I trofei di entrambi i giocatori verranno azzerati.
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: '#334155',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#e2e8f0', fontSize: 15, fontWeight: '600' }}>
                Annulla
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: 'rgba(127, 29, 29, 0.5)',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fecaca', fontSize: 15, fontWeight: '700' }}>
                Azzera
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
