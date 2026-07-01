import { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { FINISH_INFO, FINISH_ORDER } from '@beybladex/shared';
import type { MatchRecord } from '../statsStore';
import { aggregateCombos, matchupsFor, formFor } from '../aggregation';
import { sp, winRateColor, LOW_SAMPLE } from '../statsTheme';
import { partsLabel, pct, signed, diffColor } from '../format';
import { FinishDonut } from './FinishDonut';
import { FinishMixBar, FinishLegend, FormDots, StatKpi, SampleBadge } from './charts';
import { MatchupRow } from './MatchupRow';

/** Dettaglio combo: hero donut (mix finish + win-rate), KPI, mix inflitti/subiti, forma, matchup. */
export function ComboDetailModal({
  comboKey,
  records,
  onSelectCombo,
  onClose,
}: {
  comboKey: string;
  records: MatchRecord[];
  onSelectCombo: (key: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const combo = useMemo(
    () => aggregateCombos(records).find((c) => c.key === comboKey),
    [records, comboKey]
  );
  const matchups = useMemo(() => matchupsFor(comboKey, records), [records, comboKey]);
  const form = useMemo(() => formFor(comboKey, records), [records, comboKey]);

  // Insight prescrittivo soft: finish più subito (solo con campione sufficiente).
  const insight = useMemo(() => {
    if (!combo || combo.games < LOW_SAMPLE) return null;
    const top = FINISH_ORDER.reduce((b, f) => (combo.finishAgainst[f] > combo.finishAgainst[b] ? f : b), FINISH_ORDER[0]);
    return combo.finishAgainst[top] > 0 ? top : null;
  }, [combo]);

  return (
    <View style={styles.overlay}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {combo?.name ?? t('stats.combo.notFound')}
          </Text>
          {combo ? (
            <Text style={styles.parts} numberOfLines={1}>
              {partsLabel(combo.parts)}
            </Text>
          ) : null}
        </View>
        <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('builder.common.close')}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      {!combo ? (
        <View style={styles.notFound}>
          <Text style={styles.dim}>{t('stats.empty.range')}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]} showsVerticalScrollIndicator={false}>
          {/* Hero: donut mix finish + win-rate */}
          <View style={styles.hero}>
            <FinishDonut
              counts={combo.finishFor}
              centerValue={pct(combo.winRate)}
              centerLabel={t('stats.combo.winRate')}
              centerColor={winRateColor(combo.winRate)}
            />
            <View style={styles.heroMeta}>
              <Text style={styles.record}>
                {combo.wins}-{combo.losses}
              </Text>
              <Text style={styles.games}>{t('stats.combo.games', { count: combo.games })}</Text>
              {combo.games < LOW_SAMPLE ? <SampleBadge /> : null}
            </View>
          </View>

          {/* KPI */}
          <View style={styles.kpis}>
            <StatKpi value={signed(combo.pointDiff)} label={t('stats.combo.pointDiff')} color={diffColor(combo.pointDiff)} />
            <StatKpi value={signed(Math.round(combo.avgDiff * 10) / 10)} label={t('stats.combo.avgDiff')} color={diffColor(combo.avgDiff)} />
            <StatKpi value={`${combo.pointsFor}-${combo.pointsAgainst}`} label={t('stats.combo.points')} />
          </View>

          {/* Composizione finish: inflitti vs subiti */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('stats.combo.finishMix')}</Text>
            <Text style={styles.mixLabel}>{t('stats.combo.finishScored')}</Text>
            <FinishMixBar counts={combo.finishFor} />
            <Text style={[styles.mixLabel, { marginTop: 10 }]}>{t('stats.combo.finishConceded')}</Text>
            <FinishMixBar counts={combo.finishAgainst} />
            <FinishLegend counts={combo.finishFor} />
            {insight ? (
              <Text style={styles.insight}>
                💡 {t('stats.combo.insightConceded', { finish: t(FINISH_INFO[insight].labelKey) })}
              </Text>
            ) : null}
          </View>

          {/* Forma */}
          {form.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.formRow}>
                <Text style={styles.sectionTitle}>{t('stats.combo.form')}</Text>
                <FormDots results={form} />
              </View>
            </View>
          ) : null}

          {/* Matchup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('stats.combo.matchups')}</Text>
            {matchups.length === 0 ? (
              <Text style={styles.dim}>{t('stats.combo.noMatchups')}</Text>
            ) : (
              <View style={styles.matchupList}>
                {matchups.map((m) => (
                  <MatchupRow key={m.opponentKey} matchup={m} onPress={() => onSelectCombo(m.opponentKey)} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: sp.bg, zIndex: 400 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: sp.border,
  },
  headerText: { flex: 1, marginRight: 12 },
  title: { color: sp.gold, fontSize: 18, fontWeight: '900' },
  parts: { color: sp.dim, fontSize: 12, marginTop: 2 },
  close: { color: sp.dim, fontSize: 22, fontWeight: '700', paddingHorizontal: 4 },
  notFound: { padding: 32, alignItems: 'center' },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  hero: { alignItems: 'center', gap: 8 },
  heroMeta: { alignItems: 'center', gap: 4 },
  record: { color: sp.text, fontSize: 20, fontWeight: '900' },
  games: { color: sp.dim, fontSize: 13, fontWeight: '600' },
  kpis: {
    flexDirection: 'row',
    backgroundColor: sp.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: sp.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  section: {
    backgroundColor: sp.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: sp.border,
    padding: 14,
  },
  sectionTitle: { color: sp.text, fontSize: 14, fontWeight: '800', marginBottom: 8 },
  mixLabel: { color: sp.dim, fontSize: 11, fontWeight: '700', marginBottom: 4 },
  insight: { color: sp.dim, fontSize: 12, fontStyle: 'italic', marginTop: 10 },
  formRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  matchupList: { gap: 8 },
  dim: { color: sp.dim, fontSize: 13 },
});
