import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { CustomRange } from '../aggregation';
import { sp } from '../statsTheme';

interface Props {
  value: CustomRange | null;
  onApply: (range: CustomRange) => void;
  onClose: () => void;
}

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
function endOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
function fmt(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/**
 * Calendario per scegliere un intervallo personalizzato (da/a). Mese singolo navigabile, selezione
 * a due tap (inizio → fine), senza dipendenze native. Estremi normalizzati a inizio/fine giornata.
 */
export function RangeCalendar({ value, onApply, onClose }: Props) {
  const { t } = useTranslation();
  const months = t('stats.calendar.months', { returnObjects: true }) as string[];
  const weekdays = t('stats.calendar.weekdays', { returnObjects: true }) as string[];

  const initial = value ? new Date(value.from) : new Date();
  const [view, setView] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const [start, setStart] = useState<number | null>(value ? startOfDay(value.from) : null);
  const [end, setEnd] = useState<number | null>(value ? startOfDay(value.to) : null);

  const firstOfMonth = new Date(view.year, view.month, 1);
  const leading = (firstOfMonth.getDay() + 6) % 7; // lunedì = 0
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(startOfDay(new Date(view.year, view.month, d).getTime()));
  while (cells.length % 7 !== 0) cells.push(null);

  const tapDay = (ts: number) => {
    if (start === null || end !== null) {
      setStart(ts);
      setEnd(null);
    } else {
      // Secondo estremo: normalizza l'ordine, così un tap su un giorno precedente chiude [C, A]
      // invece di ripartire (vedi review: due tap = sempre un intervallo a due estremi).
      const [lo, hi] = ts < start ? [ts, start] : [start, ts];
      setStart(lo);
      setEnd(hi);
    }
  };

  const dayLabel = (ts: number) => {
    const d = new Date(ts);
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const shiftMonth = (delta: number) => {
    const m = view.month + delta;
    setView({ year: view.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 });
  };

  const inRange = (ts: number) => start !== null && end !== null && ts > start && ts < end;
  const isEdge = (ts: number) => ts === start || ts === end;

  const rangeLabel =
    start === null
      ? t('stats.calendar.pickStart')
      : end === null
        ? fmt(start)
        : `${fmt(start)} – ${fmt(end)}`;

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.card}>
        <View style={styles.head}>
          <Pressable
            onPress={() => shiftMonth(-1)}
            hitSlop={10}
            style={styles.nav}
            accessibilityRole="button"
            accessibilityLabel={t('stats.calendar.prevMonth')}
          >
            <Text style={styles.navText}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>
            {months[view.month]} {view.year}
          </Text>
          <Pressable
            onPress={() => shiftMonth(1)}
            hitSlop={10}
            style={styles.nav}
            accessibilityRole="button"
            accessibilityLabel={t('stats.calendar.nextMonth')}
          >
            <Text style={styles.navText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekRow}>
          {weekdays.map((w, i) => (
            <Text key={i} style={styles.weekday}>
              {w}
            </Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((ts, i) => {
            if (ts === null) return <View key={i} style={styles.cell} />;
            const edge = isEdge(ts);
            const mid = inRange(ts);
            return (
              <Pressable
                key={i}
                style={[styles.cell, mid && styles.cellMid, edge && styles.cellEdge]}
                onPress={() => tapDay(ts)}
                accessibilityRole="button"
                accessibilityLabel={dayLabel(ts)}
                accessibilityState={{ selected: edge }}
              >
                <Text style={[styles.dayText, (edge || mid) && styles.dayTextActive]}>
                  {new Date(ts).getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.rangeLabel}>{rangeLabel}</Text>

        <View style={styles.actions}>
          <Pressable onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>{t('confirm.no')}</Text>
          </Pressable>
          <Pressable
            disabled={start === null}
            onPress={() => onApply({ from: startOfDay(start as number), to: endOfDay((end ?? start) as number) })}
            style={[styles.applyBtn, start === null && styles.applyDisabled]}
          >
            <Text style={[styles.applyText, start === null && styles.applyTextDisabled]}>
              {t('stats.calendar.apply')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 450 },
  card: { width: 340, maxWidth: '100%', backgroundColor: sp.surface, borderRadius: 16, borderWidth: 1, borderColor: sp.border, padding: 14 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  nav: { width: 36, height: 36, borderRadius: 8, backgroundColor: sp.surface2, alignItems: 'center', justifyContent: 'center' },
  navText: { color: sp.gold, fontSize: 22, fontWeight: '900', lineHeight: 24 },
  monthTitle: { color: sp.text, fontSize: 16, fontWeight: '800' },
  weekRow: { flexDirection: 'row', marginBottom: 4 },
  weekday: { flex: 1, textAlign: 'center', color: sp.faint, fontSize: 11, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: 40, alignItems: 'center', justifyContent: 'center' },
  cellMid: { backgroundColor: 'rgba(251,191,36,0.18)' },
  cellEdge: { backgroundColor: sp.gold, borderRadius: 8 },
  dayText: { color: sp.text, fontSize: 14, fontWeight: '600' },
  dayTextActive: { color: '#0f172a', fontWeight: '800' },
  rangeLabel: { color: sp.dim, fontSize: 13, fontWeight: '700', textAlign: 'center', marginTop: 12 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 14 },
  cancelBtn: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 10, backgroundColor: sp.surface2 },
  cancelText: { color: sp.dim, fontSize: 14, fontWeight: '700' },
  applyBtn: { paddingVertical: 9, paddingHorizontal: 22, borderRadius: 10, backgroundColor: sp.gold },
  applyDisabled: { backgroundColor: sp.surface2 },
  applyText: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  applyTextDisabled: { color: sp.faint },
});
