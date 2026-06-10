import { Modal, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTranslation, Trans } from 'react-i18next';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function ReleaseNoteModal({ visible, onClose }: Props) {
  const { t } = useTranslation();

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
            {t('releaseNote.badge')}
          </Text>

          <Text style={{ color: 'white', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
            {t('releaseNote.title')}
          </Text>

          <Text style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 24, lineHeight: 20 }}>
            <Trans
              i18nKey="releaseNote.body"
              components={{ b: <Text style={{ fontWeight: '700', color: '#e2e8f0' }} /> }}
            />
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
              {t('releaseNote.gotIt')}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
