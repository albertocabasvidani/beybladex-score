import { Modal, View, Text, TouchableOpacity, Pressable, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as StoreReview from 'expo-store-review';
import { useReviewStore } from '../../store/review-store';
import { logger } from '../../utils/logger';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const MARKET_URL = 'market://details?id=com.beybladex.score';
const WEB_URL = 'https://play.google.com/store/apps/details?id=com.beybladex.score';

async function openReviewFlow() {
  // Percorso più rapido: dialog di recensione nativo in-app (l'utente resta nell'app)
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      return;
    }
  } catch (error) {
    logger.warn('In-app review not available', {
      message: error instanceof Error ? error.message : String(error),
    });
  }
  // Fallback: apri la scheda Play Store
  try {
    await Linking.openURL(MARKET_URL);
  } catch {
    await Linking.openURL(WEB_URL).catch(() => {});
  }
}

export function ReviewPromptModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const markReviewPromptShown = useReviewStore((state) => state.markReviewPromptShown);

  const handleRate = async () => {
    markReviewPromptShown();
    await openReviewFlow();
    onClose();
  };

  const handleLater = () => {
    markReviewPromptShown();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleLater}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        onPress={handleLater}
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
          <Text style={{ fontSize: 36, textAlign: 'center', marginBottom: 8 }}>⭐</Text>

          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            {t('review.title')}
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
            {t('review.message')}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={handleLater}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: '#334155',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#e2e8f0', fontSize: 15, fontWeight: '600' }}>
                {t('review.later')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRate}
              style={{
                flex: 1,
                paddingVertical: 12,
                backgroundColor: '#fbbf24',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#1e293b', fontSize: 15, fontWeight: '700' }}>
                {t('review.rate')}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
