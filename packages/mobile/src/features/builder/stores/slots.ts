/**
 * Logica pura degli slot del Combo Builder (data-driven, niente toggle): quali slot sono
 * disponibili dipende dalle parti scelte. Estratta dallo store per essere testabile in isolamento
 * (nessuna dipendenza da zustand/AsyncStorage; solo tipi da @beybladex/shared).
 */
import type { PartStats, AnyPart, PartCategory } from '@beybladex/shared';

/**
 * Parte selezionata in uno slot. `stats` opzionale (molte parti non le hanno). `integratedRatchet`
 * marca le parti che inglobano il ratchet (blade UX tipo Bullet Griffon, Ratchet Integrated Bit
 * tipo Operate/Turbo): quando selezionate, lo slot ratchet va escluso.
 */
export interface SelectedPart {
  id: string;
  name: string;
  stats?: PartStats;
  integratedRatchet?: boolean;
}

/** Mappa categoria → parte selezionata. Gli slot effettivi dipendono dalle parti scelte (computeSlots). */
export type SelectedParts = Partial<Record<PartCategory, SelectedPart>>;

export const emptyStats: PartStats = { atk: 0, def: 0, sta: 0 };

/** Converte una parte del registry in SelectedPart (id/name/stats/integratedRatchet). */
export function toSelectedPart(part: AnyPart): SelectedPart {
  const p = part as { stats?: PartStats; integratedRatchet?: boolean };
  return {
    id: part.id,
    name: part.name,
    stats: p.stats,
    ...(p.integratedRatchet ? { integratedRatchet: true } : {}),
  };
}

/** Le lame del sistema Custom (CX): mutuamente esclusive con il blade standard (BX/UX). */
export const CX_LAMA_CATEGORIES: PartCategory[] = ['lockChip', 'mainBlade', 'assistBlade', 'overBlade'];

/** Ordine canonico degli slot (rendering + label combo). Tutti i menù sono mostrati; computeSlots ne abilita un sottoinsieme. */
export const SLOT_ORDER: PartCategory[] = [
  'lockChip',
  'blade',
  'mainBlade',
  'assistBlade',
  'overBlade',
  'ratchet',
  'bit',
];

export type SlotReason = 'family' | 'integratedRatchet';
export interface SlotState {
  category: PartCategory;
  enabled: boolean;
  /** Motivo della disabilitazione (per la UI). */
  reason?: SlotReason;
}

/** True se una qualsiasi parte selezionata ingloba il ratchet (→ slot ratchet escluso). */
export function ratchetIsIncluded(parts: SelectedParts): boolean {
  return !!parts.blade?.integratedRatchet || !!parts.bit?.integratedRatchet;
}

/**
 * Stato di ogni slot in base alle parti selezionate (data-driven, niente toggle):
 * - blade (BX/UX) e lame CX (lockChip/mainBlade/assistBlade/overBlade) sono mutuamente esclusive;
 * - lo slot ratchet è disabilitato se una parte selezionata lo include;
 * - il bit è sempre disponibile (anche Operate/Turbo si scelgono lì).
 */
export function computeSlots(parts: SelectedParts): SlotState[] {
  const hasStandard = !!parts.blade;
  const hasCx = CX_LAMA_CATEGORIES.some((c) => !!parts[c]);
  const ratchetIncluded = ratchetIsIncluded(parts);

  return SLOT_ORDER.map((category): SlotState => {
    if (category === 'bit') return { category, enabled: true };
    if (category === 'ratchet') {
      return ratchetIncluded
        ? { category, enabled: false, reason: 'integratedRatchet' }
        : { category, enabled: true };
    }
    if (category === 'blade') {
      return hasCx ? { category, enabled: false, reason: 'family' } : { category, enabled: true };
    }
    // Lame CX
    return hasStandard ? { category, enabled: false, reason: 'family' } : { category, enabled: true };
  });
}

/** True se la combo è completa e salvabile: lama valida + bit + ratchet (se non incluso). */
export function comboComplete(parts: SelectedParts): boolean {
  const hasStandard = !!parts.blade;
  const hasCx = !!parts.lockChip && !!parts.mainBlade && !!parts.assistBlade;
  if (!hasStandard && !hasCx) return false;
  if (!parts.bit) return false;
  if (!ratchetIsIncluded(parts) && !parts.ratchet) return false;
  return true;
}

/** Somma grezza delle stat dei pezzi selezionati, senza pesi (pezzi senza stat = 0). */
export function sumStats(parts: SelectedParts): PartStats {
  const acc: PartStats = { atk: 0, def: 0, sta: 0 };
  for (const p of Object.values(parts)) {
    if (p?.stats) {
      acc.atk += p.stats.atk;
      acc.def += p.stats.def;
      acc.sta += p.stats.sta;
    }
  }
  return acc;
}
