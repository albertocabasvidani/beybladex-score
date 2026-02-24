import { Modal, View, Text, TouchableOpacity, Pressable, ScrollView, StyleSheet } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenCredits: () => void;
}

export function GuideModal({ visible, onClose, onOpenCredits }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop - tap to close */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Content */}
        <View style={styles.card}>
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
            <Text style={styles.sectionTitle}>
              Pannello giocatore
            </Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              <Text style={styles.item}>
                Tocca il <Text style={{ fontWeight: '700' }}>nome</Text> per modificarlo
              </Text>
              <Text style={styles.item}>
                <Text style={{ fontWeight: '700' }}>F: 0/2</Text> — falli. Usa +/- per aggiungere o togliere. Al limite, il punto va all'avversario
              </Text>
              <Text style={styles.item}>
                <Text style={{ fontWeight: '700' }}>🏆</Text> sopra il punteggio — vittorie nella sessione. Tieni premuto per azzerare entrambi
              </Text>
              <Text style={styles.item}>
                I <Text style={{ fontWeight: '700' }}>4 pulsanti grandi</Text> assegnano il punteggio in base al tipo di finish
              </Text>
            </View>

            {/* Commands */}
            <Text style={styles.sectionTitle}>
              Comandi
            </Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              <Text style={styles.item}>
                <Text style={{ fontWeight: '700' }}>⇄</Text> (in alto al centro) — scambia i lati dei giocatori
              </Text>
              <Text style={styles.item}>
                <Text style={{ fontWeight: '700' }}>🏆</Text> — apre le impostazioni (punteggio vittoria e limite falli)
              </Text>
              <Text style={styles.item}>
                ↩ <Text style={{ fontWeight: '700' }}>Undo</Text> — annulla l'ultima azione
              </Text>
              <Text style={styles.item}>
                ↻ <Text style={{ fontWeight: '700' }}>Reset</Text> — nuova partita (le vittorie restano)
              </Text>
              <Text style={styles.item}>
                <Text style={{ fontWeight: '700' }}>i</Text> — questa guida
              </Text>
            </View>

            {/* End game */}
            <Text style={styles.sectionTitle}>
              Fine partita
            </Text>
            <View style={{ gap: 6, marginBottom: 16 }}>
              <Text style={styles.item}>
                Quando un giocatore raggiunge il punteggio vittoria, tocca <Text style={{ fontWeight: '700' }}>New Game</Text> per ricominciare
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    maxWidth: 420,
    width: '90%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  item: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
  },
});
