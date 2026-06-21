import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { ComboAggregate } from '../aggregation';
import { sp, winRateColor, LOW_SAMPLE } from '../statsTheme';
import { partsLabel, pct, signed, diffColor } from '../format';
import { SampleBadge } from './charts';
import { WinRateBar } from './charts';

/** Riga della leaderboard combo: nome + win-rate (barra + %) + record + diff punti + badge low-sample. */
export function ComboRow({ combo, onPress }: { combo: ComboAggregate; onPress: () => void }) {
  const low = combo.games < LOW_SAMPLE;
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {combo.name}
        </Text>
        <Text style={[styles.pct, { color: winRateColor(combo.winRate) }]}>{pct(combo.winRate)}</Text>
      </View>

      <WinRateBar value={combo.winRate} />

      <View style={styles.bottomRow}>
        <Text style={styles.parts} numberOfLines={1}>
          {partsLabel(combo.parts) || combo.name}
        </Text>
        <View style={styles.meta}>
          {low ? <SampleBadge /> : null}
          <Text style={styles.record}>
            {combo.wins}-{combo.losses}
          </Text>
          <Text style={[styles.diff, { color: diffColor(combo.pointDiff) }]}>{signed(combo.pointDiff)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: sp.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: sp.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pressed: { borderColor: sp.gold, backgroundColor: '#243042' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  name: { color: sp.gold, fontSize: 15, fontWeight: '800', flex: 1, marginRight: 8 },
  pct: { fontSize: 15, fontWeight: '900' },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 8 },
  parts: { color: sp.dim, fontSize: 11, flex: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  record: { color: sp.faint, fontSize: 12, fontWeight: '700' },
  diff: { fontSize: 13, fontWeight: '800', minWidth: 28, textAlign: 'right' },
});
