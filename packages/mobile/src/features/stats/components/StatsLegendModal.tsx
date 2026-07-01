import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { sp } from '../statsTheme';

/** Guida rapida: cosa fa ciascuna tab + legenda della notazione (record, diff, campione ridotto). */
export function StatsLegendModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const tabs = [
    { icon: '📋', name: t('stats.tabs.overview'), desc: t('stats.legend.tabOverview') },
    { icon: '⚔️', name: t('stats.tabs.matchups'), desc: t('stats.legend.tabMatchups') },
    { icon: '🧩', name: t('stats.tabs.parts'), desc: t('stats.legend.tabParts') },
  ];

  return (
    <View style={styles.overlay}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.title}>{t('stats.legend.title')}</Text>
        <Pressable onPress={onClose} hitSlop={12} accessibilityRole="button">
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>{t('stats.legend.tabsTitle')}</Text>
        {tabs.map((tab) => (
          <View key={tab.name} style={styles.row}>
            <Text style={styles.icon}>{tab.icon}</Text>
            <View style={styles.rowText}>
              <Text style={styles.rowName}>{tab.name}</Text>
              <Text style={styles.rowDesc}>{tab.desc}</Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{t('stats.legend.metricsTitle')}</Text>

        <View style={styles.metric}>
          <View style={[styles.barSample, { backgroundColor: sp.win }]} />
          <Text style={styles.metricText}>{t('stats.legend.mWinrate')}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.token, { color: sp.faint }]}>2-1</Text>
          <Text style={styles.metricText}>{t('stats.legend.mRecord')}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={[styles.token, { color: sp.win }]}>+2</Text>
          <Text style={[styles.token, { color: sp.loss, marginLeft: -4 }]}>-2</Text>
          <Text style={styles.metricText}>{t('stats.legend.mDiff')}</Text>
        </View>
        <View style={styles.metric}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{t('stats.combo.lowSample')}</Text>
          </View>
          <Text style={styles.metricText}>{t('stats.legend.mLowSample')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: sp.bg, zIndex: 460 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: sp.border,
  },
  title: { color: sp.text, fontSize: 18, fontWeight: '800' },
  close: { color: sp.dim, fontSize: 22, fontWeight: '700', paddingHorizontal: 4 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { color: sp.gold, fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  icon: { fontSize: 22, width: 28, textAlign: 'center' },
  rowText: { flex: 1 },
  rowName: { color: sp.text, fontSize: 15, fontWeight: '800' },
  rowDesc: { color: sp.dim, fontSize: 13, marginTop: 2, lineHeight: 18 },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  barSample: { width: 40, height: 10, borderRadius: 5 },
  token: { fontSize: 14, fontWeight: '900', minWidth: 28 },
  metricText: { color: sp.dim, fontSize: 13, flex: 1, lineHeight: 18 },
  badge: { backgroundColor: 'rgba(148,163,184,0.15)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { color: sp.faint, fontSize: 10, fontWeight: '700' },
});
