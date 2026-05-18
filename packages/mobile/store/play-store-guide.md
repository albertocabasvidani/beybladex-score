# Guida: Pubblicare Beyblade X Score su Google Play Store

> 📚 **Best practice ASO 2026**: prima di compilare la listing leggi **`aso-best-practices-2026.md`** — contiene il razionale per titolo, short description, categoria, draft di Custom Store Listing e le fonti aggiornate.
> 📝 **Testi listing**: copy ottimizzato in **`listing-it.md`** (default IT) e **`listing-en.md`** (EN).

## Prerequisiti

- Account Google (Gmail)
- Carta di credito/debito (per la fee di 25$)
- File AAB (generato con EAS build production)

---

## Step 1: Creare Account Google Play Developer

1. Vai su https://play.google.com/console/signup
2. Accetta i termini di servizio
3. Paga la fee una tantum di **25$**
4. Completa la verifica dell'identità (richiede documento)
5. Attendi l'approvazione (di solito poche ore, max 48h)

---

## Step 2: Creare l'App nella Console

1. Vai su https://play.google.com/console
2. Clicca **"Crea app"**
3. Compila:
   - **Nome app**: `Beyblade X Score`
   - **Lingua predefinita**: Italiano
   - **App o gioco**: Gioco
   - **Gratuita o a pagamento**: Gratuita
   - **Dichiarazioni**: accetta tutte
4. Clicca **"Crea app"**

---

## Step 3: Compilare la Scheda dello Store

### 3.1 Dettagli app (Grow > Store listing)
Copia i testi dal file `listing-it.md` (default IT) e da `listing-en.md` (EN):
- **Titolo**: `Beyblade X: Segnapunti` (IT) / `Beyblade X Score Tracker` (EN)
- **Descrizione breve**: vedi `listing-it.md` / `listing-en.md`
- **Descrizione completa**: copia dal file

### 3.2 Immagini
Carica dalla cartella `store/`:
- **Icona app** (512x512): usa `assets/icon.png` (ridimensiona a 512x512)
- **Feature graphic** (1024x500): crea con Canva o simile, oppure usa uno screenshot panoramico
- **Screenshot** (minimo 4, 1920x1080): cattura dall'app in landscape

### 3.3 Categoria
- **Tipo app**: **Gioco** (non App) — 5 su 6 competitor Beyblade sul Play Store sono in Games
- **Categoria**: **Sports**
- **Tag**: scegli dalla lista predefinita Google in Play Console (max 5). Concetti target: Sports, 2 Player, Casual, Local Multiplayer, Score

---

## Step 4: Content Rating (Classificazione contenuti)

1. Vai su **Policy > App content > Content rating**
2. Clicca **"Start questionnaire"**
3. **Tipo**: **Gioco** (non più "Utilità")
4. Rispondi **NO** a tutte le domande sui contenuti:
   - Violenza? No (i finish sono animazioni stilizzate, non violenza)
   - Contenuti sessuali? No
   - Linguaggio volgare? No
   - Sostanze controllate? No
   - Gambling? No
   - Contenuti generati dagli utenti? No
