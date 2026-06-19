import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LIST_PADDING } from '../responsive';

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterChipRowProps {
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

const GAP = 8;
const CHIP_H_PADDING = 14;

/** Riga di chip filtro a larghezza adattiva. Portato da bbxdeckbuild (SCREEN_WIDTH → hook). */
export function FilterChipRow({ options, selected, onSelect }: FilterChipRowProps) {
  const { width } = useWindowDimensions();
  const availableWidth = width - LIST_PADDING * 2;
  const totalGaps = (options.length - 1) * GAP;
  const chipWidth = Math.floor((availableWidth - totalGaps) / options.length);

  const textSpace = chipWidth - CHIP_H_PADDING * 2;
  const longestLabel = Math.max(1, ...options.map((o) => o.label.length));
  const fontSize = Math.max(10, Math.min(16, Math.floor(textSpace / (longestLabel * 0.55))));

  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = opt.value === selected;
        const chipColor = opt.color ?? '#FF3A4F';
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.7}
            style={[
              styles.chip,
              { width: chipWidth },
              isActive
                ? { backgroundColor: chipColor + '25', borderColor: chipColor }
                : { backgroundColor: '#1E1E38', borderColor: '#FFFFFF30' },
            ]}
          >
            <Text style={[styles.chipText, { fontSize, color: isActive ? chipColor : '#8888AA' }]} numberOfLines={1}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingHorizontal: LIST_PADDING, gap: GAP, paddingVertical: 4 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: CHIP_H_PADDING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { fontWeight: '600' },
});

export default FilterChipRow;
