---
name: scoreboard
status: active
updated: 22/06/2026
health: green
next-step: "v20 (banner invito beta) in review su Production; resta da sostituire gli ID test AdMob/RevenueCat con quelli reali"
blocked-by: null
current-plan: null
main-doc: .claude/CLAUDE.md
---

# Scoreboard — app segnapunti Beyblade X

## Scope

L'app segnapunti vera e propria (web + mobile) e la logica di gioco condivisa in `packages/shared`: punteggio, falli, schermata vittoria, font dinamico, countdown audio, modali, impostazioni. Include come feature trasversali la monetizzazione (AdMob + RevenueCat), la pipeline di build/release Android e l'ASO/store listing. Il Combo Builder è tracciato a parte in [[combo-builder]], le statistiche/selezione Bey in [[combo-stats]].

## Backlog

<!-- Idee, feature, task non avviati. Formato: `- gg/mm/aaaa — testo` -->

## Known issues

- 08/04/2026 — ID test AdMob (App ID, ad unit) e RevenueCat API key sono ancora placeholder/test: sostituirli con quelli reali prima del rilascio (`src/config/ads.ts`, `src/store/purchases-store.ts`).
- 10/06/2026 — expo-audio inietta in autolinking la permission sensibile `RECORD_AUDIO` (più `MODIFY_AUDIO_SETTINGS`, `FOREGROUND_SERVICE*`) anche se l'app fa solo playback: da rimuovere via config del plugin se Play Console ne chiede la motivazione.
- 22/06/2026 — Play Console segnala API edge-to-edge deprecate (Android 15): le chiamate vengono dalle dipendenze (React Native core `StatusBarModule`/`WindowUtilKt`, lib `react-native-edge-to-edge` di zoontek, AdMob `gms.ads`), NON dal codice app (che usa già `SystemBars`). Non bloccante (solo deprecazione, API ancora funzionanti). Risolvibile solo aggiornando RN/edge-to-edge/AdMob quando migreranno via dalle API deprecate; richiede regressione completa.

## In progress

- 20/06/2026 — Video YouTube promozionale: slide generate con pptxgenjs (strumenti, costi, metodo), copertina smartphone stilizzato; mockup in `packages/mobile/mockups/` (non tracciato).

## Changelog

<!-- Cose completate, dalla più recente. Formato: `- gg/mm/aaaa — testo` -->
- 22/06/2026 — Banner in-app (modale bloccante, una sola volta dopo 20 partite completate) che invita gli utenti al beta-testing della beta combo; toggle `BETA_INVITE_ENABLED` (off a beta finita). Pubblicato in Production v20 (full rollout, in review). Riga "beta" anche nelle descrizioni Store (`listing-{en,it}.md`).
- 21/06/2026 — Promemoria "cambia lato" ogni 3 lanci (banner auto-dismiss, disattivabile da messaggio o impostazioni) + localizzazione completa UI it/en (audit stringhe hardcoded) e nomi giocatore localizzati (v18, in review).
- 19/06/2026 — ASO: listing Play Store ottimizzato (best practice 2026), screenshot marketing, custom listing Beyblade.
- 10/06/2026 — Countdown vocale 3-2-1 + modali bilingui (v17).
- 05/06/2026 — Icona minimale, invito recensione dopo 10 partite, annunci non personalizzati per minori (v16).
- 12/05/2026 — Reset trofei reso scopribile (vedi plans/reset-trofei-rendere-la-funzione-scopribile-2026-05-12-1129.md).
- 08/04/2026 — Monetizzazione: banner AdMob nella schermata vittoria + RevenueCat rimozione pubblicità (vedi plans/piano-banner-ad-nella-schermata-vittoria-2026-04-08-0954.md).
- 25/03/2026 — Fix warning Play Console (edge-to-edge deprecato, orientation).
- 24/03/2026 — Win score illimitato (max 999) con font dinamico.
- 21/02/2026 — Contatore falli.
- 05/02/2026 — Migrazione a monorepo React Native (web + mobile + shared).
- 31/01/2026 — MVP score tracker.
