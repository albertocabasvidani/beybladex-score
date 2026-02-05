/**
 * Shared translations for Beyblade X Score Tracker
 * Used by both web and mobile packages
 */

export const translations = {
  it: {
    app: {
      title: 'Beyblade X Score'
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
    settings: {
      title: 'Impostazioni',
      language: 'Lingua',
      winScore: 'Punti per vincere'
    },
    confirm: {
      reset: 'Sei sicuro di voler resettare la partita?',
      yes: 'Conferma',
      no: 'Annulla'
    }
  },
  en: {
    app: {
      title: 'Beyblade X Score'
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
    settings: {
      title: 'Settings',
      language: 'Language',
      winScore: 'Points to win'
    },
    confirm: {
      reset: 'Are you sure you want to reset the game?',
      yes: 'Confirm',
      no: 'Cancel'
    }
  }
} as const;

export type TranslationKey = keyof typeof translations;
export type TranslationLocale = 'it' | 'en';
