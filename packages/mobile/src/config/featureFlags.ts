/**
 * Feature flag delle funzioni "avanzate" (combo builder, statistiche, home modalità).
 *
 * Tutte ON in sviluppo (`__DEV__` = true con `expo start`), OFF nelle build di produzione
 * (release APK/AAB) finché la feature non è pronta al rilascio. Con i flag OFF l'app è identica
 * allo scoreboard attuale: nessun tab, nessuna home, nessun cambio di orientamento, nessun
 * selettore Bey, nessuna registrazione statistiche.
 *
 * Per testare le feature in una build release temporanea, forzare `true` qui.
 */

// TEMP test override — abilita le feature avanzate anche in release per testarle sull'emulatore.
// Riportare a `false` prima del rilascio (le feature devono restare nascoste in produzione).
const FORCE_ON = false;

/** Combo Builder (tab parti/builder/deck/collezione). */
export const BUILDER_ENABLED: boolean = __DEV__ || FORCE_ON;

/**
 * Statistiche per combo: selettore Bey nello scoreboard, registrazione dei match e schermate
 * analitiche. Gate separato dal builder, ma di fatto sono nate insieme (la selezione Bey pesca
 * dallo "scaffale" del builder).
 */
export const STATS_ENABLED: boolean = __DEV__ || FORCE_ON;

/**
 * Home con selettore di modalità (Segnapunti / Gestore combo / Analitiche). Mostrata solo se è
 * attiva almeno una delle feature avanzate; altrimenti l'app entra dritta nello scoreboard.
 */
export const MODE_HOME_ENABLED: boolean = BUILDER_ENABLED || STATS_ENABLED;
