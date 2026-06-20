/**
 * Smoke test della logica data-driven del Combo Builder (computeSlots / comboComplete / ratchetIsIncluded
 * / sumStats). Pura, niente RN: esegui con `npx tsx packages/mobile/scripts/test-builder-slots.ts`.
 */
import {
  computeSlots,
  comboComplete,
  ratchetIsIncluded,
  sumStats,
  type SelectedParts,
} from '../src/features/builder/stores/slots';

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean) {
  if (cond) pass++;
  else {
    fail++;
    console.error(`  FAIL: ${name}`);
  }
}

const p = (id: string, integrated?: boolean, stats?: { atk: number; def: number; sta: number }): any => ({
  id,
  name: id,
  ...(integrated ? { integratedRatchet: true } : {}),
  ...(stats ? { stats } : {}),
});
const slot = (parts: SelectedParts, cat: string) => computeSlots(parts).find((s) => s.category === cat)!;
const en = (parts: SelectedParts, cat: string) => slot(parts, cat).enabled;
const reason = (parts: SelectedParts, cat: string) => slot(parts, cat).reason;

// 1) Combo vuota: tutti gli slot abilitati
check('vuoto: blade enabled', en({}, 'blade'));
check('vuoto: mainBlade enabled', en({}, 'mainBlade'));
check('vuoto: ratchet enabled', en({}, 'ratchet'));
check('vuoto: bit enabled', en({}, 'bit'));

// 2) Blade BX/UX normale → lame CX disabilitate (family), ratchet/bit attivi
const std: SelectedParts = { blade: p('shark-scale') };
check('std: lockChip disabled (family)', !en(std, 'lockChip') && reason(std, 'lockChip') === 'family');
check('std: mainBlade disabled', !en(std, 'mainBlade'));
check('std: ratchet enabled', en(std, 'ratchet'));
check('std: bit enabled', en(std, 'bit'));

// 3) Blade UX a ratchet integrato (Bullet Griffon) → slot ratchet disabilitato
const ux: SelectedParts = { blade: p('bullet-griffon', true) };
check('ux integrato: ratchet disabled (integratedRatchet)', !en(ux, 'ratchet') && reason(ux, 'ratchet') === 'integratedRatchet');
check('ux integrato: mainBlade disabled (family)', !en(ux, 'mainBlade'));
check('ux integrato: bit enabled', en(ux, 'bit'));

// 4) Ratchet Integrated Bit (Operate) nello slot bit → slot ratchet disabilitato
const opBit: SelectedParts = { blade: p('shark-scale'), bit: p('operate', true) };
check('operate: ratchet disabled (integratedRatchet)', !en(opBit, 'ratchet') && reason(opBit, 'ratchet') === 'integratedRatchet');
check('operate: ratchetIsIncluded', ratchetIsIncluded(opBit));

// 5) Lama CX (main blade) → blade standard disabilitato (family), lame CX attive
const cx: SelectedParts = { mainBlade: p('blast') };
check('cx: blade disabled (family)', !en(cx, 'blade') && reason(cx, 'blade') === 'family');
check('cx: lockChip enabled', en(cx, 'lockChip'));
check('cx: assistBlade enabled', en(cx, 'assistBlade'));
check('cx: ratchet enabled', en(cx, 'ratchet'));

// 6) comboComplete
check('complete: std blade+ratchet+bit', comboComplete({ blade: p('shark-scale'), ratchet: p('3-60'), bit: p('hexa') }));
check('complete: blade integrato + bit (no ratchet)', comboComplete({ blade: p('bullet-griffon', true), bit: p('hexa') }));
check('complete: blade + Operate (no ratchet)', comboComplete({ blade: p('shark-scale'), bit: p('operate', true) }));
check('complete: CX lockChip+mainBlade+assist+ratchet+bit', comboComplete({ lockChip: p('emperor'), mainBlade: p('blast'), assistBlade: p('heavy'), ratchet: p('9-60'), bit: p('kick') }));
check('incomplete: manca bit', !comboComplete({ blade: p('shark-scale'), ratchet: p('3-60') }));
check('incomplete: manca ratchet (non integrato)', !comboComplete({ blade: p('shark-scale'), bit: p('hexa') }));
check('incomplete: CX senza assist', !comboComplete({ lockChip: p('emperor'), mainBlade: p('blast'), ratchet: p('9-60'), bit: p('kick') }));
check('incomplete: vuoto', !comboComplete({}));

// 7) sumStats: somma e ignora le parti senza stat
const s = sumStats({ blade: p('a', false, { atk: 10, def: 5, sta: 2 }), ratchet: p('b', false, { atk: 1, def: 1, sta: 1 }), bit: p('c') });
check('sumStats somma e ignora senza stat', s.atk === 11 && s.def === 6 && s.sta === 3);

console.log(`\n${pass} passed, ${fail} failed.`);
if (fail > 0) process.exit(1);
