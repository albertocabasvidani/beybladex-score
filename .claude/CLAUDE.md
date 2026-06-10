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

Ricette complete (emulatore / dispositivo / Play Store) in **`packages/mobile/BUILD-RECIPES.md`**. Dettagli/troubleshooting in **`packages/mobile/BUILD-GUIDE.md`**.

Comandi rapidi:
```bash
# Iterazione veloce (incrementale, riusa C++ compilato): emulatore o device
bash packages/mobile/scripts/build-apk-fast.sh --emulator   # x86_64
bash packages/mobile/scripts/build-apk-fast.sh --device     # arm64-v8a

# Build pulita (reset completo) se l'incrementale dà errori o cambi dipendenze
bash packages/mobile/scripts/full-build-apk.sh --emulator

# AAB Play Store (sempre pulita, tutte le ABI, firma upload)
bash packages/mobile/scripts/full-build-aab.sh
```

**REGOLE**:
- **Iterazione = `build-apk-fast.sh`** (no `--clean`, riusa native cache → minuti). Build pulita solo per reset o cambio dipendenze.
- Ottimizzazioni Gradle (build cache, parallel, daemon, heap 4G) sono in `patch-build-gradle.sh`, riapplicate a ogni build. `configuration-cache` NON abilitabile (incompatibile RN plugin).
- MAI usare `build-apk.sh` dopo `expo prebuild --clean` senza `patch-build-gradle.sh`
- Upload Play Store: SEMPRE track **Production** (MAI Closed testing/Alpha)
- Controllare review/rejection su Play Console via Chrome DevTools
- **versionCode è bruciato anche dopo Discard draft**: se un AAB con versionCode N viene caricato e poi il draft scartato, Play Console rifiuta il prossimo upload con stesso N (errore *"Version code N has already been used"*). Bumpare SEMPRE a N+1 prima di re-buildare.

## Audio countdown (expo-audio)

- Pulsante pill "▶ 3·2·1" al centro della bottom bar: `CountdownButton.tsx` + hook `useCountdownAudio.ts`. File audio: `assets/sounds/countdown-{it,en}.mp3`, forniti dall'utente (generati con ElevenLabs, 06/2026).
- Fallback TTS per rigenerarli: `bash packages/mobile/scripts/generate-countdown-audio.sh` (richiede `ELEVENLABS_API_KEY` nel `.env`; voci Davide IT / Charlie EN, pause tarabili con `PAUSE_NUM`/`PAUSE_FINAL`, segmenti cachati in `tmp/countdown-tts`). Sovrascrive i file dell'utente: usare solo se servono nuove versioni.

**Regole critiche** (dettagli generali in `~/.claude/rules/react-native-android.md`):
- `scripts/metro-bundle.js` deve mantenere il blocco `saveAssets` + normalizzazione `httpServerLocation`: senza, gli asset Metro non finiscono nell'APK o hanno nome risorsa sbagliato (monorepo) → `Resource not found` solo in release.
- `useCountdownAudio.ts` costruisce l'URI `android.resource://com.beybladex.score/raw/<nome>` in release (il nome risorsa nudo non è riproducibile da ExoPlayer). La costante `ANDROID_PACKAGE` deve combaciare con `android.package` di `app.json`.
- Verificare gli asset nell'APK con `aapt2 dump resources` (NON `unzip -l`: `optimizeReleaseResources` offusca i path).
- Se si cambiano SOLO gli mp3, la build incrementale lascia `createBundleReleaseJsAndAssets` UP-TO-DATE (gli asset non sono input tracciati) e l'APK esce con gli audio vecchi: cancellare prima `C:/projects/beybladex/packages/mobile/android/app/build/generated/{assets,res}/createBundleReleaseJsAndAssets`.

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
