# Guida: Pubblicare Beyblade X Score su Google Play Store

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
   - **App o gioco**: App
   - **Gratuita o a pagamento**: Gratuita
   - **Dichiarazioni**: accetta tutte
4. Clicca **"Crea app"**

---

## Step 3: Compilare la Scheda dello Store

### 3.1 Dettagli app (Grow > Store listing)
Copia i testi dal file `listing-it.md`:
- **Titolo**: Beyblade X Score
- **Descrizione breve**: Segnapunti per partite Beyblade X. Spin, Burst, Over, Xtreme!
- **Descrizione completa**: copia dal file

### 3.2 Immagini
Carica dalla cartella `store/`:
- **Icona app** (512x512): usa `assets/icon.png` (ridimensiona a 512x512)
- **Feature graphic** (1024x500): crea con Canva o simile, oppure usa uno screenshot panoramico
- **Screenshot** (minimo 4, 1920x1080): cattura dall'app in landscape

### 3.3 Categoria
- **Categoria**: Strumenti > Utilità
- **Tag**: beyblade, segnapunti, punteggio, score, battaglia

---

## Step 4: Content Rating (Classificazione contenuti)

1. Vai su **Policy > App content > Content rating**
2. Clicca **"Start questionnaire"**
3. **Tipo**: Utilità (non gioco)
4. Rispondi **NO** a tutte le domande:
   - Violenza? No
   - Contenuti sessuali? No
   - Linguaggio volgare? No
   - Sostanze controllate? No
   - Gambling? No
   - Contenuti generati dagli utenti? No
5. **Risultato**: Rating **"Everyone"** / Per tutti

---

## Step 5: Data Safety (Sicurezza dei dati)

1. Vai su **Policy > App content > Data safety**
2. **"La tua app raccoglie o condivide dati?"**: No
3. **"La tua app raccoglie dati degli utenti?"**: No
4. Conferma che l'app:
   - Non raccoglie dati personali
   - Non condivide dati con terze parti
   - Non usa analytics o tracking
5. **Privacy policy URL**: `https://albertocabasvidani.github.io/beybladex-score/privacy-policy.html`

---

## Step 6: Target Audience

1. Vai su **Policy > App content > Target audience**
2. **Fascia d'età target**: 13+ (o "Tutte le età" se disponibile)
3. **L'app è rivolta ai minori?**: No (per evitare requisiti COPPA aggiuntivi)

---

## Step 7: Ads Declaration

1. Vai su **Policy > App content > Ads**
2. **L'app contiene pubblicità?**: No

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
