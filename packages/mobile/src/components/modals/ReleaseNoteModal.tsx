import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ReleaseNoteModal({ visible, onClose }: Props) {
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
            width: 340,
            borderWidth: 1,
            borderColor: '#334155',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>
            Novità
          </Text>

          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
            Reset trofei più facile
          </Text>

          <Text style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
            Ora puoi azzerare i trofei toccando l'icona 🏆 sopra il punteggio. Apparirà una conferma per evitare reset accidentali.
          </Text>

          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: 12,
              backgroundColor: '#334155',
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#e2e8f0', fontSize: 15, fontWeight: '600' }}>
              Ho capito
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
