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
} from './types';

const registry = bundled as unknown as PartsRegistry;

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

export function getCategoryOf(id: string): PartCategory | undefined {
  return index().get(id)?.category;
}

/** True se la parte espone le 3 stat (per decidere se mostrare il radar). */
export function hasStats(part: { stats?: PartStats } | null | undefined): part is { stats: PartStats } {
  return !!part?.stats;
}
