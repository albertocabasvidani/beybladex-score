import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, Alert, BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUiStore } from '../../store/uiStore';
import { useStatsStore } from './statsStore';
import { filterByRange, limitToRecent, type TimeRange, type CustomRange } from './aggregation';
import { TimeRangeChips } from './components/TimeRangeChips';
import { RangeCalendar } from './components/RangeCalendar';
import { StatsLegendModal } from './components/StatsLegendModal';
import { ComboDetailModal } from './components/ComboDetailModal';
import { OverviewScreen } from './screens/OverviewScreen';
import { MatchupsScreen } from './screens/MatchupsScreen';
import { PartsStatsScreen } from './screens/PartsStatsScreen';
import { sp } from './statsTheme';
import { MONETIZATION_ENABLED } from '../../config/featureFlags';
import { FREE_MATCH_LIMIT } from '../../config/monetization';
import { useHasFullAccess, useAccessStore } from '../../store/access-store';
import { usePaywallStore } from '../../store/paywall-store';
import { BannerAdView } from '../../components/ads/banner-ad';
import { showRewardedUnlock } from '../../components/ads/rewarded';

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

  const fullAccess = useHasFullAccess();
  const showPaywall = usePaywallStore((s) => s.show);
  const grantSessionUnlock = useAccessStore((s) => s.grantSessionUnlock);

  const [tab, setTab] = useState<StatsTab>('overview');
  const [range, setRange] = useState<TimeRange>('all');
  const [customRange, setCustomRange] = useState<CustomRange | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  // Gating free: senza accesso completo si vedono solo gli ultimi FREE_MATCH_LIMIT match.
  // Il Pro (o lo sblocco rewarded della sessione) rende `fullAccess` true → storico intero.
  const gatedRecords = useMemo(
    () => (fullAccess ? records : limitToRecent(records, FREE_MATCH_LIMIT)),
    [records, fullAccess]
  );
  const hiddenCount = records.length - gatedRecords.length;

  const filtered = useMemo(
    () => filterByRange(gatedRecords, range, Date.now(), customRange),
    [gatedRecords, range, customRange]
  );

  // Tasto indietro Android: chiude gli overlay aperti (top-most prima), altrimenti torna alla home.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showLegend) { setShowLegend(false); return true; }
      if (showCalendar) { setShowCalendar(false); return true; }
      if (selected) { setSelected(null); return true; }
      setActiveTab('home');
      return true;
    });
    return () => sub.remove();
  }, [showLegend, showCalendar, selected, setActiveTab]);

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
          <Pressable onPress={() => setShowLegend(true)} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('stats.legend.title')}>
            <Text style={styles.help}>ⓘ</Text>
          </Pressable>
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
            <TimeRangeChips
              value={range}
              onChange={setRange}
              customRange={customRange}
              onCustomPress={() => setShowCalendar(true)}
            />
            <Text style={styles.caption}>{t(`stats.tabCaption.${tab}`)}</Text>
          </View>

          {hiddenCount > 0 ? (
            <View style={styles.gateCard}>
              <Text style={styles.gateText}>
                🔒 {t('stats.gate.teaser', { visible: gatedRecords.length, total: records.length })}
              </Text>
              <View style={styles.gateActions}>
                <Pressable
                  onPress={() => showRewardedUnlock(grantSessionUnlock)}
                  style={styles.gateGhost}
                  accessibilityRole="button"
                >
                  <Text style={styles.gateGhostText}>{t('stats.gate.watchAd')}</Text>
                </Pressable>
                <Pressable
                  onPress={() => showPaywall('analytics')}
                  style={styles.gatePrimary}
                  accessibilityRole="button"
                >
                  <Text style={styles.gatePrimaryText}>{t('stats.gate.cta')}</Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          <View style={styles.content}>
            {tab === 'overview' ? <OverviewScreen records={filtered} onSelectCombo={setSelected} /> : null}
            {tab === 'matchups' ? <MatchupsScreen records={filtered} onSelectCombo={setSelected} /> : null}
            {tab === 'parts' ? <PartsStatsScreen records={filtered} onSelectCombo={setSelected} /> : null}
          </View>

          {MONETIZATION_ENABLED ? <BannerAdView style={styles.banner} /> : null}

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

      {showCalendar ? (
        <RangeCalendar
          value={customRange}
          onApply={(r) => {
            setCustomRange(r);
            setRange('custom');
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      ) : null}

      {showLegend ? <StatsLegendModal onClose={() => setShowLegend(false)} /> : null}
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
  headerRight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 16 },
  back: { color: sp.gold, fontSize: 16, fontWeight: '700' },
  title: { color: sp.text, fontSize: 18, fontWeight: '800' },
  help: { color: sp.dim, fontSize: 20, fontWeight: '700' },
  clear: { fontSize: 18 },
  rangeWrap: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4 },
  caption: { color: sp.faint, fontSize: 12, textAlign: 'center', marginTop: 8 },
  content: { flex: 1 },
  gateCard: {
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: sp.gold,
    backgroundColor: '#1c1810',
    gap: 10,
  },
  gateText: { color: sp.gold, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  gateActions: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  gateGhost: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: sp.border,
  },
  gateGhostText: { color: sp.dim, fontSize: 12, fontWeight: '700' },
  gatePrimary: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: sp.gold,
  },
  gatePrimaryText: { color: '#0f172a', fontSize: 12, fontWeight: '800' },
  banner: { alignSelf: 'stretch' },
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
