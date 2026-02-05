# Piano: Migrazione Beyblade X Score Tracker a Monorepo con React Native Android

**Data**: 05/02/2026
**Progetto**: Beyblade X Score Tracker
**Obiettivo**: Creare monorepo con app web (React), app mobile Android (React Native + Expo), logica condivisa, testing autonomo con emulatori, e pubblicazione Play Store

---

## 📋 Panoramica

### Requisiti
1. ✅ **Monorepo** con `packages/web`, `packages/mobile`, `packages/shared`
2. ✅ **Responsive Android** per 360px, 390px, 412px (dispositivi più diffusi 2026)
3. ✅ **Testing autonomo** con Android Studio Emulator + ADB
4. ✅ **Branch GitHub separati** per web e mobile
5. ✅ **Claude Code** capisce contesto tramite `cd packages/web` o `packages/mobile`
6. ✅ **Pubblicazione Play Store** con tutti i requisiti necessari
7. ❌ **React Native Web** - NON implementato (web rimane React puro per semplicità)

### Decisioni Architetturali
- **Monorepo**: Yarn Workspaces (single repo, 3 packages)
- **Mobile stack**: Expo (NON React Native CLI)
- **Styling mobile**: NativeWind (Tailwind per RN)
- **Animazioni mobile**: Reanimated (60fps garantiti)
- **Testing**: Android Studio AVD + android-mcp-server
- **Git**: Single main branch + feature branches
- **Web**: Mantiene React + Vite (NON migra a React Native Web)

---

## 🏗️ Struttura Monorepo Finale

```
C:\claude-code\Personale\app segnapunti beybladex\
├── package.json                    # Root workspace
├── tsconfig.base.json              # TypeScript config condiviso
├── yarn.lock
├── README.md
├── .gitignore
│
├── packages/
│   ├── shared/                     # Logica condivisa (pure TypeScript)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── game/               # Core game logic
│   │       │   ├── types.ts
│   │       │   ├── constants.ts
│   │       │   ├── game-engine.ts
│   │       │   └── index.ts
│   │       ├── i18n/
│   │       │   ├── translations.ts  # IT + EN
│   │       │   └── index.ts
│   │       └── index.ts            # Main export
│   │
│   ├── web/                        # App web (React + Vite)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── store/              # Zustand
│   │   │   ├── hooks/
│   │   │   ├── i18n/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── .claude/CLAUDE.md
│   │
│   └── mobile/                     # App mobile (React Native + Expo)
│       ├── package.json
│       ├── app.json                # Expo config
│       ├── eas.json                # EAS Build config per Play Store
│       ├── metro.config.js
│       ├── babel.config.js
│       ├── tailwind.config.js      # NativeWind
│       ├── android/                # Native code
│       ├── src/
│       │   ├── components/
│       │   ├── store/              # Zustand
│       │   ├── hooks/
│       │   │   └── useResponsive.ts  # Hook responsive per 360/390/412px
│       │   ├── i18n/
│       │   ├── App.tsx
│       │   └── index.tsx
│       ├── scripts/
│       │   └── test-emulators.js   # Test automatico 3 risoluzioni
│       └── .claude/CLAUDE.md
│
└── .claude/
    └── CLAUDE.md                   # Regole monorepo globali
```

---

## 📦 Package Shared - Logica Condivisa

### File da Spostare

Da `beybladex-score/src/core/` → `packages/shared/src/`:

| File Attuale | Destinazione | Contenuto |
|--------------|--------------|-----------|
| `src/core/game/types.ts` | `packages/shared/src/game/types.ts` | FinishType, Player, MatchState, HistoryEntry |
| `src/core/game/constants.ts` | `packages/shared/src/game/constants.ts` | FINISH_SCORES, FINISH_INFO, DEFAULT_WIN_SCORE |
| `src/core/game/game-engine.ts` | `packages/shared/src/game/game-engine.ts` | scorePoint, undo, reset, checkWinner (pure functions) |
| `src/core/game/index.ts` | `packages/shared/src/game/index.ts` | Re-exports |

### Traduzioni Condivise

Da `beybladex-score/src/i18n/locales/` → `packages/shared/src/i18n/translations.ts`:

