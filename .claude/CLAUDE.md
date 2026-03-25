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
La build standard produce APK solo `arm64-v8a`, che **CRASHA sull'emulatore x86_64** (`SoLoaderDSONotFoundError`). Per testare sull'emulatore:
1. In `patch-build-gradle.sh`: cambiare a `arm64-v8a,x86_64`
2. `bash packages/mobile/scripts/full-build-apk.sh`
3. **RIPRISTINARE** a `arm64-v8a` dopo il test

**IMPORTANTE**: Tutti i comandi adb vanno in script `.sh` per evitare permission multiple.

### Mobile - Device Fisico
1. Apri segnalibro: https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds
2. Tap sull'ultima build → "Install"

## Build & Release Android

Dettagli completi in **`packages/mobile/BUILD-GUIDE.md`**.

Comandi rapidi:
```bash
# APK test emulatore (ricordarsi architettura x86_64!)
bash packages/mobile/scripts/full-build-apk.sh

# AAB Play Store
bash packages/mobile/scripts/full-build-aab.sh
```

**REGOLE**:
- MAI usare `build-apk.sh` dopo `expo prebuild --clean` senza `patch-build-gradle.sh`
- Sempre stoppare Gradle daemons prima di una nuova build
- Upload Play Store: SEMPRE track **Production** (MAI Closed testing/Alpha)
- Controllare review/rejection su Play Console via Chrome DevTools

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: build locale AAB + upload manuale su Play Console

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE usare `yarn install` dalla root (NON npm install nei singoli package)
- Per modifiche logica di gioco: modificare `shared`, poi adattare UI in web e mobile
- EAS build DEVE essere lanciato da `packages/mobile` (NON dalla root)
