import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { asyncStorage } from './async-storage';
import { logger } from '../utils/logger';

const REVENUECAT_API_KEY = 'goog_ajfBPtppZKDVhqGfLqVwksRqxyb';
const ENTITLEMENT_ID = 'pro';

interface PurchasesStore {
  adsRemoved: boolean;
  init: () => Promise<void>;
  purchaseRemoveAds: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

export const usePurchasesStore = create<PurchasesStore>()(
  persist(
    (set, get) => ({
      adsRemoved: false,

      init: async () => {
        try {
          if (__DEV__) {
            Purchases.setLogLevel(LOG_LEVEL.DEBUG);
          }
          Purchases.configure({ apiKey: REVENUECAT_API_KEY });

          const customerInfo = await Purchases.getCustomerInfo();
          const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          set({ adsRemoved: hasEntitlement });
          logger.info('RevenueCat initialized', { adsRemoved: hasEntitlement });
        } catch (error) {
          logger.warn('RevenueCat init failed', {
            message: error instanceof Error ? error.message : String(error),
          });
        }
      },

      purchaseRemoveAds: async () => {
        try {
          const offerings = await Purchases.getOfferings();
          const product = offerings.current?.availablePackages[0];
          if (!product) {
            logger.warn('No offerings available');
            return false;
          }

          const { customerInfo } = await Purchases.purchasePackage(product);
          const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          set({ adsRemoved: hasEntitlement });
          logger.info('Purchase completed', { adsRemoved: hasEntitlement });
          return hasEntitlement;
        } catch (error) {
          logger.warn('Purchase failed', {
            message: error instanceof Error ? error.message : String(error),
          });
          return false;
        }
      },

      restorePurchases: async () => {
        try {
          const customerInfo = await Purchases.restorePurchases();
          const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          set({ adsRemoved: hasEntitlement });
          logger.info('Purchases restored', { adsRemoved: hasEntitlement });
          return hasEntitlement;
        } catch (error) {
          logger.warn('Restore failed', {
            message: error instanceof Error ? error.message : String(error),
          });
          return false;
        }
      },
    }),
    {
      name: 'purchases-store',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({ adsRemoved: state.adsRemoved }),
    },
  ),
);
