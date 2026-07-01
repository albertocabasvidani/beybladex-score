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
  - **ABI emulatore**: la build standard è solo `arm64-v8a` e crasha sull'emulatore x86_64 (`SoLoaderDSONotFoundError`). Per l'emulatore servono build con x86_64 (flag `--emulator`).
  - Tutti i comandi adb vanno in script `.sh` (evita permission multiple).
- **Mobile (device fisico)**: build EAS da https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds → "Install".

## Build & Release Android

Ricette complete in `packages/mobile/BUILD-RECIPES.md`; dettagli/troubleshooting in `packages/mobile/BUILD-GUIDE.md`.

```bash
bash packages/mobile/scripts/build-apk-fast.sh --emulator   # iterazione veloce, x86_64
bash packages/mobile/scripts/build-apk-fast.sh --device     # iterazione veloce, arm64-v8a
bash packages/mobile/scripts/build-apk-fast.sh --device --beta  # + feature avanzate ON (test combo/stats su telefono via adb)
bash packages/mobile/scripts/full-build-apk.sh --emulator   # build pulita (reset / cambio dipendenze)
bash packages/mobile/scripts/full-build-aab.sh              # AAB Play Store (pulita, tutte le ABI, firma upload)
bash packages/mobile/scripts/release-pair.sh                # coppia coerente: Production (N+1) + beta (N+2), stesso commit
bash packages/mobile/scripts/release-pair.sh --beta-only    # solo beta (N+1), Production intatta
```

**Regole**:
- Iterazione = `build-apk-fast.sh` (no `--clean`, riusa native cache → minuti). Pulita solo per reset o cambio dipendenze.
- Test **combo/stats su telefono** senza Play Store: `build-apk-fast.sh --device --beta` (accende `EXPO_PUBLIC_FEATURES_ON=1` anche in APK release). L'APK è firmato con la upload key, non con l'app-signing di Google: se sul device c'è la versione dal Play Store va **disinstallata prima** (`adb uninstall com.beybladex.score`, cancella i dati locali) o l'install fallisce per firma diversa.
- Ottimizzazioni Gradle in `patch-build-gradle.sh` (riapplicate a ogni build). `configuration-cache` NON abilitabile (incompatibile RN plugin). MAI `build-apk.sh` dopo `expo prebuild --clean` senza `patch-build-gradle.sh`.
- Upload Play Store: release **pubbliche** → track **Production**; build **beta** delle feature flag → track **Test aperto** (i tester si iscrivono via link, gli altri restano su Production). Review/rejection via Chrome DevTools su Play Console.
- **Coerenza Production ↔ Test aperto**: lo stesso commit produce entrambi gli AAB (con/senza `--beta`; le feature combo sono gated → OFF in Production), quindi si lavora su un solo branch (`master`) — niente branch beta separato. I track condividono lo spazio `versionCode` e un tester del Test aperto riceve il `versionCode` più alto a cui ha accesso, **inclusa la Production**: la beta deve restare **sempre sopra** la Production, altrimenti i tester scivolano su Production e perdono le combo. Per non sbagliare usare `release-pair.sh` (coppia `N+1`/`N+2` dallo stesso commit, aggiorna `app.json` da sé); `--beta-only` rinfresca solo la beta lasciando intatta la Production.
- **versionCode bruciato anche dopo Discard draft**: bumpare SEMPRE a N+1 in `app.json` prima di re-buildare (sennò *"Version code N has already been used"*).

## Moduli avanzati (feature-flagged, `src/config/featureFlags.ts`)

Tutti gated da `__DEV__` → OFF in release: in produzione l'app è identica al vecchio scoreboard. Per una build **beta** (track Test aperto) usare `full-build-aab.sh --beta`: esporta `EXPO_PUBLIC_FEATURES_ON=1` (inlinato da babel-preset-expo) che accende i flag solo in quell'AAB. La build Production normale (`full-build-aab.sh` senza flag) li lascia OFF — niente più costante da azzerare a mano.

