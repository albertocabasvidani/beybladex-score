---
name: combo-builder
status: active
updated: 20/06/2026
health: green
next-step: "Rigenerare combos.json (accesso WBO) + decidere rilascio produzione"
blocked-by: null
current-plan: plans/piano-combo-builder-come-tab-nellapp-beyblade-scor-2026-06-19-1450.md
main-doc: .claude/CLAUDE.md
---

# Combo Builder — tab builder di combo/deck

## Scope

Builder di combo e deck come tab interna dello scoreboard, feature-flagged (`BUILDER_ENABLED = __DEV__`): ON in dev, OFF in release. Dati parti bundled offline (`bundled-parts.json`, registry 265 parti), radar stats ATK/DEF/STA, gestione deck (regola WBO no-duplicati) e collezione. Sync dati build-time dal sito combo finder. Fa parte dell'app [[scoreboard]].

## Backlog

<!-- Idee, feature, task non avviati. Formato: `- gg/mm/aaaa — testo` -->
- 20/06/2026 — Test E2E automatico sull'emulatore (casistiche / risultato atteso / procedura / reporting): prompt già definito; il modello CX/integrati è ora completo.
- 20/06/2026 — Rigenerare `combos.json` del sito combo (richiede accesso WBO, fetch bloccato da Cloudflare in headless): `npm run fetch:wbo` → `parse:wbo` → `score:combos` (+ `prune:combos` per rimuovere `shark-scale-7-60-operate`, mis-parse). Solo allora le combo a parte integrata da torneo compaiono sul sito.
- 20/06/2026 — Integrazione con lo scoreboard: alimentare la selezione combo dello scoreboard dal builder (visione del funnel). Cfr. [[scoreboard]].
- 19/06/2026 — Completare copertura stat dalle pagine Fandom dedicate (blade 97/105, bit 45/53, ratchet 27/35, main blade 15/22): verificare se gli scoperti sono mismatch di nome (recuperabili) o privi di dati sul wiki. Le parti scoperte degradano (badge "Stats non disponibili").
- 19/06/2026 — Decidere il rilascio in produzione: attualmente il tab è solo `__DEV__`, in release l'app resta identica allo scoreboard.

## Known issues

- 19/06/2026 — Combo/selezioni salvate memorizzano uno snapshot delle stat al momento del salvataggio: un aggiornamento dati non le ricalcola finché non si ri-seleziona la parte.

## In progress

<!-- Lavori in corso. Se collegati a un piano in plans/, linkalo. -->

## Changelog

<!-- Cose completate, dalla più recente. Formato: `- gg/mm/aaaa — testo` -->
- 20/06/2026 — Builder **data-driven** (niente toggle): `computeSlots` calcola gli slot dalla parte scelta; quelli non applicabili sono disabilitati. Supporta combo CX (5+1 slot), blade UX a ratchet integrato (Bullet Griffon…) e **Ratchet Integrated Bit** (Operate/Turbo, verificati su Fandom) — lo slot ratchet si disabilita. Deck misti BX/UX/CX. Lato sito combo: `Combo.ratchet` nullable, parser materializza le combo integrate (golden test 59/0). `operate`/`turbo` ricategorizzati come `integratedRatchet` nel master.
- 20/06/2026 — Combo Builder CX a 5+1 slot (lock chip/main blade/assist blade/over blade) — prima estensione, poi assorbita nel modello data-driven.
- 20/06/2026 — Radar e StatBar scalati dai massimi reali del dataset (`STAT_MAX_*`).
- 19/06/2026 — Sincronizzato registry con stat ATK/DEF/STA; sezione Combo Builder in CLAUDE.md aggiornata (stat popolate, non più differite).
- 19/06/2026 — Combo Builder introdotto come tab feature-flagged nello scoreboard (vedi plans/piano-combo-builder-come-tab-nellapp-beyblade-scor-2026-06-19-1450.md).
