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

**Build locale (PREFERITO, ~1 min)**:
```bash
# PREREQUISITO: clonare in path SENZA SPAZI
git clone https://github.com/albertocabasvidani/beybladex-score.git C:\projects\beybladex
cd C:\projects\beybladex && yarn install
cd packages/mobile && yarn expo prebuild --platform android --clean

# Build APK (arm64 only)
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

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: `cd packages/mobile && eas build --platform android --profile production` (Play Store)

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
- `game-store.ts` - Zustand store con score, undo, reset, setWinScoreValue, currentAnimation

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE usare `yarn install` dalla root (NON npm install nei singoli package)
- Per modifiche solo web: lavorare in `packages/web`
- Per modifiche solo mobile: lavorare in `packages/mobile`
- Per modifiche logica di gioco: modificare `shared`, poi adattare UI in web e mobile
- EAS build DEVE essere lanciato da `packages/mobile` (NON dalla root)