```typescript
export const translations = {
  it: {
    finish: { spin: 'Spin', burst: 'Burst', over: 'Over', xtreme: 'Xtreme' },
    game: { winner: 'Vincitore', winScore: 'Punteggio Vittoria' },
    buttons: { undo: 'Annulla', reset: 'Reset', share: 'Condividi', newGame: 'Nuova Partita' }
  },
  en: {
    finish: { spin: 'Spin', burst: 'Burst', over: 'Over', xtreme: 'Xtreme' },
    game: { winner: 'Winner', winScore: 'Win Score' },
    buttons: { undo: 'Undo', reset: 'Reset', share: 'Share', newGame: 'New Game' }
  }
} as const;
```

### Export Index

`packages/shared/src/index.ts`:

```typescript
// Game logic
export * from './game/types';
export * from './game/constants';
export * from './game/game-engine';

// i18n
export * from './i18n/translations';
```

### Dependencies

`packages/shared/package.json`:

```json
{
  "name": "@beybladex/shared",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {},
  "devDependencies": {
    "typescript": "~5.9.3"
  }
}
```

---

## 🌐 Package Web - App React Esistente

### Modifiche Necessarie

1. **package.json**: Aggiungere `"@beybladex/shared": "workspace:*"`
2. **Imports**: Cambiare da `'../core/game'` a `'@beybladex/shared'`
3. **tsconfig.json**: Aggiungere reference a shared

### Esempio Import Aggiornati

**Prima** (`src/store/game-store.ts`):
```typescript
import { FINISH_SCORES } from '../core/game/constants';
import { scorePoint } from '../core/game/game-engine';
```

**Dopo**:
```typescript
import { FINISH_SCORES, scorePoint } from '@beybladex/shared';
```

### File Critici da Aggiornare

- `src/store/game-store.ts` - importa game-engine
- `src/components/game/FinishButton.tsx` - importa FINISH_INFO
- `src/components/game/ScoreDisplay.tsx` - usa types
- `src/i18n/config.ts` - importa translations da shared

### Scripts NPM

Rimangono identici (dev, build, deploy per GitHub Pages)

---

## 📱 Package Mobile - React Native + Expo

### Setup Iniziale

```bash
cd packages
npx create-expo-app mobile --template blank-typescript
cd mobile
npx expo install zustand react-native-reanimated
npx expo install nativewind tailwindcss
npx expo install expo-localization i18next react-i18next
```

### Configurazione Expo

`packages/mobile/app.json`:

```json
{
  "expo": {
    "name": "Beyblade X Score",
    "slug": "beybladex-score",
    "version": "1.0.0",
    "orientation": "landscape",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.beybladex.score",
      "versionCode": 1
    },
    "plugins": ["expo-localization", "nativewind/metro"]
  }
}
```

### Metro Config per Monorepo

`packages/mobile/metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.extraNodeModules = {
  '@beybladex/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
};

module.exports = config;
```

### NativeWind Setup

`packages/mobile/tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#0f3460',
        'finish-spin': '#22c55e',
        'finish-burst': '#ef4444',
        'finish-over': '#3b82f6',
        'finish-xtreme': '#f59e0b',
      },
    },
  },
};
```

### Responsive Hook

`packages/mobile/src/hooks/useResponsive.ts`:

```typescript
import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Breakpoints landscape widths
  const isSmall = width < 700;     // 360px portrait → ~640-800 landscape
  const isMedium = width >= 700 && width < 850;  // 375-390px
  const isLarge = width >= 850;    // 412px+

  const scale = {
    button: isSmall ? 0.85 : isMedium ? 0.9 : 1,
    text: isSmall ? 0.9 : 1,
    spacing: isSmall ? 0.8 : 1,
  };

  return { width, height, isLandscape, isSmall, isMedium, isLarge, scale };
}
```

### Zustand Store Mobile

`packages/mobile/src/store/game-store.ts`:

