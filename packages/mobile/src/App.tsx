import { SafeAreaView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RotateDeviceScreen } from './components/ui/RotateDeviceScreen';
import { GameScreen } from './components/game/GameScreen';
import './i18n/config';

export default function App() {
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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />
      <GameScreen />
    </SafeAreaView>
  );
}
