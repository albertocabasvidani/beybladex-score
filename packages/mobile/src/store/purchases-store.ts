import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Purchases, {
  LOG_LEVEL,
  type PurchasesPackage,
  type PurchasesOffering,
} from 'react-native-purchases';
import { asyncStorage } from './async-storage';
import { logger } from '../utils/logger';

const REVENUECAT_API_KEY = 'goog_ajfBPtppZKDVhqGfLqVwksRqxyb';
// Entitlement unico "Pro": sblocca analitiche complete + salvataggi illimitati + niente pubblicità.
// Vi sono mappati più prodotti (lifetime one-time + annuale), gestiti come package dell'offering.
const ENTITLEMENT_ID = 'pro';

interface PurchasesStore {
  /** L'utente ha l'entitlement "pro" attivo (acquisto permanente/annuale). Persistito come cache. */
  isPro: boolean;
  /** Offering corrente di RevenueCat (lifetime + annuale). Runtime, non persistito. */
  offering: PurchasesOffering | null;
  init: () => Promise<void>;
  /** Carica l'offering corrente per popolare il paywall. Restituisce null se non disponibile. */
  loadOfferings: () => Promise<PurchasesOffering | null>;
  /** Acquista il package scelto nel paywall. Restituisce true se l'entitlement "pro" risulta attivo. */
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

export const usePurchasesStore = create<PurchasesStore>()(
  persist(
    (set, get) => ({
      isPro: false,
      offering: null,

      init: async () => {
        try {
          if (__DEV__) {
            Purchases.setLogLevel(LOG_LEVEL.DEBUG);
          }
          Purchases.configure({ apiKey: REVENUECAT_API_KEY });

          const customerInfo = await Purchases.getCustomerInfo();
          const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          set({ isPro: hasEntitlement });
          logger.info('RevenueCat initialized', { isPro: hasEntitlement });

          // Pre-carica le offerte per il paywall (best-effort: non deve far fallire l'init).
          void get().loadOfferings();
        } catch (error) {
          logger.warn('RevenueCat init failed', {
            message: error instanceof Error ? error.message : String(error),
          });
        }
      },

      loadOfferings: async () => {
        try {
          const offerings = await Purchases.getOfferings();
          const current = offerings.current ?? null;
          set({ offering: current });
          return current;
        } catch (error) {
          logger.warn('Load offerings failed', {
            message: error instanceof Error ? error.message : String(error),
          });
          return null;
        }
      },

      purchasePackage: async (pkg) => {
        try {
          const { customerInfo } = await Purchases.purchasePackage(pkg);
          const hasEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
          set({ isPro: hasEntitlement });
          logger.info('Purchase completed', { isPro: hasEntitlement, package: pkg.identifier });
          return hasEntitlement;
        } catch (error) {
          // Include l'annullamento volontario dell'utente: non è un errore da mostrare.
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
          set({ isPro: hasEntitlement });
          logger.info('Purchases restored', { isPro: hasEntitlement });
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
      version: 1,
      // v0 persisteva `adsRemoved`; da v1 il concetto è `isPro` (il "rimuovi ads" è ora parte del Pro).
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as { adsRemoved?: boolean; isPro?: boolean };
        const isPro =
          typeof s.isPro === 'boolean' ? s.isPro : version < 1 ? !!s.adsRemoved : false;
        return { isPro } as unknown as PurchasesStore;
      },
      partialize: (state) => ({ isPro: state.isPro }),
    },
  ),
);
