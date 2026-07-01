import { TestIds } from 'react-native-google-mobile-ads';
import { usePurchasesStore } from '../store/purchases-store';

// Test IDs in __DEV__, real IDs in production.
// NB: sostituire il rewarded con l'ad unit reale creato su AdMob prima del rilascio.
export const AD_UNIT_IDS = {
  banner: __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : 'ca-app-pub-7303361297226779/4762021095',
  rewarded: __DEV__
    ? TestIds.REWARDED
    : 'ca-app-pub-7303361297226779/0000000000', // TODO: ad unit rewarded reale
};

export const BANNER_HEIGHT = 50;

/** True se l'utente ha l'entitlement Pro (banner e paywall vanno nascosti). */
export function isPro(): boolean {
  return usePurchasesStore.getState().isPro;
}