5. **Interactive elements**:
   - Users interact (online)? No (l'app è offline)
   - Shares location? No
   - Digital purchases? **Sì** (IAP "remove ads")
6. **Risultato atteso**: Rating **"Everyone"** / Per tutti

> ⚠️ Se cambi tipo da App a Gioco rispetto a una sottomissione precedente, il content rating va **rifatto da zero**.

---

## Step 5: Data Safety (Sicurezza dei dati)

1. Vai su **Policy > App content > Data safety**
2. **"La tua app raccoglie o condivide dati?"**: **Sì** (a causa di AdMob)
3. Dichiara i dati raccolti da **AdMob** (SDK `react-native-google-mobile-ads`):
   - **Device or other IDs** (Advertising ID) — usato per Advertising or marketing
   - Tipo: collected, not shared
   - Crittografata in transito: Sì
   - Required for ads functionality
4. Dichiara i dati raccolti da **RevenueCat** (IAP):
   - **Purchase history** — usato per App functionality (gestire stato IAP "remove ads")
5. Dati dell'app stessa:
   - Game scores, settings → **stored only on device** (NOT collected/shared)
6. **Privacy policy URL**: `https://albertocabasvidani.github.io/beybladex-score/privacy-policy.html`

> ⚠️ **Prima di submit**: aggiorna `privacy-policy.md` per dichiarare AdMob e RevenueCat tra i Third-Party Services. Il claim attuale "Third-Party Services: None" è inaccurato e in contrasto con quanto dichiarato qui in Data Safety.

---

## Step 6: Target Audience

1. Vai su **Policy > App content > Target audience**
2. **Fascia d'età target**: 13+ (o "Tutte le età" se disponibile)
3. **L'app è rivolta ai minori?**: No (per evitare requisiti COPPA aggiuntivi)

---

## Step 7: Ads Declaration

1. Vai su **Policy > App content > Ads**
2. **L'app contiene pubblicità?**: **Sì** (banner AdMob nella VictoryOverlay)

---

## Step 8: Upload AAB e Release

### 8.1 Build AAB
La build AAB viene generata con:
```bash
npx eas-cli build --platform android --profile production --non-interactive
```
Scarica il file `.aab` dalla pagina EAS builds:
https://expo.dev/accounts/albertocv/projects/beybladex-score-mobile/builds

### 8.2 Creare la Release

1. Vai su **Release > Production**
2. Clicca **"Create new release"**
3. **Upload** il file `.aab`
4. Aggiungi **Release notes**: "Prima release - Segnapunti per Beyblade X"
5. Clicca **"Review release"**
6. Se tutti i check sono verdi, clicca **"Start rollout to Production"**

---

## Step 9: Revisione Google

- La prima revisione richiede **1-7 giorni lavorativi**
- Google controlla: malware, violazioni policy, crash rate
- Riceverai email di conferma o richiesta modifiche
- Le revisioni successive sono più veloci (ore)

---

## Update Successivi

### Manuale
```bash
# Build
npx eas-cli build --platform android --profile production --non-interactive
# Submit (dopo aver configurato il Service Account)
npx eas-cli submit --platform android --profile production
```

### Automatico (con Service Account)
```bash
npx eas-cli build --platform android --profile production --auto-submit --non-interactive
```

---

## (Opzionale) Configurare Google Service Account per Submit Automatico

Questo permette di usare `eas submit` per upload automatici.

### 1. Google Cloud Console
1. Vai su https://console.cloud.google.com
2. Crea un nuovo progetto (o usa uno esistente)
3. Vai su **API e servizi > Libreria**
4. Cerca e abilita **"Google Play Android Developer API"**

### 2. Creare il Service Account
1. Vai su **IAM e amministrazione > Account di servizio**
2. Clicca **"Crea account di servizio"**
3. Nome: `eas-submit` (o qualsiasi nome)
4. Clicca **"Crea e continua"**
5. Salta i ruoli (non servono qui)
6. Clicca **"Fine"**

### 3. Generare la Chiave JSON
1. Clicca sull'account di servizio appena creato
2. Vai su **Chiavi**
3. **Aggiungi chiave > Crea nuova chiave > JSON**
4. Scarica il file e salvalo come `packages/mobile/google-service-account.json`

### 4. Collegare al Play Console
1. Vai su https://play.google.com/console
2. **Impostazioni > Accesso API**
3. Nella sezione "Account di servizio", clicca **"Collega account di servizio"**
4. Inserisci l'email del service account (es. `eas-submit@progetto.iam.gserviceaccount.com`)
5. Concedi permessi **Admin** (o almeno "Release manager")
6. **Attendi 24 ore** per l'attivazione delle credenziali

### 5. Aggiungere a .gitignore
```
# Aggiungi a packages/mobile/.gitignore
google-service-account.json
```

---

**Creato**: 10/02/2026
**Task**: Guida deploy Google Play Store
