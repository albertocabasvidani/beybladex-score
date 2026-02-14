import { Modal, View, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenCredits: () => void;
}

const finishTypes = [
  { name: 'Spin', points: 1, color: '#22c55e' },
  { name: 'Burst', points: 2, color: '#ef4444' },
  { name: 'Over', points: 2, color: '#3b82f6' },
  { name: 'Xtreme', points: 3, color: '#f59e0b' },
];

export function GuideModal({ visible, onClose, onOpenCredits }: Props) {
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
            maxWidth: 420,
            width: '90%',
            maxHeight: '90%',
            borderWidth: 1,
            borderColor: '#334155',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '700' }}>
              Come si gioca
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Text style={{ color: '#94a3b8', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Names */}
            <Text style={{ color: '#e2e8f0', fontSize: 14, marginBottom: 12, lineHeight: 20 }}>
              Tocca il nome del giocatore per modificarlo.
            </Text>

            {/* Finish types */}
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 }}>
              Punteggi
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {finishTypes.map((ft) => (
                <View
                  key={ft.name}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: '#0f172a',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text style={{ color: ft.color, fontSize: 14, fontWeight: '700' }}>{ft.name}</Text>
                  <Text style={{ color: '#94a3b8', fontSize: 13 }}>=</Text>
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{ft.points}pt</Text>
                </View>
              ))}
            </View>

            {/* How to win */}
            <Text style={{ color: '#e2e8f0', fontSize: 14, marginBottom: 12, lineHeight: 20 }}>
              Premi i pulsanti per assegnare punti. Il primo giocatore a raggiungere il punteggio vittoria vince!
            </Text>

            {/* Controls */}
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 }}>
              Controlli
            </Text>
            <View style={{ gap: 4, marginBottom: 16 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                🏆  Tocca per cambiare il punteggio vittoria
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                ↩  Annulla l'ultima azione
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                ↻  Nuova partita
              </Text>
            </View>
          </ScrollView>

          {/* Credits button */}
          <TouchableOpacity
            onPress={onOpenCredits}
            style={{
              alignSelf: 'center',
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ color: '#64748b', fontSize: 13 }}>Crediti</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
