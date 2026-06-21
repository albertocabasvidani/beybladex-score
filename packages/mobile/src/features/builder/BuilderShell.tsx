import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useUiStore, type BuilderTab } from '../../store/uiStore';
import { PartsScreen } from './screens/PartsScreen';
import { BuilderScreen } from './screens/BuilderScreen';
import { DecksScreen } from './screens/DecksScreen';
import { CollectionScreen } from './screens/CollectionScreen';

const TABS: { key: BuilderTab; icon: string }[] = [
  { key: 'parts', icon: '🧩' },
  { key: 'builder', icon: '🛠️' },
  { key: 'decks', icon: '🗂️' },
  { key: 'collection', icon: '📦' },
];

function renderScreen(tab: BuilderTab) {
  switch (tab) {
    case 'parts':
      return <PartsScreen />;
    case 'builder':
      return <BuilderScreen />;
    case 'decks':
      return <DecksScreen />;
    case 'collection':
      return <CollectionScreen />;
  }
}

/**
 * Guscio del Builder: header con ritorno allo scoreboard + tab bar interna a 4 voci.
 * Portrait. Montato solo quando BUILDER_ENABLED e activeTab === 'builder' (vedi App.tsx).
 */
export function BuilderShell() {
  const { t } = useTranslation();
  const activeBuilderTab = useUiStore((s) => s.activeBuilderTab);
  const setActiveBuilderTab = useUiStore((s) => s.setActiveBuilderTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setActiveTab('home')}
          hitSlop={12}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel={t('stats.backHome')}
        >
          <Text style={styles.backText}>‹ {t('stats.backHome')}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{t('builder.title')}</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.content}>{renderScreen(activeBuilderTab)}</View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = tab.key === activeBuilderTab;
          const label = t(`builder.tabs.${tab.key}`);
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveBuilderTab(tab.key)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={label}
            >
              <Text style={[styles.tabIcon, active && styles.tabIconActive]}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D0D1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10',
  },
  backBtn: { minWidth: 96 },
  backText: { color: '#FF3A4F', fontSize: 16, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0D0D1A',
    borderTopColor: '#FFFFFF10',
    borderTopWidth: 1,
    paddingTop: 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIcon: { fontSize: 20, opacity: 0.5 },
  tabIconActive: { opacity: 1 },
  tabLabel: { color: '#8888AA', fontSize: 12, fontWeight: '700', marginTop: 2 },
  tabLabelActive: { color: '#FF3A4F' },
});
