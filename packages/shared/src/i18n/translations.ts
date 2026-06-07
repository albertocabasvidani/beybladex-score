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
    }
  }
} as const;

export type TranslationKey = keyof typeof translations;
export type TranslationLocale = 'it' | 'en';
