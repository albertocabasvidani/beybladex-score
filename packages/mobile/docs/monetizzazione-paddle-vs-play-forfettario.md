# Monetizzazione app — Paddle vs Google Play in regime forfettario

**Data**: 01/07/2026
**Contesto**: Beyblade Score (Android, Google Play). Sviluppatore in **regime forfettario**.
**Obiettivo**: monetizzare (abbonamenti / acquisti) **senza dover emettere una fattura a ogni pagamento o rinnovo**, minimizzando gli adempimenti fiscali.

> Nota: questo documento è un'analisi operativa e di indirizzo, non consulenza fiscale. I punti marcati come "da confermare" vanno validati col commercialista. Google stessa dichiara di non fornire consulenza fiscale.

---

## 1. Sintesi (conclusione in testa)

- **Google Play è già un Merchant of Record (MoR)** per le vendite di contenuti digitali ai consumatori UE: incassa dal cliente, gestisce l'IVA verso il consumatore, e paga allo sviluppatore il **netto una volta al mese**. Non si emette fattura al cliente finale.
- L'obiettivo "niente fatture a ogni pagamento" **è quindi già risolto da Google Play**: non serve Paddle per ottenerlo.
- **Paddle serve solo per un canale di vendita web** fuori dallo store (es. sblocco premium comprato dal sito). Come MoR fa lo stesso lavoro, ma per un forfettario **non semplifica: probabilmente complica** (vedi §4).
- **Raccomandazione**: restare su **Google Play Billing (via RevenueCat)** per la monetizzazione in-app. Valutare Paddle solo se e quando si apre un canale web separato.

---

## 2. Come funziona il Merchant of Record di Google Play

Per gli acquisti di contenuti digitali (app, acquisti in-app, abbonamenti) effettuati da consumatori UE/SEE con il billing di Google Play:

1. **Google è il merchant of record**: incassa dal cliente finale, determina/addebita/versa l'IVA nel Paese del consumatore (regime OSS). Fonte ufficiale Google: *"Google is responsible for determining, charging, and remitting VAT for all Google Play Store purchases of digital content... by EU customers."*
2. **Nessuna fattura al cliente finale**: il consumatore non è cliente tuo ai fini fiscali, è cliente di Google.
3. **Pagamento aggregato mensile**: payout a partire dal **~15 del mese** per le vendite del mese precedente, già al **netto** della commissione Google e dell'IVA trattenuta e versata da Google. Bonifico in pochi giorni.

Risultato: **nessuna fattura per singolo rinnovo da pochi euro**. Incassi aggregati mensili.

---

## 3. Trattamento in regime forfettario

Vanno distinte due facce: l'**incasso** (vendite) e il **costo** (commissione/servizi acquistati). È sulla seconda che il forfettario ha lo svantaggio noto.

### 3a. Incasso dalle vendite (lato ricavi)

- Rapporto **B2B verso Google Irlanda**: lo store si sostituisce agli utenti finali e gestisce l'IVA verso i consumatori (OSS).
- Operazione **non imponibile in Italia (art. 7-ter)**: nessuna IVA a carico dello sviluppatore.
- **Coefficiente di redditività 67%** (sviluppo software); il fatturato concorre alla **soglia degli 85.000 €**.
- Adempimento **aggregato, non per pagamento**: comunicazione periodica delle operazioni verso Google Irlanda (**esterometro / elenco riepilogativo**, plausibilmente con **iscrizione VIES**). Mensile, non a ogni transazione.

### 3b. Costo — la commissione dello store (lato acquisti)

- Regola generale del forfettario: quando **acquisti un servizio fatturato da una società UE/estera** (es. Google Ads, SaaS), scatta il **reverse charge** (integrazione/autofattura, codice **TD17**) con **versamento del 22% di IVA** tramite F24 (cod. 6493, entro il 16 del mese successivo). Da forfettario **l'IVA non è detraibile** → è un **costo vivo**.
- **Su Google Play la commissione è trattenuta a monte** (ti pagano già il netto): non arriva una fattura di commissione separata. Nell'interpretazione prevalente (store che "compra" da te) **non scatta reverse charge sulla commissione**. *(da confermare col commercialista)*

