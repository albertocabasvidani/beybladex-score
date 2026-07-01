# Monetizzazione (AdMob + RevenueCat) — dettagli e verifiche

- **Modello**: un unico entitlement `pro` (RevenueCat) sblocca *analitiche complete + salvataggi combo/deck illimitati + niente pubblicità*, venduto con due prodotti (Lifetime one-time + Annuale) mappati sullo stesso entitlement. Il segnapunti resta sempre gratis (nessun gate/ad).
- **AdMob**: banner adattivo in Combo Builder e Analitiche (mai nel segnapunti) + banner nella `VictoryOverlay`; rewarded "assaggio" (`src/components/ads/rewarded.ts`). SDK `react-native-google-mobile-ads`. Config in `src/config/ads.ts` (ad unit IDs banner+rewarded, `isPro()`). Il banner sparisce col Pro.
- **RevenueCat**: `src/store/purchases-store.ts` (`isPro`, `loadOfferings`, `purchasePackage`, `restorePurchases`; entitlement `pro`). Paywall unico in `src/components/paywall/PaywallModal.tsx` (montato in `App.tsx`, aperto via `src/store/paywall-store.ts`).

## Gating (versione gratuita)

- Flag `MONETIZATION_ENABLED` in `src/config/featureFlags.ts` (produzione, NON `__DEV__`; `false` = tutto sbloccato, nessun ad/paywall — utile per debug e regressione segnapunti). Accesso completo: `hasFullAccess()`/`useHasFullAccess()` in `src/store/access-store.ts` = Pro OPPURE sblocco rewarded di sessione (non persistito) OPPURE flag OFF.
- Limiti free in `src/config/monetization.ts`: `FREE_MATCH_LIMIT` (25 match visibili in Analitiche, via `limitToRecent` in `features/stats/aggregation.ts`), `FREE_COMBO_LIMIT` (5), `FREE_DECK_LIMIT` (1). Oltre il limite: teaser + card gate (Analitiche, con "Guarda un video" rewarded e "Sblocca con Pro") o paywall al salvataggio (Builder/Decks). Consultazione parti/radar sempre libera; l'editing di combo/deck esistenti non consuma limite.
- **Config store (creata 01/07/2026)**: Play Console prodotti `pro_lifetime` (one-time, €34,99) e `pro_annual` con base plan `annual` (annuale auto-rinnovo, €9,99), entrambi attivi. RevenueCat: prodotti importati e mappati sull'entitlement `pro`; offering `default` con package `$rc_lifetime`→`pro_lifetime` e `$rc_annual`→`pro_annual:annual`. AdMob: banner `.../4762021095`, rewarded `.../4661237648`. Il vecchio prodotto RevenueCat `remove_ads` è obsoleto ("Not found").

## ID test (sostituzione tracciata come known issue in `projects/scoreboard.md`)

- App ID AdMob: `ca-app-pub-3940256099942544~3347511713` (in `app.json`)
- Ad unit ID: `TestIds.ADAPTIVE_BANNER` in dev (in `src/config/ads.ts`)
- RevenueCat API key: `goog_XXXX` placeholder (in `src/store/purchases-store.ts`)

## Plugin AdMob in app.json — camelCase

I parametri usano **camelCase** (`androidAppId`), NON snake_case (`android_app_id`). Verificare SEMPRE i nomi parametri nel sorgente del plugin (`node_modules/react-native-google-mobile-ads/plugin/src/index.ts`) prima di configurare.

## Permission AD_ID in app.json

Poiché l'app dichiara in Play Console (App content > Advertising ID) di usare l'advertising ID per AdMob, il manifest **deve** contenere `com.google.android.gms.permission.AD_ID` (richiesto da Android 13+). In `app.json`:
```json
"android": { "permissions": ["com.google.android.gms.permission.AD_ID"] }
```
Senza, Play Console blocca con *"manifest doesn't include AD_ID permission"*. Verificare che resti dopo `expo prebuild --clean`.

### Verifica AD_ID nell'AAB (NON fidarsi del grep)

Contare la stringa `AD_ID` nel manifest proto dell'AAB NON dimostra che la permission sia attiva (potrebbe essere in `tools:node="remove"` o nel pool stringhe). Verifica corretta: generare l'APK universale e leggere le permission reali.
```bash
java -jar bundletool.jar build-apks --bundle=app.aab --output=out.apks --mode=universal --overwrite
unzip -o out.apks universal.apk -d extracted
aapt2 dump permissions extracted/universal.apk   # deve elencare com.google.android.gms.permission.AD_ID
```
bundletool: scaricare il jar da GitHub releases (non è nell'SDK). aapt2 in `$ANDROID_SDK/build-tools/<ver>/aapt2.exe`.

### Errore AD_ID in review quando l'AAB È corretto

Se l'AAB nuovo ha davvero la permission (verificato con bundletool) ma Play Console mostra comunque l'errore bloccante, l'errore riguarda il bundle **precedente ancora live** (costruito senza la permission). In quel caso *"Release without permission"* è **sicuro**: NON rimuove la permission dall'AAB nuovo (che la mantiene), bypassa solo il controllo sul vecchio artifact. La dichiarazione Advertising ID resta su "Yes". Da NON fare se invece l'AAB nuovo non ha la permission (lì l'ad id verrebbe azzerato → AdMob rotto).

## expo-audio aggiunge permission in autolinking

L'SDK expo-audio inietta nel manifest `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK` anche se l'app fa solo playback. Non bloccano la pubblicazione, ma `RECORD_AUDIO` è sensibile: se Play Console ne chiede la motivazione, rimuoverla via config del plugin.
