import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { TimeRange } from '../aggregation';
import { sp } from '../statsTheme';

const RANGES: { value: TimeRange; key: string }[] = [
  { value: 'all', key: 'stats.range.all' },
  { value: '30d', key: 'stats.range.d30' },
  { value: '7d', key: 'stats.range.d7' },
  { value: 'today', key: 'stats.range.today' },
];

/** Segmented control dei filtri temporali (applicazione istantanea, scelta singola). */
export function TimeRangeChips({ value, onChange }: { value: TimeRange; onChange: (r: TimeRange) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      {RANGES.map((r) => {
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: sp.surface2,
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  chip: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  chipActive: { backgroundColor: sp.gold },
  text: { color: sp.dim, fontSize: 13, fontWeight: '700' },
  textActive: { color: '#0f172a' },
});
