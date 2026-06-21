import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MatchRecord } from '../statsStore';
import { aggregateCombos, sortCombos, matchupsFor } from '../aggregation';
import { MatchupRow } from '../components/MatchupRow';
import { sp } from '../statsTheme';

/** Matchup: scegli una combo (chip) → esiti testa a testa contro ciascun avversario (barre). */
export function MatchupsScreen({
  records,
  onSelectCombo,
}: {
  records: MatchRecord[];
  onSelectCombo: (key: string) => void;
}) {
  const { t } = useTranslation();
  const combos = useMemo(() => sortCombos(aggregateCombos(records), 'games'), [records]);
  const [selected, setSelected] = useState<string | null>(null);
  const activeKey = selected ?? combos[0]?.key ?? null;
  const activeCombo = combos.find((c) => c.key === activeKey);
  const matchups = useMemo(
    () => (activeKey ? matchupsFor(activeKey, records) : []),
    [activeKey, records]
  );

  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.dim}>{t('stats.empty.range')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {combos.map((c) => {
          const active = c.key === activeKey;
          return (
            <Pressable
              key={c.key}
              onPress={() => setSelected(c.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                {c.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeCombo ? (
          <Text style={styles.title}>{t('stats.matchups.title', { name: activeCombo.name })}</Text>
        ) : null}
        {matchups.length === 0 ? (
          <Text style={styles.dim}>{t('stats.combo.noMatchups')}</Text>
        ) : (
          matchups.map((m) => (
            <MatchupRow key={m.opponentKey} matchup={m} onPress={() => onSelectCombo(m.opponentKey)} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  chipScroll: { flexGrow: 0 },
  chips: { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  chip: {
    backgroundColor: sp.surface2,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: sp.border,
    maxWidth: 180,
  },
  chipActive: { backgroundColor: sp.gold, borderColor: sp.gold },
  chipText: { color: sp.dim, fontSize: 13, fontWeight: '700' },
  chipTextActive: { color: '#0f172a' },
  content: { paddingHorizontal: 14, paddingBottom: 28, gap: 8 },
  title: { color: sp.text, fontSize: 14, fontWeight: '800', marginBottom: 2 },
  empty: { padding: 32, alignItems: 'center' },
  dim: { color: sp.dim, fontSize: 13, textAlign: 'center' },
});
