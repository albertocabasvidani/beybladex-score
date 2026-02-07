# Beyblade X Score Tracker - Monorepo

Applicazione per il tracciamento dei punteggi di Beyblade X, disponibile sia come web app che come app mobile Android.

## 📦 Struttura Monorepo

```
.
├── packages/
│   ├── shared/     # Core game logic (TypeScript puro)
│   ├── web/        # Web app (React + Vite + Tailwind)
│   └── mobile/     # Mobile app (React Native + Expo + NativeWind)
├── package.json    # Root workspace
└── yarn.lock
```

### Packages

- **`shared`**: Logica di gioco condivisa (types, constants, game engine, traduzioni)
- **`web`**: Applicazione web React con deploy su GitHub Pages
- **`mobile`**: Applicazione mobile React Native per Android con pubblicazione su Play Store

## 🚀 Setup Iniziale

```bash
# Install dependencies
yarn install

# Verifica installazione
yarn workspaces info
```

## 📝 Scripts Disponibili

### Root Scripts (eseguibili dalla root)

```bash
# Web development
yarn web:dev        # Avvia dev server web (localhost:5173)
yarn web:build      # Build production web
yarn web:deploy     # Deploy su GitHub Pages

# Mobile development
yarn mobile:start   # Avvia Expo Metro bundler
yarn mobile:android # Avvia su emulatore Android
yarn mobile:test    # Test automatico 3 risoluzioni

# Utilities
yarn type-check     # Type check tutti i packages
yarn clean          # Pulisci node_modules e build artifacts
```

### Package-Specific Scripts

```bash
# Web (da packages/web/)
cd packages/web
npm run dev         # Dev server
npm run build       # Build production
npm run deploy      # Deploy GitHub Pages

# Mobile (da packages/mobile/)
cd packages/mobile
expo start          # Metro bundler
expo start --android # Avvia su Android
node scripts/test-emulators.js  # Test 3 risoluzioni
```

## 🎯 Working Directory per Claude Code

- **Per lavoro su web**: `cd packages/web`
- **Per lavoro su mobile**: `cd packages/mobile`
- **Per modifiche alla logica condivisa**: modificare `packages/shared`, poi testare in web E mobile

## 📱 Testing

### Web App

```bash
cd packages/web
npm run dev
# Aprire http://localhost:5173
# Testare con Chrome DevTools su 4 risoluzioni (vedi packages/web/.claude/CLAUDE.md)
```

### Mobile App

```bash
cd packages/mobile
expo start
# Premere 'a' per avviare su Android emulator

# Test automatico su 3 risoluzioni (360px, 390px, 412px)
node scripts/test-emulators.js
```

## 🏗️ Build Production

### Web

```bash
cd packages/web
npm run build        # Output: dist/
npm run deploy       # Deploy GitHub Pages
```

### Mobile (Play Store)

```bash
cd packages/mobile
eas build --platform android --profile production  # Build AAB
eas submit --platform android                       # Submit a Play Store
```

## 📚 Documentazione Package

- [packages/shared/README.md](./packages/shared/README.md) - Package shared
- [packages/web/README.md](./packages/web/README.md) - Web app
- [packages/mobile/README.md](./packages/mobile/README.md) - Mobile app

## 🔧 Tech Stack

| Package | Stack |
|---------|-------|
| **shared** | TypeScript puro |
| **web** | React 19, Vite, Tailwind CSS, Zustand |
| **mobile** | React Native, Expo, NativeWind, Zustand, Reanimated v4, expo-dev-client |

## 📦 Yarn Workspaces

Il progetto usa Yarn Workspaces per gestire le dipendenze condivise:

- Dependencies comuni sono hoisted alla root
- Ogni package ha il proprio `package.json`
- `@beybladex/shared` è linkato automaticamente

## 🔗 Links

- **Web App**: https://albertocabasvidani.github.io/beybladex-score/
- **Play Store**: [In arrivo]
- **Repository**: https://github.com/AlbertoCabasVidani/beybladex-score

## 📝 Licenza

MIT
