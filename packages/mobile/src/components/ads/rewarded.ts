import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../config/ads';
import { logger } from '../../utils/logger';

let inFlight = false;

/**
 * Carica e mostra un rewarded opt-in ("guarda un video → sblocca per oggi").
 * Chiama `onEarned()` solo se l'utente completa il video. Best-effort: se l'ad non carica o
 * l'utente lo chiude prima, non succede nulla (resta free). Un solo rewarded in volo per volta.
 */
export function showRewardedUnlock(onEarned: () => void): void {
  if (inFlight) return;
  inFlight = true;

  const ad = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded, {
    requestNonPersonalizedAdsOnly: true,
  });
  let earned = false;
  const subs: (() => void)[] = [];
  const cleanup = () => {
    subs.forEach((u) => u());
    inFlight = false;
  };

  subs.push(
    ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      ad.show().catch((e) => {
        logger.warn('Rewarded show failed', {
          message: e instanceof Error ? e.message : String(e),
        });
        cleanup();
      });
    })
  );
  subs.push(
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      earned = true;
    })
  );
  subs.push(
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      if (earned) onEarned();
      cleanup();
    })
  );
  subs.push(
    ad.addAdEventListener(AdEventType.ERROR, (error) => {
      logger.warn('Rewarded ad error', { message: error?.message });
      cleanup();
    })
  );

  ad.load();
}
