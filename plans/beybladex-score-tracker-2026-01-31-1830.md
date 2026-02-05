# Piano: Beyblade X Score Tracker

## Obiettivo
Web app PWA per tracciare punteggi partite Beyblade X 1v1, con animazioni accattivanti e architettura pronta per app mobile nativa.

---

## Stack Tecnologico

| Tecnologia | Uso | Motivazione |
|------------|-----|-------------|
| **React 19 + TypeScript** | Frontend | Riutilizzabile con React Native |
| **Vite + vite-plugin-pwa** | Build + PWA | Fast, zero-config PWA |
| **Zustand** | State Management | Leggero, estraibile per mobile |
| **Framer Motion** | Animazioni | API dichiarativa React |
| **GSAP** | Solo Xtreme effect | Animazioni complesse |
| **Tailwind CSS v4** | Styling | Dark theme, convertibile a NativeWind |
| **i18next** | Multilingua | Standard React, facile per RN |

---

## Struttura Cartelle

```
beybladex-score-tracker/
├── public/
│   └── icons/                    # Icone PWA
│
├── src/
│   ├── core/                     # LOGICA RIUTILIZZABILE (no React)
│   │   ├── game/
│   │   │   ├── types.ts          # Player, Match, FinishType
│   │   │   ├── constants.ts      # Punteggi per tipo finish
│   │   │   ├── game-engine.ts    # Calcolo punteggi, verifica vittoria
│   │   │   └── history.ts        # Undo/redo stack
│   │   └── utils/
│   │       └── share.ts          # Generazione testo condivisione
│   │
│   ├── store/
│   │   ├── game-store.ts         # Zustand store partita
│   │   └── settings-store.ts     # Lingua, win score
│   │
│   ├── hooks/
│   │   ├── useGame.ts
│   │   ├── useSettings.ts
│   │   └── useShare.ts           # Web Share API
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── AdBanner.tsx      # Spazio AdSense
│   │   │   └── Footer.tsx
│   │   ├── game/
│   │   │   ├── PlayerPanel.tsx   # Nome + punteggio + pulsanti
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── FinishButtons.tsx # 4 pulsanti tipo vittoria
│   │   │   ├── NameInput.tsx
│   │   │   └── GameControls.tsx  # Undo, Reset
│   │   ├── animations/
│   │   │   ├── SpinEffect.tsx    # Rotazione
│   │   │   ├── BurstEffect.tsx   # Frantumazione
│   │   │   ├── OverEffect.tsx    # Caduta
│   │   │   ├── XtremeEffect.tsx  # Spettacolare
│   │   │   └── VictoryOverlay.tsx
│   │   ├── modals/
│   │   │   ├── SettingsModal.tsx
│   │   │   ├── ResetConfirmModal.tsx
│   │   │   └── ShareModal.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       └── Input.tsx
│   │
│   ├── i18n/
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── it.json
│   │       └── en.json
│   │
│   ├── styles/
│   │   └── globals.css           # Tailwind + dark theme
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Tipi Core

```typescript
// src/core/game/types.ts

export type FinishType = 'spin' | 'burst' | 'over' | 'xtreme';

export interface Player {
  id: 'player1' | 'player2';
  name: string;
  score: number;
  finishCounts: Record<FinishType, number>;
}

export interface MatchState {
  player1: Player;
  player2: Player;
  winScore: number;  // default 4
  winner: 'player1' | 'player2' | null;
  history: HistoryEntry[];
}

export interface HistoryEntry {
  playerId: 'player1' | 'player2';
  finishType: FinishType;
  pointsAdded: number;
}
```

---

## Punteggi

| Tipo | Punti |
|------|-------|
| Spin Finish | +1 |
| Burst Finish | +2 |
| Over Finish | +2 |
| Xtreme Finish | +3 |

Vittoria: **4 punti** (personalizzabile)

---

## Animazioni

### Spin Effect (+1)
- Testo "+1 SPIN" che ruota su se stesso
- Durata: 0.6s

### Burst Effect (+2)
- Testo "+2 BURST" che si frantuma in pezzi
- Lettere che esplodono in direzioni casuali
- Particelle che si disperdono
- Durata: 0.8s

### Over Effect (+2)
- Testo "+2 OVER" che cade fuori schermo
- Effetto gravità/rimbalzo
- Durata: 0.7s

### Xtreme Effect (+3) ⭐
- Flash luminoso iniziale
- Testo "+3 XTREME" con shake intenso
- Scala che pulsa
- Bagliore dorato/energetico
- Particelle esplosive
- Suono opzionale
- Durata: 1.2s
- Implementato con GSAP per massimo controllo

### Victory Overlay
- Schermata a tutto schermo
- Nome vincitore con animazione entrance
- Punteggio finale
- Pulsante condivisione
- Animazione confetti/stelle

---

## Condivisione

Web Share API con fallback clipboard:

```
🏆 BEYBLADE X MATCH 🏆

Vincitore: [Nome]
Punteggio: [X] - [Y]

