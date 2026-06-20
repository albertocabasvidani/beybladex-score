import { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  getPartsByCategory,
  getPartById,
  type AnyPart,
  type PartStats,
  type PartCategory,
} from '@beybladex/shared';
import { typeColors, statColors, palette } from '../theme';
import { CONTENT_PADDING, LIST_PADDING } from '../responsive';
import { FilterChipRow, type FilterOption } from './FilterChipRow';

/** Una qualsiasi delle 7 categorie del registry (blade/ratchet/bit + i 4 pezzi CX). */
export type PickerCategory = PartCategory;

interface PartPickerProps {
  category: PickerCategory;
  onSelect: (part: AnyPart) => void;
  onClose: () => void;
  /** Id delle parti selezionate di recente (risolti dal registry e mostrati come scorciatoie). */
  recentIds?: string[];
}

function getData(category: PickerCategory): AnyPart[] {
  return getPartsByCategory(category);
}

function partType(p: AnyPart): string | undefined {
  return (p as { type?: string }).type;
}
function partStats(p: AnyPart): PartStats | undefined {
  return (p as { stats?: PartStats }).stats;
}

function matchesSearch(p: AnyPart, q: string): boolean {
  if (!q) return true;
  const extra = p as { nameWestern?: string; shortName?: string; aliases?: string[] };
  const hay = [p.name, extra.nameWestern, extra.shortName, ...(extra.aliases ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

function MiniStats({ stats }: { stats?: PartStats }) {
  if (!stats) return null;
  return (
    <View style={styles.miniStats}>
      <Text style={[styles.miniStat, { color: statColors.atk }]}>{stats.atk}</Text>
      <Text style={styles.miniStatSep}>/</Text>
      <Text style={[styles.miniStat, { color: statColors.def }]}>{stats.def}</Text>
      <Text style={styles.miniStatSep}>/</Text>
      <Text style={[styles.miniStat, { color: statColors.sta }]}>{stats.sta}</Text>
    </View>
  );
}

/**
 * Picker di una parte (blade/ratchet/bit) cablato sul registry shared. Layout dal mockup
 * combo-selection: blade = griglia 2 colonne con filtro tipo + recenti + ricerca; ratchet/bit =
 * griglia di chip 3 colonne. Niente react-native-paper, niente immagini.
 */
export function PartPicker({ category, onSelect, onClose, recentIds }: PartPickerProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  // Filtro tipo solo dove le parti hanno `type` (blade, bit, main blade).
  const showTypeFilter = category === 'blade' || category === 'bit' || category === 'mainBlade';
  // Griglia 2 colonne con mini-stat per le "lame" (blade, main blade); token 3 colonne per il resto.
  const isBladeGrid = category === 'blade' || category === 'mainBlade';
  const numColumns = isBladeGrid ? 2 : 3;

  const typeOptions: FilterOption[] = [
    { value: 'all', label: t('builder.type.all') },
    { value: 'attack', label: t('builder.type.attack'), color: typeColors.attack },
    { value: 'defense', label: t('builder.type.defense'), color: typeColors.defense },
    { value: 'stamina', label: t('builder.type.stamina'), color: typeColors.stamina },
    { value: 'balance', label: t('builder.type.balance'), color: typeColors.balance },
  ];
  const categoryLabel = t(`builder.category.${category}`);

  const data = useMemo(() => {
    let items = getData(category);
    if (showTypeFilter && typeFilter !== 'all') {
      items = items.filter((p) => partType(p) === typeFilter);
    }
    if (search) items = items.filter((p) => matchesSearch(p, search));
    return items;
  }, [category, typeFilter, search, showTypeFilter]);

  const handleSelect = (part: AnyPart) => {
    onSelect(part);
    onClose();
  };

  const renderBladeItem = ({ item }: { item: AnyPart }) => {
    const typeColor = (partType(item) && typeColors[partType(item)!]) || palette.accent;
    return (
      <TouchableOpacity style={styles.gridItem} onPress={() => handleSelect(item)} activeOpacity={0.7}>
        <View style={[styles.gridStripe, { backgroundColor: typeColor }]} />
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <MiniStats stats={partStats(item)} />
      </TouchableOpacity>
    );
  };

  const renderTokenItem = ({ item }: { item: AnyPart }) => {
    const t = partType(item);
    const typeColor = (t && typeColors[t]) || '#FFFFFF30';
    return (
      <TouchableOpacity style={styles.token} onPress={() => handleSelect(item)} activeOpacity={0.7}>
        {t ? <View style={[styles.tokenDot, { backgroundColor: typeColor }]} /> : null}
        <Text style={styles.tokenText} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const recents: AnyPart[] = !search
    ? (recentIds ?? []).map((id) => getPartById(id)).filter((p): p is NonNullable<typeof p> => !!p)
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('builder.picker.title', { category: categoryLabel })}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('builder.common.close')}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder={t('builder.picker.search', { category: categoryLabel })}
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        placeholderTextColor="#8888AA"
        autoCorrect={false}
        autoCapitalize="none"
      />

      {showTypeFilter ? (
        <FilterChipRow options={typeOptions} selected={typeFilter} onSelect={setTypeFilter} />
      ) : null}

      {recents.length > 0 ? (
        <View style={styles.recentsWrap}>
          <Text style={styles.recentsLabel}>{t('builder.picker.recent')}</Text>
          <View style={styles.recentsRow}>
            {recents.map((p) => (
              <TouchableOpacity key={p.id} style={styles.recentChip} onPress={() => handleSelect(p)} activeOpacity={0.7}>
                <Text style={styles.recentChipText} numberOfLines={1}>
                  {p.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : null}

      <FlatList
        key={numColumns}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={isBladeGrid ? renderBladeItem : renderTokenItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>{t('builder.common.noResults')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: palette.bg, maxHeight: '85%', borderRadius: 16, overflow: 'hidden' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 16,
    paddingBottom: 4,
  },
  title: { fontWeight: '800', color: '#EEEEF5', fontSize: 24 },
  close: { color: '#8888AA', fontSize: 22, fontWeight: '700' },
  search: {
    marginHorizontal: CONTENT_PADDING,
    marginVertical: 8,
    backgroundColor: '#1E1E38',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#EEEEF5',
    fontSize: 16,
  },
  recentsWrap: { paddingHorizontal: LIST_PADDING, paddingTop: 4 },
  recentsLabel: { color: '#8888AA', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  recentsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  recentChip: {
    backgroundColor: '#1E1E38',
    borderColor: '#FFFFFF20',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: 160,
  },
  recentChipText: { color: '#EEEEF5', fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: LIST_PADDING, paddingBottom: 16, paddingTop: 8 },
  gridRow: { gap: 8 },
  gridItem: {
    flex: 1,
    backgroundColor: '#1E1E38',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF08',
    overflow: 'hidden',
  },
  gridStripe: { position: 'absolute', top: 0, left: 0, right: 0, height: 4 },
  itemName: { color: '#EEEEF5', fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 6 },
  miniStats: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  miniStat: { fontSize: 14, fontWeight: '700' },
  miniStatSep: { fontSize: 14, color: '#FFFFFF30', marginHorizontal: 2 },
  token: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E1E38',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF08',
  },
  tokenDot: { width: 8, height: 8, borderRadius: 4 },
  tokenText: { color: '#EEEEF5', fontSize: 14, fontWeight: '600', flexShrink: 1 },
  empty: { textAlign: 'center', marginTop: 20, color: '#8888AA' },
});

export default PartPicker;
