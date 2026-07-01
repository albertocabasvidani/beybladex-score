import { Modal, Text, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePartsStore } from '../../store/partsStore';
import { acknowledgeNewParts } from '../../services/parts-remote';

/**
 * Avviso "Aggiunte: X, Y, Z" mostrato al primo avvio dopo che la cache ha portato parti nuove.
 * Self-contained: si mostra da sé quando `partsStore.newParts` non è vuoto e alla conferma aggiorna
 * la baseline dei "visti" (acknowledgeNewParts). Montato a livello App, così non tocca i tab combo.
 */
export function NewPartsModal() {
  const { t } = useTranslation();
  const newParts = usePartsStore((s) => s.newParts);
  const visible = newParts.length > 0;

  const onClose = () => {
    void acknowledgeNewParts();
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
            width: 340,
            maxHeight: '80%',
            borderWidth: 1,
            borderColor: '#334155',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={{ color: '#fbbf24', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 }}>
            {t('parts.updated.title')}
          </Text>

          <Text style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 12, lineHeight: 20 }}>
            {t('parts.updated.body')}
          </Text>

          <ScrollView style={{ maxHeight: 220, marginBottom: 20 }}>
            {newParts.map((p) => (
              <Text
                key={p.id}
                style={{ color: '#e2e8f0', fontSize: 15, fontWeight: '600', paddingVertical: 4 }}
              >
                • {p.name}
              </Text>
            ))}
          </ScrollView>

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
              {t('parts.updated.ok')}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
