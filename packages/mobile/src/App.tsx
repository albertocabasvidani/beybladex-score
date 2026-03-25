import { useEffect } from 'react';
import { useWindowDimensions, AppState } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SystemBars } from 'react-native-edge-to-edge';
import { useKeepAwake } from 'expo-keep-awake';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RotateDeviceScreen } from './components/ui/RotateDeviceScreen';
import { GameScreen } from './components/game/GameScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { logger } from './utils/logger';
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

function AppContent() {
  useKeepAwake();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  // Re-hide status bar when returning from notification shade
  useEffect(() => {
    SystemBars.setHidden({ statusBar: true });

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        SystemBars.setHidden({ statusBar: true });
      }
    });

    return () => subscription.remove();
  }, []);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
