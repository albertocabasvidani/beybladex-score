# Combo Builder — architettura

Tab interna feature-flagged (`BUILDER_ENABLED = __DEV__` in `src/config/featureFlags.ts`): ON in dev, OFF in release → in produzione l'app è identica allo scoreboard (nessun tab, lock landscape, `BuilderShell` mai montato). FAB dev "🛠️ Builder" per entrarci (sostituito dal pulsante Home quando `MODE_HOME_ENABLED`). Tracking backlog/issue in `projects/combo-builder.md`.

## Slot data-driven (niente toggle)

Gli slot disponibili li calcola `computeSlots(parts)` in `builderStore` dalla parte scelta. Tutti i menù sono mostrati; quelli non applicabili sono **disabilitati**. Regole:
- `blade` (BX/UX) e le lame CX (`lockChip/mainBlade/assistBlade/overBlade`, in `CX_LAMA_CATEGORIES`) sono mutuamente esclusive.
- Una parte con `integratedRatchet` (blade UX tipo Bullet Griffon **o** Ratchet Integrated Bit tipo Operate/Turbo, su `SelectedPart`) **esclude lo slot ratchet**; il bit è sempre disponibile.
- `comboComplete(parts)` valida (lama + bit + ratchet se non incluso); `getComboLine(parts)` deriva bx/ux/cx; `setPart` pulisce gli slot incompatibili.
- `SavedCombo` usa `parts: Partial<Record<PartCategory, SelectedPart>>` + `line`; `SLOT_ORDER` ordina label/dedup.
- `getComboStatMax(line)` scala il radar (CX = mainBlade+ratchet+bit; le parti senza stat contano 0). `validateNoDuplicateParts` su **tutte** le categorie, deck misti BX/UX/CX ammessi.
- Persist `version:2` + `migrate` (v0 `{blade,ratchet,bit}` e v1 `{system,...}` → `{parts,recent}`).

N.B. "CX Infinity" (linguaggio comune) = serie CX a 5 parti; lo *stadio* xtreme/infinity è solo un badge del sito combo, non si modella qui.

## Dati parti

`packages/shared/src/parts/` — `bundled-parts.json` (registry 265 parti, import statico inlinato da Metro → istantaneo, offline) + `registry.ts` (getter tipizzati `getBlades/getBits/getRatchets/getCxParts/getPartsByCategory/getPartById/getBladeLine`). Fonte di verità = `data/parts.json` del sito combo (`albertocabasvidani/beyblade-x-combo-finder`, branch **master**).

**Sync** (build-time, MAI runtime): `scripts/sync-parts.js` (`npm run sync-parts`) scarica + valida parts.json → `bundled-parts.json` (committato). Integrato in `full-build-apk.sh` (STEP 0.5, prima della copia sorgenti). Offline → mantiene il file esistente; schema rotto → exit 1 (blocca il build).

**Stats radar (ATK/DEF/STA)**: popolate dalle pagine Fandom **dedicate** (`Blade - X`, `Bit - X`, `Ratchet - X`, `Main Blade - X`) via `beyblade combos/scripts/enrich-stats.ts` (`npm run enrich:stats`): scrive `stats` nel master (merge-master le preserva nei run giornalieri) → `build:parts` → `parts.json` → `sync-parts` → `bundled-parts.json`. Copertura stat tracciata in `projects/combo-builder.md`. Le parti scoperte degradano (badge "Stats non disponibili" in `PartCard`/`BuilderScreen`/`DecksScreen`; StatBar/mini-stat nascoste). RadarChart a 3 assi (`react-native-svg`); `STAT_MAX_*` in `features/builder/theme.ts`. **Nota**: combo/selezioni salvate memorizzano uno snapshot delle stat al salvataggio — un aggiornamento dati non le ricalcola finché non si ri-seleziona la parte.

## UI e navigazione

- `src/features/builder/`: `BuilderShell.tsx` (header + tab bar 4 voci) + `components/` (RadarChart 3 assi su `react-native-svg`, PartPicker, PartCard, StatBar, GradientButton, FilterChipRow, CollectionGridItem — niente `react-native-paper`, niente immagini, icone = emoji) + `stores/` (builder/combo/deck/collection/filter, persist key `beybladex-builder-*`; collection `ownedIds` Set↔Array; deck con regola WBO no-duplicati `validateNoDuplicateParts`) + `screens/` (Parts/Builder/Decks/Collection). Componenti portati da `bbxdeckbuild` adattati allo schema canonico (`type`/`line`, 3 assi).
- **Navigazione**: niente react-navigation. `src/store/uiStore.ts` (`activeTab` home/scoreboard/builder/analytics + `activeBuilderTab`, persist key `beybladex-ui`); `App.tsx` blocca l'orientamento per-tab (scoreboard=LANDSCAPE, home/builder/analytics=PORTRAIT) via `useEffect([isPortraitTab])`.
- **i18n**: namespace `builder.*` in `packages/shared/src/i18n/translations.ts` (it+en).
- **Dipendenza nativa**: `react-native-svg` (radar) → richiede build nativa (`full-build-apk.sh`), non basta OTA.
