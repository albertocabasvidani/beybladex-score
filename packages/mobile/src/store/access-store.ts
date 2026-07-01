import { create } from 'zustand';
import { MONETIZATION_ENABLED } from '../config/featureFlags';
import { usePurchasesStore } from './purchases-store';

/**
 * Sblocco temporaneo ottenuto guardando un rewarded ("storico completo per oggi").
 * NON persistito: si azzera a ogni cold start dell'app. Non rimuove le pubblicità (resta free).
 */
interface AccessStore {
  sessionUnlock: boolean;
  grantSessionUnlock: () => void;
}

export const useAccessStore = create<AccessStore>((set) => ({
  sessionUnlock: false,
  grantSessionUnlock: () => set({ sessionUnlock: true }),
}));

/**
 * Accesso completo alle funzioni Pro: monetizzazione disattivata (debug), acquisto Pro, oppure
 * sblocco temporaneo da rewarded. Versione imperativa (per handler/eventi, non reattiva).
 */
export function hasFullAccess(): boolean {
  if (!MONETIZATION_ENABLED) return true;
  return usePurchasesStore.getState().isPro || useAccessStore.getState().sessionUnlock;
}

/** Versione reattiva per i componenti: si aggiorna su acquisto Pro o sblocco rewarded. */
export function useHasFullAccess(): boolean {
  const isPro = usePurchasesStore((s) => s.isPro);
  const sessionUnlock = useAccessStore((s) => s.sessionUnlock);
  if (!MONETIZATION_ENABLED) return true;
  return isPro || sessionUnlock;
}
