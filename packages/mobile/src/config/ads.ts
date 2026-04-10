import { TestIds } from 'react-native-google-mobile-ads';
import { usePurchasesStore } from '../store/purchases-store';

// Test IDs in __DEV__, real IDs in production
export const AD_UNIT_IDS = {
  banner: __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : 'ca-app-pub-7303361297226779/4762021095',
};

export const BANNER_HEIGHT = 50;

export function isAdsRemoved(): boolean {
  return usePurchasesStore.getState().adsRemoved;
}
