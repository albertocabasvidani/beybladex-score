import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import type { AnyPart, PartCategory, PartStats } from '@beybladex/shared';
import { typeColors, statColors, STAT_MAX_BY_CATEGORY } from '../theme';
import { StatBar } from './StatBar';

interface PartCardProps {
  part: AnyPart;
  category: PartCategory;
  showOwnership?: boolean;
  isOwned?: boolean;
  onPress?: () => void;
  onToggleOwnership?: () => void;
}

function partType(part: AnyPart): string | undefined {
  return (part as { type?: string }).type;
}
function partStats(part: AnyPart): PartStats | undefined {
  return (part as { stats?: PartStats }).stats;
}

function subtitle(part: AnyPart, category: PartCategory, t: TFunction): string | null {
  switch (category) {
    case 'blade': {
      const b = part as { line?: string; releaseSet?: string };
      const line = b.line ? b.line.toUpperCase() : '';
      return b.releaseSet ? `${line} · ${b.releaseSet}` : line || null;
    }
    case 'bit': {
      const s = (part as { shortName?: string }).shortName;
      return s ? `${t('builder.partCard.bit')} · ${s}` : t('builder.partCard.bit');
    }
    case 'ratchet':
      return t('builder.partCard.ratchet');
    case 'mainBlade':
      return t('builder.partCard.mainBlade');
    case 'assistBlade':
      return t('builder.partCard.assistBlade');
    case 'lockChip':
      return t('builder.partCard.lockChip');
    case 'overBlade':
      return t('builder.partCard.overBlade');
    default:
      return null;
  }
}

/**
 * Card di una parte. Portato da bbxdeckbuild: niente PartImage (no immagini per copyright),
 * 3 StatBar (ATK/DEF/STA) invece di 5; se la parte non ha stat mostra il badge di degradazione.
 */
export function PartCard({
  part,
  category,
  showOwnership,
  isOwned,
  onPress,
  onToggleOwnership,
}: PartCardProps) {
  const { t } = useTranslation();
  const type = partType(part);
  const stats = partStats(part);
  const typeColor = (type && typeColors[type]) || '#FF3A4F';
  const max = STAT_MAX_BY_CATEGORY[category] ?? 100;
  const sub = subtitle(part, category, t);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.typeBorder, { backgroundColor: typeColor }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {part.name}
            </Text>
            {type ? (
              <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
                <Text style={[styles.typeText, { color: typeColor }]}>{type.toUpperCase()}</Text>
              </View>
            ) : null}
          </View>
          {showOwnership ? (
            <Pressable onPress={onToggleOwnership} hitSlop={10} style={styles.ownershipBtn}>
              <Text style={[styles.ownershipIcon, { color: isOwned ? '#2EE6A8' : '#8888AA' }]}>
                {isOwned ? '✓' : '○'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {sub ? <Text style={styles.series}>{sub}</Text> : null}

        {stats ? (
          <View style={styles.statsContainer}>
            <StatBar label="ATK" value={stats.atk} max={max} color={statColors.atk} />
            <StatBar label="DEF" value={stats.def} max={max} color={statColors.def} />
            <StatBar label="STA" value={stats.sta} max={max} color={statColors.sta} />
          </View>
        ) : (
          <View style={styles.noStatsBadge}>
            <Text style={styles.noStatsText}>{t('builder.common.noStats')}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#161628',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF08',
  },
  typeBorder: { width: 4 },
  content: { flex: 1, padding: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  nameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { color: '#EEEEF5', fontSize: 20, fontWeight: '700', flexShrink: 1 },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  typeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  series: { color: '#8888AA', fontSize: 14, marginBottom: 4 },
  ownershipBtn: { paddingHorizontal: 6, paddingVertical: 2 },
  ownershipIcon: { fontSize: 22, fontWeight: '700' },
  statsContainer: { gap: 1 },
  noStatsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF10',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  noStatsText: { color: '#8888AA', fontSize: 12, fontStyle: 'italic' },
});

export default PartCard;
