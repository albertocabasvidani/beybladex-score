# Statistiche per combo — architettura

Feature nascosta (branch `feat/combo-stats`). Win-rate per combo: assegnando una **Bey** a ciascun giocatore nello scoreboard, ogni partita conclusa diventa un record analizzabile. **Gate `STATS_ENABLED = __DEV__`** + home `MODE_HOME_ENABLED = BUILDER_ENABLED || STATS_ENABLED` (`src/config/featureFlags.ts`). La costante `FORCE_ON` forza i flag ON per testare in una build release — **tenere `false` al rilascio**. In produzione l'app è identica al vecchio scoreboard (nessuna Bey, nessuna home, nessuna registrazione; regressione verificata). Tracking in `projects/combo-stats.md`; mockup UX in `mockups/combo-selection-design.md`.

## Modello dati (`src/features/stats/`)

- `bey.ts`: `AssignedBey` (bridge scaffale↔stats); `beyComboKey` = id parti ordinati o `free:<nome>`; `beyWithPart`/`beyFromSavedCombo`/`beyFreeform`.
- `statsStore.ts`: `MatchRecord[]` persistito (`beybladex-stats`), snapshot Bey **immutabile** (rinominare/eliminare una combo nel builder non altera i record storici).
- `aggregation.ts`: funzioni **pure** (niente React/zustand, testabili): `filterByRange` (+ `CustomRange`), `aggregateCombos`, `sortCombos`, `matchupsFor`, `partUsage`, `formFor`, `overallSummary`.

## Selezione Bey nello scoreboard

`PlayerPanel` → `BeyRow`: nome + chip Bey sulla stessa riga (mockup). Flussi: scaffale dalle `SavedCombo` del builder, modifica al volo di un pezzo (variante effimera → toast "tieni nello scaffale"), componi nuova (3 pezzi), nome libero. Overlay unico `BeySelectorOverlay` montato in `GameScreen`, pilotato dallo store effimero `beySelectorStore`; riusa il `PartPicker` del builder. Bey persistite nel game-store (`player1Bey`/`player2Bey`), restano tra i match.

## Registrazione

In `GameScreen`, alla transizione `winner` null→set, se entrambe le Bey sono assegnate → `recordMatch` (idempotente per match).

## Analitiche (`StatsShell` + `screens/`)

- **Combo**: leaderboard `ComboRow` (barra win-rate colorata + record + diff punti + badge "campione ridotto" <5 partite).
- **Matchup**: liste a barre drill-down, **mai** matrice NxN.
- **Parti**: ricerca + win-rate per parte, espandibile sulle combo che la usano.
- **Dettaglio** `ComboDetailModal`: donut `react-native-svg` (anello = mix finish, centro = win-rate) + KPI + composizione finish inflitti/subiti + forma + matchup drill-down.
- **Filtri temporali** `TimeRangeChips` (Tutto/30g/7g/Oggi + chip 📅 → `RangeCalendar`, intervallo custom da/a, senza dipendenze native).
- **Guida**: didascalia per-tab + `StatsLegendModal` (pulsante ⓘ: cosa fa ogni tab + notazione record/diff/campione ridotto).
- i18n: namespace `home.*` + `stats.*`.

## Pulsante Home

Nello scoreboard, bottom bar a sinistra del trofeo (gate `MODE_HOME_ENABLED`).
