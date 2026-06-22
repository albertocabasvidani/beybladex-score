/**
 * Feature flag delle funzioni "avanzate" (combo builder, statistiche, home modalità).
 *
 * Tutte ON in sviluppo (`__DEV__` = true con `expo start`), OFF nelle build di produzione
 * (release APK/AAB) finché la feature non è pronta al rilascio. Con i flag OFF l'app è identica
 * allo scoreboard attuale: nessun tab, nessuna home, nessun cambio di orientamento, nessun
 * selettore Bey, nessuna registrazione statistiche.
 *
 * Per una build beta (track Test aperto su Play Store) usare `full-build-aab.sh --beta`:
 * attiva le feature solo in quell'AAB via EXPO_PUBLIC_FEATURES_ON, senza toccare la Production.
 */

// Attivato a build-time SOLO dalle build beta: `full-build-aab.sh --beta` esporta
// EXPO_PUBLIC_FEATURES_ON=1, che babel-preset-expo inlina qui. Senza il flag --beta la variabile
// è assente → in Production i gate restano legati al solo __DEV__ (feature nascoste).
const FEATURES_ON: boolean = process.env.EXPO_PUBLIC_FEATURES_ON === '1';

/** Combo Builder (tab parti/builder/deck/collezione). */
export const BUILDER_ENABLED: boolean = __DEV__ || FEATURES_ON;

/**
 * Statistiche per combo: selettore Bey nello scoreboard, registrazione dei match e schermate
 * analitiche. Gate separato dal builder, ma di fatto sono nate insieme (la selezione Bey pesca
 * dallo "scaffale" del builder).
 */
export const STATS_ENABLED: boolean = __DEV__ || FEATURES_ON;

/**
 * Home con selettore di modalità (Segnapunti / Gestore combo / Analitiche). Mostrata solo se è
 * attiva almeno una delle feature avanzate; altrimenti l'app entra dritta nello scoreboard.
 */
export const MODE_HOME_ENABLED: boolean = BUILDER_ENABLED || STATS_ENABLED;
