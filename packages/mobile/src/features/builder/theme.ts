/**
 * Palette e costanti del Builder. Estratte dal tema di bbxdeckbuild (che usava react-native-paper
 * MD3DarkTheme) e ridotte ai soli valori usati — niente dipendenza da Paper.
 *
 * I massimi delle stat (per-categoria e per-combo) NON sono qui: si calcolano dai dati reali via
 * `getCategoryStatMax` / `getComboStatMax` in `@beybladex/shared` ("il massimo è quello sul sito").
 */
export const palette = {
  bg: '#0D0D1A',
  surface: '#161628',
  surface2: '#1E1E38',
  text: '#EEEEF5',
  textDim: '#8888AA',
  accent: '#FF3A4F',
  border: '#FFFFFF20',
  borderFaint: '#FFFFFF10',
};

/** Colore per tipo parte (attack/defense/stamina/balance). */
export const typeColors: Record<string, string> = {
  attack: '#FF3A4F',
  defense: '#3ABFFF',
  stamina: '#2EE6A8',
  balance: '#FFB347',
};

/** Colore per asse stat (3 assi reali Beyblade X). */
export const statColors = {
  atk: '#FF3A4F',
  def: '#3ABFFF',
  sta: '#2EE6A8',
} as const;
