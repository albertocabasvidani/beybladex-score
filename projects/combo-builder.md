---
name: combo-builder
status: active
updated: 20/06/2026
health: yellow
next-step: "Pianificare e completare le combo CX e CX Infinity (requisito minimo)"
blocked-by: null
current-plan: plans/piano-combo-builder-come-tab-nellapp-beyblade-scor-2026-06-19-1450.md
main-doc: .claude/CLAUDE.md
---

# Combo Builder — tab builder di combo/deck

## Scope

Builder di combo e deck come tab interna dello scoreboard, feature-flagged (`BUILDER_ENABLED = __DEV__`): ON in dev, OFF in release. Dati parti bundled offline (`bundled-parts.json`, registry 265 parti), radar stats ATK/DEF/STA, gestione deck (regola WBO no-duplicati) e collezione. Sync dati build-time dal sito combo finder. Fa parte dell'app [[scoreboard]].

## Backlog

<!-- Idee, feature, task non avviati. Formato: `- gg/mm/aaaa — testo` -->
- 20/06/2026 — **Modellare le combo CX e CX Infinity (requisito minimo, non rinviabile)**: oggi il builder costruisce solo BX/UX (blade+ratchet+bit). Mancano CX (lock chip + main blade + assist blade + ratchet + bit, + over blade per Expand), CX Infinity (da definire con precisione dalle fonti reali) e i blade a ratchet integrato. Servono slot variabili per linea + estensione di stat/radar e della regola WBO. Da pianificare PRIMA del test E2E.
- 20/06/2026 — Test E2E automatico sull'emulatore (casistiche / risultato atteso / procedura / reporting): prompt già definito; eseguire dopo il completamento del modello CX.
- 20/06/2026 — Integrazione con lo scoreboard: alimentare la selezione combo dello scoreboard dal builder (visione del funnel). Cfr. [[scoreboard]].
- 19/06/2026 — Completare copertura stat dalle pagine Fandom dedicate (blade 97/105, bit 45/53, ratchet 27/35, main blade 15/22): verificare se gli scoperti sono mismatch di nome (recuperabili) o privi di dati sul wiki. Le parti scoperte degradano (badge "Stats non disponibili").
- 19/06/2026 — Decidere il rilascio in produzione: attualmente il tab è solo `__DEV__`, in release l'app resta identica allo scoreboard.

## Known issues

- 20/06/2026 — Il builder modella solo combo BX/UX (blade+ratchet+bit): le combo CX, CX Infinity e i blade a ratchet integrato non sono costruibili oggi (vedi Backlog — requisito minimo da chiudere).
- 19/06/2026 — Combo/selezioni salvate memorizzano uno snapshot delle stat al momento del salvataggio: un aggiornamento dati non le ricalcola finché non si ri-seleziona la parte.

## In progress

<!-- Lavori in corso. Se collegati a un piano in plans/, linkalo. -->

## Changelog

<!-- Cose completate, dalla più recente. Formato: `- gg/mm/aaaa — testo` -->
- 20/06/2026 — Radar e StatBar scalati dai massimi reali del dataset (`STAT_MAX_*`).
- 19/06/2026 — Sincronizzato registry con stat ATK/DEF/STA; sezione Combo Builder in CLAUDE.md aggiornata (stat popolate, non più differite).
- 19/06/2026 — Combo Builder introdotto come tab feature-flagged nello scoreboard (vedi plans/piano-combo-builder-come-tab-nellapp-beyblade-scor-2026-06-19-1450.md).
