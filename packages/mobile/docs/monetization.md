# Monetizzazione (AdMob + RevenueCat) — dettagli e verifiche

- **AdMob**: banner nella `VictoryOverlay`, SDK `react-native-google-mobile-ads`. Config in `src/config/ads.ts` (ad unit IDs, `isAdsRemoved()`).
- **RevenueCat**: acquisto one-time "rimuovi pubblicità", SDK `react-native-purchases`. Store acquisti in `src/store/purchases-store.ts`.

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