#BeybladeX
```

---

## Layout UI

```
┌─────────────────────────┐
│  Header + Settings ⚙️   │
├─────────────────────────┤
│     [Ad Banner Top]     │
├─────────────────────────┤
│                         │
│   GIOCATORE 1           │
│   [Nome editabile]      │
│   ████ 3 ████           │  ← Punteggio grande
│   [Spin][Burst][Over][X]│  ← 4 pulsanti
│                         │
├─────────────────────────┤
│         VS              │
│    Vittoria: 4 punti    │
├─────────────────────────┤
│                         │
│   GIOCATORE 2           │
│   [Nome editabile]      │
│   ████ 2 ████           │
│   [Spin][Burst][Over][X]│
│                         │
├─────────────────────────┤
│   [↩️ Undo] [🔄 Reset]   │
├─────────────────────────┤
│    [Ad Banner Bottom]   │
└─────────────────────────┘
```

---

## PWA

- Installabile su Android/iOS
- Offline-first con Workbox
- Icone 192x192 e 512x512
- Theme color: #1a1a2e (dark)
- Display: standalone
- Orientation: portrait

---

## Spazio Pubblicitario

- **Top banner**: sotto header (320x50 mobile / 728x90 desktop)
- **Bottom banner**: sopra footer
- AdSense responsive
- Non interferisce con gameplay

---

## Riutilizzo per Mobile Nativo

La cartella `src/core/` contiene SOLO logica pura TypeScript:
- Nessuna dipendenza React
- Nessuna dipendenza DOM
- Estraibile come pacchetto npm

Per React Native:
1. Estrarre `core/` e `store/` in pacchetti
2. Ricreare solo componenti UI con React Native
3. Usare Reanimated invece di Framer Motion
4. Usare NativeWind invece di Tailwind

---

## Strategia Sub-Agent

**REGOLA**: Eseguire ogni task con un sub-agent quando possibile (nessun conflitto di dipendenze).

### Task Parallelizzabili
Le seguenti task possono essere eseguite in parallelo da sub-agent diversi:
- Componenti UI indipendenti (Button, Modal, Input)
- Animazioni (SpinEffect, BurstEffect, OverEffect, XtremeEffect)
- Traduzioni IT/EN
- Share utility

### Task Sequenziali
Queste richiedono completamento delle precedenti:
- Store → dipende da types/constants
- PlayerPanel → dipende da FinishButtons, ScoreDisplay, NameInput
- App.tsx → dipende da tutti i componenti
- Test e deploy → alla fine

---

## Deploy su VPS Hostinger

### Prerequisiti
- Accesso SSH al VPS
- nginx installato
- Dominio configurato (opzionale)

### Procedura
1. **Build locale**: `npm run build` → genera `dist/`
2. **Upload**: SCP o SFTP della cartella `dist/` su `/var/www/beybladex/`
3. **Configurazione nginx**:
```nginx
server {
    listen 80;
    server_name beybladex.tuodominio.com;
    root /var/www/beybladex;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - tutte le route vanno a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
4. **HTTPS**: Configurare con Certbot (Let's Encrypt)
5. **Reload nginx**: `sudo nginx -t && sudo systemctl reload nginx`

---

## Fasi Implementazione

### Fase 1: Setup Progetto
- [ ] Inizializzare Vite + React + TypeScript
- [ ] Configurare Tailwind CSS dark theme
- [ ] Configurare PWA base
- [ ] Struttura cartelle

### Fase 2: Core Logic
- [ ] Types e constants
- [ ] Game engine (calcolo punteggi, verifica vittoria)
- [ ] History manager (undo)
- [ ] Zustand stores

### Fase 3: UI Base
- [ ] Layout components (Header, Footer, AdBanner placeholder)
- [ ] PlayerPanel con nome editabile
- [ ] ScoreDisplay
- [ ] FinishButtons (4 pulsanti)
- [ ] GameControls (Undo, Reset)

### Fase 4: Animazioni
- [ ] SpinEffect
- [ ] BurstEffect (frantumazione)
- [ ] OverEffect (caduta)
- [ ] XtremeEffect (spettacolare con GSAP)
- [ ] VictoryOverlay

### Fase 5: Features Complete
- [ ] Internazionalizzazione IT/EN
- [ ] Settings modal (lingua, win score)
- [ ] Web Share API
- [ ] Reset con conferma

### Fase 6: PWA + Deploy
- [ ] Icone PWA
- [ ] Manifest completo
- [ ] Service worker
- [ ] Test offline
- [ ] Deploy (Vercel/Netlify)

### Fase 7: Monetizzazione
- [ ] Integrazione AdSense
- [ ] Test banner

---

## Verifica Finale

1. **Funzionalità**
   - Tap su pulsante → punteggio aggiorna + animazione
   - Undo funziona correttamente
   - Reset chiede conferma
   - Vittoria mostra overlay quando si raggiunge win score
   - Condivisione funziona su mobile

2. **PWA**
   - Installabile da browser mobile
   - Funziona offline
   - Icona corretta

3. **Performance**
   - Animazioni fluide 60fps
   - Tempo caricamento < 3s
   - Lighthouse PWA score > 90

4. **Responsive**
   - Funziona su mobile portrait
   - Banner ads visibili ma non invasivi

---

## File Critici

| File | Descrizione |
|------|-------------|
| `src/core/game/game-engine.ts` | Logica punteggi - FONDAMENTALE per riuso |
| `src/store/game-store.ts` | Store centrale partita |
| `src/components/game/PlayerPanel.tsx` | UI principale |
| `src/components/animations/XtremeEffect.tsx` | Animazione più complessa |
| `vite.config.ts` | Configurazione PWA |

---

**Creato**: 31/01/2026 18:30
**Task**: Beyblade X Score Tracker - Web App PWA
