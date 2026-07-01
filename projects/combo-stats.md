---
name: combo-stats
status: active
updated: 22/06/2026
health: green
next-step: "Beta (combo builder + stats) in review su Test aperto; a beta approvata pubblicare la riga beta nello Store live e raccogliere feedback"
blocked-by: null
current-plan: null
main-doc: .claude/CLAUDE.md
---

# Combo Stats — selezione Bey + statistiche per combo

## Scope

Tracking win-rate per combo: assegnando una **Bey** a ciascun giocatore nello scoreboard, ogni partita conclusa viene registrata e analizzata. Comprende: selezione Bey nello scoreboard (scaffale dalle SavedCombo del [[combo-builder]], modifica al volo di un pezzo, componi nuova, nome libero), registrazione match a fine partita, home selettore modalità (segnapunti/gestore combo/analitiche) e schermate analitiche (leaderboard win-rate, dettaglio combo con donut mix finish, matchup drill-down, ricerca parti, filtri temporali con intervallo custom). Feature-flagged `STATS_ENABLED = __DEV__` + home `MODE_HOME_ENABLED`. Branch `feat/combo-stats`. Parte dell'app [[scoreboard]]; sorgenti in `packages/mobile/src/features/stats/`.

## Backlog

<!-- Idee, feature, task non avviati. Formato: `- gg/mm/aaaa — testo` -->
- 22/06/2026 — **A beta approvata su Test aperto**: pubblicare sulla scheda **live** di Play Console (EN + traduzione IT) la riga "🧪 BETA — try new features early / prova le novità in anteprima" già pronta in `packages/mobile/store/listing-{en,it}.md`, per reclutare tester. Rimuoverla quando la beta finisce (feature in produzione per tutti).
- 21/06/2026 — Decidere il rilascio in produzione: oggi `STATS_ENABLED = __DEV__`, in release l'app resta identica allo scoreboard. Valutare modello free/paid (input gratis, insight a pagamento — cfr. `packages/mobile/mockups/combo-selection-design.md`).
- 21/06/2026 — Modalità deck 3-on-3 (3 Bey per giocatore, no parti duplicate) sia nella selezione sia nelle analitiche.
- 21/06/2026 — Trend temporale / sparkline del win-rate cumulato e "forma" estesa nel dettaglio combo.
- 21/06/2026 — Thumbnail reali dei top al posto del testo nei chip Bey; filtro "solo i pezzi che possiedo" nei picker (collezione dal builder).

## Known issues

<!-- Bug, problemi noti. Formato: `- gg/mm/aaaa — testo` -->
- 21/06/2026 — I record memorizzano uno snapshot di nome/parti al momento del match (`comboKey` = id parti ordinati): rinominare/eliminare una combo nel builder non altera i record storici (per design).

## In progress

<!-- Lavori in corso. Se collegati a un piano in plans/, linkalo. -->

## Changelog

<!-- Cose completate, dalla più recente. Formato: `- gg/mm/aaaa — testo` -->
- 01/07/2026 — Fix emersi dal beta test su Pixel 9 (Android 15, edge-to-edge): gli overlay full-screen delle analitiche (`ComboDetailModal`, `StatsLegendModal`) andavano sotto la status bar trasparente → aggiunto `useSafeAreaInsets` all'header/contenuto. Tasto indietro Android: aggiunta policy globale (`BackHandler` in `StatsShell`/`BuilderShell` + fallback in `GameScreen` gated `MODE_HOME_ENABLED`) — indietro chiude l'overlay aperto in cascata, altrimenti torna alla home invece di uscire dall'app. Nuova opzione `build-apk-fast.sh --device --beta` per sideload di test su telefono. Verificato su device.
- 22/06/2026 — Beta (combo builder + statistiche) pubblicata sul track **Test aperto** (versionCode 19, inviata in review). Nuovo meccanismo flag a build-time `full-build-aab.sh --beta` (`EXPO_PUBLIC_FEATURES_ON`) al posto di `FORCE_ON`; la Production resta scoreboard puro. Link tester: play.google.com/apps/testing/com.beybladex.score (attivo a review approvata).
- 21/06/2026 — Intervallo temporale custom (calendario da/a, `RangeCalendar`, senza dipendenze native) + guida rapida alle analitiche (didascalia per-tab + legenda ⓘ `StatsLegendModal`). Review multi-agente del codice nuovo con 3 fix.
- 21/06/2026 — Feature completa su branch `feat/combo-stats`: selezione Bey nello scoreboard (dal mockup `combo-selection-design.md`), registrazione match idempotente, home selettore modalità con orientamento per-tab, analitiche (leaderboard, dettaglio donut mix finish + win-rate, matchup, ricerca parti, filtri temporali). Modello dati e aggregazioni pure in `src/features/stats/`. Tutto feature-flagged, regressione produzione verificata (nessun impatto).
