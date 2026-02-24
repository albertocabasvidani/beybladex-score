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
            {/* Player panel */}
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 }}>
              Pannello giocatore
            </Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                <Text style={{ fontWeight: '700' }}>Nome</Text> — tocca per modificarlo
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                <Text style={{ fontWeight: '700' }}>F: 0/2</Text> — contatore falli. Usa +/- per aggiungere o togliere. Al limite, il punto va all'avversario
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                <Text style={{ fontWeight: '700' }}>🏆 sopra il punteggio</Text> — vittorie nella sessione. Tieni premuto per azzerare entrambi
              </Text>
            </View>

            {/* Finish types */}
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 }}>
              Punteggi
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
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

            {/* Bottom bar controls */}
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 }}>
              Barra inferiore
            </Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                🏆 <Text style={{ color: '#fbbf24', fontWeight: '700' }}>5</Text> — apre le impostazioni (punteggio vittoria e limite falli)
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                ↩ <Text style={{ fontWeight: '700' }}>Undo</Text> — annulla l'ultima azione
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                ↻ <Text style={{ fontWeight: '700' }}>Reset</Text> — nuova partita (le vittorie restano)
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                <Text style={{ fontWeight: '700' }}>i</Text> — questa guida
              </Text>
            </View>

            {/* Other */}
            <Text style={{ color: '#94a3b8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 8 }}>
              Altro
            </Text>
            <View style={{ gap: 6, marginBottom: 16 }}>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                <Text style={{ fontWeight: '700' }}>⇄</Text> — scambia i lati dei giocatori
              </Text>
              <Text style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 18 }}>
                Quando un giocatore vince, tocca <Text style={{ fontWeight: '700' }}>New Game</Text> per ricominciare
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
