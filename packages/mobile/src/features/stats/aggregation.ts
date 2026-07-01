/**
 * Aggregazioni pure sui match registrati (niente zustand/React qui → testabili in isolamento).
 * Il "tempo" è sempre passato come parametro `now` per non dipendere da Date.now().
 */
import type { ComboLine, FinishType, PartCategory } from '@beybladex/shared';
import { FINISH_ORDER } from '@beybladex/shared';
import type { MatchRecord, RecordedBey, RecordedSide } from './statsStore';

export type TimeRange = 'all' | 'today' | '7d' | '30d' | 'custom';

/** Intervallo personalizzato: estremi inclusivi in ms (from = inizio giorno, to = fine giorno). */
export interface CustomRange {
  from: number;
  to: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Filtra i match per finestra temporale (rispetto a `now`; `custom` usa gli estremi passati). */
export function filterByRange(
  records: MatchRecord[],
  range: TimeRange,
  now: number,
  custom?: CustomRange | null
): MatchRecord[] {
  if (range === 'all') return records;
  if (range === 'custom') {
    if (!custom) return records;
    return records.filter((r) => r.playedAt >= custom.from && r.playedAt <= custom.to);
  }
  const cutoff =
    range === 'today' ? startOfDay(now) : range === '7d' ? now - 7 * DAY_MS : now - 30 * DAY_MS;
  return records.filter((r) => r.playedAt >= cutoff);
}

/**
 * Tiene i `limit` match più recenti (per `playedAt`). Gating della versione gratuita delle
 * analitiche: il free vede solo gli ultimi N match, il Pro tutti. Non muta l'input; l'ordine del
 * risultato è irrilevante per le aggregazioni a valle (che riordinano da sé).
 */
export function limitToRecent(records: MatchRecord[], limit: number): MatchRecord[] {
  if (limit <= 0) return [];
  if (records.length <= limit) return records;
  return [...records].sort((a, b) => b.playedAt - a.playedAt).slice(0, limit);
}

function emptyFinish(): Record<FinishType, number> {
  return { spin: 0, burst: 0, over: 0, xtreme: 0 };
}

/** Lati di un match dal punto di vista di ciascuna Bey (me vs opp + esito). */
function sidesOf(r: MatchRecord): { me: RecordedSide; opp: RecordedSide; won: boolean }[] {
  return [
    { me: r.player1, opp: r.player2, won: r.winner === 'player1' },
    { me: r.player2, opp: r.player1, won: r.winner === 'player2' },
  ];
}

export interface ComboAggregate {
  key: string;
  name: string;
  line: ComboLine;
  parts: RecordedBey['parts'];
  freeform: boolean;
  games: number;
  wins: number;
  losses: number;
  /** 0..1. */
  winRate: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  /** Differenza punti media per partita. */
  avgDiff: number;
  /** Finish messi a segno (propri) e subiti (avversario), per tipo. */
  finishFor: Record<FinishType, number>;
  finishAgainst: Record<FinishType, number>;
  /** Ultima volta giocata (timestamp). */
  lastPlayed: number;
}

/** Aggrega tutti i match per combo (chiave d'identità). Snapshot nome/parti = il più recente. */
export function aggregateCombos(records: MatchRecord[]): ComboAggregate[] {
  const map = new Map<string, ComboAggregate>();
  // Ordine cronologico: l'ultima iterazione lascia il nome/parti più recenti.
  const ordered = [...records].sort((a, b) => a.playedAt - b.playedAt);
  for (const r of ordered) {
    for (const { me, opp, won } of sidesOf(r)) {
      const key = me.bey.comboKey;
      let a = map.get(key);
      if (!a) {
        a = {
          key,
          name: me.bey.name,
          line: me.bey.line,
          parts: me.bey.parts,
          freeform: !!me.bey.freeform,
          games: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          pointDiff: 0,
          avgDiff: 0,
          finishFor: emptyFinish(),
          finishAgainst: emptyFinish(),
          lastPlayed: 0,
        };
        map.set(key, a);
      }
      a.games += 1;
      if (won) a.wins += 1;
      else a.losses += 1;
      a.pointsFor += me.score;
      a.pointsAgainst += opp.score;
      for (const f of FINISH_ORDER) {
        a.finishFor[f] += me.finishCounts[f] ?? 0;
        a.finishAgainst[f] += opp.finishCounts[f] ?? 0;
      }
      a.name = me.bey.name;
      a.line = me.bey.line;
      a.parts = me.bey.parts;
      a.freeform = !!me.bey.freeform;
      a.lastPlayed = Math.max(a.lastPlayed, r.playedAt);
    }
  }
  for (const a of map.values()) {
    a.winRate = a.games > 0 ? a.wins / a.games : 0;
    a.pointDiff = a.pointsFor - a.pointsAgainst;
    a.avgDiff = a.games > 0 ? a.pointDiff / a.games : 0;
  }
  return [...map.values()];
}

export type ComboSort = 'winRate' | 'pointDiff' | 'games' | 'recent';

/** Ordina la leaderboard. A parità di metrica principale, più partite vince (più affidabile). */
export function sortCombos(combos: ComboAggregate[], sort: ComboSort): ComboAggregate[] {
  const arr = [...combos];
  switch (sort) {
    case 'winRate':
      return arr.sort((a, b) => b.winRate - a.winRate || b.games - a.games);
    case 'pointDiff':
      return arr.sort((a, b) => b.pointDiff - a.pointDiff || b.games - a.games);
    case 'games':
      return arr.sort((a, b) => b.games - a.games || b.winRate - a.winRate);
    case 'recent':
      return arr.sort((a, b) => b.lastPlayed - a.lastPlayed);
  }
}

export interface Matchup {
  opponentKey: string;
  opponentName: string;
  opponentLine: ComboLine;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
}

/** Matchup di una combo: esiti contro ciascun avversario distinto. */
export function matchupsFor(key: string, records: MatchRecord[]): Matchup[] {
  const map = new Map<string, Matchup>();
  for (const r of records) {
    for (const { me, opp, won } of sidesOf(r)) {
      if (me.bey.comboKey !== key) continue;
      if (opp.bey.comboKey === key) continue; // specchio: stessa combo su entrambi i lati
      let m = map.get(opp.bey.comboKey);
      if (!m) {
        m = {
          opponentKey: opp.bey.comboKey,
          opponentName: opp.bey.name,
          opponentLine: opp.bey.line,
          games: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
        };
        map.set(opp.bey.comboKey, m);
      }
      m.games += 1;
      if (won) m.wins += 1;
      else m.losses += 1;
      m.opponentName = opp.bey.name;
    }
  }
  for (const m of map.values()) m.winRate = m.games > 0 ? m.wins / m.games : 0;
  return [...map.values()].sort((a, b) => b.games - a.games || b.winRate - a.winRate);
}

/** Ultimi `limit` esiti di una combo in ordine cronologico (true = vittoria) — per la "forma". */
export function formFor(key: string, records: MatchRecord[], limit = 8): boolean[] {
  const out: { t: number; won: boolean }[] = [];
  for (const r of records) {
    for (const { me, won } of sidesOf(r)) {
      if (me.bey.comboKey === key) out.push({ t: r.playedAt, won });
    }
  }
  return out
    .sort((a, b) => a.t - b.t)
    .slice(-limit)
    .map((x) => x.won);
}

export interface PartUsage {
  partId: string;
  partName: string;
  category: PartCategory;
  games: number;
  wins: number;
  losses: number;
  winRate: number;
}

/** Aggrega gli esiti per singola parte (una partita conta per ogni parte della Bey usata). */
export function partUsage(records: MatchRecord[]): PartUsage[] {
  const map = new Map<string, PartUsage>();
  for (const r of records) {
    for (const { me, won } of sidesOf(r)) {
      for (const part of me.bey.parts) {
        let u = map.get(part.id);
        if (!u) {
          u = {
            partId: part.id,
            partName: part.name,
            category: part.category,
            games: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
          };
          map.set(part.id, u);
        }
        u.games += 1;
        if (won) u.wins += 1;
        else u.losses += 1;
        u.partName = part.name;
      }
    }
  }
  for (const u of map.values()) u.winRate = u.games > 0 ? u.wins / u.games : 0;
  return [...map.values()].sort((a, b) => b.games - a.games || b.winRate - a.winRate);
}

export interface OverallSummary {
  totalGames: number;
  totalCombos: number;
  /** Combo più giocata (o null se nessun match). */
  mostPlayed: ComboAggregate | null;
  /** Miglior combo per win-rate con almeno `minGames` partite. */
  topByWinRate: ComboAggregate | null;
}

export function overallSummary(records: MatchRecord[], minGames = 3): OverallSummary {
  const combos = aggregateCombos(records);
  const eligible = combos.filter((c) => c.games >= minGames);
  const pool = eligible.length > 0 ? eligible : combos;
  return {
    totalGames: records.length,
    totalCombos: combos.length,
    mostPlayed: combos.length
      ? [...combos].sort((a, b) => b.games - a.games)[0]
      : null,
    topByWinRate: pool.length
      ? [...pool].sort((a, b) => b.winRate - a.winRate || b.games - a.games)[0]
      : null,
  };
}
