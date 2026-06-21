import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { MatchRecord } from '../statsStore';
import { aggregateCombos, partUsage } from '../aggregation';
import { ComboRow } from '../components/ComboRow';
import { WinRateBar, SampleBadge } from '../components/charts';
import { sp, winRateColor, LOW_SAMPLE } from '../statsTheme';
import { pct } from '../format';

/** Ricerca parti nelle statistiche: win-rate aggregato per parte, espandibile sulle combo che la usano. */
export function PartsStatsScreen({
  records,
  onSelectCombo,
}: {
  records: MatchRecord[];
  onSelectCombo: (key: string) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const parts = useMemo(() => partUsage(records), [records]);
  const combos = useMemo(() => aggregateCombos(records), [records]);

  const filtered = query.trim()
    ? parts.filter((p) => p.partName.toLowerCase().includes(query.trim().toLowerCase()))
    : parts;

  if (records.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.dim}>{t('stats.empty.range')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('stats.parts.searchPlaceholder')}
          placeholderTextColor={sp.faint}
          style={styles.search}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {filtered.length === 0 ? (
          <Text style={styles.dim}>{t('stats.parts.noResults')}</Text>
        ) : (
          filtered.map((p) => {
            const isOpen = expanded === p.partId;
            const usingCombos = isOpen ? combos.filter((c) => c.parts.some((cp) => cp.id === p.partId)) : [];
            const low = p.games < LOW_SAMPLE;
            return (
              <View key={p.partId}>
                <Pressable
                  style={({ pressed }) => [styles.partCard, pressed && styles.pressed]}
                  onPress={() => setExpanded(isOpen ? null : p.partId)}
                >
                  <View style={styles.partTop}>
                    <View style={styles.partNameWrap}>
                      <Text style={styles.partName} numberOfLines={1}>
                        {p.partName}
                      </Text>
                      <Text style={styles.partCat}>{t(`builder.category.${p.category}`)}</Text>
                    </View>
                    <Text style={[styles.pct, { color: winRateColor(p.winRate) }]}>{pct(p.winRate)}</Text>
                  </View>
                  <WinRateBar value={p.winRate} height={8} />
                  <View style={styles.partMeta}>
                    {low ? <SampleBadge /> : null}
                    <Text style={styles.record}>
                      {p.wins}-{p.losses}
                    </Text>
                  </View>
                </Pressable>
                {isOpen ? (
                  <View style={styles.combos}>
                    {usingCombos.map((c) => (
                      <ComboRow key={c.key} combo={c} onPress={() => onSelectCombo(c.key)} />
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchWrap: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4 },
  search: {
    backgroundColor: sp.surface2,
    borderWidth: 1,
    borderColor: sp.border,
    borderRadius: 10,
    color: sp.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  content: { paddingHorizontal: 14, paddingTop: 6, paddingBottom: 28, gap: 8 },
  partCard: {
    backgroundColor: sp.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: sp.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pressed: { borderColor: sp.gold },
  partTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  partNameWrap: { flex: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  partName: { color: sp.text, fontSize: 14, fontWeight: '800', flexShrink: 1 },
  partCat: { color: sp.faint, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  pct: { fontSize: 14, fontWeight: '900' },
  partMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  record: { color: sp.faint, fontSize: 11, fontWeight: '700' },
  combos: { gap: 8, marginTop: 8, marginLeft: 12, paddingLeft: 8, borderLeftWidth: 2, borderLeftColor: sp.border },
  empty: { padding: 32, alignItems: 'center' },
  dim: { color: sp.dim, fontSize: 13, textAlign: 'center' },
});
