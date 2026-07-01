/**
 * Registry parti — accesso tipizzato al dataset bundlato.
 *
 * `bundled-parts.json` è importato STATICAMENTE: Metro lo inlina nel bundle Hermes → lettura
 * istantanea, offline by-design, nessun fetch a runtime. Aggiornato a build-time dal sync.
 */
import bundled from './bundled-parts.json';
import type {
  PartsRegistry,
  Blade,
  Bit,
  Ratchet,
  LockChip,
  MainBlade,
  AssistBlade,
  OverBlade,
  AnyPart,
  PartCategory,
  PartStats,
  PartWithCategory,
  ComboLine,
} from './types';

// `let` (non `const`): a runtime il mobile può sostituirlo con un dataset più fresco scaricato e
// validato (vedi setRegistry). Tutti i getter leggono questo binding, quindi lo swap è trasparente.
// Il web non chiama mai setRegistry → resta sul bundle.
let registry = bundled as unknown as PartsRegistry;

export function getRegistry(): PartsRegistry {
  return registry;
}

export function getPartsVersion(): string {
  return registry.version;
}

export function getBlades(): Blade[] {
  return registry.blades;
}
export function getBits(): Bit[] {
  return registry.bits;
}
export function getRatchets(): Ratchet[] {
  return registry.ratchets;
}
export function getLockChips(): LockChip[] {
  return registry.lockChips;
}
export function getMainBlades(): MainBlade[] {
  return registry.mainBlades;
}
export function getAssistBlades(): AssistBlade[] {
  return registry.assistBlades;
}
export function getOverBlades(): OverBlade[] {
  return registry.overBlades;
}

/** Parti del sistema Custom (CX): lock chip, main blade, assist blade, over blade. */
export function getCxParts(): {
  lockChips: LockChip[];
  mainBlades: MainBlade[];
  assistBlades: AssistBlade[];
  overBlades: OverBlade[];
} {
  return {
    lockChips: registry.lockChips,
    mainBlades: registry.mainBlades,
    assistBlades: registry.assistBlades,
    overBlades: registry.overBlades,
  };
}

export function getPartsByCategory(category: PartCategory): AnyPart[] {
  switch (category) {
    case 'blade':
      return registry.blades;
    case 'lockChip':
      return registry.lockChips;
    case 'mainBlade':
      return registry.mainBlades;
    case 'assistBlade':
      return registry.assistBlades;
    case 'overBlade':
      return registry.overBlades;
    case 'ratchet':
      return registry.ratchets;
    case 'bit':
      return registry.bits;
  }
}

// Indice id → {part, category}, costruito una sola volta al primo accesso.
let _index: Map<string, PartWithCategory> | null = null;
function index(): Map<string, PartWithCategory> {
  if (_index) return _index;
  const m = new Map<string, PartWithCategory>();
  const cats: PartCategory[] = [
    'blade',
    'lockChip',
    'mainBlade',
    'assistBlade',
    'overBlade',
    'ratchet',
    'bit',
  ];
  for (const cat of cats) {
    for (const part of getPartsByCategory(cat)) {
      m.set(part.id, { ...part, category: cat } as PartWithCategory);
    }
  }
  _index = m;
  return m;
}

export function getPartById(id: string): PartWithCategory | undefined {
  return index().get(id);
}

/** Tutte le parti con la `category` annessa. Usato per il diff/naming degli aggiornamenti dataset. */
export function getAllParts(): PartWithCategory[] {
  return Array.from(index().values());
}

/**
 * Linea di un blade BX/UX dato l'id. Serve a derivare la `line` di una combo "standard" al
 * salvataggio (il blade scelto sa se è BX o UX). Fallback 'bx' se l'id non si risolve.
 */
export function getBladeLine(id: string): ComboLine {
  const line = (getPartById(id) as { line?: ComboLine } | undefined)?.line;
  return line ?? 'bx';
}

export function getCategoryOf(id: string): PartCategory | undefined {
  return index().get(id)?.category;
}

/** True se la parte espone le 3 stat (per decidere se mostrare il radar). */
export function hasStats(part: { stats?: PartStats } | null | undefined): part is { stats: PartStats } {
  return !!part?.stats;
}

// --- Massimi delle stat, calcolati dai dati reali ("il massimo è quello sul sito"). ---

const STAT_AXES: (keyof PartStats)[] = ['atk', 'def', 'sta'];

function maxByAxis(parts: { stats?: PartStats }[]): PartStats {
  const r: PartStats = { atk: 0, def: 0, sta: 0 };
  for (const p of parts) {
    if (!p.stats) continue;
    for (const a of STAT_AXES) if (p.stats[a] > r[a]) r[a] = p.stats[a];
  }
  return r;
}

const _catMax = new Map<PartCategory, PartStats>();
/** Massimo per asse osservato nella categoria (per le StatBar di una singola parte). */
export function getCategoryStatMax(category: PartCategory): PartStats {
  let v = _catMax.get(category);
  if (!v) {
    v = maxByAxis(getPartsByCategory(category) as { stats?: PartStats }[]);
    _catMax.set(category, v);
  }
  return v;
}

// Parti che portano stat in una combo, per linea. BX/UX: blade+ratchet+bit. CX: mainBlade+ratchet+bit
// (lock chip / assist blade / over blade non hanno stat nel dataset → non contribuiscono).
const COMBO_STAT_CATEGORIES: Record<ComboLine, PartCategory[]> = {
  bx: ['blade', 'ratchet', 'bit'],
  ux: ['blade', 'ratchet', 'bit'],
  cx: ['mainBlade', 'ratchet', 'bit'],
};

const _comboMaxByLine: Partial<Record<ComboLine, PartStats>> = {};
/**
 * Massimo per asse del totale di una combo, per linea = somma dei massimi di categoria delle parti
 * che portano le stat (vedi COMBO_STAT_CATEGORIES). È la scala del radar: il minimo è 0, il massimo
 * è la somma dei massimi sul sito. Clamp ≥1 per asse per non rompere la normalizzazione del
 * RadarChart se una categoria fosse interamente priva di stat.
 */
export function getComboStatMax(line: ComboLine = 'bx'): PartStats {
  const cached = _comboMaxByLine[line];
  if (cached) return cached;
  const sum: PartStats = { atk: 0, def: 0, sta: 0 };
  for (const cat of COMBO_STAT_CATEGORIES[line]) {
    const m = getCategoryStatMax(cat);
    sum.atk += m.atk;
    sum.def += m.def;
    sum.sta += m.sta;
  }
  const clamped: PartStats = {
    atk: Math.max(1, sum.atk),
    def: Math.max(1, sum.def),
    sta: Math.max(1, sum.sta),
  };
  _comboMaxByLine[line] = clamped;
  return clamped;
}

/**
 * Sostituisce il dataset attivo (usato a runtime dal mobile dopo aver scaricato e VALIDATO un
 * `parts.json` più fresco) e azzera tutte le cache memoizzate, così i getter ricalcolano sul nuovo
 * registry. Idempotente. Il web non lo chiama → resta sul bundle importato staticamente.
 */
export function setRegistry(next: PartsRegistry): void {
  registry = next;
  _index = null;
  _catMax.clear();
  (Object.keys(_comboMaxByLine) as ComboLine[]).forEach((k) => delete _comboMaxByLine[k]);
}
