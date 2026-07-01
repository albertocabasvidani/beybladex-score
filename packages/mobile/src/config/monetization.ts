/**
 * Limiti della versione gratuita (gating funzionale). Valori di partenza: da tarare con A/B test.
 * Il Pro rimuove tutti questi limiti (vedi `hasFullAccess` in `store/access-store.ts`).
 */

/** Analitiche: numero di match più recenti visibili nel free (lo storico completo è Pro). */
export const FREE_MATCH_LIMIT = 25;

/** Combo Builder: numero massimo di combo salvabili nel free. */
export const FREE_COMBO_LIMIT = 5;

/** Combo Builder: numero massimo di deck salvabili nel free. */
export const FREE_DECK_LIMIT = 1;
