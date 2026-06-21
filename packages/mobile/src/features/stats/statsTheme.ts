/** Palette analitiche (allineata allo scoreboard slate) + helper di colore. */
export const sp = {
  bg: '#0f172a',
  surface: '#1e293b',
  surface2: '#162033',
  border: '#334155',
  text: '#e2e8f0',
  dim: '#94a3b8',
  faint: '#64748b',
  gold: '#fbbf24',
  accent: '#60a5fa',
  win: '#22c55e',
  loss: '#ef4444',
};

/** Verde (forte) → ambra (incerto) → rosso (debole) in base al win-rate 0..1. */
export function winRateColor(wr: number): string {
  if (wr >= 0.6) return '#22c55e';
  if (wr >= 0.45) return '#f59e0b';
  return '#ef4444';
}

/** Sotto questa soglia di partite il dato è statisticamente fragile (badge "campione ridotto"). */
export const LOW_SAMPLE = 5;
