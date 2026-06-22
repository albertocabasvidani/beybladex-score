import { Modal, View, Text, TouchableOpacity, Pressable, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { logger } from '../../utils/logger';

// Link di partecipazione al Test aperto (Open testing) su Google Play.
const BETA_TEST_URL = 'https://play.google.com/apps/testing/com.beybladex.score';

interface Props {
  visible: boolean;
  /** Chiusura: tap fuori dalla card, OK o Partecipa. Marca l'invito come già mostrato. */
  onClose: () => void;
}

/**
 * Modale bloccante che invita al beta-testing, mostrata in produzione una sola volta dopo un
 * certo numero di partite completate (vedi BETA_INVITE_THRESHOLD nel review-store). Si chiude
 * toccando fuori dalla card o col pulsante OK; "Partecipa" apre il link di iscrizione.
 */
export function BetaInviteBanner({ visible, onClose }: Props) {
  const { t } = useTranslation();

  const handleJoin = async () => {
    try {
      await Linking.openURL(BETA_TEST_URL);
    } catch (error) {
      logger.warn('Beta invite link failed to open', {
        message: error instanceof Error ? error.message : String(error),
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Backdrop bloccante: il tap fuori dalla card chiude */}
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
            width: 360,
            borderWidth: 1,
            borderColor: '#a855f7',
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>🧪</Text>

          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {t('beta.title')}
          </Text>

          <Text
            style={{
              color: '#cbd5e1',
              fontSize: 14,
              lineHeight: 20,
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            {t('beta.message')}
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
                {t('beta.ok')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleJoin}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: '#a855f7',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
                {t('beta.join')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
