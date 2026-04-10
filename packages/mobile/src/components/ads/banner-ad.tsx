import { View, type ViewStyle } from 'react-native';
import {
  BannerAd as RNBannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, BANNER_HEIGHT, isAdsRemoved } from '../../config/ads';
import { logger } from '../../utils/logger';

interface Props {
  style?: ViewStyle;
}

export function BannerAdView({ style }: Props) {
  if (isAdsRemoved()) return null;

  return (
    <View style={[{ height: BANNER_HEIGHT, alignItems: 'center', justifyContent: 'center' }, style]}>
      <RNBannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={(error) => {
          logger.warn('Banner ad failed to load', { message: error.message });
        }}
      />
    </View>
  );
}
