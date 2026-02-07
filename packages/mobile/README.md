# Beyblade X Score Tracker - Mobile App

Applicazione mobile Android (React Native + Expo) per il tracciamento dei punteggi di Beyblade X.

## 🚀 Setup Iniziale

```bash
# Dalla root del monorepo
yarn install

# Avvia Metro bundler
cd packages/mobile
expo start
```

## 📱 Avvio su Emulatori/Device

### Android Emulator

```bash
expo start --android
# Oppure: expo start, poi premere 'a'
```

### Device Fisico

1. Installare **Expo Go** dal Play Store
2. Scansionare il QR code mostrato nel terminale

## 🧪 Testing Multi-Risoluzione

L'app DEVE essere testata su 3 risoluzioni prima di ogni commit:

```bash
node scripts/test-emulators.js
```

Questo script:
1. Avvia 3 emulatori Android (360px, 390px, 412px)
2. Installa l'app su ciascuno
3. Prende screenshot
4. Verifica assenza di overflow UI

### Verifica Screenshot

Controllare in `screenshots/`:
- `Android_360px.png`
- `Android_390px.png`
- `Android_412px.png`

**Checklist**:
- [ ] NO overflow orizzontale
- [ ] NO overflow verticale
- [ ] Pulsanti > 44x44px (touch target)
- [ ] Testo leggibile
- [ ] Layout simmetrico

## 📐 Responsive Design

L'app usa il hook `useResponsive()` per adattarsi a diverse risoluzioni:

```typescript
import { useResponsive } from './hooks/useResponsive';

const { isSmall, isMedium, isLarge, scale } = useResponsive();

// Usa scale per dimensioni dinamiche
<View style={{ paddingHorizontal: 16 * scale.spacing }}>
```

### Breakpoints

| Size | Width | Devices |
|------|-------|---------|
| `isSmall` | < 700px | Android mid-range (360px portrait) |
| `isMedium` | 700-850px | iPhone Pro size (390px portrait) |
| `isLarge` | >= 850px | Flagship Android (412px portrait) |

## 🎨 Styling (NativeWind)

L'app usa **NativeWind** (Tailwind per React Native):

```tsx
<View className="flex-1 bg-primary">
  <Text className="text-white text-2xl font-bold">
    Player 1
  </Text>
</View>
```

### Colori Personalizzati

Configurati in `tailwind.config.js`:

- `bg-primary`: `#1a1a2e`
- `bg-secondary`: `#16213e`
- `bg-accent`: `#0f3460`
- `bg-finish-spin`: `#22c55e` (verde)
- `bg-finish-burst`: `#ef4444` (rosso)
- `bg-finish-over`: `#3b82f6` (blu)
- `bg-finish-xtreme`: `#f59e0b` (arancione)

## 🏗️ Build Production

### Build AAB (Play Store)

```bash
# Build production
eas build --platform android --profile production

# Submit a Play Store
eas submit --platform android --profile production
```

### Build APK (Test)

```bash
# Build APK per testing locale
eas build --platform android --profile preview

# Download APK
eas build:download --platform android
```

## 📦 Dipendenze Principali

| Package | Uso |
|---------|-----|
| `expo` | Framework React Native |
| `react-native` | Core RN |
| `zustand` | State management |
| `nativewind` | Tailwind CSS per RN |
| `react-native-reanimated` | Animazioni 60fps |
| `expo-localization` | Rilevamento lingua device |
| `i18next` | Internazionalizzazione |
| `@beybladex/shared` | Logica di gioco condivisa |

## 🔧 Configurazione

### app.json

Expo configuration:
- Package ID: `com.beybladex.score`
- Orientation: `landscape` (ONLY)
- Version: `1.0.0`
- versionCode: `1`

### eas.json

EAS Build profiles:
- `development`: Dev builds
- `preview`: APK per testing
- `production`: AAB per Play Store

### metro.config.js

Metro bundler configurato per monorepo:
- Watch folders: root del monorepo
- Resolve `@beybladex/shared`

## 📂 Struttura File

```
packages/mobile/
├── src/
│   ├── components/
│   │   ├── game/           # Game UI components
│   │   │   ├── GameScreen.tsx     # Layout con bottom bar
│   │   │   ├── PlayerPanel.tsx    # Pannello giocatore
│   │   │   ├── FinishButton.tsx   # Pulsanti finish animati
│   │   │   ├── ScoreDisplay.tsx   # Punteggio con spring pop
│   │   │   └── VictoryOverlay.tsx # Overlay vittoria
│   │   ├── animations/     # Effetti finish (Reanimated v4)
│   │   │   ├── SpinEffect.tsx
│   │   │   ├── BurstEffect.tsx
│   │   │   ├── OverEffect.tsx
│   │   │   ├── XtremeEffect.tsx
│   │   │   └── AnimationOverlay.tsx
│   │   ├── modals/          # Modal settings/credits
│   │   │   ├── SettingsModal.tsx   # Win score +/-
│   │   │   └── CreditsModal.tsx    # Autore + email
│   │   └── ui/              # Generic UI components
│   ├── store/
│   │   └── game-store.ts    # Zustand store
│   ├── hooks/
│   │   └── useResponsive.ts # Responsive hook
│   ├── i18n/
│   │   └── config.ts        # i18next config
│   ├── App.tsx
│   └── index.tsx
├── scripts/
│   ├── test-emulators.js    # Test 3 risoluzioni
│   ├── install-and-test.sh  # Install APK + screenshot emulatore
│   └── launch-and-screenshot.sh
├── assets/                  # Icone, splash screen
├── app.json
├── eas.json
├── metro.config.js
├── babel.config.js
├── tailwind.config.js
└── package.json
```

## 🎯 Import da Shared

```typescript
import {
  MatchState,
  PlayerId,
  FinishType,
  scorePoint,
  undoLastAction,
  resetMatch,
  FINISH_SCORES,
  FINISH_INFO
} from '@beybladex/shared';
```

## 📝 Scripts NPM

```bash
expo start           # Avvia Metro bundler
expo start --android # Avvia su Android
expo start --clear   # Pulisci cache Metro
node scripts/test-emulators.js  # Test 3 risoluzioni
```

## 🐛 Debug

### Log Console

```bash
# React Native debugger
npx react-devtools

# Android logcat
adb logcat | grep ReactNativeJS
```

### Metro Cache Issues

```bash
expo start --clear
# oppure
yarn cache clean
rm -rf node_modules
yarn install
```

## 🚀 Deploy Play Store

### Requisiti

1. **Google Play Developer Account** ($25 USD)
2. **Google Service Account Key** (upload via `eas credentials`)
3. **Privacy Policy** URL pubblico
4. **Screenshots** (da `test-emulators.js`)
5. **Content Rating** (PEGI/ESRB)

### Prima Pubblicazione

1. Build AAB: `eas build --platform android --profile production`
2. Download AAB da EAS dashboard
3. Upload MANUALE su Play Console (primo upload)
4. Compila store listing (descrizioni, screenshots, privacy policy)
5. Submit per review

### Update Successivi

```bash
# Incrementa versionCode in app.json
# "android": { "versionCode": 2 }

eas build --platform android --profile production
eas submit --platform android
```

## 📄 Licenza

MIT
