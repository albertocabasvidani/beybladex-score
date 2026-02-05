import { View, Text } from 'react-native';

export function RotateDeviceScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          textAlign: 'center',
        }}
      >
        Ruota il dispositivo in landscape per giocare
      </Text>
    </View>
  );
}
