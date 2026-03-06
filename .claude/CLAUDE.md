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

**Requisiti**: Android Studio + SDK installati
- AVD: `beybladex_test` (Pixel 6, Android 35, google_apis x86_64)
- SDK: `C:\Users\cinqu\AppData\Local\Android\Sdk`

**Build locale - Pipeline completo (PREFERITO)**:
```bash
# PREREQUISITO: clonare in path SENZA SPAZI
git clone https://github.com/albertocabasvidani/beybladex-score.git C:\projects\beybladex

# Build completa (copia sorgenti → install → prebuild → patch → gradle)
bash packages/mobile/scripts/full-build-apk.sh
# Output: packages/mobile/beybladex-mobile.apk
```

**Build locale - Solo Gradle (se android/ già esiste e patchato)**:
```bash
bash packages/mobile/scripts/build-apk.sh
# Output: packages/mobile/beybladex-mobile.apk
```

**Build EAS cloud (fallback, ~15 min)**:
```bash
cd packages/mobile
npx eas-cli build --platform android --profile preview --non-interactive
```

**Emulatore test**:
```bash
# 1. Avvia emulatore
bash packages/mobile/scripts/start-emulator.sh

# 2. Install + Screenshot
bash packages/mobile/scripts/install-and-test.sh
```

**IMPORTANTE**: Tutti i comandi adb vanno in script `.sh` per evitare permission multiple. Usare `bash script.sh` (già autorizzato).

### Mobile - Device Fisico
1. Apri segnalibro: https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds
2. Tap sull'ultima build → "Install"
3. Abilita "Installa da origini sconosciute" se richiesto

### Mobile - Expo Go
```bash
yarn mobile:start
# Scansiona QR con Expo Go
```

## Convention Commits
- `feat(web):` - nuova feature web
- `feat(mobile):` - nuova feature mobile
- `feat(shared):` - nuova feature shared
- `fix(web):` - bugfix web
- `fix(mobile):` - bugfix mobile
- `chore(mobile):` - manutenzione mobile
- `docs:` - documentazione

## Scripts Root
```bash
yarn web:dev        # Dev server web
yarn mobile:start   # Metro bundler mobile
yarn mobile:test    # Test 3 risoluzioni
yarn type-check     # TypeScript check
```

## Import da Shared
```typescript
// Web e Mobile
import { FINISH_SCORES, scorePoint, MatchState, setWinScore, MIN_WIN_SCORE, MAX_WIN_SCORE } from '@beybladex/shared';
```

## Build & Signing Android

### Signing Key (CRITICO)
La prima release su Play Store è stata caricata con la keystore gestita da EAS (Expo).
Per le build locali (Gradle) **BISOGNA usare la stessa upload keystore**, altrimenti Play Store rifiuta l'AAB.

- **Keystore**: `packages/mobile/android/app/upload.keystore` (scaricata da EAS API)
- **Password/alias**: configurati in `build.gradle` → `signingConfigs.release`
- **MAI usare `signingConfigs.debug` per release** destinate a Play Store
- Se `upload.keystore` non esiste, scaricarla dall'API Expo GraphQL (vedi script `download-keystore.sh`)

### Build AAB locale (Play Store)
```bash
# PREREQUISITO: upload.keystore deve essere in android/app/
# build.gradle deve avere signingConfigs.release con upload keystore
bash packages/mobile/scripts/build-aab.sh
# Output: packages/mobile/beybladex-mobile.aab
```

### Build APK locale (test emulatore)
```bash
# Pipeline completo (se hai modificato app.json/package.json/dipendenze):
bash packages/mobile/scripts/full-build-apk.sh

# Solo gradle (se android/ è già pronto e patchato):
bash packages/mobile/scripts/build-apk.sh
# Output: packages/mobile/beybladex-mobile.apk
```

### Problemi noti build locale e soluzioni automatiche

`expo prebuild --clean` rigenera android/ da zero e **DISTRUGGE** le customizzazioni:
1. **cliFile**: sovrascrive con `@expo/cli` → deve essere `metro-bundle.js` (bundler monorepo)
2. **signingConfigs**: rimuove `release` con upload keystore → serve per Play Store
3. **gradle.properties**: resetta architetture a tutte → deve essere solo `arm64-v8a`

Lo script `patch-build-gradle.sh` corregge tutti e 3 i problemi automaticamente.
Lo script `full-build-apk.sh` esegue l'intero pipeline con patch inclusa.

**REGOLA**: MAI usare `build-apk.sh` dopo `expo prebuild --clean` senza prima eseguire `patch-build-gradle.sh`.
**REGOLA**: Sempre stoppare Gradle daemons prima di una nuova build (`gradlew --stop`).

### EAS Cloud (fallback)
```bash
# Attenzione: piano gratuito ha limite mensile di build
bash packages/mobile/scripts/eas-build-production.sh
```

### Upload Play Store
1. Google Play Console → BeyScore → **Production** → Create new release
2. Upload AAB (`beybladex-mobile.aab`)
3. Compilare release notes e pubblicare

**REGOLA**: SEMPRE usare il track **Production** (non Closed testing/Alpha).
**REGOLA**: Controllare sempre lo stato delle review/rejection su Play Console via Chrome DevTools, non via email.

### Checklist Pre-Release (OBBLIGATORIA prima di buildare AAB)
- [ ] Nome app in `app.json` → corrisponde al titolo sullo store listing?
- [ ] Icona `icon.png` e `adaptive-icon.png` → corrisponde all'icona dello store listing?
- [ ] `versionCode` in `app.json` → incrementato rispetto all'ultima release su Play Store?
- [ ] Store listing (titolo, descrizione, screenshot) → aggiornati se necessario?
- [ ] Nessuna modifica pending ai sorgenti che non è stata inclusa nella build?

### Icona App
- L'icona launcher (`icon.png` e `adaptive-icon.png`) DEVE corrispondere all'icona dello store listing
- MAI lasciare placeholder Expo come icona — causa rejection "Misleading Claims"

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: build locale AAB + upload manuale su Play Console

## Componenti Mobile Principali

### Game UI (`packages/mobile/src/components/game/`)
- `GameScreen.tsx` - Layout principale con bottom bar (trofeo, annulla, reset, info, settings)
- `PlayerPanel.tsx` - Pannello giocatore: nome + [pulsanti | punteggio | pulsanti] (flex 2-3-2)
- `FinishButton.tsx` - Pulsanti finish con animazione press (Pressable + Reanimated)
- `ScoreDisplay.tsx` - Punteggio con spring pop e glow effect
- `VictoryOverlay.tsx` - Overlay vittoria con confetti e trofeo

### Animazioni (`packages/mobile/src/components/animations/`)
- `SpinEffect.tsx`, `BurstEffect.tsx`, `OverEffect.tsx`, `XtremeEffect.tsx`
- `AnimationOverlay.tsx` - Switch su tipo finish

### Modal (`packages/mobile/src/components/modals/`)
- `SettingsModal.tsx` - Punteggio vittoria con +/- (range 3-10)
- `CreditsModal.tsx` - Crediti autore + link email

### Store (`packages/mobile/src/store/`)
- `game-store.ts` - Zustand store con score, wins, undo, reset, resetWins, setWinScoreValue, currentAnimation

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE usare `yarn install` dalla root (NON npm install nei singoli package)
- Per modifiche solo web: lavorare in `packages/web`
- Per modifiche solo mobile: lavorare in `packages/mobile`
- Per modifiche logica di gioco: modificare `shared`, poi adattare UI in web e mobile
- EAS build DEVE essere lanciato da `packages/mobile` (NON dalla root)
