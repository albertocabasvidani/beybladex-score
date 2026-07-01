/**
 * Validatore puro dello schema del registry parti.
 *
 * Usato a RUNTIME (mobile) prima di sostituire il registry con un `parts.json` scaricato: se lo
 * schema è rotto il file va scartato e si tiene il dataset precedente. Rispecchia 1:1 le regole di
 * build-time in `packages/mobile/scripts/sync-parts.js` (funzione `validate()`). Le due copie vanno
 * tenute allineate — `validator.test.ts` fa da guardia contro la deriva.
 *
 * Nessuna dipendenza Node (niente `process.exit`): resta puro TS condivisibile con web e mobile.
 */
import type { PartsRegistry } from './types';

const CATEGORIES = [
  'blades',
  'lockChips',
  'mainBlades',
  'assistBlades',
  'overBlades',
  'ratchets',
  'bits',
] as const;

// Slug "kebab-ish": segmenti alfanumerici separati da "-". Case-insensitive perché alcuni ratchet
// hanno prefissi maiuscoli (es. "M-85" = ratchet in metallo).
const SLUG = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;
const TYPES = new Set(['attack', 'defense', 'stamina', 'balance']);

export type ValidationResult =
  | { ok: true; data: PartsRegistry }
  | { ok: false; errors: string[] };

export function validatePartsRegistry(data: unknown): ValidationResult {
  const errors: string[] = [];
  const d = data as Record<string, any>;

  if (!d || typeof d !== 'object') return { ok: false, errors: ['root non è un oggetto'] };
  if (typeof d.version !== 'string' || !d.version) errors.push('manca "version"');
  for (const cat of CATEGORIES) {
    if (!Array.isArray(d[cat])) errors.push(`categoria "${cat}" mancante o non array`);
  }
  // Se una categoria non è un array, fermarsi: iterare oltre crasherebbe.
  if (errors.length) return { ok: false, errors };

  const check = (cat: string, fn: (p: any) => string | null) => {
    (d[cat] as any[]).forEach((p, i) => {
      const where = `${cat}[${i}] (${p && p.id ? p.id : '?'})`;
      if (!p || typeof p !== 'object') return errors.push(`${where}: non è un oggetto`);
      if (typeof p.id !== 'string' || !SLUG.test(p.id)) errors.push(`${where}: id non valido`);
      if (typeof p.name !== 'string' || !p.name) errors.push(`${where}: name mancante`);
      const e = fn(p);
      if (e) errors.push(`${where}: ${e}`);
    });
  };

  // Le blade sono il cuore del dataset: type/line DEVONO essere validi.
  check('blades', (p) => {
    if (!TYPES.has(p.type)) return `type non valido (${p.type})`;
    if (p.line !== 'bx' && p.line !== 'ux') return `line non valida (${p.line})`;
    return null;
  });
  // Ratchet: height numerico obbligatorio; sides può essere null (ratchet speciali tipo "M-85").
  check('ratchets', (p) => {
    if (typeof p.height !== 'number') return 'height non numerico';
    if (p.sides !== null && typeof p.sides !== 'number') return 'sides non numerico né null';
    return null;
  });
  check('assistBlades', (p) => (typeof p.shortName === 'string' ? null : 'shortName mancante'));
  // bit.type, lockChip, mainBlade, overBlade: nessun vincolo bloccante (type bit talvolta assente).
  check('bits', () => null);
  check('lockChips', () => null);
  check('mainBlades', () => null);
  check('overBlades', () => null);

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: d as unknown as PartsRegistry };
}
