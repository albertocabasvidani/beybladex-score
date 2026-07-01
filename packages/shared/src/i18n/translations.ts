/**
 * Shared translations for Beyblade X Score Tracker
 * Used by both web and mobile packages
 */

export const translations = {
  it: {
    app: {
      title: 'Beyblade Score',
      rotateDevice: 'Ruota il dispositivo in landscape per giocare'
    },
    home: {
      title: 'Beyblade X',
      chooseMode: 'Scegli una modalità',
      scoreboard: 'Segnapunti',
      scoreboardDesc: 'Conta i punti delle battaglie',
      builder: 'Gestore combo',
      builderDesc: 'Crea e salva le tue Bey',
      analytics: 'Analitiche',
      analyticsDesc: 'Win-rate e statistiche delle combo'
    },
    stats: {
      title: 'Analitiche',
      backHome: 'Home',
      gate: {
        teaser: 'Vedi {{visible}} di {{total}} match — sblocca lo storico completo',
        cta: 'Sblocca con Pro',
        watchAd: 'Guarda un video'
      },
      tabs: { overview: 'Combo', matchups: 'Matchup', parts: 'Parti' },
      range: { all: 'Tutto', today: 'Oggi', d7: '7g', d30: '30g', custom: 'Personalizzato' },
      empty: {
        title: 'Ancora nessun dato',
        body: 'Assegna una Bey a ciascun giocatore nel segnapunti: ogni partita verrà registrata qui.',
        cta: 'Vai al segnapunti',
        range: 'Nessuna partita in questo periodo'
      },
      summary: { games: 'Partite', combos: 'Combo', topCombo: 'Top combo' },
      sort: { winRate: 'Win-rate', pointDiff: 'Diff. punti', games: 'Partite', recent: 'Recenti' },
      combo: {
        winRate: 'win-rate',
        games_one: '{{count}} partita',
        games_other: '{{count}} partite',
        pointDiff: 'Diff. punti',
        avgDiff: 'Diff. media',
        points: 'Punti (F-S)',
        finishMix: 'Composizione finish',
        finishScored: 'Inflitti',
        finishConceded: 'Subiti',
        form: 'Forma',
        matchups: 'Matchup',
        noMatchups: 'Nessun matchup registrato',
        lowSample: 'campione ridotto',
        notFound: 'Combo',
        insightConceded: 'Subisci spesso finish {{finish}}: valuta un assetto più adatto.'
      },
      matchups: { title: 'Matchup di {{name}}' },
      parts: { searchPlaceholder: 'Cerca una parte…', noResults: 'Nessuna parte trovata' },
      tabCaption: {
        overview: 'Le tue combo ordinate per win-rate',
        matchups: 'Come va una combo contro ciascuna avversaria',
        parts: 'Win-rate di ogni singola parte'
      },
      calendar: {
        months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        weekdays: ['L', 'M', 'M', 'G', 'V', 'S', 'D'],
        pickStart: 'Scegli la data di inizio',
        apply: 'Applica',
        prevMonth: 'Mese precedente',
        nextMonth: 'Mese successivo'
      },
      legend: {
        title: 'Come leggere le analitiche',
        tabsTitle: 'Le tab',
        tabOverview: 'Le tue combo in classifica per percentuale di vittorie.',
        tabMatchups: 'Quanto bene una combo se la cava contro ciascuna avversaria.',
        tabParts: 'La percentuale di vittorie di ogni singola parte.',
        metricsTitle: 'La notazione',
        mWinrate: 'Barra = win-rate (verde alto, ambra incerto, rosso basso).',
        mRecord: 'Vittorie–sconfitte.',
        mDiff: 'Differenza tra punti fatti e subiti (verde se positiva, rossa se negativa).',
        mLowSample: 'Meno di 5 partite: dato poco affidabile.'
      },
      bey: {
        add: 'Aggiungi Bey',
        change: 'Cambia Bey',
        remove: 'Rimuovi Bey',
        sheetTitle: 'Bey di {{name}}',
        yourBeys: 'Le tue Bey · dal builder',
        noSavedCombos: 'Nessuna combo salvata nel builder',
        openBuilder: 'Apri il gestore combo',
        composeNew: 'Componi nuova',
        composeTitle: 'Componi nuova Bey',
        confirm: 'Conferma Bey',
        freeformHint: '…oppure un nome al volo',
        freeformPlaceholder: 'es. «Dran rossa»',
        variantActive: 'Variante attiva per questo match',
        keepInShelf: 'Tieni nello scaffale'
      },
      clearTitle: 'Cancellare le statistiche?',
      clearBody: 'Tutte le partite registrate verranno eliminate. Operazione irreversibile.',
      clearConfirm: 'Cancella tutto'
    },
    player: {
      player1: 'Giocatore 1',
      player2: 'Giocatore 2'
    },
    finish: {
      spin: 'Spin',
      burst: 'Burst',
      over: 'Over',
      xtreme: 'Xtreme'
    },
    game: {
      vs: 'VS',
      winScore: 'Vittoria a {{score}} punti',
      winner: '{{name}} vince!',
      scoreLabel: 'Punti',
      victories_one: '{{count}} vittoria',
      victories_other: '{{count}} vittorie'
    },
    buttons: {
      undo: 'Annulla',
      reset: 'Reset',
      share: 'Condividi',
      newGame: 'Nuova Partita'
    },
    foul: {
      label: 'Falli',
      short: 'F',
      maxFouls: 'Limite falli',
      disabled: 'OFF'
    },
    settings: {
      title: 'Impostazioni',
      language: 'Lingua',
      winScore: 'Punti per vincere',
      maxFouls: 'Limite falli'
    },
    confirm: {
      reset: 'Sei sicuro di voler resettare la partita?',
      yes: 'Conferma',
      no: 'Annulla'
    },
    credits: {
      title: 'Crediti',
      createdBy: 'Creato da Alberto Cabas Vidani',
      contactMessage: 'Contattami per idee, problemi e complimenti ;-)',
      sendEmail: 'Invia Email'
    },
    resetTrophies: {
      title: 'Azzerare i trofei?',
      message: 'I trofei di entrambi i giocatori verranno azzerati.',
      confirm: 'Azzera'
    },
    ads: {
      remove: 'Rimuovi pubblicità'
    },
    paywall: {
      title: 'Passa a Pro',
      goPro: 'Passa a Pro',
      loading: 'Caricamento offerte…',
      sub: {
        analytics: 'Sblocca tutto il tuo storico e le statistiche avanzate.',
        combo: 'Salva combo e deck illimitati.',
        deck: 'Crea deck illimitati e confrontali.',
        ads: 'Togli le pubblicità e sblocca tutte le funzioni Pro.',
        generic: 'Sblocca tutte le funzioni Pro.'
      },
      feature: {
        history: 'Storico completo dei match + trend nel tempo',
        charts: 'Statistiche avanzate: win-rate per bey, combo e parte',
        combos: 'Combo e deck salvati illimitati',
        noAds: 'Niente pubblicità'
      },
      buyLifetime: 'Sblocca per sempre · {{price}}',
      buyAnnual: 'Abbonamento annuale · {{price}}',
      buyGeneric: 'Sblocca Pro · {{price}}',
      lifetimeNote: 'Pagamento unico, nessun rinnovo',
      annualNote: 'Si rinnova ogni anno, disdici quando vuoi',
      restore: 'Ripristina acquisti',
      notNow: 'Non ora',
      legal: 'Il pagamento è gestito da Google Play. Puoi ripristinare l\'acquisto su qualsiasi tuo dispositivo.'
    },
    error: {
      title: 'Qualcosa è andato storto',
      restart: 'Riavvia'
    },
    review: {
      title: 'Ti piace Beyblade Score?',
      message: 'Se l\'app ti è utile, una recensione sul Play Store ci aiuta tantissimo. Bastano pochi secondi.',
      rate: 'Lascia una recensione',
      later: 'Più tardi'
    },
    beta: {
      title: 'Prova le novità in anteprima',
      message: 'Iscriviti alla beta per provare Gestore Combo e Statistiche prima di tutti.',
      join: 'Partecipa',
      ok: 'OK'
    },
    sideSwitch: {
      message: 'Avete cambiato lato?',
      dontShowAgain: 'Non mostrare più',
      settingLabel: 'Promemoria cambio lato'
    },
    releaseNote: {
      badge: 'Novità',
      title: 'Promemoria cambio lato',
      body: 'In Beyblade dopo 3 lanci si cambia lato. Ora l\'app te lo ricorda: dopo ogni 3 lanci compare <b>"Avete cambiato lato?"</b>, sparisce da solo dopo pochi secondi e puoi disattivarlo dal messaggio stesso o dalle impostazioni.',
      gotIt: 'Ho capito'
    },
    guide: {
      title: 'Come si gioca',
      sectionPanel: 'Pannello giocatore',
      panelName: 'Tocca il <b>nome</b> per modificarlo',
      panelFouls: '<b>F: 0/2</b> — falli. Usa +/- per aggiungere o togliere. Al limite, il punto va all\'avversario',
      panelTrophies: '<b>🏆</b> sopra il punteggio — vittorie nella sessione. Tocca per azzerare entrambi',
      panelButtons: 'I <b>4 pulsanti grandi</b> assegnano il punteggio in base al tipo di finish',
      sectionCommands: 'Comandi',
      cmdSwap: '<b>⇄</b> (in alto al centro) — scambia i lati dei giocatori',
      cmdSettings: '<b>🏆</b> — apre le impostazioni (punteggio vittoria e limite falli)',
      cmdCountdown: '▶ <b>3·2·1</b> — conto alla rovescia vocale per il lancio ("3, 2, 1, pronti... lancio!")',
      cmdUndo: '↩ <b>Undo</b> — annulla l\'ultima azione',
      cmdReset: '↻ <b>Reset</b> — nuova partita (le vittorie restano)',
      cmdInfo: '<b>i</b> — questa guida',
      sectionEnd: 'Fine partita',
      endText: 'Quando un giocatore raggiunge il punteggio vittoria, tocca <b>New Game</b> per ricominciare',
      credits: 'Crediti'
    },
    builder: {
      title: 'Combo Builder',
      backToScoreboard: 'Scoreboard',
      tabs: { parts: 'Parti', builder: 'Builder', decks: 'Deck', collection: 'Collezione' },
      category: { blade: 'Blade', ratchet: 'Ratchet', bit: 'Bit', cx: 'CX', lockChip: 'Lock Chip', mainBlade: 'Main Blade', assistBlade: 'Assist Blade', overBlade: 'Over Blade' },
      slotDisabled: { integratedRatchet: 'Ratchet incluso nella parte' },
      type: { all: 'Tutti', attack: 'Attacco', defense: 'Difesa', stamina: 'Stamina', balance: 'Equilibrio' },
      common: {
        search: 'Cerca...',
        clear: 'Pulisci',
        noResults: 'Nessun risultato',
        cancel: 'Annulla',
        delete: 'Elimina',
        noStats: 'Stats non disponibili',
        close: 'Chiudi'
      },
      picker: { title: 'Seleziona {{category}}', search: 'Cerca {{category}}...', recent: 'Recenti' },
      parts: { empty: 'Nessuna parte' },
      partCard: {
        bit: 'Bit',
        ratchet: 'Ratchet',
        mainBlade: 'Main Blade (CX)',
        assistBlade: 'Assist Blade (CX)',
        lockChip: 'Lock Chip (CX)',
        overBlade: 'Over Blade (CX)'
      },
      combo: {
        selectSlot: 'Seleziona {{slot}}',
        optional: 'Opzionale',
        namePlaceholder: 'Nome combo (opzionale)',
        save: 'Salva combo',
        update: 'Aggiorna combo',
        saved: 'Combo salvate ({{count}})',
        empty: 'Nessuna combo salvata',
        noRadar: 'Stats non disponibili',
        noRadarHint: 'Le statistiche compariranno quando saranno presenti nel database parti.',
        deleteTitle: 'Elimina combo',
        deleteMsg: 'Eliminare "{{name}}"?',
        limitReached: 'Limite gratuito raggiunto ({{limit}} combo) — Passa a Pro'
      },
      deck: {
        new: 'Nuovo deck ({{count}}/{{size}})',
        wboHint: 'Regola WBO: nessuna parte ripetuta tra le combo.',
        needCombos: 'Salva prima qualche combo nel Builder.',
        noRadar: 'Stats non disponibili per il radar',
        duplicateInline: '{{kind}} "{{name}}" è ripetuta.',
        namePlaceholder: 'Nome deck (opzionale)',
        save: 'Salva deck',
        update: 'Aggiorna deck',
        saved: 'Deck salvati ({{count}})',
        empty: 'Nessun deck salvato',
        deleteTitle: 'Elimina deck',
        deleteMsg: 'Eliminare "{{name}}"?',
        duplicateTitle: 'Parti duplicate',
        duplicateMsg: '{{kind}} "{{name}}" usata in più combo del deck.',
        defaultName: 'Deck {{n}}',
        limitReached: 'Limite gratuito raggiunto ({{limit}} deck) — Passa a Pro'
      },
      collection: { counter: '{{owned}}/{{total}} possedute' }
    },
    parts: {
      updated: {
        title: 'Nuove parti disponibili',
        body: 'Aggiunte al catalogo:',
        ok: 'Ok'
      },
      loading: 'Caricamento parti...'
    }
  },
  en: {
    app: {
      title: 'Beyblade Score',
      rotateDevice: 'Rotate your device to landscape to play'
    },
    home: {
      title: 'Beyblade X',
      chooseMode: 'Choose a mode',
      scoreboard: 'Scoreboard',
      scoreboardDesc: 'Track battle points',
      builder: 'Combo manager',
      builderDesc: 'Build and save your Beys',
      analytics: 'Analytics',
      analyticsDesc: 'Combo win-rate and stats'
    },
    stats: {
      title: 'Analytics',
      backHome: 'Home',
      gate: {
        teaser: 'Showing {{visible}} of {{total}} matches — unlock your full history',
        cta: 'Unlock with Pro',
        watchAd: 'Watch a video'
      },
      tabs: { overview: 'Combos', matchups: 'Matchups', parts: 'Parts' },
      range: { all: 'All', today: 'Today', d7: '7d', d30: '30d', custom: 'Custom' },
      empty: {
        title: 'No data yet',
        body: 'Assign a Bey to each player in the scoreboard: every game gets recorded here.',
        cta: 'Go to scoreboard',
        range: 'No games in this period'
      },
      summary: { games: 'Games', combos: 'Combos', topCombo: 'Top combo' },
      sort: { winRate: 'Win-rate', pointDiff: 'Point diff', games: 'Games', recent: 'Recent' },
      combo: {
        winRate: 'win-rate',
        games_one: '{{count}} game',
        games_other: '{{count}} games',
        pointDiff: 'Point diff',
        avgDiff: 'Avg diff',
        points: 'Points (F-A)',
        finishMix: 'Finish mix',
        finishScored: 'Scored',
        finishConceded: 'Conceded',
        form: 'Form',
        matchups: 'Matchups',
        noMatchups: 'No matchups recorded',
        lowSample: 'low sample',
        notFound: 'Combo',
        insightConceded: 'You often concede {{finish}} finishes: consider a sturdier setup.'
      },
      matchups: { title: '{{name}} matchups' },
      parts: { searchPlaceholder: 'Search a part…', noResults: 'No part found' },
      tabCaption: {
        overview: 'Your combos ranked by win-rate',
        matchups: 'How a combo fares against each opponent',
        parts: 'Win-rate of each single part'
      },
      calendar: {
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        pickStart: 'Pick a start date',
        apply: 'Apply',
        prevMonth: 'Previous month',
        nextMonth: 'Next month'
      },
      legend: {
        title: 'How to read the analytics',
        tabsTitle: 'The tabs',
        tabOverview: 'Your combos ranked by win percentage.',
        tabMatchups: 'How well a combo does against each opponent.',
        tabParts: 'The win percentage of each single part.',
        metricsTitle: 'The notation',
        mWinrate: 'Bar = win-rate (green high, amber uncertain, red low).',
        mRecord: 'Wins–losses.',
        mDiff: 'Difference between points scored and conceded (green if positive, red if negative).',
        mLowSample: 'Fewer than 5 games: unreliable figure.'
      },
      bey: {
        add: 'Add Bey',
        change: 'Change Bey',
        remove: 'Remove Bey',
        sheetTitle: "{{name}}'s Bey",
        yourBeys: 'Your Beys · from the builder',
        noSavedCombos: 'No combos saved in the builder',
        openBuilder: 'Open combo manager',
        composeNew: 'Compose new',
        composeTitle: 'Compose new Bey',
        confirm: 'Confirm Bey',
        freeformHint: '…or a quick name',
        freeformPlaceholder: 'e.g. "Red Dran"',
        variantActive: 'Variant active for this match',
        keepInShelf: 'Keep in shelf'
      },
      clearTitle: 'Clear stats?',
      clearBody: 'All recorded games will be deleted. This cannot be undone.',
      clearConfirm: 'Clear all'
    },
    player: {
      player1: 'Player 1',
      player2: 'Player 2'
    },
    finish: {
      spin: 'Spin',
      burst: 'Burst',
      over: 'Over',
      xtreme: 'Xtreme'
    },
    game: {
      vs: 'VS',
      winScore: 'First to {{score}} points',
      winner: '{{name}} wins!',
      scoreLabel: 'Score',
      victories_one: '{{count}} victory',
      victories_other: '{{count}} victories'
    },
    buttons: {
      undo: 'Undo',
      reset: 'Reset',
      share: 'Share',
      newGame: 'New Game'
    },
    foul: {
      label: 'Fouls',
      short: 'F',
      maxFouls: 'Foul limit',
      disabled: 'OFF'
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      winScore: 'Points to win',
      maxFouls: 'Foul limit'
    },
    confirm: {
      reset: 'Are you sure you want to reset the game?',
      yes: 'Confirm',
      no: 'Cancel'
    },
    credits: {
      title: 'Credits',
      createdBy: 'Created by Alberto Cabas Vidani',
      contactMessage: 'Contact me for ideas, issues and compliments ;-)',
      sendEmail: 'Send Email'
    },
    resetTrophies: {
      title: 'Reset trophies?',
      message: "Both players' trophies will be reset.",
      confirm: 'Reset'
    },
    ads: {
      remove: 'Remove ads'
    },
    paywall: {
      title: 'Go Pro',
      goPro: 'Go Pro',
      loading: 'Loading offers…',
      sub: {
        analytics: 'Unlock your full history and advanced stats.',
        combo: 'Save unlimited combos and decks.',
        deck: 'Build unlimited decks and compare them.',
        ads: 'Remove ads and unlock all Pro features.',
        generic: 'Unlock all Pro features.'
      },
      feature: {
        history: 'Full match history + trends over time',
        charts: 'Advanced stats: win-rate by bey, combo and part',
        combos: 'Unlimited saved combos and decks',
        noAds: 'No ads'
      },
      buyLifetime: 'Unlock forever · {{price}}',
      buyAnnual: 'Yearly subscription · {{price}}',
      buyGeneric: 'Unlock Pro · {{price}}',
      lifetimeNote: 'One-time payment, no renewal',
      annualNote: 'Renews yearly, cancel anytime',
      restore: 'Restore purchases',
      notNow: 'Not now',
      legal: 'Payment is handled by Google Play. You can restore your purchase on any of your devices.'
    },
    error: {
      title: 'Something went wrong',
      restart: 'Restart'
    },
    review: {
      title: 'Enjoying Beyblade Score?',
      message: 'If the app is useful to you, a quick review on the Play Store helps us a lot. It only takes a few seconds.',
      rate: 'Rate the app',
      later: 'Maybe later'
    },
    beta: {
      title: 'Try new features early',
      message: 'Join the beta to try the Combo Builder and Stats before everyone else.',
      join: 'Join',
      ok: 'OK'
    },
    sideSwitch: {
      message: 'Did you switch sides?',
      dontShowAgain: "Don't show again",
      settingLabel: 'Side-switch reminder'
    },
    releaseNote: {
      badge: 'What\'s new',
      title: 'Side-switch reminder',
      body: 'In Beyblade you switch sides after 3 launches. Now the app reminds you: after every 3 launches it shows <b>"Did you switch sides?"</b>, disappears on its own after a few seconds, and you can turn it off from the message itself or in settings.',
      gotIt: 'Got it'
    },
    guide: {
      title: 'How to play',
      sectionPanel: 'Player panel',
      panelName: 'Tap the <b>name</b> to edit it',
      panelFouls: '<b>F: 0/2</b> — fouls. Use +/- to add or remove. At the limit, the point goes to the opponent',
      panelTrophies: '<b>🏆</b> above the score — session wins. Tap to reset both',
      panelButtons: 'The <b>4 big buttons</b> assign points based on the finish type',
      sectionCommands: 'Commands',
      cmdSwap: '<b>⇄</b> (top center) — swap player sides',
      cmdSettings: '<b>🏆</b> — opens settings (win score and foul limit)',
      cmdCountdown: '▶ <b>3·2·1</b> — voice countdown for the launch ("3, 2, 1... go shoot!")',
      cmdUndo: '↩ <b>Undo</b> — undoes the last action',
      cmdReset: '↻ <b>Reset</b> — new game (wins are kept)',
      cmdInfo: '<b>i</b> — this guide',
      sectionEnd: 'End of game',
      endText: 'When a player reaches the win score, tap <b>New Game</b> to start over',
      credits: 'Credits'
    },
    builder: {
      title: 'Combo Builder',
      backToScoreboard: 'Scoreboard',
      tabs: { parts: 'Parts', builder: 'Builder', decks: 'Decks', collection: 'Collection' },
      category: { blade: 'Blade', ratchet: 'Ratchet', bit: 'Bit', cx: 'CX', lockChip: 'Lock Chip', mainBlade: 'Main Blade', assistBlade: 'Assist Blade', overBlade: 'Over Blade' },
      slotDisabled: { integratedRatchet: 'Ratchet included in the part' },
      type: { all: 'All', attack: 'Attack', defense: 'Defense', stamina: 'Stamina', balance: 'Balance' },
      common: {
        search: 'Search...',
        clear: 'Clear',
        noResults: 'No results',
        cancel: 'Cancel',
        delete: 'Delete',
        noStats: 'Stats unavailable',
        close: 'Close'
      },
      picker: { title: 'Select {{category}}', search: 'Search {{category}}...', recent: 'Recent' },
      parts: { empty: 'No parts' },
      partCard: {
        bit: 'Bit',
        ratchet: 'Ratchet',
        mainBlade: 'Main Blade (CX)',
        assistBlade: 'Assist Blade (CX)',
        lockChip: 'Lock Chip (CX)',
        overBlade: 'Over Blade (CX)'
      },
      combo: {
        selectSlot: 'Select {{slot}}',
        optional: 'Optional',
        namePlaceholder: 'Combo name (optional)',
        save: 'Save combo',
        update: 'Update combo',
        saved: 'Saved combos ({{count}})',
        empty: 'No saved combos',
        noRadar: 'Stats unavailable',
        noRadarHint: 'Stats will appear once they are present in the parts database.',
        deleteTitle: 'Delete combo',
        deleteMsg: 'Delete "{{name}}"?',
        limitReached: 'Free limit reached ({{limit}} combos) — Go Pro'
      },
      deck: {
        new: 'New deck ({{count}}/{{size}})',
        wboHint: 'WBO rule: no part repeated across combos.',
        needCombos: 'Save some combos in the Builder first.',
        noRadar: 'Stats unavailable for the radar',
        duplicateInline: '{{kind}} "{{name}}" is repeated.',
        namePlaceholder: 'Deck name (optional)',
        save: 'Save deck',
        update: 'Update deck',
        saved: 'Saved decks ({{count}})',
        empty: 'No saved decks',
        deleteTitle: 'Delete deck',
        deleteMsg: 'Delete "{{name}}"?',
        duplicateTitle: 'Duplicate parts',
        duplicateMsg: '{{kind}} "{{name}}" used in more than one combo of the deck.',
        defaultName: 'Deck {{n}}',
        limitReached: 'Free limit reached ({{limit}} decks) — Go Pro'
      },
      collection: { counter: '{{owned}}/{{total}} owned' }
    },
    parts: {
      updated: {
        title: 'New parts available',
        body: 'Added to the catalog:',
        ok: 'Ok'
      },
      loading: 'Loading parts...'
    }
  }
} as const;

export type TranslationKey = keyof typeof translations;
export type TranslationLocale = 'it' | 'en';
