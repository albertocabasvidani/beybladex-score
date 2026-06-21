import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MatchRecord } from '../statsStore';
import { aggregateCombos, sortCombos, overallSummary, type ComboSort } from '../aggregation';
import { ComboRow } from '../components/ComboRow';
import { StatKpi } from '../components/charts';
import { sp } from '../statsTheme';
import { pct } from '../format';

const SORTS: { value: ComboSort; key: string }[] = [
  { value: 'winRate', key: 'stats.sort.winRate' },
  { value: 'pointDiff', key: 'stats.sort.pointDiff' },
  { value: 'games', key: 'stats.sort.games' },
  { value: 'recent', key: 'stats.sort.recent' },
];

/** Panoramica: KPI globali + ordinamento + leaderboard combo. */
export function OverviewScreen({
  records,
  onSelectCombo,
}: {
  records: MatchRecord[];
  onSelectCombo: (key: string) => void;
}) {
  const { t } = useTranslation();
  const [sort, setSort] = useState<ComboSort>('winRate');

  const combos = useMemo(() => aggregateCombos(records), [records]);
  const sorted = useMemo(() => sortCombos(combos, sort), [combos, sort]);
  const summary = useMemo(() => overallSummary(records), [records]);

  if (records.length === 0) {
    return (
      <View style={styles.emptyRange}>
        <Text style={styles.emptyText}>{t('stats.empty.range')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.kpis}>
        <StatKpi value={String(summary.totalGames)} label={t('stats.summary.games')} />
        <StatKpi value={String(summary.totalCombos)} label={t('stats.summary.combos')} />
        {summary.topByWinRate ? (
          <StatKpi
            value={pct(summary.topByWinRate.winRate)}
            label={t('stats.summary.topCombo')}
            sub={summary.topByWinRate.name}
            color={sp.win}
          />
        ) : null}
      </View>

      <View style={styles.sortRow}>
        {SORTS.map((s) => {
          const active = s.value === sort;
          return (
            <Pressable
              key={s.value}
              onPress={() => setSort(s.value)}
              style={[styles.sortChip, active && styles.sortChipActive]}
            >
              <Text style={[styles.sortText, active && styles.sortTextActive]}>{t(s.key)}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.list}>
        {sorted.map((c) => (
          <ComboRow key={c.key} combo={c} onPress={() => onSelectCombo(c.key)} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 14, paddingBottom: 28, gap: 12 },
  kpis: {
    flexDirection: 'row',
    backgroundColor: sp.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: sp.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sortChip: {
    backgroundColor: sp.surface2,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: sp.border,
  },
  sortChipActive: { backgroundColor: sp.gold, borderColor: sp.gold },
  sortText: { color: sp.dim, fontSize: 12, fontWeight: '700' },
  sortTextActive: { color: '#0f172a' },
  list: { gap: 8 },
  emptyRange: { padding: 32, alignItems: 'center' },
  emptyText: { color: sp.dim, fontSize: 14, textAlign: 'center' },
});
