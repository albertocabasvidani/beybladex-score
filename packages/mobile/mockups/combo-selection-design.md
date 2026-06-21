# Bozza design — Selezione combo & match tracking

**Stato**: bozza (non implementato) · **Data**: 19/06/2026
**Mockup interattivo**: [combo-selection.html](combo-selection.html) (servire via HTTP: `python -m http.server 8901 --directory packages/mobile/mockups`)

## Obiettivo

Aggiungere allo scoreboard la possibilità di associare a ogni giocatore la **Bey** che sta usando (Blade + Ratchet + Bit), così che ogni partita registrata diventi un dato di **win-rate per combo**. È il ponte tra lo scoreboard (superficie "nel momento della battaglia") e il **combo builder** (progetto separato, dove vivono la libreria combo e l'analisi).

## Posizionamento / razionale

- Il mercato companion/deck-builder è saturo e gratuito (Bey Companion, BeyDeck, BeyBattle Labs…). Non si compete lì.
- L'asset unico dello scoreboard è essere **aperto al tavolo durante il match**: nessun competitor cattura *quale combo ha vinto, nel momento del finish*. Quello è il dato proprietario.

## Principi UX

1. **Opzionale e non bloccante** — lo score funziona identico senza toccare la Bey. Il casual la ignora, zero attrito.
2. **Pagare il costo una volta** — in una sessione/torneo si giocano sempre le stesse combo: la selezione è 1 tap da uno "scaffale" personale, non data-entry ripetuto.
3. **Lo scaffale arriva dal combo builder** — comporre da 100+ parti è lavoro "da casa", sta nel builder. Lo scoreboard mostra solo *le tue Bey*.
4. **Modifica = swap di un pezzo, non rebuild** — al tavolo si cambia un Bit/Ratchet: si tocca solo il chip di quel pezzo.
5. **Niente icone decorative** — solo testo (nome combo + parti). Eventuali **immagini reali dei top** in futuro, dal builder; nessuna emoji segnaposto.

## Layout

- Header pannello: **nome + Bey sulla stessa riga** (`Marco · Dran Sword 3-60 F`) per risparmiare spazio verticale (landscape) e ingrandire il nome.
- Bey mostrata come tre chip tappabili: `[Blade] [Ratchet] [Bit]` (+ marcatore `★ var` se variante effimera).
- Aggancio vuoto: pill `+ Aggiungi Bey`.

## I tre flussi

1. **Pick da scaffale (caso 95%, 0-1 tap)** — tap su `+ Aggiungi Bey` → bottom sheet con "Le tue Bey" (dal builder) → 1 tap. Default: ricorda l'ultima del match precedente.
2. **Modifica al volo** — tap **solo sul chip del pezzo cambiato** → picker di quella parte → variante **effimera** (loggata comunque), con "Tieni nello scaffale" opzionale.
3. **Componi nuova / nome libero (caso raro)** — `+ Componi nuova` apre il modale a 3 pezzi; oppure campo testo libero come onramp a freddo (mappabile a combo strutturata dopo).

## Pattern del picker per tipo di pezzo

Vincolo chiave: **landscape-only** → la tastiera copre quasi tutto. La ricerca è secondaria (tap-to-focus, mai autofocus); il default è sfogliare.

- **Bit / Ratchet** (token corti, ~15-20): **griglia di chip** in una schermata, 1 tap, niente scroll. Recenti in cima.
- **Blade** (set grande, in crescita): **modale ricco** = ricerca tap-to-focus + filtri **Tipo** (Attack/Defense/Stamina/Balance) + **Recenti** + **griglia visiva** alfabetica (in futuro thumbnail reali). Lo scroller alfabetico è l'ultima risorsa, non il default.
- Surfacing per **recency + collezione** ("i tuoi pezzi") è ciò che rende l'azione abbastanza rapida da essere usata.

## Dipendenze dati (da definire)

- **Ponte col combo builder**: da lì arrivano (a) scaffale "Le tue Bey", (b) collezione "i pezzi che possiedo" per accorciare i picker, (c) dataset parti (nomi/tipi/immagini).
  - Opzioni: dataset parti condiviso (JSON) come primo passo; account/sync condiviso per la libreria personale come secondo.
- **Match → builder**: ogni partita loggata (combo di ciascun giocatore + finish) alimenta le win-rate. Direzione del flusso e storage da decidere.

## Modello free/paid (in valutazione)

Vedi nota di sessione. Orientamento: **input gratis ovunque** (protegge le recensioni dello scoreboard, genera dato e abitudine), **insight a pagamento** (storico completo, win-rate per combo/parte, head-to-head, cloud sync, deck illimitati) — preferibilmente nel combo builder, con un'unica entitlement "Bey Pro" via RevenueCat (già integrato) valida su entrambi i progetti. Affiliazione parti come baseline sempre attiva.

## Aperti / prossimi passi

- Modalità **deck 3-on-3** (3 Bey per giocatore, no parti duplicate → warning legalità solo in competitivo).
- Filtro **"solo i pezzi che possiedo"** nei picker.
- Thumbnail reali dei top dal builder al posto del testo.
- Definire il ponte dati (dataset condiviso vs sync account).
