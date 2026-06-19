import { TouchableOpacity, Text, StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  /** Icona opzionale come emoji/testo (niente @expo/vector-icons per non aggiungere dipendenze). */
  icon?: string;
  colors?: [string, string];
  disabled?: boolean;
  compact?: boolean;
  style?: ViewStyle;
}

/** Pulsante con gradiente. Portato da bbxdeckbuild: Paper Text → RN Text, icona = emoji. */
export function GradientButton({
  label,
  onPress,
  icon,
  colors = ['#FF3A4F', '#FFB347'],
  disabled = false,
  compact = false,
  style,
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[styles.wrapper, disabled && styles.disabled, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <LinearGradient
        colors={disabled ? ['#333', '#444'] : colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={compact ? styles.gradientCompact : styles.gradient}
      >
        {icon ? (
          <Text style={[compact ? styles.iconCompact : styles.icon, disabled && styles.labelDisabled]}>
            {icon}
          </Text>
        ) : null}
        <Text style={[compact ? styles.labelCompact : styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 12, overflow: 'hidden', flex: 1 },
  disabled: { opacity: 0.5 },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  gradientCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  icon: { fontSize: 20, marginRight: 8 },
  iconCompact: { fontSize: 15, marginRight: 6 },
  label: { color: '#fff', fontWeight: '700', fontSize: 22 },
  labelCompact: { color: '#fff', fontWeight: '700', fontSize: 14 },
  labelDisabled: { color: '#888' },
});

export default GradientButton;
