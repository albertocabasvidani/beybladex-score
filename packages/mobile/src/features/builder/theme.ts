/**
 * Palette e costanti del Builder. Estratte dal tema di bbxdeckbuild (che usava react-native-paper
 * MD3DarkTheme) e ridotte ai soli valori usati — niente dipendenza da Paper.
 */
import type { PartCategory } from '@beybladex/shared';

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

/**
 * Massimi per le StatBar di una singola parte, per categoria. Valori provvisori (le stat reali
 * non sono ancora nel dataset, vedi piano builder Parte A differita): andranno ritarati quando il
 * sito combo popolerà il campo `stats`. Riferimenti dall'infobox Fandom: blade ATK~55, bit ATK~40.
 */
export const STAT_MAX_BY_CATEGORY: Partial<Record<PartCategory, number>> = {
  blade: 100,
  mainBlade: 100,
  bit: 80,
  ratchet: 60,
};

/** Massimo per il radar di un combo (somma blade + bit + ratchet sui 3 assi). */
export const STAT_MAX_COMBO = 200;
