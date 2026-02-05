# @beybladex/shared

Package condiviso contenente la logica di gioco pura (TypeScript) utilizzata sia dall'app web che dall'app mobile.

## 📦 Contenuto

### Game Logic (`src/game/`)

- **`types.ts`**: TypeScript types (FinishType, Player, MatchState, HistoryEntry)
- **`constants.ts`**: Costanti di gioco (FINISH_SCORES, FINISH_INFO, DEFAULT_WIN_SCORE)
- **`game-engine.ts`**: Pure functions per la logica di gioco (scorePoint, undo, reset, checkWinner)

### Traduzioni (`src/i18n/`)

- **`translations.ts`**: Traduzioni IT/EN (finish types, game UI, buttons)

## 🎯 Export Disponibili

```typescript
// Types
import type { FinishType, Player, MatchState, HistoryEntry } from '@beybladex/shared';

// Constants
import { FINISH_SCORES, FINISH_INFO, DEFAULT_WIN_SCORE } from '@beybladex/shared';

// Game engine functions
import {
  scorePoint,
  undoLastAction,
  resetMatch,
  setPlayerName,
  setWinScore,
  canUndo,
  createInitialMatchState
} from '@beybladex/shared';

// Traduzioni
import { translations } from '@beybladex/shared';
```

## 🔧 Utilizzo nei Package

### In Web (`packages/web`)

```typescript
// package.json
{
  "dependencies": {
    "@beybladex/shared": "workspace:*"
  }
}

// src/store/game-store.ts
import { scorePoint, FINISH_SCORES } from '@beybladex/shared';
```

### In Mobile (`packages/mobile`)

```typescript
// package.json
{
  "dependencies": {
    "@beybladex/shared": "workspace:*"
  }
}

// src/store/game-store.ts
import { scorePoint, MatchState } from '@beybladex/shared';
```

## 📝 Regole di Sviluppo

- **Pure Functions**: Tutte le funzioni in `game-engine.ts` sono pure (no side effects)
- **Immutability**: Le funzioni ritornano nuovi stati senza mutare l'input
- **Type Safety**: Tutti gli export hanno types espliciti
- **Zero Dependencies**: Package senza dipendenze esterne (solo TypeScript)

## 🧪 Testing

```bash
# Type check
cd packages/shared
yarn type-check

# Verifica utilizzo in web
cd ../web
npm run dev

# Verifica utilizzo in mobile
cd ../mobile
expo start
```

## ⚠️ Modifiche a Shared

Quando modifichi questo package:

1. **Modifica** il codice in `packages/shared/src/`
2. **Test web**: `cd packages/web && npm run dev`
3. **Test mobile**: `cd packages/mobile && expo start`
4. **Verifica**: Entrambi i package devono funzionare correttamente

## 📂 Struttura

```
packages/shared/
├── src/
│   ├── game/
│   │   ├── types.ts          # TypeScript types
│   │   ├── constants.ts      # Costanti di gioco
│   │   ├── game-engine.ts    # Pure functions
│   │   └── index.ts          # Re-exports
│   ├── i18n/
│   │   ├── translations.ts   # IT + EN
│   │   └── index.ts
│   └── index.ts              # Main export
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 Links

- [Game Engine Logic](./src/game/game-engine.ts)
- [Type Definitions](./src/game/types.ts)
- [Constants](./src/game/constants.ts)
