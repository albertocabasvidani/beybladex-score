import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { Matchup } from '../aggregation';
import { sp, winRateColor, LOW_SAMPLE } from '../statsTheme';
import { pct } from '../format';
import { WinRateBar, SampleBadge } from './charts';

/** Riga matchup: avversario + barra win-rate (di chi guarda) + record + n + badge low-sample. */
export function MatchupRow({ matchup, onPress }: { matchup: Matchup; onPress?: () => void }) {
  const low = matchup.games < LOW_SAMPLE;
  const body = (
    <>
      <View style={styles.topRow}>
        <Text style={styles.name} numberOfLines={1}>
          {matchup.opponentName}
        </Text>
        <Text style={[styles.pct, { color: winRateColor(matchup.winRate) }]}>{pct(matchup.winRate)}</Text>
      </View>
      <WinRateBar value={matchup.winRate} height={8} />
      <View style={styles.metaRow}>
        {low ? <SampleBadge /> : null}
        <Text style={styles.record}>
          {matchup.wins}-{matchup.losses}
        </Text>
      </View>
    </>
  );
  return onPress ? (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.pressed]} onPress={onPress}>
      {body}
    </Pressable>
  ) : (
    <View style={styles.row}>{body}</View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: sp.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: sp.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  pressed: { borderColor: sp.gold },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  name: { color: sp.text, fontSize: 13, fontWeight: '700', flex: 1, marginRight: 8 },
  pct: { fontSize: 13, fontWeight: '900' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  record: { color: sp.faint, fontSize: 11, fontWeight: '700' },
});
