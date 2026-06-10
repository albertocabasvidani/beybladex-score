/**
 * Shared translations for Beyblade X Score Tracker
 * Used by both web and mobile packages
 */

export const translations = {
  it: {
    app: {
      title: 'Beyblade Score'
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
      winner: '{{name}} vince!'
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
    review: {
      title: 'Ti piace Beyblade Score?',
      message: 'Se l\'app ti è utile, una recensione sul Play Store ci aiuta tantissimo. Bastano pochi secondi.',
      rate: 'Lascia una recensione',
      later: 'Più tardi'
    },
    releaseNote: {
      badge: 'Novità',
      title: 'Conto alla rovescia vocale',
      body: 'Nuovo pulsante <b>▶ 3·2·1</b> al centro della barra in basso: toccalo e l\'app conta per te — "3, 2, 1, pronti... lancio!". La voce segue la lingua del telefono (italiano o inglese).',
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
    }
  },
  en: {
    app: {
      title: 'Beyblade Score'
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
      winner: '{{name}} wins!'
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
    review: {
      title: 'Enjoying Beyblade Score?',
      message: 'If the app is useful to you, a quick review on the Play Store helps us a lot. It only takes a few seconds.',
      rate: 'Rate the app',
      later: 'Maybe later'
    },
    releaseNote: {
      badge: 'What\'s new',
      title: 'Voice countdown',
      body: 'New <b>▶ 3·2·1</b> button at the center of the bottom bar: tap it and the app counts down for you — "3, 2, 1... go shoot!". The voice follows your phone language (English or Italian).',
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
    }
  }
} as const;

export type TranslationKey = keyof typeof translations;
export type TranslationLocale = 'it' | 'en';
