import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { TimeRange, CustomRange } from '../aggregation';
import { sp } from '../statsTheme';

const PRESETS: { value: TimeRange; key: string }[] = [
  { value: 'all', key: 'stats.range.all' },
  { value: '30d', key: 'stats.range.d30' },
  { value: '7d', key: 'stats.range.d7' },
  { value: 'today', key: 'stats.range.today' },
];

function fmtShort(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}`;
}

/**
 * Segmented control dei filtri temporali (applicazione istantanea). L'ultimo segmento "📅" apre il
 * calendario per un intervallo personalizzato; quando attivo, sotto compare l'intervallo scelto.
 */
export function TimeRangeChips({
  value,
  onChange,
  customRange,
  onCustomPress,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
  customRange: CustomRange | null;
  onCustomPress: () => void;
}) {
  const { t } = useTranslation();
  const customActive = value === 'custom';

  return (
    <View>
      <View style={styles.row}>
        {PRESETS.map((r) => {
          const active = r.value === value;
          return (
            <Pressable
              key={r.value}
              onPress={() => onChange(r.value)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.text, active && styles.textActive]}>{t(r.key)}</Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={onCustomPress}
          style={[styles.chip, styles.customChip, customActive && styles.chipActive]}
          accessibilityRole="button"
          accessibilityLabel={t('stats.range.custom')}
          accessibilityState={{ selected: customActive }}
        >
          <Text style={[styles.text, customActive && styles.textActive]}>📅</Text>
        </Pressable>
      </View>
      {customActive && customRange ? (
        <Pressable onPress={onCustomPress} style={styles.rangeLabelWrap}>
          <Text style={styles.rangeLabel}>
            {t('stats.range.custom')}: {fmtShort(customRange.from)} – {fmtShort(customRange.to)}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', backgroundColor: sp.surface2, borderRadius: 10, padding: 3, gap: 3 },
  chip: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  customChip: { flex: 0, paddingHorizontal: 12 },
  chipActive: { backgroundColor: sp.gold },
  text: { color: sp.dim, fontSize: 13, fontWeight: '700' },
  textActive: { color: '#0f172a' },
  rangeLabelWrap: { alignSelf: 'center', marginTop: 6 },
  rangeLabel: { color: sp.gold, fontSize: 12, fontWeight: '700' },
});
