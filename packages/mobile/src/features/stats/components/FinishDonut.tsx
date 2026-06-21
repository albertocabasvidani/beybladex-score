import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import type { FinishType } from '@beybladex/shared';
import { FINISH_INFO, FINISH_ORDER } from '@beybladex/shared';
import { sp } from '../statsTheme';

interface Props {
  counts: Record<FinishType, number>;
  size?: number;
  stroke?: number;
  /** Testo grande al centro (es. win-rate "67%"). */
  centerValue?: string;
  centerLabel?: string;
  centerColor?: string;
}

/**
 * Donut della composizione finish (anello = spin/burst/over/xtreme proporzionali) con un valore al
 * centro (tipicamente il win-rate). Combina P1 (win-rate) e P2 (mix finish) in un unico hero.
 */
export function FinishDonut({
  counts,
  size = 150,
  stroke = 18,
  centerValue,
  centerLabel,
  centerColor = sp.text,
}: Props) {
  const c = size / 2;
  const r = c - stroke / 2;
  const circ = 2 * Math.PI * r;
  const total = FINISH_ORDER.reduce((s, f) => s + (counts[f] ?? 0), 0);

  let offset = 0;
  const segments =
    total > 0
      ? FINISH_ORDER.filter((f) => counts[f] > 0).map((f) => {
          const len = (counts[f] / total) * circ;
          const startAngle = -90 + (offset / circ) * 360;
          offset += len;
          return { f, len, startAngle };
        })
      : [];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Anello di base */}
        <Circle cx={c} cy={c} r={r} fill="none" stroke="#0b1220" strokeWidth={stroke} />
        {segments.map((s) => (
          <G key={s.f} rotation={s.startAngle} origin={`${c}, ${c}`}>
            <Circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={FINISH_INFO[s.f].color}
              strokeWidth={stroke}
              strokeDasharray={`${s.len} ${circ}`}
              strokeLinecap="butt"
            />
          </G>
        ))}
      </Svg>
      {centerValue ? (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text style={[styles.value, { color: centerColor }]}>{centerValue}</Text>
          {centerLabel ? <Text style={styles.label}>{centerLabel}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  value: { fontSize: 30, fontWeight: '900' },
  label: { color: sp.dim, fontSize: 11, fontWeight: '700', marginTop: 1 },
});
