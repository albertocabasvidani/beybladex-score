#!/usr/bin/env node
/**
 * sync-parts.js — Sincronizza il registry parti dal sito combo (build-time, MAI runtime).
 *
 * Sorgente di verità: data/parts.json del repo `beyblade-x-combo-finder` (branch master).
 * Output:            packages/shared/src/parts/bundled-parts.json (committato, inlinato da Metro).
 *
 * Comportamento:
 *   - Scarica parts.json, valida lo schema, scrive bundled-parts.json.
 *   - Schema rotto  → exit 1 (blocca il build con dati corrotti).
 *   - Rete KO       → se bundled-parts.json esiste già, warn + exit 0 (build offline OK);
 *                     altrimenti exit 1 (non c'è nulla da bundlare).
 *   - Stat mancanti → solo warning di copertura (le stat sono opzionali, vedi piano builder).
 *
 * Uso:
 *   node packages/mobile/scripts/sync-parts.js            # scarica da GitHub
 *   node packages/mobile/scripts/sync-parts.js --local P  # usa un parts.json locale (no rete)
 */
const fs = require('fs');
const path = require('path');

const RAW_URL =
  'https://raw.githubusercontent.com/albertocabasvidani/beyblade-x-combo-finder/master/data/parts.json';

const OUT_PATH = path.join(__dirname, '..', '..', 'shared', 'src', 'parts', 'bundled-parts.json');

const CATEGORIES = [
  'blades',
  'lockChips',
  'mainBlades',
  'assistBlades',
  'overBlades',
  'ratchets',
  'bits',
];

// Slug "kebab-ish": segmenti alfanumerici separati da "-". Case-insensitive perché alcuni
// ratchet hanno prefissi maiuscoli (es. "M-85" = ratchet in metallo).
const SLUG = /^[A-Za-z0-9]+(-[A-Za-z0-9]+)*$/;
const TYPES = new Set(['attack', 'defense', 'stamina', 'balance']);

function fail(msg) {
  console.error(`\n[sync-parts] SCHEMA NON VALIDO: ${msg}`);
  console.error('[sync-parts] bundled-parts.json NON aggiornato.\n');
  process.exit(1);
}

function validate(data) {
  if (!data || typeof data !== 'object') fail('root non è un oggetto');
  if (typeof data.version !== 'string' || !data.version) fail('manca "version"');
  for (const cat of CATEGORIES) {
    if (!Array.isArray(data[cat])) fail(`categoria "${cat}" mancante o non array`);
  }

  const errors = [];
  const check = (cat, fn) => {
    data[cat].forEach((p, i) => {
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

  if (errors.length) {
    fail(`${errors.length} parti non valide:\n  - ${errors.slice(0, 25).join('\n  - ')}`);
  }

  const bitsNoType = data.bits.filter((p) => !TYPES.has(p.type)).length;
  if (bitsNoType > 0) {
    console.warn(`[sync-parts] ${bitsNoType} bit senza type (es. "operate"): filtro tipo non li includerà.`);
  }
}

function reportStatsCoverage(data) {
  const withStats = (arr) => arr.filter((p) => p.stats).length;
  const lines = [];
  for (const cat of ['blades', 'bits', 'ratchets', 'mainBlades']) {
    const total = data[cat].length;
    const n = withStats(data[cat]);
    lines.push(`${cat}: ${n}/${total}`);
  }
  const total = CATEGORIES.reduce((s, c) => s + data[c].length, 0);
  console.log(`[sync-parts] ${total} parti, versione ${data.version}.`);
  console.log(`[sync-parts] copertura stat (ATK/DEF/STA): ${lines.join(', ')}.`);
  const anyStats = CATEGORIES.some((c) => withStats(data[c]) > 0);
  if (!anyStats) {
    console.warn(
      '[sync-parts] AVVISO: nessuna parte ha stat. Il radar resterà nascosto ("stats non ' +
        'disponibili") finché il sito combo non popola il campo stats. Atteso al momento.'
    );
  }
}

async function loadSource() {
  const localFlag = process.argv.indexOf('--local');
  if (localFlag !== -1 && process.argv[localFlag + 1]) {
    const p = process.argv[localFlag + 1];
    console.log(`[sync-parts] sorgente locale: ${p}`);
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  console.log(`[sync-parts] download: ${RAW_URL}`);
  const res = await fetch(RAW_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  let data;
  try {
    data = await loadSource();
  } catch (err) {
    if (fs.existsSync(OUT_PATH)) {
      console.warn(
        `[sync-parts] rete non disponibile (${err.message}). Mantengo bundled-parts.json esistente.`
      );
      process.exit(0);
    }
    console.error(`[sync-parts] download fallito (${err.message}) e nessun bundled-parts.json locale.`);
    process.exit(1);
  }

  validate(data);
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(data, null, 2) + '\n');
  reportStatsCoverage(data);
  console.log(`[sync-parts] scritto ${path.relative(process.cwd(), OUT_PATH)}`);
}

main();
