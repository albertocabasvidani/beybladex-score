# Beyblade X Score Monorepo

## Struttura
- `packages/shared`: Core game logic (pure TypeScript)
- `packages/web`: React web app (Vite + Tailwind)
- `packages/mobile`: React Native app (Expo + NativeWind + Reanimated)

## Working Directory
- **Web**: `cd packages/web`
- **Mobile**: `cd packages/mobile`
- **Shared**: modifiche shared richiedono test in web E mobile

## Testing

### Web
```bash
cd packages/web
npm run dev
# Apri http://localhost:5173
```

### Mobile - Emulatore Locale (PREFERITO)

Guida completa build + emulatore: **`packages/mobile/BUILD-GUIDE.md`**
Troubleshooting emulatore: **`packages/mobile/EMULATOR-GUIDE.md`**

**REGOLA CRITICA — Architettura APK per emulatore**:
La build standard produce APK solo `arm64-v8a`, che **CRASHA sull'emulatore x86_64** (`SoLoaderDSONotFoundError`).
- **Emulatore**: `bash packages/mobile/scripts/full-build-apk.sh --emulator` (aggiunge x86_64 automaticamente)
- **Device/Play Store**: `bash packages/mobile/scripts/full-build-apk.sh` (arm64-v8a only)

**IMPORTANTE**: Tutti i comandi adb vanno in script `.sh` per evitare permission multiple.

### Mobile - Device Fisico
1. Apri segnalibro: https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds
2. Tap sull'ultima build → "Install"

## Build & Release Android

Dettagli completi in **`packages/mobile/BUILD-GUIDE.md`**.

Comandi rapidi:
```bash
# APK test emulatore (include x86_64 automaticamente)
bash packages/mobile/scripts/full-build-apk.sh --emulator

# AAB Play Store
bash packages/mobile/scripts/full-build-aab.sh
```

**REGOLE**:
- MAI usare `build-apk.sh` dopo `expo prebuild --clean` senza `patch-build-gradle.sh`
- Sempre stoppare Gradle daemons prima di una nuova build
- Upload Play Store: SEMPRE track **Production** (MAI Closed testing/Alpha)
- Controllare review/rejection su Play Console via Chrome DevTools
- **versionCode è bruciato anche dopo Discard draft**: se un AAB con versionCode N viene caricato e poi il draft scartato, Play Console rifiuta il prossimo upload con stesso N (errore *"Version code N has already been used"*). Bumpare SEMPRE a N+1 prima di re-buildare.

## Monetizzazione (AdMob + RevenueCat)

- **AdMob**: banner nella VictoryOverlay, SDK `react-native-google-mobile-ads`
- **RevenueCat**: acquisto one-time "rimuovi pubblicità", SDK `react-native-purchases`
- **Config**: `packages/mobile/src/config/ads.ts` (ad unit IDs, `isAdsRemoved()`)
- **Store acquisti**: `packages/mobile/src/store/purchases-store.ts`

**REGOLA CRITICA — Plugin AdMob in app.json**: i parametri usano **camelCase** (`androidAppId`), NON snake_case (`android_app_id`). Verificare SEMPRE i nomi parametri nel sorgente del plugin (`node_modules/react-native-google-mobile-ads/plugin/src/index.ts`) prima di configurare.

**REGOLA CRITICA — Permission AD_ID in app.json**: poiché l'app dichiara in Play Console (App content > Advertising ID) di usare l'advertising ID per AdMob, il manifest **deve** contenere `com.google.android.gms.permission.AD_ID` (richiesto da Android 13+). In `app.json`:
```json
"android": { "permissions": ["com.google.android.gms.permission.AD_ID"] }
```
Senza questa permission, Play Console blocca la pubblicazione con errore *"manifest doesn't include AD_ID permission"*. Verificare che resti dopo `expo prebuild --clean`.

**ID test** (da sostituire prima del rilascio):
- App ID AdMob: `ca-app-pub-3940256099942544~3347511713` (in `app.json`)
- Ad unit ID: `TestIds.ADAPTIVE_BANNER` in dev (in `src/config/ads.ts`)
- RevenueCat API key: `goog_XXXX` placeholder (in `src/store/purchases-store.ts`)

## Play Store & ASO

- Best practice ASO 2026 (riferimento + draft Custom Store Listing): **`packages/mobile/store/aso-best-practices-2026.md`**
- Guida operativa pubblicazione: **`packages/mobile/store/play-store-guide.md`**
- Listing markdown da copiare in Play Console: **`packages/mobile/store/listing-en.md`**, **`packages/mobile/store/listing-it.md`**

**Categoria target**: Game > Sports (allineata ai competitor Beyblade sul Play Store).

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: build locale AAB + upload manuale su Play Console

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE usare `yarn install` dalla root (NON npm install nei singoli package)
- Per modifiche logica di gioco: modificare `shared`, poi adattare UI in web e mobile
- EAS build DEVE essere lanciato da `packages/mobile` (NON dalla root)
