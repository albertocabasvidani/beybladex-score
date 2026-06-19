import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { typeColors } from '../theme';

interface CollectionGridItemProps {
  name: string;
  type?: string;
  isOwned: boolean;
  onToggle: () => void;
}

/**
 * Cella della griglia collezione. Portato da bbxdeckbuild senza immagine: pastiglia colorata per
 * tipo + nome + check, posseduto vs non posseduto (dimmed).
 */
export function CollectionGridItem({ name, type, isOwned, onToggle }: CollectionGridItemProps) {
  const typeColor = (type && typeColors[type]) || '#FF3A4F';
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.imageWrapper}>
        <View
          style={[
            styles.chip,
            {
              borderColor: isOwned ? typeColor : '#FFFFFF15',
              backgroundColor: isOwned ? typeColor + '22' : '#161628',
              opacity: isOwned ? 1 : 0.45,
            },
          ]}
        >
          <Text style={[styles.chipInitial, { color: isOwned ? typeColor : '#8888AA' }]}>{initial}</Text>
        </View>
        {isOwned ? (
          <View style={styles.checkBadge}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.name, !isOwned && styles.nameUnowned]} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 6, marginBottom: 4 },
  imageWrapper: { position: 'relative' },
  chip: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipInitial: { fontSize: 26, fontWeight: '800' },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0D0D1A',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: { color: '#2EE6A8', fontSize: 14, fontWeight: '800' },
  name: { color: '#EEEEF5', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  nameUnowned: { color: '#8888AA', opacity: 0.6 },
});

export default CollectionGridItem;
