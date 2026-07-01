import { create } from 'zustand';

/** Contesto da cui parte il paywall — usato solo per adattare il sottotitolo/copy. */
export type PaywallContext = 'analytics' | 'combo' | 'deck' | 'ads' | 'generic';

interface PaywallStore {
  visible: boolean;
  context: PaywallContext;
  show: (context?: PaywallContext) => void;
  hide: () => void;
}

/**
 * Visibilità del paywall. Il `PaywallModal` è montato una sola volta alla radice (App.tsx) e legge
 * da qui; qualunque trigger apre il paywall con `usePaywallStore.getState().show('...')`.
 */
export const usePaywallStore = create<PaywallStore>((set) => ({
  visible: false,
  context: 'generic',
  show: (context = 'generic') => set({ visible: true, context }),
  hide: () => set({ visible: false }),
}));
