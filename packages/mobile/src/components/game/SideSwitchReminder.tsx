import { useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

const AUTO_DISMISS_MS = 4000;

interface Props {
  /** Tap sul banner o timeout di auto-chiusura */
  onDismiss: () => void;
  /** "Non mostrare più": disattiva il promemoria */
  onDisable: () => void;
}

/**
 * Banner non bloccante "Avete cambiato lato?" mostrato ogni 3 lanci, dopo l'animazione dei punti.
 * Si auto-chiude dopo pochi secondi, si chiude al tap, e offre "Non mostrare più".
 */
export function SideSwitchReminder({ onDismiss, onDisable }: Props) {
  const { t } = useTranslation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Ref per evitare che il timer si resetti sui re-render del padre (onDismiss è ricreato ogni render)
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismissRef.current(), AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    // Wrapper a tutto schermo che NON cattura i tap: i tocchi fuori dal banner arrivano al gioco
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 150 }}
    >
      <Animated.View
        entering={FadeInUp.duration(300)}
        exiting={FadeOut.duration(250)}
        style={{ position: 'absolute', top: 16, alignSelf: 'center', maxWidth: 520 }}
      >
        <Pressable
          onPress={onDismiss}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            backgroundColor: '#1e293b',
            borderColor: '#fbbf24',
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text allowFontScaling={false} style={{ fontSize: 22 }}>🔄</Text>
          <Text
            allowFontScaling={false}
            style={{ color: '#e2e8f0', fontSize: 16, fontWeight: '700' }}
          >
            {t('sideSwitch.message')}
          </Text>
          <Pressable onPress={onDisable} hitSlop={8}>
            <Text
              allowFontScaling={false}
              style={{ color: '#94a3b8', fontSize: 12, textDecorationLine: 'underline' }}
            >
              {t('sideSwitch.dontShowAgain')}
            </Text>
          </Pressable>
        </Pressable>
      </Animated.View>
    </View>
  );
}
