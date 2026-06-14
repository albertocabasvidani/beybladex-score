# ASO Best Practices 2026 — Google Play Store

> Riferimento operativo per ottimizzare il posizionamento di **Beyblade X Score** sul Google Play Store.
> Focus: **Google Play** (no iOS).
> Ultimo aggiornamento: maggio 2026.

---

## TL;DR — I 5 fattori più importanti per il ranking 2026

1. **Titolo** — campo a maggior peso ASO. 30 char, keyword principale all'inizio.
2. **Short description** — secondo campo per importanza; secondo dati 2026 traina l'84% dei miglioramenti di ranking sulle keyword.
3. **Engagement & retention** — Android Vitals + uninstall rate. L'install volume puro pesa meno di prima.
4. **Visual conversion** — i primi 3 screenshot decidono il 90% degli install.
5. **Recensioni** — target medio ≥4.0; risposta entro 24-48h ai negativi.

---

## 1. Metadata

### Titolo (max 30 char)
- Campo più importante per il ranking
- Keyword principale all'inizio
- Evita stuffing: Google penalizza titoli "promotional" o ripetitivi
- Mantieni leggibilità e brand identity

**Esempio Beyblade X Score**: `Beyblade X Score Tracker` (24 char — keyword brand + intent)

### Short description (max 80 char)
- Secondo campo a maggior peso per ranking
- Deve spiegare il **valore**, non solo le feature
- Deve contenere la keyword target principale
- È il primo testo che l'utente legge in search e browse

**Esempio Beyblade X Score**: `Beyblade X score tracker for blader battles — Spin, Burst, Over, Xtreme!`

### Long description (max 4000 char)
- Supporta l'indexing: Google Play crawla l'intero testo
- Densità keyword target: ~1 menzione naturale ogni 250 char
- Struttura "Story Flow": problema → soluzione → trust → CTA
- Emoji come ancore visive (non spam)
- Sinonimi e keyword secondarie: varietà > ripetizione
- Sezioni con bullet point: feature, use case, privacy, monetizzazione, social proof

### Keyword research
- Search del Play Store mobile + autocomplete = fonte gratuita più affidabile
- Cerca middle-tail keyword (più realistiche da rankare per app di nicchia)
- Tool gratuiti: Google Play search autocomplete, Search Ads keyword planner
- Tool a pagamento: Apptweak, MobileAction, ASOMobile, AppRadar

**Keyword target Beyblade X Score**:
- Primary: `beyblade x`, `beyblade`, `score tracker`, `segnapunti`
- Secondary: `blader`, `battle`, `finish`, `tournament`, `landscape scorekeeper`

---

## 2. Visual Assets

### Icona (512x512)
- Riconoscibile a piccole dimensioni
- Niente testo (illeggibile in miniatura)
- Colori contrastanti rispetto allo sfondo Play Store (bianco)
- Coerente con feature graphic e screenshot

### Feature Graphic (1024x500)
- Posizioni d'uso: top della listing, search, browse, raccolte editoriali
- Include nome app + value prop visiva
- Niente elementi critici nelle aree esterne (Play Store può croppare)
- A/B testabile via Store Listing Experiments

### Screenshot
- Specifica tecnica 2026: **1080x2400 px** (telefoni moderni)
- I primi 1-3 determinano il 90% della decisione install
- Pattern vincente "Story Flow": problema → soluzione → trust
- Caption testuale max **20%** dell'area screenshot
- Mostra l'app **in uso + benefit**, non solo screen statici
- Almeno 4, idealmente 6-8

**Suggerimento per Beyblade X Score**:
1. Match in corso con scoreboard visibile next to "stadium implicito" — caption: "Real Beyblade X scoring"
2. I 4 tipi di finish evidenziati — caption: "All 4 finish types, one tap"
3. Vittoria con celebration overlay — caption: "Celebrate every win"
4. Setup partita con nomi giocatori — caption: "Tournament-ready"

---

## 3. Categoria

### App vs Game (decisione strutturale)
- Per **Beyblade X Score**: **Game** — 5 su 6 app companion Beyblade sul Play Store sono categorizzate come Game, è il flusso di discovery dei blader.

### Sottocategoria
- **Game > Sports** (scelta): allineato a competitor + meno affollato di Casual
- Alternative: Casual, Board

### Tags (max 5)
- Lista predefinita Google, varia per categoria
- Scegli SOLO tag che descrivono onestamente l'app
- Meglio 3 tag pertinenti che 5 forzati
- I tag impattano discovery in browse, non search diretta

---

## 4. Custom Store Listings (CSL)

### Cosa sono
Fino a **50 versioni alternative** della scheda Play Store. Ogni versione può avere titolo, icona, descrizioni, screenshot, feature graphic diversi.

### Trigger (3 tipi)
1. **Per paese/lingua** — listing dedicata per ogni mercato (es. variante Giappone dove la cultura Beyblade è forte)
2. **Per URL di install** — deep link che porta a una listing custom (es. campagne social, YouTube, advertising)
3. **🔥 Per keyword di ricerca** — listing mostrata quando l'utente cerca termini specifici — *l'opzione più potente per ASO*

