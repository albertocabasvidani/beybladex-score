# Piano: Contatore Falli - Beyblade X Score

## Contesto

L'utente vuole aggiungere un contatore di falli per ogni giocatore con limite personalizzabile. Quando un giocatore raggiunge il limite falli, **l'avversario riceve 1 punto** e i falli del giocatore penalizzato si **azzerano**. La funzionalita va implementata sia su mobile che su web.

**Gia implementati** (nessun lavoro necessario):
- Schermo sempre acceso (`useKeepAwake` in App.tsx:24)
- Nomi giocatori persistenti (Zustand persist in game-store.ts:185-190)
- Sistema di logging completo (persistent-logger.ts)

---

## Meccanica Falli

- Ogni giocatore ha un contatore falli (parte da 0)
- Il limite falli e configurabile nelle impostazioni (default: **2**, range: 0-5, dove 0 = disabilitato)
- Quando un giocatore raggiunge il limite:
  1. L'**avversario** riceve **+1 punto** (come uno Spin Finish)
  2. I falli del giocatore penalizzato si **azzerano** a 0
  3. Se il punto assegnato porta l'avversario al winScore, **l'avversario vince**
- I falli sono **annullabili** con Undo (stessa coda cronologica dei punteggi)
- Al **Reset** partita i falli tornano a 0
- Con limite a 0 (OFF), i falli vengono solo contati senza conseguenze

---

## Layout: Posizionamento Contatore Falli

Posizionato **sotto il nome del giocatore**, tra il nome e la riga dei pulsanti. Riga compatta (~22px) con pulsanti [-] e [+] e contatore.

```
Mobile (landscape):
[Player 1 Panel]           |div|         [Player 2 Panel]
  Player 1 Name                            Player 2 Name
  [-] F: 0 [+]                            [-] F: 0 [+]
  [Spin][Burst]  SCORE  [Over][Xtreme]    [Spin][Burst]  SCORE  [Over][Xtreme]
```

- Pulsanti [-] e [+]: 22x22, rotondi, bg `#334155`
- "F:" label + contatore: fontSize 13, colore `#94a3b8` (slate) quando 0, `#f59e0b` (amber) quando > 0
- [-] disabilitato quando fouls === 0
- [+] disabilitato quando c'e gia un vincitore
- Se maxFouls > 0: mostrare "F: 1/2" (falli attuali / limite)

---

## Implementazione

### 1. Shared - Types (`packages/shared/src/game/types.ts`)

Aggiungere `fouls: number` a `Player`. Refactoring `HistoryEntry` in union discriminata:

```typescript
export interface Player {
  id: PlayerId;
  name: string;
  score: number;
  fouls: number;  // NUOVO
  finishCounts: Record<FinishType, number>;
}

export type HistoryEntry = ScoreHistoryEntry | FoulHistoryEntry;

export interface ScoreHistoryEntry {
  type: 'score';
  playerId: PlayerId;
  finishType: FinishType;
  pointsAdded: number;
  timestamp: number;
}

export interface FoulHistoryEntry {
  type: 'foul';
  playerId: PlayerId;
  previousFouls: number;    // per undo: ripristinare il valore precedente
  opponentScored: boolean;  // true se il fallo ha causato punto all'avversario
  timestamp: number;
}

export interface MatchState {
  player1: Player;
  player2: Player;
  winScore: number;
  maxFouls: number;  // NUOVO
  winner: PlayerId | null;
  history: HistoryEntry[];
}
```

### 2. Shared - Constants (`packages/shared/src/game/constants.ts`)

- Aggiungere `fouls: 0` a `createInitialPlayer`
- Nuove costanti: `DEFAULT_MAX_FOULS = 2`, `MIN_MAX_FOULS = 0`, `MAX_MAX_FOULS = 5`

### 3. Shared - Game Engine (`packages/shared/src/game/game-engine.ts`)

**Modifiche a funzioni esistenti:**
- `scorePoint()`: aggiungere `type: 'score'` all'history entry
- `undoLastAction()`: gestire union discriminata:
  - `type === 'score'`: comportamento attuale (rimuovi punti, decrementa finishCount)
  - `type === 'foul'`: ripristina `previousFouls`, se `opponentScored` rimuovi 1 punto all'avversario
- `createInitialMatchState(winScore, maxFouls)`: accettare `maxFouls` come parametro
- `resetMatch()`: preservare maxFouls
- `getMatchStats()`: includere fouls

**Nuove funzioni:**
- `addFoul(state, playerId)`:
  1. Incrementa `fouls` del giocatore
  2. Se `maxFouls > 0` e `fouls >= maxFouls`: azzera fouls, +1 punto avversario, controlla vittoria
  3. Aggiunge `FoulHistoryEntry` con `previousFouls` e `opponentScored`
- `removeFoul(state, playerId)`: decrementa fouls (min 0), aggiunge FoulHistoryEntry con `opponentScored: false`
- `setMaxFouls(state, maxFouls)`: imposta il limite falli

