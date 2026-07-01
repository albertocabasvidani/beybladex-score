/**
 * Test self-running del validatore + di setRegistry. Nessun framework: il monorepo non ne ha uno.
 * Passa `tsc --noEmit` (parte di `yarn type-check`) e si esegue con:
 *
 *   npx tsx packages/shared/src/parts/validator.test.ts
 *
 * Scopo: (1) il `bundled-parts.json` reale deve validare; (2) le mutazioni note vanno rifiutate
 * (guardia anti-deriva rispetto a `sync-parts.js`); (3) `setRegistry` azzera davvero le cache.
 * Fallisce con throw (exit ≠ 0) se una asserzione non regge.
 */
import bundled from './bundled-parts.json';
import { validatePartsRegistry } from './validator';
import { setRegistry, getComboStatMax, getPartById } from './registry';
import type { PartsRegistry } from './types';

let failures = 0;
function assert(cond: boolean, msg: string): void {
  console.log(`${cond ? '  ok  ' : 'FAIL  '}${msg}`);
  if (!cond) failures++;
}

const clone = (): any => JSON.parse(JSON.stringify(bundled));

// 1. Il dataset bundlato reale deve essere valido.
assert(validatePartsRegistry(bundled).ok === true, 'bundled-parts.json valido');

// 2. Rifiuti attesi (rispecchiano le regole di sync-parts.js).
const badType = clone();
badType.blades[0].type = 'invalido';
assert(validatePartsRegistry(badType).ok === false, 'blade con type errato rifiutata');

const missingCat = clone();
delete missingCat.ratchets;
assert(validatePartsRegistry(missingCat).ok === false, 'categoria mancante rifiutata');

const badId = clone();
badId.bits[0].id = 'id con spazi';
assert(validatePartsRegistry(badId).ok === false, 'id non-slug rifiutato');

const noVersion = clone();
noVersion.version = '';
assert(validatePartsRegistry(noVersion).ok === false, 'version vuota rifiutata');

// 3. setRegistry azzera le cache memoizzate (_index e le cache stat).
const beforeAtk = getComboStatMax('bx').atk;
const swapped = clone() as PartsRegistry;
swapped.blades.push({
  id: 'zzz-test-blade',
  name: 'Test',
  type: 'attack',
  line: 'bx',
  stats: { atk: 999, def: 1, sta: 1 },
});
setRegistry(swapped);
assert(getPartById('zzz-test-blade') !== undefined, 'setRegistry: nuovo id nell indice (cache _index azzerata)');
assert(getComboStatMax('bx').atk >= 999, 'setRegistry: getComboStatMax ricalcolato (cache stat azzerata)');

// Ripristino il bundle originale per igiene.
setRegistry(bundled as unknown as PartsRegistry);
assert(getComboStatMax('bx').atk === beforeAtk, 'setRegistry: ripristino bundle riporta lo stat max');

if (failures > 0) throw new Error(`${failures} asserzioni fallite`);
console.log('Tutte le asserzioni passate.');
