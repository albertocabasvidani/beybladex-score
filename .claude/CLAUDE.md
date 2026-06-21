# Beyblade X Score Monorepo

## Struttura
- `packages/shared`: Core game logic (pure TypeScript)
- `packages/web`: React web app (Vite + Tailwind)
- `packages/mobile`: React Native app (Expo + NativeWind + Reanimated)

## Sottoprogetti

Tracking di backlog/issue/changelog in `projects/` (vedi `projects/INDEX.md`).

| Sottoprogetto | Scope |
|---|---|
| `scoreboard` | App segnapunti (web+mobile), logica shared, monetizzazione, build/release, ASO |
| `combo-builder` | Tab Combo Builder feature-flagged: dati parti, radar stats, deck/collection |
| `combo-stats` | Selezione Bey nello scoreboard + registrazione match + analitiche (feature nascosta) |

## Working Directory
- **Web**: `cd packages/web`
- **Mobile**: `cd packages/mobile`
- **Shared**: modifiche shared richiedono test in web E mobile

## Testing

- **Web**: `cd packages/web`, poi `npm run dev` → http://localhost:5173
- **Mobile (emulatore, PREFERITO)**: guida completa in `packages/mobile/BUILD-GUIDE.md`, troubleshooting in `packages/mobile/EMULATOR-GUIDE.md`.
  - **REGOLA CRITICA — ABI emulatore**: la build standard è solo `arm64-v8a` e **CRASHA sull'emulatore x86_64** (`SoLoaderDSONotFoundError`). Per l'emulatore servono build con x86_64 (flag `--emulator`).
  - Tutti i comandi adb vanno in script `.sh` (evita permission multiple).
- **Mobile (device fisico)**: build EAS da https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds → "Install".

## Build & Release Android

Ricette complete in `packages/mobile/BUILD-RECIPES.md`; dettagli/troubleshooting in `packages/mobile/BUILD-GUIDE.md`.

```bash
bash packages/mobile/scripts/build-apk-fast.sh --emulator   # iterazione veloce, x86_64
bash packages/mobile/scripts/build-apk-fast.sh --device     # iterazione veloce, arm64-v8a
bash packages/mobile/scripts/full-build-apk.sh --emulator   # build pulita (reset / cambio dipendenze)
bash packages/mobile/scripts/full-build-aab.sh              # AAB Play Store (pulita, tutte le ABI, firma upload)
```

**Regole**:
- Iterazione = `build-apk-fast.sh` (no `--clean`, riusa native cache → minuti). Pulita solo per reset o cambio dipendenze.
- Ottimizzazioni Gradle in `patch-build-gradle.sh` (riapplicate a ogni build). `configuration-cache` NON abilitabile (incompatibile RN plugin). MAI `build-apk.sh` dopo `expo prebuild --clean` senza `patch-build-gradle.sh`.
- Upload Play Store SEMPRE track **Production** (MAI Closed testing/Alpha). Review/rejection via Chrome DevTools su Play Console.
- **versionCode bruciato anche dopo Discard draft**: bumpare SEMPRE a N+1 in `app.json` prima di re-buildare (sennò *"Version code N has already been used"*).

## Moduli avanzati (feature-flagged, `src/config/featureFlags.ts`)

Tutti gated da `__DEV__` → OFF in release: in produzione l'app è identica al vecchio scoreboard. La costante `FORCE_ON` forza i flag ON per testarli in una build release — **tenere `false` al rilascio**.

- **Combo Builder** (`BUILDER_ENABLED`): tab builder combo/deck data-driven, dati parti bundled offline, radar stats. Architettura → `packages/mobile/docs/combo-builder.md`.
- **Combo Stats** (`STATS_ENABLED` + home `MODE_HOME_ENABLED`): selezione Bey nello scoreboard, registrazione match, home selettore modalità, analitiche. Architettura → `packages/mobile/docs/combo-stats.md`.
- Navigazione: `uiStore.activeTab` (home/scoreboard/builder/analytics); `App.tsx` blocca l'orientamento per-tab (scoreboard=landscape, resto=portrait). `react-native-svg` (radar/donut) richiede build nativa, non basta OTA.

## Feature scoreboard (audio, promemoria, i18n)

Dettagli in `packages/mobile/docs/scoreboard-features.md`.
- **Gotcha critici che rompono la release in silenzio**: audio/asset bundled (metro `saveAssets`, cache incrementale degli mp3, URI `android.resource://`). Leggere il doc PRIMA di toccare audio/asset o `scripts/metro-bundle.js`.
- **i18n**: tutte le stringhe UI via i18next (`t()`), zero hardcoded; chiavi in `packages/shared/src/i18n/translations.ts` (it+en), il web usa JSON separati. A ogni release con novità bumpare `hasSeenReleaseNote_v{N}` in `GameScreen.tsx`.

## Monetizzazione (AdMob + RevenueCat)

Dettagli e procedure di verifica in `packages/mobile/docs/monetization.md`. **Regole critiche**:
- Plugin AdMob in `app.json`: parametri **camelCase** (`androidAppId`, non snake_case).
- Il manifest **deve** contenere `com.google.android.gms.permission.AD_ID` (in `app.json` → `android.permissions`); verificarlo nell'AAB con bundletool, NON col grep. Senza → Play Console blocca la pubblicazione.
- ID AdMob/RevenueCat ancora di test/placeholder (sostituzione tracciata come known issue in `projects/scoreboard.md`).

## Play Store & ASO

- Best practice 2026 + draft listing: `packages/mobile/store/aso-best-practices-2026.md`
- Guida pubblicazione: `packages/mobile/store/play-store-guide.md`
- Listing da copiare in Play Console: `packages/mobile/store/listing-{en,it}.md`
- **Categoria target**: Game > Sports.

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: build locale AAB + upload manuale su Play Console

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE `yarn install` dalla root (NON npm install nei singoli package)
- Logica di gioco: modificare `shared`, poi adattare UI in web e mobile
- EAS build DEVE partire da `packages/mobile` (NON dalla root)