- **Combo Builder** (`BUILDER_ENABLED`): tab builder combo/deck data-driven, dati parti bundled offline, radar stats. Architettura → `packages/mobile/docs/combo-builder.md`.
- **Combo Stats** (`STATS_ENABLED` + home `MODE_HOME_ENABLED`): selezione Bey nello scoreboard, registrazione match, home selettore modalità, analitiche. Architettura → `packages/mobile/docs/combo-stats.md`.
- Navigazione: `uiStore.activeTab` (home/scoreboard/builder/analytics); `App.tsx` blocca l'orientamento per-tab (scoreboard=landscape, resto=portrait). `react-native-svg` (radar/donut) richiede build nativa, non basta OTA.

## Feature scoreboard (audio, promemoria, i18n)

Dettagli in `packages/mobile/docs/scoreboard-features.md`.
- **Gotcha critici che rompono la release in silenzio**: audio/asset bundled (metro `saveAssets`, cache incrementale degli mp3, URI `android.resource://`). Leggere il doc PRIMA di toccare audio/asset o `scripts/metro-bundle.js`.
- **i18n**: tutte le stringhe UI via i18next (`t()`), zero hardcoded; chiavi in `packages/shared/src/i18n/translations.ts` (it+en), il web usa JSON separati. A ogni release con novità bumpare `hasSeenReleaseNote_v{N}` in `GameScreen.tsx`.
- **Banner invito beta** (`BETA_INVITE_ENABLED` in `featureFlags.ts`): toggle di **produzione** NON gated da `__DEV__`, invita al Test aperto dopo 20 partite. Dettagli e cleanup a beta conclusa in `packages/mobile/docs/scoreboard-features.md`.

## Monetizzazione (AdMob + RevenueCat)

Dettagli e procedure in `packages/mobile/docs/monetization.md`. Modello: **un unico entitlement `pro`** sblocca *analitiche complete + salvataggi combo/deck illimitati + niente pubblicità*, venduto con due prodotti (Lifetime one-time + Annuale) mappati sullo stesso entitlement. Il **segnapunti resta gratis** (nessun gate/ad).

- **Gate** attivo via flag `MONETIZATION_ENABLED` (`featureFlags.ts`, produzione, NON `__DEV__`). Accesso completo = `hasFullAccess()`/`useHasFullAccess()` in `store/access-store.ts` (Pro OPPURE sblocco rewarded di sessione OPPURE flag OFF). Limiti free in `config/monetization.ts` (`FREE_MATCH_LIMIT`=25, `FREE_COMBO_LIMIT`=5, `FREE_DECK_LIMIT`=1).
- **Analitiche**: free vede solo gli ultimi `FREE_MATCH_LIMIT` match (`limitToRecent` in `aggregation.ts`) + teaser/card gate. **Combo Builder**: salvataggio oltre il limite → paywall (consultazione parti/radar sempre libera).
- **Ads**: banner adattivo in builder/analitiche (mai nel segnapunti; sparisce col Pro) + rewarded "assaggio" (`components/ads/rewarded.ts`, sblocca lo storico per la sessione). Paywall unico: `components/paywall/PaywallModal.tsx` (montato in `App.tsx`, aperto via `store/paywall-store.ts`).
- Plugin AdMob in `app.json`: parametri **camelCase** (`androidAppId`, non snake_case).
- Il manifest **deve** contenere `com.google.android.gms.permission.AD_ID` (in `app.json` → `android.permissions`); verificarlo nell'AAB con bundletool, NON col grep. Senza → Play Console blocca la pubblicazione.
- **Config store (creata)**: Play Console prodotti `pro_lifetime` (one-time €34,99) + `pro_annual` / base plan `annual` (annuale €9,99), attivi. RevenueCat: entrambi mappati sull'entitlement `pro`, offering `default` con package `$rc_lifetime`→`pro_lifetime` e `$rc_annual`→`pro_annual:annual`. AdMob ad unit: banner `ca-app-pub-7303361297226779/4762021095`, rewarded `ca-app-pub-7303361297226779/4661237648` (in `config/ads.ts`).

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
