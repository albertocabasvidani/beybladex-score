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

## Working Directory
- **Web**: `cd packages/web`
- **Mobile**: `cd packages/mobile`
- **Shared**: modifiche shared richiedono test in web E mobile

## Testing

### Web
```bash
cd packages/web
npm run dev
# Apri http://localhost:5173
```

### Mobile - Emulatore Locale (PREFERITO)

Guida completa build + emulatore: **`packages/mobile/BUILD-GUIDE.md`**
Troubleshooting emulatore: **`packages/mobile/EMULATOR-GUIDE.md`**

**REGOLA CRITICA — Architettura APK per emulatore**:
La build standard produce APK solo `arm64-v8a`, che **CRASHA sull'emulatore x86_64** (`SoLoaderDSONotFoundError`).
- **Emulatore**: `bash packages/mobile/scripts/full-build-apk.sh --emulator` (aggiunge x86_64 automaticamente)
- **Device/Play Store**: `bash packages/mobile/scripts/full-build-apk.sh` (arm64-v8a only)

**IMPORTANTE**: Tutti i comandi adb vanno in script `.sh` per evitare permission multiple.

### Mobile - Device Fisico
1. Apri segnalibro: https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds
2. Tap sull'ultima build → "Install"

## Build & Release Android

Ricette complete (emulatore / dispositivo / Play Store) in **`packages/mobile/BUILD-RECIPES.md`**. Dettagli/troubleshooting in **`packages/mobile/BUILD-GUIDE.md`**.

Comandi rapidi:
```bash
# Iterazione veloce (incrementale, riusa C++ compilato): emulatore o device
bash packages/mobile/scripts/build-apk-fast.sh --emulator   # x86_64
bash packages/mobile/scripts/build-apk-fast.sh --device     # arm64-v8a

# Build pulita (reset completo) se l'incrementale dà errori o cambi dipendenze
bash packages/mobile/scripts/full-build-apk.sh --emulator

# AAB Play Store (sempre pulita, tutte le ABI, firma upload)
bash packages/mobile/scripts/full-build-aab.sh
```

**REGOLE**:
- **Iterazione = `build-apk-fast.sh`** (no `--clean`, riusa native cache → minuti). Build pulita solo per reset o cambio dipendenze.
- Ottimizzazioni Gradle (build cache, parallel, daemon, heap 4G) sono in `patch-build-gradle.sh`, riapplicate a ogni build. `configuration-cache` NON abilitabile (incompatibile RN plugin).
- MAI usare `build-apk.sh` dopo `expo prebuild --clean` senza `patch-build-gradle.sh`
- Upload Play Store: SEMPRE track **Production** (MAI Closed testing/Alpha)
- Controllare review/rejection su Play Console via Chrome DevTools
- **versionCode è bruciato anche dopo Discard draft**: se un AAB con versionCode N viene caricato e poi il draft scartato, Play Console rifiuta il prossimo upload con stesso N (errore *"Version code N has already been used"*). Bumpare SEMPRE a N+1 prima di re-buildare.

## Audio countdown (expo-audio)

- Pulsante pill "▶ 3·2·1" al centro della bottom bar: `CountdownButton.tsx` + hook `useCountdownAudio.ts`. File audio: `assets/sounds/countdown-{it,en}.mp3`, forniti dall'utente (generati con ElevenLabs, 06/2026).
- Fallback TTS per rigenerarli: `bash packages/mobile/scripts/generate-countdown-audio.sh` (richiede `ELEVENLABS_API_KEY` nel `.env`; voci Davide IT / Charlie EN, pause tarabili con `PAUSE_NUM`/`PAUSE_FINAL`, segmenti cachati in `tmp/countdown-tts`). Sovrascrive i file dell'utente: usare solo se servono nuove versioni.

**Regole critiche** (dettagli generali in `~/.claude/rules/react-native-android.md`):
- `scripts/metro-bundle.js` deve mantenere il blocco `saveAssets` + normalizzazione `httpServerLocation`: senza, gli asset Metro non finiscono nell'APK o hanno nome risorsa sbagliato (monorepo) → `Resource not found` solo in release.
- `useCountdownAudio.ts` costruisce l'URI `android.resource://com.beybladex.score/raw/<nome>` in release (il nome risorsa nudo non è riproducibile da ExoPlayer). La costante `ANDROID_PACKAGE` deve combaciare con `android.package` di `app.json`.
- Verificare gli asset nell'APK con `aapt2 dump resources` (NON `unzip -l`: `optimizeReleaseResources` offusca i path).
- Se si cambiano SOLO gli mp3, la build incrementale lascia `createBundleReleaseJsAndAssets` UP-TO-DATE (gli asset non sono input tracciati) e l'APK esce con gli audio vecchi: cancellare prima `C:/projects/beybladex/packages/mobile/android/app/build/generated/{assets,res}/createBundleReleaseJsAndAssets`.

