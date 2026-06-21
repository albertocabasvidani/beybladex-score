import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export function RotateDeviceScreen() {
  const { t } = useTranslation();
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
        {t('app.rotateDevice')}
      </Text>
    </View>
  );
}
