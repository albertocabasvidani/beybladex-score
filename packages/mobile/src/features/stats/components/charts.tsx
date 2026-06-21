import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { FinishType } from '@beybladex/shared';
import { FINISH_INFO, FINISH_ORDER } from '@beybladex/shared';
import { sp, winRateColor } from '../statsTheme';

/** Barra orizzontale del win-rate (0..1), colorata per fascia. Mostra sempre la percentuale. */
export function WinRateBar({ value, height = 10 }: { value: number; height?: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${pct}%`,
          height: '100%',
          backgroundColor: winRateColor(value),
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

/** Barra impilata della composizione finish (spin/burst/over/xtreme), proporzionale ai conteggi. */
export function FinishMixBar({
  counts,
  height = 12,
}: {
  counts: Record<FinishType, number>;
  height?: number;
}) {
  const total = FINISH_ORDER.reduce((s, f) => s + (counts[f] ?? 0), 0);
  if (total === 0) {
    return <View style={[styles.track, { height, borderRadius: height / 2 }]} />;
  }
  return (
    <View style={[styles.track, { height, borderRadius: height / 2, flexDirection: 'row', overflow: 'hidden' }]}>
      {FINISH_ORDER.map((f) =>
        counts[f] > 0 ? (
          <View key={f} style={{ flex: counts[f], backgroundColor: FINISH_INFO[f].color }} />
        ) : null
      )}
    </View>
  );
}

/** Legenda finish: pallino colorato + etichetta + conteggio. */
export function FinishLegend({ counts }: { counts: Record<FinishType, number> }) {
  const { t } = useTranslation();
  return (
    <View style={styles.legend}>
      {FINISH_ORDER.map((f) => (
        <View key={f} style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: FINISH_INFO[f].color }]} />
          <Text style={styles.legendText}>
            {t(FINISH_INFO[f].labelKey)} {counts[f] ?? 0}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** KPI: numero grande + etichetta (+ sottotitolo opzionale). */
export function StatKpi({
  value,
  label,
  sub,
  color = sp.text,
}: {
  value: string;
  label: string;
  sub?: string;
  color?: string;
}) {
  return (
    <View style={styles.kpi}>
      <Text style={[styles.kpiValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      {sub ? <Text style={styles.kpiSub}>{sub}</Text> : null}
    </View>
  );
}

/** Badge "campione ridotto" per win-rate su poche partite. */
export function SampleBadge() {
  const { t } = useTranslation();
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{t('stats.combo.lowSample')}</Text>
    </View>
  );
}

/** Pallini forma (ultimi N esiti): verde = vittoria, rosso = sconfitta. */
export function FormDots({ results }: { results: boolean[] }) {
  return (
    <View style={styles.form}>
      {results.map((won, i) => (
        <View key={i} style={[styles.formDot, { backgroundColor: won ? sp.win : sp.loss }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', backgroundColor: '#0b1220', overflow: 'hidden' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: sp.dim, fontSize: 12, fontWeight: '600' },
  kpi: { alignItems: 'center', flex: 1 },
  kpiValue: { fontSize: 24, fontWeight: '900' },
  kpiLabel: { color: sp.dim, fontSize: 11, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  kpiSub: { color: sp.faint, fontSize: 10, marginTop: 1, textAlign: 'center' },
  badge: {
    backgroundColor: 'rgba(148,163,184,0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: sp.faint, fontSize: 10, fontWeight: '700' },
  form: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  formDot: { width: 8, height: 8, borderRadius: 4 },
});
