import { SLOT_ORDER } from '../builder/stores/slots';
import type { RecordedBey } from './statsStore';
import { sp } from './statsTheme';

/** Etichetta "pezzo1 · pezzo2 · …" nell'ordine canonico degli slot. */
export function partsLabel(parts: RecordedBey['parts']): string {
  const order = (cat: string) => {
    const i = SLOT_ORDER.indexOf(cat as (typeof SLOT_ORDER)[number]);
    return i < 0 ? 99 : i;
  };
  return [...parts]
    .sort((a, b) => order(a.category) - order(b.category))
    .map((p) => p.name)
    .join(' · ');
}

export function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}

export function diffColor(n: number): string {
  if (n > 0) return sp.win;
  if (n < 0) return sp.loss;
  return sp.dim;
}