## Combo Builder (tab feature-flagged)

Builder di combo/deck come tab interna. **Feature flag `BUILDER_ENABLED = __DEV__`** (`packages/mobile/src/config/featureFlags.ts`): ON in dev, OFF in release → in produzione l'app è identica allo scoreboard (nessun tab, lock landscape, BuilderShell mai montato). FAB dev "🛠️ Builder" in alto a sinistra sullo scoreboard per entrarci.

- **Slot data-driven (niente toggle)**: gli slot disponibili li calcola `computeSlots(parts)` in `builderStore` dalla parte scelta. Tutti i menù sono mostrati; quelli non applicabili sono **disabilitati**. Regole: `blade` (BX/UX) e le lame CX (`lockChip/mainBlade/assistBlade/overBlade`, in `CX_LAMA_CATEGORIES`) sono mutuamente esclusive; una parte con `integratedRatchet` (blade UX tipo Bullet Griffon **o** Ratchet Integrated Bit tipo Operate/Turbo, su `SelectedPart`) **esclude lo slot ratchet**; il bit è sempre disponibile. `comboComplete(parts)` valida (lama + bit + ratchet se non incluso); `getComboLine(parts)` deriva bx/ux/cx. `setPart` pulisce gli slot incompatibili. `SavedCombo` usa `parts: Partial<Record<PartCategory, SelectedPart>>` + `line`; `SLOT_ORDER` ordina label/dedup. `getComboStatMax(line)` scala il radar (CX = mainBlade+ratchet+bit; le parti senza stat contano 0). `validateNoDuplicateParts` su **tutte** le categorie, deck misti BX/UX/CX ammessi. Persist `version:2`+`migrate` (v0 `{blade,ratchet,bit}` e v1 `{system,...}` → `{parts,recent}`). N.B. "CX Infinity" (linguaggio comune) = serie CX a 5 parti; lo *stadio* xtreme/infinity è solo un badge del sito combo, non si modella qui.
- **Dati parti**: `packages/shared/src/parts/` — `bundled-parts.json` (registry 265 parti, import statico inlinato da Metro → istantaneo, offline) + `registry.ts` (getter tipizzati `getBlades/getBits/getRatchets/getCxParts/getPartsByCategory/getPartById/getBladeLine`). Fonte di verità = `data/parts.json` del sito combo (`albertocabasvidani/beyblade-x-combo-finder`, branch **master**).
- **Sync** (build-time, MAI runtime): `scripts/sync-parts.js` (`npm run sync-parts`) scarica + valida parts.json → `bundled-parts.json` (committato). Integrato in `full-build-apk.sh` (STEP 0.5, prima della copia sorgenti). Offline → mantiene il file esistente; schema rotto → exit 1 (blocca il build).
- **Stats radar (ATK/DEF/STA)**: popolate dalle pagine Fandom **dedicate** (`Blade - X`, `Bit - X`, `Ratchet - X`, `Main Blade - X`) via `beyblade combos/scripts/enrich-stats.ts` (`npm run enrich:stats`): scrive `stats` nel master (merge-master le preserva nei run giornalieri) → `build:parts` → `parts.json` → `sync-parts` → `bundled-parts.json`. Copertura stat attuale tracciata in `projects/combo-builder.md`. Le parti scoperte degradano (badge "Stats non disponibili" in `PartCard`/`BuilderScreen`/`DecksScreen`; StatBar/mini-stat nascoste). RadarChart a 3 assi (`react-native-svg`); `STAT_MAX_*` in `features/builder/theme.ts`. **Nota**: combo/selezioni salvate memorizzano uno snapshot delle stat al momento del salvataggio — un aggiornamento dati non le ricalcola finché non si ri-seleziona la parte.
- **Navigazione**: niente react-navigation. `src/store/uiStore.ts` (`activeTab` scoreboard/builder + `activeBuilderTab`, persist key `beybladex-ui`); `App.tsx` fa lock orientamento per-tab (scoreboard=LANDSCAPE, builder=PORTRAIT) via `useEffect([isBuilder])`.
- **UI** (`src/features/builder/`): `BuilderShell.tsx` (header + tab bar 4 voci) + `components/` (RadarChart 3 assi su `react-native-svg`, PartPicker, PartCard, StatBar, GradientButton, FilterChipRow, CollectionGridItem — niente `react-native-paper`, niente immagini, icone = emoji) + `stores/` (builder/combo/deck/collection/filter, persist key `beybladex-builder-*`; collection `ownedIds` Set↔Array; deck con regola WBO no-duplicati `validateNoDuplicateParts`) + `screens/` (Parts/Builder/Decks/Collection). Componenti portati da `bbxdeckbuild` adattati allo schema canonico (`type`/`line`, 3 assi).
- **i18n**: namespace `builder.*` in `packages/shared/src/i18n/translations.ts` (it+en).
- **Nuova dipendenza nativa**: `react-native-svg` (radar) → richiede build nativa (`full-build-apk.sh`), non basta OTA.