### 4. Shared - Translations (`packages/shared/src/i18n/translations.ts`)

```typescript
// it:
foul: {
  label: 'Falli',
  short: 'F',
  maxFouls: 'Limite falli',
  disabled: 'Disabilitato',
}

// en:
foul: {
  label: 'Fouls',
  short: 'F',
  maxFouls: 'Foul limit',
  disabled: 'Disabled',
}
```

### 5. Mobile - Store (`packages/mobile/src/store/game-store.ts`)

Nuove azioni:
- `addFoul(playerId)`: chiama `addFoul` da shared, logga, aggiorna stato (entrambi i giocatori + history + winner)
- `removeFoul(playerId)`: chiama `removeFoul` da shared, logga, aggiorna stato
- `setMaxFoulsValue(value)`: imposta maxFouls, persiste nel storage

Persistenza:
- Aggiungere `maxFouls` a `PersistedState` e `partialize`
- Aggiungere a `merge` per ripristinarlo

### 6. Mobile - Componente FoulCounter (`packages/mobile/src/components/game/FoulCounter.tsx`)

Nuovo componente. Props: `{ playerId: PlayerId }`.
- Legge `player.fouls`, `maxFouls`, `winner` dallo store
- Pulsanti [-] e [+] piccoli (22x22)
- Se maxFouls > 0: mostra "F: 1/2" (attuale/limite)
- Se maxFouls === 0: mostra "F: 1" (solo contatore)
- [-] disabilitato se fouls === 0
- [+] disabilitato se winner !== null

### 7. Mobile - PlayerPanel (`packages/mobile/src/components/game/PlayerPanel.tsx`)

Inserire `<FoulCounter playerId={playerId} />` tra il nome e la riga dei pulsanti.

### 8. Mobile - SettingsModal (`packages/mobile/src/components/modals/SettingsModal.tsx`)

Aggiungere sezione "Limite Falli" sotto "Win Score", stesso stile con [-] numero [+]:
- Range: 0 (OFF) - 5
- Quando 0: mostrare "OFF" al posto del numero
- Default: 2

### 9. Web - Store (`packages/web/src/store/game-store.ts`)

Stesse azioni mobile: `addFoul`, `removeFoul`, `setMaxFoulsValue`.

### 10. Web - Componente FoulCounter (`packages/web/src/components/game/FoulCounter.tsx`)

Nuovo componente con Tailwind CSS, stessa logica del mobile.

### 11. Web - PlayerPanel (`packages/web/src/components/game/PlayerPanel.tsx`)

Inserire `<FoulCounter playerId={playerId} />` tra NameInput e la riga pulsanti.

### 12. Web - SettingsModal (`packages/web/src/components/modals/SettingsModal.tsx`)

Aggiungere sezione "Foul limit" con +/- buttons, range 0-5.

---

## File modificati

| File | Azione |
|------|--------|
| `packages/shared/src/game/types.ts` | Aggiunto fouls a Player, union HistoryEntry, maxFouls a MatchState |
| `packages/shared/src/game/constants.ts` | Aggiunto fouls: 0, costanti maxFouls |
| `packages/shared/src/game/game-engine.ts` | Refactor undo, addFoul, removeFoul, penalty point logic |
| `packages/shared/src/i18n/translations.ts` | Aggiunte traduzioni foul |
| `packages/mobile/src/store/game-store.ts` | Azioni foul, persistenza maxFouls |
| `packages/mobile/src/components/game/FoulCounter.tsx` | **NUOVO** - componente contatore |
| `packages/mobile/src/components/game/PlayerPanel.tsx` | Inserito FoulCounter |
| `packages/mobile/src/components/modals/SettingsModal.tsx` | Sezione limite falli |
| `packages/web/src/store/game-store.ts` | Azioni foul |
| `packages/web/src/components/game/FoulCounter.tsx` | **NUOVO** - componente contatore web |
| `packages/web/src/components/game/PlayerPanel.tsx` | Inserito FoulCounter |
| `packages/web/src/components/game/GameControls.tsx` | Fix Undo button reactivity (selector) |
| `packages/web/src/components/modals/SettingsModal.tsx` | Sezione limite falli |
| `packages/web/src/i18n/locales/it.json` | Aggiunta traduzione settings.maxFouls |
| `packages/web/src/i18n/locales/en.json` | Aggiunta traduzione settings.maxFouls |

---

## Note implementazione

- **Bug fix web**: Il selettore Zustand `(state) => state.canUndo` ritornava sempre lo stesso riferimento funzione, impedendo il re-render. Sostituito con `(state) => state.history.length > 0`.
- **Web i18n**: Le traduzioni web usano file JSON locali (`packages/web/src/i18n/locales/`), non il file shared. La chiave `settings.maxFouls` andava aggiunta anche li.

---

**Creato**: 21/02/2026 17:30 - Contatore falli con penalita punto avversario
