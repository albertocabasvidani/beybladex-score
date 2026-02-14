import { useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
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
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  if (!isLandscape) {
    return (
      <>
        <StatusBar hidden />
        <RotateDeviceScreen />
      </>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar hidden />
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
