/**
 * Tipi del registry parti Beyblade X.
 *
 * Schema canonico = quello del sito combo (`beyblade combos/src/lib/types.ts`, sezione registry).
 * Fonte di verità unica: `data/parts.json` del sito, sincronizzato in `bundled-parts.json` a
 * build-time (vedi `packages/mobile/scripts/sync-parts.js`). NON modificare a mano i dati: si
 * rigenerano dal sync.
 */

export type BladeType = 'attack' | 'defense' | 'stamina' | 'balance';
export type BitType = 'attack' | 'defense' | 'stamina' | 'balance';
export type ComboLine = 'bx' | 'ux' | 'cx';

/**
 * Stat di gioco a 3 assi (Attack/Defense/Stamina, 0-100), dall'infobox Fandom della pagina
 * dedicata della parte. OPZIONALE: molte parti non le hanno (ratchet quasi sempre, parti nuove)
 * → resta `undefined` e la UI degrada (niente radar, badge "stats non disponibili"). Vedi B3.
 */
export interface PartStats {
  atk: number;
  def: number;
  sta: number;
}

export interface Blade {
  id: string;
  name: string;
  nameWestern?: string;
  aliases?: string[];
  type: BladeType;
  line: 'bx' | 'ux';
  integratedRatchet?: boolean;
  releaseSet?: string;
  stats?: PartStats;
}

export interface LockChip {
  id: string;
  name: string;
  nameWestern?: string;
  line: 'cx';
}

export interface MainBlade {
  id: string;
  name: string;
  nameWestern?: string;
  type?: BladeType;
  line: 'cx';
  stats?: PartStats;
}

export interface AssistBlade {
  id: string;
  name: string;
  nameWestern?: string;
  shortName: string;
  line: 'cx';
}

export interface OverBlade {
  id: string;
  name: string;
  nameWestern?: string;
  line: 'cx';
}

export interface Ratchet {
  id: string;
  name: string;
  sides: number;
  height: number;
  stats?: PartStats;
}

export interface Bit {
  id: string;
  name: string;
  type: BitType;
  shortName?: string;
  aliases?: string[];
  stats?: PartStats;
  /** Ratchet Integrated Bit (es. Operate, Turbo): ratchet+bit in un'unica parte → combo senza ratchet. */
  integratedRatchet?: boolean;
}

export interface PartsRegistry {
  version: string;
  blades: Blade[];
  lockChips: LockChip[];
  mainBlades: MainBlade[];
  assistBlades: AssistBlade[];
  overBlades: OverBlade[];
  ratchets: Ratchet[];
  bits: Bit[];
}

/** Categorie del registry (chiavi di `PartsRegistry` meno `version`). */
export type PartCategory =
  | 'blade'
  | 'lockChip'
  | 'mainBlade'
  | 'assistBlade'
  | 'overBlade'
  | 'ratchet'
  | 'bit';

/** Unione di tutte le parti — usata dai componenti generici (card, picker). */
export type AnyPart = Blade | LockChip | MainBlade | AssistBlade | OverBlade | Ratchet | Bit;

/** Parte con la `category` annessa (comoda per liste eterogenee). */
export type PartWithCategory = AnyPart & { category: PartCategory };