## Monetizzazione (AdMob + RevenueCat)

- **AdMob**: banner nella VictoryOverlay, SDK `react-native-google-mobile-ads`
- **RevenueCat**: acquisto one-time "rimuovi pubblicità", SDK `react-native-purchases`
- **Config**: `packages/mobile/src/config/ads.ts` (ad unit IDs, `isAdsRemoved()`)
- **Store acquisti**: `packages/mobile/src/store/purchases-store.ts`

**REGOLA CRITICA — Plugin AdMob in app.json**: i parametri usano **camelCase** (`androidAppId`), NON snake_case (`android_app_id`). Verificare SEMPRE i nomi parametri nel sorgente del plugin (`node_modules/react-native-google-mobile-ads/plugin/src/index.ts`) prima di configurare.

**REGOLA CRITICA — Permission AD_ID in app.json**: poiché l'app dichiara in Play Console (App content > Advertising ID) di usare l'advertising ID per AdMob, il manifest **deve** contenere `com.google.android.gms.permission.AD_ID` (richiesto da Android 13+). In `app.json`:
```json
"android": { "permissions": ["com.google.android.gms.permission.AD_ID"] }
```
Senza questa permission, Play Console blocca la pubblicazione con errore *"manifest doesn't include AD_ID permission"*. Verificare che resti dopo `expo prebuild --clean`.

**Verifica AD_ID nell'AAB (NON fidarsi del grep)**: contare la stringa `AD_ID` nel manifest proto dell'AAB NON dimostra che la permission sia attiva (potrebbe essere in `tools:node="remove"` o nel pool stringhe). Verifica corretta: generare l'APK universale e leggere le permission reali.
```bash
java -jar bundletool.jar build-apks --bundle=app.aab --output=out.apks --mode=universal --overwrite
unzip -o out.apks universal.apk -d extracted
aapt2 dump permissions extracted/universal.apk   # deve elencare com.google.android.gms.permission.AD_ID
```
bundletool: scaricare il jar da GitHub releases (non è nell'SDK). aapt2 in `$ANDROID_SDK/build-tools/<ver>/aapt2.exe`.

**Errore AD_ID in review quando l'AAB È corretto**: se l'AAB nuovo ha davvero la permission (verificato con bundletool) ma Play Console mostra comunque l'errore bloccante, l'errore riguarda il bundle **precedente ancora live** (costruito senza la permission). In quel caso *"Release without permission"* è **sicuro**: NON rimuove la permission dall'AAB nuovo (che la mantiene), bypassa solo il controllo relativo al vecchio artifact. La dichiarazione Advertising ID resta su "Yes". Da NON fare se invece l'AAB nuovo non ha la permission (lì l'ad id verrebbe azzerato → AdMob rotto).

**expo-audio aggiunge permission in autolinking**: l'SDK expo-audio inietta nel manifest `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MEDIA_PLAYBACK` anche se l'app fa solo playback. Non bloccano la pubblicazione, ma `RECORD_AUDIO` è sensibile: se Play Console ne chiede la motivazione, rimuoverla via config del plugin.

**ID test** (sostituzione con gli ID reali tracciata come known issue in `projects/scoreboard.md`):
- App ID AdMob: `ca-app-pub-3940256099942544~3347511713` (in `app.json`)
- Ad unit ID: `TestIds.ADAPTIVE_BANNER` in dev (in `src/config/ads.ts`)
- RevenueCat API key: `goog_XXXX` placeholder (in `src/store/purchases-store.ts`)

## Play Store & ASO

- Best practice ASO 2026 (riferimento + draft Custom Store Listing): **`packages/mobile/store/aso-best-practices-2026.md`**
- Guida operativa pubblicazione: **`packages/mobile/store/play-store-guide.md`**
- Listing markdown da copiare in Play Console: **`packages/mobile/store/listing-en.md`**, **`packages/mobile/store/listing-it.md`**

**Categoria target**: Game > Sports (allineata ai competitor Beyblade sul Play Store).

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: build locale AAB + upload manuale su Play Console

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE usare `yarn install` dalla root (NON npm install nei singoli package)
- Per modifiche logica di gioco: modificare `shared`, poi adattare UI in web e mobile
- EAS build DEVE essere lanciato da `packages/mobile` (NON dalla root)