---

## 4. Confronto con Paddle (per un forfettario)

| Aspetto | **Google Play** | **Paddle** |
|---|---|---|
| Merchant of Record | Sì (UE/SEE) | Sì |
| Fatture ai clienti finali | No | No |
| Sede controparte | Google Irlanda (UE) | Estera (UK, **extra-UE**) |
| Canale | Dentro l'app / store | **Web** (checkout esterno) |
| Commissione | Trattenuta a monte, netta → di norma **niente reverse charge** | **Fatturata come servizio** → **reverse charge + 22% IVA non detraibile** a tuo carico |
| Payout | Mensile (~15) | Periodico |

**Punto chiave**: entrambi risolvono il "niente fatture ai clienti". Ma **Paddle aggiunge** al forfettario un rapporto extra-UE e, soprattutto, una **fee fatturata** che ricade nel caso classico di reverse charge (22% IVA non detraibile). Quindi per un forfettario **Paddle non è più semplice di Google Play**: è potenzialmente più oneroso e più adempimenti.

---

## 5. Raccomandazione

1. **Monetizzazione in-app (Play Store)** → **Google Play Billing via RevenueCat** (già configurato nel progetto). È già il modello MoR cercato: zero fatture ai clienti, IVA gestita da Google, payout mensile netto.
2. **Paddle** → considerarlo **solo** per un eventuale canale di vendita **web** parallelo (pattern app-to-web), non come sostituto dell'IAP. Tenere presente il costo reverse charge sulla sua fee.
3. **Non introdurre Paddle** con l'unico scopo di evitare le fatture: quel beneficio ce l'hai già con Google Play.

---

## 6. Da confermare col commercialista

Punti con interpretazioni divergenti tra professionisti — portare questi due temi:

- **Natura dell'incasso**: gestione come prestazione **non imponibile art. 7-ter** verso Google Irlanda; se serve **iscrizione VIES**; se emettere un documento/fattura verso Google o gestire tutto in **esterometro / elenco riepilogativo**.
- **Trattamento della commissione** Google Play: conferma che, essendo trattenuta a monte, **non** genera reverse charge (diversamente da Google Ads).
- **Flusso AdMob** (pubblicità): stream separato — servizio pubblicitario reso a Google Irlanda (art. 7-ter/esterometro), trattamento distinto dagli abbonamenti.

---

## 7. Fonti

- [Google Play — Tax rates and VAT (Play Console Help)](https://support.google.com/googleplay/android-developer/answer/138000?hl=en)
- [Google Play — Understanding your tax responsibilities](https://support.google.com/googleplay/android-developer/answer/16408159?hl=en)
- [Google — Merchant payout schedule](https://support.google.com/paymentscenter/answer/7159355?hl=en)
- [Google Play — Order processing and payouts](https://support.google.com/googleplay/android-developer/answer/137997?hl=en)
- [Paddle — In-App Purchase](https://www.paddle.com/in-app-purchase)
- [RevenueCat — App-to-web purchase guidelines](https://www.revenuecat.com/blog/engineering/app-to-web-purchase-guidelines/)
- [Fiscomania — Vendita di applicazioni sul Web: tassazione](https://fiscomania.com/vendita-applicazioni-sul-web-guida-fiscale/)
- [Fiscomania — Reverse charge nel regime forfettario](https://fiscomania.com/reverse-charge-nel-regime-forfettario/)
- [Regime-forfettario.it — Acquisti all'estero e reverse charge](https://www.regime-forfettario.it/acquisti-allestero-come-funziona-liva-in-reverse-charge-nel-regime-forfettario/)
- [Fatture in Cloud — Forfettari e fattura estera UE/ExtraUE](https://www.fattureincloud.it/guida-regime-forfettario/fattura-estera/)