### Best practice
- Inizia con 1 custom listing keyword-based sulla keyword brand più forte (per noi: `beyblade`)
- Misura conversion vs default (Play Console mostra metriche per listing)
- Mantieni coerenza con il prodotto reale: niente bait-and-switch (rischio policy)
- È **gratis** ed è dentro Play Console

### Draft per Beyblade X Score — keyword "beyblade"

**Titolo (max 30 char)**:
```
Beyblade X Score Tracker
```
*(stesso del default — già ottimo)*

**Short description (max 80 char)**:
```
The Beyblade X scorekeeper made by bladers, for bladers. Let it rip!
```
*(67 char. Più emotional/community-driven, meno tecnico — chi cerca "beyblade" conosce già il franchise.)*

**Long description (max 4000 char)**:
```
Made by bladers, for bladers.

If you've ever lost track of points in a heated Beyblade X battle — Spin, Burst, Over, Xtreme — this is the scorekeeper you've been looking for.

Beyblade X Score Tracker is the landscape-first scoreboard built around real Beyblade X tournament rules. One tap per finish, instant point updates, no clutter.

⚡ ZERO-FRICTION SCORING
• Spin Finish — 1 point, one tap
• Burst Finish — 2 points, animated
• Over Finish — 2 points, instant
• Xtreme Finish — 3 points, with celebration

⚔️ TOURNAMENT-READY
Customizable win score (3 to 10), editable blader names for bracket play, undo for honest battles, and a quick reset between matches. The app stays out of your way while you focus on the launch.

📱 LANDSCAPE-NATIVE
Designed to live next to your stadium, not on top of your game. No portrait mode, no pop-ups, no nonsense.

🌍 OFFLINE + PRIVATE
Works fully offline. No account, no data sent anywhere. Your battle log stays on your device.

💎 FREE
Free to download, supported by a single banner ad with an optional one-time purchase to go ad-free.

Built by a Beyblade X fan tired of paper scoreboards. Let it rip — and let the app keep score.
```

