import { useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RotateDeviceScreen } from './components/ui/RotateDeviceScreen';
import { GameScreen } from './components/game/GameScreen';
import './i18n/config';

function AppContent() {
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
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