```typescript
import { create } from 'zustand';
import {
  MatchState,
  PlayerId,
  FinishType,
  scorePoint,
  undoLastAction,
  resetMatch,
  setPlayerName,
  setWinScore,
  canUndo,
  createInitialMatchState,
} from '@beybladex/shared';

interface GameStore extends MatchState {
  score: (playerId: PlayerId, finishType: FinishType) => void;
  undo: () => void;
  reset: () => void;
  setName: (playerId: PlayerId, name: string) => void;
  setWinScoreValue: (winScore: number) => void;
  canUndo: () => boolean;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialMatchState(),

  score: (playerId, finishType) => {
    const newState = scorePoint(get(), playerId, finishType);
    set(newState);
  },

  undo: () => set(undoLastAction(get())),
  reset: () => set(resetMatch(get())),
  setName: (playerId, name) => set(setPlayerName(get(), playerId, name)),
  setWinScoreValue: (winScore) => set(setWinScore(get(), winScore)),
  canUndo: () => canUndo(get()),
}));
```

### i18n Config Mobile

`packages/mobile/src/i18n/config.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { translations } from '@beybladex/shared';

i18n.use(initReactI18next).init({
  resources: {
    it: { translation: translations.it },
    en: { translation: translations.en },
  },
  lng: Localization.locale.split('-')[0],
  fallbackLng: 'it',
  supportedLngs: ['it', 'en'],
  interpolation: { escapeValue: false },
});

export default i18n;
```

### App.tsx Mobile

`packages/mobile/src/App.tsx`:

```tsx
import { SafeAreaView, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useResponsive } from './hooks/useResponsive';
import './i18n/config';

export default function App() {
  const { isLandscape } = useResponsive();

  if (!isLandscape) {
    return (
      <SafeAreaView className="flex-1 bg-primary items-center justify-center">
        <Text className="text-white text-xl text-center px-8">
          Ruota il dispositivo in landscape per giocare
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar hidden />
      <GameScreen />
    </SafeAreaView>
  );
}
```

---

## 🎯 Responsive Design - Testing 3 Risoluzioni

### Target Devices

| Risoluzione | Viewport Landscape | Dispositivi |
|-------------|-------------------|-------------|
| **360px** | 800x360 | Android mid-range (50%+ traffico) |
| **390px** | 844x390 | iPhone 12-14 Pro equivalente |
| **412px** | 915x412 | Pixel 9, Galaxy S25 |

### Script Test Automatico

`packages/mobile/scripts/test-emulators.js`:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');

const EMULATORS = [
  { name: 'Android_360px', avd: 'pixel_5' },
  { name: 'Android_390px', avd: 'pixel_8' },
  { name: 'Android_412px', avd: 'pixel_9_pro' }
];