### Come creare una CSL in Play Console
1. **Grow > Store presence > Custom store listings**
2. Click **"Create listing"**
3. Tipo: **"Targeted by search keyword"** (per il draft sopra)
4. Keyword: `beyblade`
5. Compila Title / Short / Long / asset visivi (puoi riutilizzare i default per gli asset visivi all'inizio)
6. **Save & publish**
7. Monitora performance in **Play Console > Acquisition reports** (filtri per listing)

---

## 5. Localizzazione

- Traduci la listing per ogni lingua target, non solo i testi nell'app
- Le Custom Store Listings per paese permettono variazioni più profonde di una semplice traduzione
- Mercati ad alta affinità Beyblade da considerare per priorità:
  - Italia (default IT)
  - USA/UK (EN)
  - Giappone (JA) — culla del Beyblade
  - Spagna, Messico (ES) — community attive
  - Brasile (PT-BR) — community in crescita

---

## 6. Ratings & Reviews

- Target medio **≥4.0** per qualificare per featured/raccolte editoriali
- Rispondi ai negativi entro **24-48h**, niente template generici — riconosci il problema, indica un fix
- Chi riceve risposta personalizzata tende ad aggiornare rating al rialzo
- Implementa in-app review prompt al momento giusto (dopo una vittoria celebrata, NON al primo avvio)
- Usa `expo-store-review` o equivalente

---

## 7. Engagement & Android Vitals

L'algoritmo 2026 ha spostato peso da "install volume" a "engagement & retention". Penalizzazioni significative per:
- ANR (App Not Responding) rate alto
- Crash rate su startup
- Battery drain percepito
- Tempi di avvio lenti (cold start > 5s)
- Disinstallazione entro 24h dall'install

**Dove monitorare**: Play Console > Quality > **Android Vitals**.
**Soglia critica**: Bad behavior threshold (mostrato da Google) — sopra questa soglia la visibilità in search/browse cala.

---

## 8. A/B Testing — Store Listing Experiments

Built-in in Play Console, **gratis**. Permette test di:
- Icon
- Feature graphic
- Screenshot
- Short description
- Long description
- Localized listings (per lingua/paese)

### Process
1. **Grow > Store listing experiments > Create experiment**
2. Scegli l'asset da testare — **un attributo alla volta** per chiarezza statistica
3. Traffic split: 50/50 (o variabile)
4. Attendi significatività statistica (di solito 2-4 settimane, dipende dal traffico)
5. Pubblica la variante vincente

### Prima cosa da testare per Beyblade X Score
- **Screenshot 1** (primo impatto). Varianti:
  - A — "feature-focused": "Track 4 finish types"
  - B — "outcome-focused": "Win every Beyblade X battle"
- Aspettativa: la versione outcome-focused converte meglio (pattern 2026 confermato in più verticali)

---

## 9. Monetizzazione & Trasparenza

- **Dichiara onestamente** ads + IAP in listing (sezione "Monetizzazione" della long description)
- **Data Safety** deve riflettere AdMob (Advertising ID, raccolta dati per pubblicità personalizzata)
- **Ads Declaration**: sì se l'app contiene ads (AdMob banner)
- **Inconsistenza** dichiarata vs reale = rischio sospensione/rimozione app

### Stato attuale Beyblade X Score
- AdMob attivo (banner in VictoryOverlay) → **Sì ads**
- RevenueCat IAP "remove ads" → **Sì IAP**
- ⚠️ `privacy-policy.md` va aggiornato per dichiarare AdMob come Third-Party Service

---

## Stato implementazione (14/06/2026)

Audit completo della scheda live + interventi su Play Console (inviati per review):

- **Screenshot Default (en-US, mondo)**: erano **2 grezzi** → sostituiti con **5 screenshot di marketing** 1920×1080 con caption story-flow EN. È il fix a maggior impatto sui click (la default serviva 16.475 visitatori con conv. 3,3% e soli 2 screenshot).
- **Screenshot it-IT (Italia)**: erano **4 grezzi** → sostituiti con **5 screenshot** con caption in italiano.
- **Custom Store Listing "beyblade"** (keyword globale): aveva **lingua default = Italiano** (errore: utenti non-IT vedevano contenuti IT; conv. 2,3% < 3,3% della default) → **lingua default cambiata a English (US)**, IT mantenuto come traduzione. Screenshot ereditati dalla default (ora ottimizzati).
- **Lingue**: confermato setup corretto — **en-US default (mondo) + it-IT (Italia)** sia su default che custom listing.
- **Keyword**: tutte le primarie/secondarie del piano già presenti in titolo/short/full (EN e IT). `scoreboard`/`tabellone` aggiunti come candidati per il prossimo update descrizione (vedi listing-en/it.md).
- **Store Listing Experiment** "Screenshot 1 - feature vs outcome": resta **draft non avviato** — gli asset sono cambiati; rivalutare quando i nuovi screenshot sono live.
- Asset/script screenshot versionati in `marketing-screenshots/`.

## Checklist deployment ottimizzato

- [ ] Titolo include keyword principale all'inizio (≤30 char)
- [ ] Short description include keyword + value prop (≤80 char)
- [ ] Long description con densità keyword ~1/250 char e story flow
- [ ] Categoria: **Game > Sports**
- [ ] Tags scelti onestamente (3-5)
- [ ] 4-8 screenshot 1080x2400 con story flow
- [ ] Feature graphic 1024x500 con value prop visiva
- [ ] Icona 512x512 leggibile in piccolo
- [ ] Privacy policy URL valida e accurata (include AdMob)
- [ ] Data Safety: dichiarata raccolta Advertising ID
- [ ] Ads Declaration: **Sì**
- [ ] Content Rating: rifatto come Game
- [ ] Localizzazione: IT + EN minimo
- [ ] Custom Store Listing "beyblade" creata (draft in §4)
- [ ] Store Listing Experiment attivo (test screenshot 1)
- [ ] Risposta a review entro 24-48h
- [ ] Monitoraggio Android Vitals settimanale

---

## Fonti

- [ASOMobile — App Listings in Google Play 2026](https://asomobile.net/en/blog/app-listings-in-google-play-2026/)
- [ASOMobile — ASO in 2026: Complete Guide](https://asomobile.net/en/blog/aso-in-2026-the-complete-guide-to-app-optimization/)
- [Apptweak — Top Google Play ranking factors 2026](https://www.apptweak.com/en/aso-blog/google-play-ranking-factors)
- [Apptweak — Google Play keyword research 2026](https://www.apptweak.com/en/aso-blog/play-store-keyword-research)
- [Apptweak — Custom Store Listings guide](https://www.apptweak.com/en/aso-blog/what-are-custom-store-listings-and-how-to-use-them)
- [MobileAction — Custom store listings 2026](https://www.mobileaction.co/blog/custom-store-listings-on-google-play/)
- [MobileAction — Google Play ranking factors](https://www.mobileaction.co/blog/google-play-store-ranking-factors/)
- [Moburst — App Store Optimization 2026 Guide](https://www.moburst.com/blog/app-store-optimization-guide/)
- [Phiture — Master Google Play Custom Store Listings](https://phiture.com/asostack/google-play-custom-store-listings/)
- [ScreenshotWhale — Feature Graphic 2026](https://screenshotwhale.com/blog/google-play-feature-graphic)
- [AppLaunchpad — Google Play Screenshot Guidelines 2026](https://theapplaunchpad.com/blog/google-play-store-screenshot-guidelines)
- [Google Play Console Help — App Discovery and Ranking](https://support.google.com/googleplay/android-developer/answer/9958766)
- [Google Play Console Help — Choose category and tags](https://support.google.com/googleplay/android-developer/answer/9859673)
- [Google Play Console Help — Custom store listings](https://support.google.com/googleplay/android-developer/answer/9867158)
