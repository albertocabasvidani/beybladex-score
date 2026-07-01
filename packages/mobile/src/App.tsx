import { useEffect } from 'react';
import { useWindowDimensions, AppState, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { useKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RotateDeviceScreen } from './components/ui/RotateDeviceScreen';
import { GameScreen } from './components/game/GameScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import { logger } from './utils/logger';
import { usePurchasesStore } from './store/purchases-store';
import { useUiStore, type AppTab } from './store/uiStore';
import { BUILDER_ENABLED, STATS_ENABLED, MODE_HOME_ENABLED, REMOTE_PARTS_ENABLED } from './config/featureFlags';
import { BuilderShell } from './features/builder/BuilderShell';
import { StatsShell } from './features/stats/StatsShell';
import { HomeScreen } from './components/home/HomeScreen';
import { usePartsStore } from './store/partsStore';
import { hydratePartsFromCache, refreshPartsInBackground } from './services/parts-remote';
import { NewPartsModal } from './components/modals/NewPartsModal';
import { PaywallModal } from './components/paywall/PaywallModal';
import { useTranslation } from 'react-i18next';
import './i18n/config';

// Global error handler for uncaught JS errors
const originalHandler = (globalThis as any).ErrorUtils?.getGlobalHandler?.();
(globalThis as any).ErrorUtils?.setGlobalHandler?.((error: Error, isFatal?: boolean) => {
  logger.error(isFatal ? 'FATAL JS Error' : 'Uncaught JS Error', {
    message: error.message,
    stack: error.stack?.split('\n').slice(0, 5).join('\n'),
  });
  originalHandler?.(error, isFatal);
});

logger.init().then(() => logger.info('App started'));

// App rivolta a minori (target 13-15): annunci adatti all'età e non personalizzati
mobileAds()
  .setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.G,
    tagForUnderAgeOfConsent: true,
  })
  .then(() => mobileAds().initialize())
  .then(() => logger.info('AdMob initialized'))
  .catch((err: Error) => logger.warn('AdMob init failed', { message: err.message }));

usePurchasesStore.getState().init();

// Aggiornamento parti a runtime (solo build con combo attive): idrata dalla cache — che si applica
// da questo avvio — e poi rinfresca in background per il prossimo. Con REMOTE_PARTS_ENABLED OFF lo
// store va subito 'ready' (registry = bundle), così i tab non aspettano nulla in produzione.
if (REMOTE_PARTS_ENABLED) {
  hydratePartsFromCache()
    .then(() => refreshPartsInBackground())
    .catch(() => usePartsStore.getState().setReady([]));
} else {
  usePartsStore.getState().setReady([]);
}

function AppContent() {
  useKeepAwake();
  const { t } = useTranslation();

  const activeTab = useUiStore((s) => s.activeTab);
  const partsStatus = usePartsStore((s) => s.status);
  // Con i flag OFF l'app resta SEMPRE sullo scoreboard: nessuna home, nessun cambio orientamento/UI.
  let effectiveTab: AppTab = MODE_HOME_ENABLED ? activeTab : 'scoreboard';
  if (effectiveTab === 'builder' && !BUILDER_ENABLED) effectiveTab = 'home';
  if (effectiveTab === 'analytics' && !STATS_ENABLED) effectiveTab = 'home';
  // scoreboard = landscape (storico); home/builder/analytics = portrait.
  const isPortraitTab = effectiveTab !== 'scoreboard';

  useEffect(() => {
    ScreenOrientation.lockAsync(
      isPortraitTab
        ? ScreenOrientation.OrientationLock.PORTRAIT_UP
        : ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }, [isPortraitTab]);

  // Status bar: nascosta sullo scoreboard (come prima), visibile nelle schermate portrait.
  useEffect(() => {
    const hidden = !isPortraitTab;
    SystemBars.setHidden({ statusBar: hidden });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        SystemBars.setHidden({ statusBar: hidden });
      }
    });

    return () => subscription.remove();
  }, [isPortraitTab]);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (effectiveTab === 'home') {
    return (
      <>
        <SystemBars hidden={{ statusBar: false }} />
        <HomeScreen />
      </>
    );
  }

  // I tab combo consumano il registry parti: attendere che l'idratazione della cache sia completa
  // (decine di ms) evita il flash bundle→cache. Con i flag OFF partsStatus è già 'ready'.
  if ((effectiveTab === 'builder' || effectiveTab === 'analytics') && partsStatus !== 'ready') {
    return (
      <>
        <SystemBars hidden={{ statusBar: false }} />
        <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text style={{ color: '#94a3b8', marginTop: 12, fontSize: 14 }}>{t('parts.loading')}</Text>
        </View>
      </>
    );
  }

  if (effectiveTab === 'builder') {
    return (
      <>
        <SystemBars hidden={{ statusBar: false }} />
        <BuilderShell />
      </>
    );
  }

  if (effectiveTab === 'analytics') {
    return (
      <>
        <SystemBars hidden={{ statusBar: false }} />
        <StatsShell />
      </>
    );
  }

  if (!isLandscape) {
    return (
      <>
        <SystemBars hidden={{ statusBar: true }} />
        <RotateDeviceScreen />
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }} edges={['left', 'right']}>
      <SystemBars hidden={{ statusBar: true }} />
      <GameScreen />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppContent />
        <NewPartsModal />
        <PaywallModal />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
