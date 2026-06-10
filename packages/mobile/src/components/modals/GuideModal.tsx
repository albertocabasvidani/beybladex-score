import { Modal, View, Text, TouchableOpacity, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation, Trans } from 'react-i18next';

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenCredits: () => void;
}

// Voce della guida con grassetti inline definiti nella traduzione (<b>...</b>)
function GuideItem({ i18nKey }: { i18nKey: string }) {
  return (
    <Text style={styles.item}>
      <Trans i18nKey={i18nKey} components={{ b: <Text style={{ fontWeight: '700' }} /> }} />
    </Text>
  );
}

export function GuideModal({ visible, onClose, onOpenCredits }: Props) {
  const { t } = useTranslation();

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
              {t('guide.title')}
            </Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
              <Text style={{ color: '#94a3b8', fontSize: 20 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Player panel */}
            <Text style={styles.sectionTitle}>
              {t('guide.sectionPanel')}
            </Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              <GuideItem i18nKey="guide.panelName" />
              <GuideItem i18nKey="guide.panelFouls" />
              <GuideItem i18nKey="guide.panelTrophies" />
              <GuideItem i18nKey="guide.panelButtons" />
            </View>

            {/* Commands */}
            <Text style={styles.sectionTitle}>
              {t('guide.sectionCommands')}
            </Text>
            <View style={{ gap: 6, marginBottom: 14 }}>
              <GuideItem i18nKey="guide.cmdSwap" />
              <GuideItem i18nKey="guide.cmdSettings" />
              <GuideItem i18nKey="guide.cmdCountdown" />
              <GuideItem i18nKey="guide.cmdUndo" />
              <GuideItem i18nKey="guide.cmdReset" />
              <GuideItem i18nKey="guide.cmdInfo" />
            </View>

            {/* End game */}
            <Text style={styles.sectionTitle}>
              {t('guide.sectionEnd')}
            </Text>
            <View style={{ gap: 6, marginBottom: 16 }}>
              <GuideItem i18nKey="guide.endText" />
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
            <Text style={{ color: '#64748b', fontSize: 13 }}>{t('guide.credits')}</Text>
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
