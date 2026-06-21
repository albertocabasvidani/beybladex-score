import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUiStore, type AppTab } from '../../store/uiStore';
import { BUILDER_ENABLED, STATS_ENABLED } from '../../config/featureFlags';

interface ModeCard {
  tab: AppTab;
  icon: string;
  titleKey: string;
  descKey: string;
  enabled: boolean;
}

/** Schermata iniziale: scelta della modalità (Segnapunti / Gestore combo / Analitiche). Portrait. */
export function HomeScreen() {
  const { t } = useTranslation();
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  const cards: ModeCard[] = [
    { tab: 'scoreboard', icon: '🏆', titleKey: 'home.scoreboard', descKey: 'home.scoreboardDesc', enabled: true },
    { tab: 'builder', icon: '🛠️', titleKey: 'home.builder', descKey: 'home.builderDesc', enabled: BUILDER_ENABLED },
    { tab: 'analytics', icon: '📊', titleKey: 'home.analytics', descKey: 'home.analyticsDesc', enabled: STATS_ENABLED },
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.chooseMode')}</Text>
      </View>

      <View style={styles.cards}>
        {cards
          .filter((c) => c.enabled)
          .map((c) => (
            <Pressable
              key={c.tab}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => setActiveTab(c.tab)}
              accessibilityRole="button"
              accessibilityLabel={t(c.titleKey)}
            >
              <Text style={styles.cardIcon}>{c.icon}</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{t(c.titleKey)}</Text>
                <Text style={styles.cardDesc}>{t(c.descKey)}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0f172a', paddingHorizontal: 20 },
  header: { paddingTop: 28, paddingBottom: 24, alignItems: 'center' },
  title: { color: '#fbbf24', fontSize: 30, fontWeight: '900', letterSpacing: 0.5 },
  subtitle: { color: '#94a3b8', fontSize: 15, fontWeight: '600', marginTop: 6 },
  cards: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 20,
    paddingHorizontal: 18,
    gap: 16,
  },
  cardPressed: { backgroundColor: '#283449', borderColor: '#fbbf24' },
  cardIcon: { fontSize: 34 },
  cardBody: { flex: 1 },
  cardTitle: { color: '#e2e8f0', fontSize: 19, fontWeight: '800' },
  cardDesc: { color: '#94a3b8', fontSize: 13, marginTop: 3 },
  chevron: { color: '#475569', fontSize: 28, fontWeight: '300' },
});
