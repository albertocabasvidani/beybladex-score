import { Modal, View, Text, TouchableOpacity, Pressable, Linking } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CreditsModal({ visible, onClose }: Props) {
  const handleEmail = () => {
    Linking.openURL('mailto:albertocabasvidani@gmail.com');
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
          {/* Intestazione */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>
              Crediti
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Text style={{ color: '#94a3b8', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenuto */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
              Creato da Alberto Cabas Vidani
            </Text>
            <Text style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
              Contattami per idee, problemi e complimenti ;-)
            </Text>
            <TouchableOpacity
              onPress={handleEmail}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: '#2563eb',
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>✉</Text>
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>Invia Email</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
