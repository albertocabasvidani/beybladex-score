import { View, Text, StyleSheet } from 'react-native';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

/** Barra orizzontale di una stat. Portato da bbxdeckbuild, react-native-paper Text → RN Text. */
export function StatBar({ label, value, max, color }: StatBarProps) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <View style={styles.trackContainer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
        </View>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 22 },
  label: { fontSize: 14, fontWeight: '700', width: 30, textAlign: 'right' },
  trackContainer: { flex: 1 },
  track: { height: 6, backgroundColor: '#FFFFFF10', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 2 },
  value: { fontSize: 15, fontWeight: '700', width: 30 },
});

export default StatBar;
