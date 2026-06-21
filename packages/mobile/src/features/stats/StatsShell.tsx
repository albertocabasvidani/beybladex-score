import { useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '../../store/uiStore';
import { useStatsStore } from './statsStore';
import { filterByRange, type TimeRange } from './aggregation';
import { TimeRangeChips } from './components/TimeRangeChips';
import { ComboDetailModal } from './components/ComboDetailModal';
import { OverviewScreen } from './screens/OverviewScreen';
import { MatchupsScreen } from './screens/MatchupsScreen';
import { PartsStatsScreen } from './screens/PartsStatsScreen';
import { sp } from './statsTheme';

type StatsTab = 'overview' | 'matchups' | 'parts';

const TABS: { key: StatsTab; icon: string }[] = [
  { key: 'overview', icon: '📋' },
  { key: 'matchups', icon: '⚔️' },
  { key: 'parts', icon: '🧩' },
];

/** Guscio delle analitiche: header + filtri temporali + tab (combo/matchup/parti) + dettaglio combo. */
export function StatsShell() {
  const { t } = useTranslation();
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  const records = useStatsStore((s) => s.records);
  const clearAll = useStatsStore((s) => s.clearAll);

  const [tab, setTab] = useState<StatsTab>('overview');
  const [range, setRange] = useState<TimeRange>('all');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => filterByRange(records, range, Date.now()), [records, range]);

  const confirmClear = () => {
    Alert.alert(t('stats.clearTitle'), t('stats.clearBody'), [
      { text: t('confirm.no'), style: 'cancel' },
      { text: t('stats.clearConfirm'), style: 'destructive', onPress: clearAll },
    ]);
  };

  const empty = records.length === 0;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setActiveTab('home')}
          hitSlop={12}
          style={styles.headerSide}
          accessibilityRole="button"
          accessibilityLabel={t('stats.backHome')}
        >
          <Text style={styles.back}>‹ {t('stats.backHome')}</Text>
        </Pressable>
        <Text style={styles.title}>{t('stats.title')}</Text>
        <View style={[styles.headerSide, styles.headerRight]}>
          {!empty ? (
            <Pressable onPress={confirmClear} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('stats.clearTitle')}>
              <Text style={styles.clear}>🗑</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {empty ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>{t('stats.empty.title')}</Text>
          <Text style={styles.emptyBody}>{t('stats.empty.body')}</Text>
          <Pressable style={styles.cta} onPress={() => setActiveTab('scoreboard')}>
            <Text style={styles.ctaText}>{t('stats.empty.cta')}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.rangeWrap}>
            <TimeRangeChips value={range} onChange={setRange} />
          </View>

          <View style={styles.content}>
            {tab === 'overview' ? <OverviewScreen records={filtered} onSelectCombo={setSelected} /> : null}
            {tab === 'matchups' ? <MatchupsScreen records={filtered} onSelectCombo={setSelected} /> : null}
            {tab === 'parts' ? <PartsStatsScreen records={filtered} onSelectCombo={setSelected} /> : null}
          </View>

          <View style={styles.tabBar}>
            {TABS.map((tb) => {
              const active = tb.key === tab;
              return (
                <Pressable
                  key={tb.key}
                  onPress={() => setTab(tb.key)}
                  style={styles.tab}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{tb.icon}</Text>
                  <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                    {t(`stats.tabs.${tb.key}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      {selected ? (
        <ComboDetailModal
          comboKey={selected}
          records={filtered}
          onSelectCombo={setSelected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: sp.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: sp.border,
  },
  headerSide: { minWidth: 90 },
  headerRight: { alignItems: 'flex-end' },
  back: { color: sp.gold, fontSize: 16, fontWeight: '700' },
  title: { color: sp.text, fontSize: 18, fontWeight: '800' },
  clear: { fontSize: 18 },
  rangeWrap: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4 },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    borderTopColor: sp.border,
    borderTopWidth: 1,
    paddingTop: 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { color: sp.faint, fontSize: 12, fontWeight: '700', marginTop: 2 },
  tabLabelActive: { color: sp.gold },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  emptyIcon: { fontSize: 54 },
  emptyTitle: { color: sp.text, fontSize: 20, fontWeight: '900' },
  emptyBody: { color: sp.dim, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  cta: {
    marginTop: 10,
    backgroundColor: sp.gold,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  ctaText: { color: '#0f172a', fontSize: 15, fontWeight: '800' },
});