async function testAllEmulators() {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  for (const emu of EMULATORS) {
    console.log(`\n📱 Testing ${emu.name}...`);

    // Start emulator
    console.log('Starting emulator...');
    const emuProcess = execSync(`emulator -avd ${emu.avd} &`, { stdio: 'inherit' });

    // Wait for device
    console.log('Waiting for device...');
    execSync('adb wait-for-device', { stdio: 'inherit' });

    // Wait 10s for boot
    await sleep(10000);

    // Install app
    console.log('Installing app...');
    execSync('npx expo run:android', { stdio: 'inherit' });

    // Wait 5s for app start
    await sleep(5000);

    // Screenshot
    console.log('Taking screenshot...');
    execSync(`adb exec-out screencap -p > screenshots/${emu.name}.png`);

    // Verify no overflow
    console.log('Checking UI...');
    const uiCheck = execSync('adb shell "dumpsys window | grep -E \'mCurrentFocus|mFrame\'"').toString();
    console.log(uiCheck);

    // Kill emulator
    console.log('Stopping emulator...');
    execSync('adb emu kill');

    await sleep(2000);
  }

  console.log('\n✅ Test completati! Verifica screenshots in screenshots/');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

testAllEmulators().catch(console.error);
```

Eseguire: `node scripts/test-emulators.js`

---

## 🤖 Testing con Android Studio Emulator + ADB

### Setup AVD (Android Virtual Devices)

```bash
# Crea 3 AVD per test
avdmanager create avd -n "Android_360px" \
  -k "system-images;android-34;google_apis;x86_64" -d "pixel_5"

avdmanager create avd -n "Android_390px" \
  -k "system-images;android-34;google_apis;x86_64" -d "pixel_8"

avdmanager create avd -n "Android_412px" \
  -k "system-images;android-34;google_apis;x86_64" -d "pixel_9_pro"
```

### ADB Access per Claude

**MCP Server: android-mcp-server**

```bash
npm install -g android-mcp-server
```

**Configurazione** `.claude/settings.json` (root monorepo):

```json
{
  "mcpServers": {
    "android-debug-bridge": {
      "command": "npx",
      "args": ["android-mcp-server"],
      "env": {
        "ANDROID_HOME": "C:\\Users\\cinqu\\AppData\\Local\\Android\\Sdk"
      }
    }
  }
}
```

### Comandi ADB Utili

```bash
# Screenshot
adb exec-out screencap -p > test.png

# UI Dump
adb shell uiautomator dump /sdcard/ui.xml
adb pull /sdcard/ui.xml

# Tap coordinates
adb shell input tap 400 200

# Lista devices
adb devices

# Start emulator
emulator -avd Android_390px &
```

---

## 🏪 Pubblicazione Play Store

### Requisiti Google Play

1. **Google Play Developer Account** - $25 USD one-time fee
2. **Google Service Account Key** - per EAS Submit
3. **Privacy Policy** - URL pubblico obbligatorio
4. **App Content Rating** - PEGI/ESRB
5. **Screenshots** - Minimo 2 screenshots, diverse risoluzioni
6. **Descrizione** - Short (80 char) + Full (4000 char)
7. **Icona** - 512x512px

### EAS Build Configuration

`packages/mobile/eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### Setup Service Account Key

1. **Google Play Console** → Setup → API access
2. Crea nuovo service account
3. Scarica JSON key → salva come `google-service-account.json`
4. Upload a EAS dashboard: `eas credentials`

### Build Production

```bash
cd packages/mobile

# Build AAB per Play Store
eas build --platform android --profile production

# Download AAB localmente (opzionale)
eas build:download --platform android
```

### Submit a Play Store

```bash
# Primo upload MANUALE (limitazione Google Play API)
# Vai su Play Console → Create app → Upload manualmente l'AAB

# Successivi update via EAS
eas submit --platform android --profile production
```

### App Versioning

In `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

**Regola**:
- `version` = semantic version per utenti (1.0.0, 1.1.0, 2.0.0)
- `versionCode` = integer incrementale per Play Store (1, 2, 3, ...)

### Privacy Policy

Creare `privacy-policy.md` o hostare su GitHub Pages:

```markdown
# Privacy Policy - Beyblade X Score Tracker

**Effective Date**: [DATA]

## Data Collection
This app does NOT collect, store, or transmit any personal data.

## Local Storage
- Game scores stored locally on device
- Settings (language, win score) stored locally
- NO data sent to external servers

## Third-Party Services
None.

## Contact
[TUA EMAIL]
```

Hostare su: `https://albertocabasvidani.github.io/beybladex-score/privacy`

### Content Rating

Play Console → Complete questionnaire:
- **Violence**: No
- **Gambling**: No
- **User Interaction**: No
- **Age**: All Ages

---

## 🔀 Git & Branch Strategy

### Branch Structure

**RACCOMANDAZIONE: Single Main Branch + Feature Branches**

```
main                              # Stable (web + mobile + shared)
├── feature/web-*                 # Feature web-only
├── feature/mobile-*              # Feature mobile-only
├── feature/shared-*              # Feature shared + adattamenti
└── release/v1.0.0                # Release tags
```

### Workflow Git

```bash
# Feature web
git checkout -b feature/web-new-animation
cd packages/web
# ... modifiche ...
git add packages/web
git commit -m "feat(web): add victory animation"
git push origin feature/web-new-animation

# Feature mobile
git checkout -b feature/mobile-responsive-fix
cd packages/mobile
# ... modifiche ...
git add packages/mobile
git commit -m "feat(mobile): fix 360px button size"
git push origin feature/mobile-responsive-fix

# Feature shared (impatta entrambi)
git checkout -b feature/shared-overtime-rule
cd packages/shared
# ... modifica game-engine.ts ...
cd ../web
# ... adatta web UI ...
cd ../mobile
# ... adatta mobile UI ...
git add packages/
git commit -m "feat(shared): add overtime rule

- Add overtime logic to game-engine
- Update web UI for overtime display
- Update mobile UI for overtime display"
git push origin feature/shared-overtime-rule
```

### Convention Commits

- `feat(web):` - nuova feature web
- `feat(mobile):` - nuova feature mobile
- `feat(shared):` - nuova feature shared
- `fix(web):` - bugfix web
- `chore(mobile):` - manutenzione mobile
- `docs:` - documentazione

---

## 🧑‍💻 Claude Code Workflow

### Directory Switching

```bash
# Lavoro su web
cd "C:\claude-code\Personale\app segnapunti beybladex\packages\web"
npm run dev  # http://localhost:5173

# Lavoro su mobile
cd "C:\claude-code\Personale\app segnapunti beybladex\packages\mobile"
expo start   # Metro bundler, poi 'a' per Android

# Root monorepo
cd "C:\claude-code\Personale\app segnapunti beybladex"
yarn web:dev     # Shortcut script
yarn mobile:start
```

### .claude/CLAUDE.md Files

**Root** (`C:\claude-code\Personale\app segnapunti beybladex\.claude\CLAUDE.md`):

```markdown
# Beyblade X Score Monorepo

## Struttura
- `packages/shared`: Core game logic (pure TypeScript)
- `packages/web`: React web app (Vite + Tailwind)
- `packages/mobile`: React Native app (Expo + NativeWind)

## Working Directory
- **Web**: `cd packages/web`
- **Mobile**: `cd packages/mobile`
- **Shared**: modifiche shared richiedono test in web E mobile

## Testing
- Web: `cd packages/web && npm run dev`
- Mobile: `cd packages/mobile && expo start`
- Mobile test 3 risoluzioni: `node scripts/test-emulators.js`
```

**Web** (`packages/web/.claude/CLAUDE.md`):

```markdown
# Web Package

## Testing Chrome DevTools OBBLIGATORIO
Prima di commit, testare su 4 risoluzioni:
- 800x360 (Android mid-range)
- 812x375 (iPhone 11-15)
- 844x390 (iPhone Pro)
- 915x412 (Android flagship)

## Import da Shared
```typescript
import { FINISH_SCORES, scorePoint } from '@beybladex/shared';
```

## Deploy
```bash
npm run build
npm run deploy  # GitHub Pages
```
```

**Mobile** (`packages/mobile/.claude/CLAUDE.md`):

```markdown
# Mobile Package

## Testing OBBLIGATORIO Emulatori
Prima di commit: `node scripts/test-emulators.js`

Verifica screenshots:
- NO overflow orizzontale/verticale
- Pulsanti > 44x44px touch target
- Testo leggibile

## Responsive Hook
```typescript
const { isSmall, isMedium, isLarge, scale } = useResponsive();
```

## Import da Shared
```typescript
import { FINISH_SCORES } from '@beybladex/shared';
```

## Build Play Store
```bash
eas build --platform android --profile production
eas submit --platform android
```
```

---

## 📝 Migration Steps - Ordine Esecuzione

### FASE 1: Backup e Setup Root (1 ora)

```bash
# 1.1 Backup
cd "C:\claude-code\Personale\app segnapunti beybladex\beybladex-score"
git checkout -b migration/monorepo
git add . && git commit -m "chore: backup before monorepo"

# 1.2 Crea struttura root
cd ..
mkdir -p packages/shared/src packages/web packages/mobile

# 1.3 Crea package.json root con workspaces (vedi Struttura Monorepo)
# 1.4 Crea tsconfig.base.json
# 1.5 Crea .gitignore root
```

### FASE 2: Spostare Progetto Web (30 min)

```bash
# Spostare TUTTO da beybladex-score/ a packages/web/
git mv beybladex-score/* packages/web/
git mv beybladex-score/.* packages/web/ 2>/dev/null || true

# Verify
ls packages/web/src
# Deve contenere: components/, store/, core/, hooks/, i18n/, App.tsx
```

### FASE 3: Creare Package Shared (1 ora)

```bash
cd packages/shared

# 3.1 Crea package.json
# 3.2 Crea tsconfig.json
# 3.3 Sposta core logic
mkdir -p src/game src/i18n
git mv ../web/src/core/game/*.ts src/game/

# 3.4 Crea translations.ts estraendo da ../web/src/i18n/locales/
# 3.5 Crea src/index.ts con exports
```

### FASE 4: Aggiornare Package Web (1 ora)

```bash
cd packages/web

# 4.1 Modifica package.json: aggiungere "@beybladex/shared": "workspace:*"
# 4.2 Modifica tsconfig.json: aggiungere references
# 4.3 Sostituire imports:
#     DA: import { ... } from '../core/game'
#     A:  import { ... } from '@beybladex/shared'

# File da aggiornare:
# - src/store/game-store.ts
# - src/components/game/FinishButton.tsx
# - src/components/game/ScoreDisplay.tsx
# - src/i18n/config.ts

# 4.4 Test
yarn install
npm run dev  # DEVE funzionare!
```

### FASE 5: Creare Package Mobile (2 ore)

```bash
cd packages

# 5.1 Init Expo
npx create-expo-app mobile --template blank-typescript

# 5.2 Install dependencies
cd mobile
npx expo install zustand react-native-reanimated
npx expo install nativewind tailwindcss
npx expo install expo-localization i18next react-i18next

# 5.3 Config files
# Creare: app.json, metro.config.js, babel.config.js, tailwind.config.js

# 5.4 Aggiorna package.json: aggiungere "@beybladex/shared": "workspace:*"

# 5.5 Setup i18n: src/i18n/config.ts
# 5.6 Setup store: src/store/game-store.ts
# 5.7 Setup hooks: src/hooks/useResponsive.ts

# 5.8 Test
yarn install
expo start  # DEVE avviarsi
```

### FASE 6: Implementare UI Mobile (6-8 ore)

```bash
# 6.1 Creare componenti base:
# - src/components/game/FinishButton.tsx (NativeWind)
# - src/components/game/ScoreDisplay.tsx
# - src/components/game/PlayerCard.tsx
# - src/components/ui/RotateDeviceScreen.tsx

# 6.2 Creare App.tsx con landscape check

# 6.3 Test su emulatore
expo start --android
# Verificare layout base
```

### FASE 7: Testing Multi-Risoluzione (2 ore)

```bash
# 7.1 Creare AVD
avdmanager create avd -n "Android_360px" -k "system-images;android-34;google_apis;x86_64" -d "pixel_5"
avdmanager create avd -n "Android_390px" -k "system-images;android-34;google_apis;x86_64" -d "pixel_8"
avdmanager create avd -n "Android_412px" -k "system-images;android-34;google_apis;x86_64" -d "pixel_9_pro"

# 7.2 Creare scripts/test-emulators.js

# 7.3 Test
node scripts/test-emulators.js

# 7.4 Verificare screenshots
# - NO overflow
# - Pulsanti > 44px
# - Testo leggibile
```

### FASE 8: Setup ADB Automation (1 ora)

```bash
# 8.1 Install MCP
npm install -g android-mcp-server

# 8.2 Config Claude Code (vedi sezione Testing)

# 8.3 Test MCP
emulator -avd Android_390px &
adb devices
adb exec-out screencap -p > test.png
```

### FASE 9: Play Store Setup (2 ore)

```bash
cd packages/mobile

# 9.1 Install EAS CLI
npm install -g eas-cli
eas login

# 9.2 Configure EAS
eas build:configure
# Creare eas.json (vedi sezione Play Store)

# 9.3 Setup Service Account
# - Creare su Google Play Console
# - Download JSON
# - Upload a EAS: eas credentials

# 9.4 Creare Privacy Policy
# - Creare privacy-policy.md
# - Hostare su GitHub Pages

# 9.5 Build production
eas build --platform android --profile production

# 9.6 Primo upload MANUALE
# Download AAB → Upload manualmente su Play Console

# 9.7 Complete Play Console setup
# - Screenshots (da test-emulators.js)
# - Descriptions
# - Content rating
# - Privacy policy URL
```

### FASE 10: Git Cleanup (1 ora)

```bash
cd <root>

# 10.1 Commit monorepo
git add .
git commit -m "feat: migrate to monorepo with mobile support

- Add packages/shared with core game logic
- Migrate packages/web from original project
- Add packages/mobile with Expo + NativeWind
- Setup Yarn workspaces
- Configure EAS Build for Play Store"

# 10.2 Update README
# Creare README.md root
# Aggiornare packages/web/README.md
# Creare packages/mobile/README.md

# 10.3 Merge a main
git checkout main
git merge migration/monorepo
git push origin main

# 10.4 Deploy web
cd packages/web
npm run build
npm run deploy
```

---

## ✅ Verification Steps

### Web App

```bash
cd packages/web
npm run dev
# Apri http://localhost:5173
# Verifica: game funziona, punteggi, undo, reset
npm run build
# Verifica: build OK senza errori TypeScript
```

### Mobile App

```bash
cd packages/mobile
expo start
# Premi 'a' per Android emulator
# Verifica: landscape check, punteggi funzionano

node scripts/test-emulators.js
# Verifica: 3 screenshot OK, no overflow
```

### Shared Package

```bash
cd packages/shared
yarn type-check
# Verifica: no errori TypeScript

# Test import da web
cd ../web
grep -r "@beybladex/shared" src/
# Verifica: imports corretti

# Test import da mobile
cd ../mobile
grep -r "@beybladex/shared" src/
# Verifica: imports corretti
```

### Play Store Build

```bash
cd packages/mobile
eas build --platform android --profile production
# Verifica: build success, download AAB
# Upload manuale su Play Console per prima volta
```

---

## 📂 File Critici

| File | Path | Scopo |
|------|------|-------|
| **Root workspace** | `package.json` | Yarn workspaces, scripts monorepo |
| **TypeScript shared** | `tsconfig.base.json` | Config TS condivisa |
| **Shared exports** | `packages/shared/src/index.ts` | Export logica condivisa |
| **Game engine** | `packages/shared/src/game/game-engine.ts` | Logica pura gioco |
| **Metro config** | `packages/mobile/metro.config.js` | Monorepo support Metro |
| **Responsive hook** | `packages/mobile/src/hooks/useResponsive.ts` | Responsive 360/390/412px |
| **EAS config** | `packages/mobile/eas.json` | Build + submit Play Store |
| **Test script** | `packages/mobile/scripts/test-emulators.js` | Test automatico risoluzioni |
| **Mobile store** | `packages/mobile/src/store/game-store.ts` | Zustand + shared imports |
| **Web store** | `packages/web/src/store/game-store.ts` | Zustand + shared imports |

---

## 🎯 Decisioni Chiave

### ✅ Mantieni React Web (NO React Native Web)
- App web attuale funziona perfettamente
- Deploy semplice GitHub Pages
- Bundle ottimizzato
- Condividi solo logica (packages/shared)

### ✅ Expo (NO React Native CLI)
- Setup monorepo automatico
- Metro config più semplice
- EAS Build per Play Store
- Dev velocity migliore

### ✅ NativeWind (NO StyleSheet)
- Sintassi Tailwind familiare
- Responsive built-in
- Cross-platform consistency

### ✅ Single Main Branch (NO branch separati web/mobile)
- Evita sync nightmare
- Feature branches per isolamento
- Merge a main dopo review

---

## 📊 Tempo Stimato Totale

| Fase | Ore |
|------|-----|
| Setup monorepo + shared | 2-3 |
| Aggiornare web | 1 |
| Setup mobile base | 2 |
| Implementare UI mobile | 6-8 |
| Testing responsive | 2 |
| ADB automation | 1 |
| Play Store setup | 2 |
| Git + documentation | 1 |
| **TOTALE** | **17-20 ore** |

---

## 🔗 Sources & References

- [Expo Monorepo Documentation](https://docs.expo.dev/guides/monorepos/)
- [React Native Web Monorepo Guide](https://github.com/brunolemos/react-native-web-monorepo)
- [Setting up React Native Monorepo with Yarn Workspaces](https://www.callstack.com/blog/setting-up-react-native-monorepo-with-yarn-workspaces)
- [Expo Submit to Play Store](https://docs.expo.dev/submit/android/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Android MCP Server](https://github.com/minhalvp/android-mcp-server)
- [Most Popular Mobile Screen Resolutions 2026](https://phone-simulator.com/blog/most-popular-mobile-screen-resolutions-in-2026)
- [React Native Best Practices 2026](https://www.aalpha.net/articles/best-practices-for-react-native-development/)

---

**Fine Piano**

---
**Creato**: 05/02/2026 11:40
**Task**: Migrazione Beyblade X Score Tracker a Monorepo con React Native Android
