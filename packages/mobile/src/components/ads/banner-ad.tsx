import { View, type ViewStyle } from 'react-native';
import {
  BannerAd as RNBannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, BANNER_HEIGHT } from '../../config/ads';
import { usePurchasesStore } from '../../store/purchases-store';
import { logger } from '../../utils/logger';

interface Props {
  style?: ViewStyle;
}

export function BannerAdView({ style }: Props) {
  // Reattivo: alla conferma dell'acquisto Pro il banner sparisce senza rimontare il parent.
  const isPro = usePurchasesStore((s) => s.isPro);
  if (isPro) return null;

  return (
    <View style={[{ height: BANNER_HEIGHT, alignItems: 'center', justifyContent: 'center' }, style]}>
      <RNBannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(error) => {
          logger.warn('Banner ad failed to load', { message: error.message });
        }}
      />
    </View>
  );
}
