import { useEffect } from 'react';
import { useWindowDimensions, AppState, Pressable, Text, StyleSheet } from 'react-native';
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
import { useUiStore } from './store/uiStore';
import { BUILDER_ENABLED } from './config/featureFlags';
import { BuilderShell } from './features/builder/BuilderShell';
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

function AppContent() {
  useKeepAwake();

  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  // Con il flag OFF l'app resta SEMPRE sullo scoreboard: nessun cambio di orientamento/UI.
  const effectiveTab = BUILDER_ENABLED ? activeTab : 'scoreboard';
  const isBuilder = effectiveTab === 'builder';

  // Orientamento per-tab: scoreboard = landscape (storico), builder = portrait.
  useEffect(() => {
    ScreenOrientation.lockAsync(
      isBuilder
        ? ScreenOrientation.OrientationLock.PORTRAIT_UP
        : ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }, [isBuilder]);

  // Status bar: nascosta sullo scoreboard (come prima), visibile nel builder portrait.
  useEffect(() => {
    const hidden = !isBuilder;
    SystemBars.setHidden({ statusBar: hidden });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        SystemBars.setHidden({ statusBar: hidden });
      }
    });

    return () => subscription.remove();
  }, [isBuilder]);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (isBuilder) {
    return (
      <>
        <SystemBars hidden={{ statusBar: false }} />
        <BuilderShell />
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
      {BUILDER_ENABLED && (
        <Pressable
          onPress={() => setActiveTab('builder')}
          hitSlop={8}
          style={styles.builderFab}
          accessibilityRole="button"
          accessibilityLabel="Apri Combo Builder"
        >
          <Text style={styles.builderFabText}>🛠️ Builder</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // FAB di sviluppo per saltare al builder (visibile solo con BUILDER_ENABLED = __DEV__).
  builderFab: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#0D0D1AE6',
    borderColor: '#FF3A4F',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  builderFabText: { color: '#FF3A4F', fontSize: 12, fontWeight: '700' },
});

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
