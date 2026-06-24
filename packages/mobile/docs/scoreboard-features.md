# Scoreboard — dettagli feature

## Audio countdown (expo-audio)

Pulsante pill "▶ 3·2·1" al centro della bottom bar: `CountdownButton.tsx` + hook `useCountdownAudio.ts`. File audio: `assets/sounds/countdown-{it,en}.mp3`, forniti dall'utente (generati con ElevenLabs, 06/2026). Fallback TTS per rigenerarli: `bash packages/mobile/scripts/generate-countdown-audio.sh` (richiede `ELEVENLABS_API_KEY` nel `.env`; voci Davide IT / Charlie EN, pause `PAUSE_NUM`/`PAUSE_FINAL`, segmenti cachati in `tmp/countdown-tts`). Sovrascrive i file dell'utente: usare solo se servono nuove versioni.

**Gotcha critici** (dettagli generali in `~/.claude/rules/react-native-android.md`):
- `scripts/metro-bundle.js` deve mantenere il blocco `saveAssets` + normalizzazione `httpServerLocation`: senza, gli asset Metro non finiscono nell'APK o hanno nome risorsa sbagliato (monorepo) → `Resource not found` solo in release.
- `useCountdownAudio.ts` costruisce l'URI `android.resource://com.beybladex.score/raw/<nome>` in release (il nome risorsa nudo non è riproducibile da ExoPlayer). La costante `ANDROID_PACKAGE` deve combaciare con `android.package` di `app.json`.
- Verificare gli asset nell'APK con `aapt2 dump resources` (NON `unzip -l`: `optimizeReleaseResources` offusca i path).
- Cambiando SOLO gli mp3, la build incrementale lascia `createBundleReleaseJsAndAssets` UP-TO-DATE (gli asset non sono input tracciati) e l'APK esce con gli audio vecchi: cancellare prima `C:/projects/beybladex/packages/mobile/android/app/build/generated/{assets,res}/createBundleReleaseJsAndAssets`.

## Promemoria cambio lato

Banner non bloccante "Avete cambiato lato?" (`src/components/game/SideSwitchReminder.tsx`) mostrato ogni 3 **lanci** a fine animazione punti, auto-dismiss ~4s, tap per chiudere, link "Non mostrare più". Flag `sideSwitchReminderEnabled` (default ON, persistito in `game-store.ts`); toggle in `SettingsModal`. Trigger in `GameScreen.tsx`: alla transizione `currentAnimation` non-null→null, se `totalLanci % 3 === 0` e non c'è `winner` (sennò vince la `VictoryOverlay`). Conteggio lanci = `history.filter(h => h.type === 'score').length` (un "lancio" = un round con assegnazione punti; mai "battaglia").

## Banner invito beta

Flag `BETA_INVITE_ENABLED` in `featureFlags.ts`: toggle di **produzione**, NON gated da `__DEV__` (a differenza degli altri moduli feature-flagged). Modale bloccante una-tantum (`BetaInviteBanner.tsx`) che, dopo 20 partite completate, invita al Test aperto. Soglia `BETA_INVITE_THRESHOLD` e logica `shouldShowBetaInvite` nel `review-store`, che riusa il contatore `gamesCompleted`. A beta conclusa: mettere il flag a `false` e togliere la riga beta dai `store/listing-{en,it}.md`.

## i18n

Tutte le stringhe UI mobile passano per i18next (`t('chiave')`), zero hardcoded — verificato con audit. Chiavi in `packages/shared/src/i18n/translations.ts` (it+en); il web usa JSON separati in `packages/web/src/i18n/locales/`. Nomi default giocatore localizzati: `DEFAULT_PLAYER_NAMES`/`isDefaultPlayerName` in shared → `PlayerPanel`/`VictoryOverlay` mostrano `player.player1/2` finché il nome è ancora il default (l'editor parte vuoto con placeholder). `ErrorBoundary` è class component → usa `i18n.t` diretto, non l'hook. Release note in-app: a ogni release con novità, bumpare la chiave `hasSeenReleaseNote_v{N}` in `GameScreen.tsx` e aggiornare i testi `releaseNote.*`.
