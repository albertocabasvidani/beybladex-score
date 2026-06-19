/**
 * Feature flag del Builder.
 *
 * ON in sviluppo (`__DEV__` = true con `expo start`), OFF nelle build di produzione (release APK/AAB)
 * finché la feature non è pronta al rilascio. Con il flag OFF l'app è identica allo scoreboard
 * attuale: nessun tab, nessun cambio di orientamento, BuilderShell mai montato.
 *
 * Per testare il builder in una build release temporanea, forzare `true` qui.
 */
export const BUILDER_ENABLED: boolean = __DEV__;
