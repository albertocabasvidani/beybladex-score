import { useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  getBlades,
  getRatchets,
  getBits,
  getCxParts,
  type AnyPart,
  type PartCategory,
} from '@beybladex/shared';
import { PartCard, FilterChipRow, type FilterOption } from '../components';
import { useFilterStore, useCollectionStore, type BrowseCategory } from '../stores';
import { typeColors, palette } from '../theme';
import { CONTENT_PADDING } from '../responsive';

interface BrowseItem {
  part: AnyPart;
  category: PartCategory;
}

function browseItems(category: BrowseCategory): BrowseItem[] {
  switch (category) {
    case 'blade':
      return getBlades().map((part) => ({ part, category: 'blade' as const }));
    case 'ratchet':
      return getRatchets().map((part) => ({ part, category: 'ratchet' as const }));
    case 'bit':
      return getBits().map((part) => ({ part, category: 'bit' as const }));
    case 'cx': {
      const cx = getCxParts();
      return [
        ...cx.mainBlades.map((part) => ({ part, category: 'mainBlade' as const })),
        ...cx.lockChips.map((part) => ({ part, category: 'lockChip' as const })),
        ...cx.assistBlades.map((part) => ({ part, category: 'assistBlade' as const })),
        ...cx.overBlades.map((part) => ({ part, category: 'overBlade' as const })),
      ];
    }
  }
}

function partType(p: AnyPart): string | undefined {
  return (p as { type?: string }).type;
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

export function PartsScreen() {
  const { t } = useTranslation();
  const { searchQuery, category, partType: typeFilter, ownedOnly, sortAsc } = useFilterStore();
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery);
  const setCategory = useFilterStore((s) => s.setCategory);
  const setPartType = useFilterStore((s) => s.setPartType);
  const setOwnedOnly = useFilterStore((s) => s.setOwnedOnly);
  const toggleSortDirection = useFilterStore((s) => s.toggleSortDirection);

  const ownedIds = useCollectionStore((s) => s.ownedIds);
  const toggleOwned = useCollectionStore((s) => s.toggleOwned);

  const categoryOptions: FilterOption[] = [
    { value: 'blade', label: t('builder.category.blade') },
    { value: 'ratchet', label: t('builder.category.ratchet') },
    { value: 'bit', label: t('builder.category.bit') },
    { value: 'cx', label: t('builder.category.cx') },
  ];
  const typeOptions: FilterOption[] = [
    { value: 'all', label: t('builder.type.all') },
    { value: 'attack', label: t('builder.type.attack'), color: typeColors.attack },
    { value: 'defense', label: t('builder.type.defense'), color: typeColors.defense },
    { value: 'stamina', label: t('builder.type.stamina'), color: typeColors.stamina },
    { value: 'balance', label: t('builder.type.balance'), color: typeColors.balance },
  ];

  const showTypeFilter = category !== 'ratchet';

  const items = useMemo(() => {
    let list = browseItems(category);
    if (showTypeFilter && typeFilter !== 'all') {
      list = list.filter((it) => partType(it.part) === typeFilter);
    }
    if (searchQuery) list = list.filter((it) => matchesSearch(it.part, searchQuery));
    if (ownedOnly) list = list.filter((it) => ownedIds.has(it.part.id));
    list = [...list].sort((a, b) =>
      sortAsc ? a.part.name.localeCompare(b.part.name) : b.part.name.localeCompare(a.part.name)
    );
    return list;
  }, [category, showTypeFilter, typeFilter, searchQuery, ownedOnly, ownedIds, sortAsc]);

  return (
    <View style={styles.root}>
      <View style={styles.controls}>
        <FilterChipRow options={categoryOptions} selected={category} onSelect={(v) => setCategory(v as BrowseCategory)} />
        {showTypeFilter ? (
          <FilterChipRow options={typeOptions} selected={typeFilter} onSelect={(v) => setPartType(v as never)} />
        ) : null}
        <View style={styles.searchRow}>
          <TextInput
            placeholder={t('builder.common.search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.search}
            placeholderTextColor="#8888AA"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setOwnedOnly(!ownedOnly)} style={[styles.iconBtn, ownedOnly && styles.iconBtnActive]}>
            <Text style={[styles.iconBtnText, ownedOnly && styles.iconBtnTextActive]}>★</Text>
          </Pressable>
          <Pressable onPress={toggleSortDirection} style={styles.iconBtn}>
            <Text style={styles.iconBtnText}>{sortAsc ? 'A↓' : 'Z↑'}</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.part.id}
        renderItem={({ item }) => (
          <PartCard
            part={item.part}
            category={item.category}
            showOwnership
            isOwned={ownedIds.has(item.part.id)}
            onToggleOwnership={() => toggleOwned(item.part.id)}
          />
        )}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>{t('builder.parts.empty')}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  controls: { paddingTop: 4 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: CONTENT_PADDING, paddingTop: 6 },
  search: {
    flex: 1,
    backgroundColor: '#1E1E38',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    color: palette.text,
    fontSize: 16,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E1E38',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF18',
  },
  iconBtnActive: { borderColor: '#FFB347', backgroundColor: '#FFB34722' },
  iconBtnText: { color: '#8888AA', fontSize: 16, fontWeight: '700' },
  iconBtnTextActive: { color: '#FFB347' },
  list: { paddingHorizontal: CONTENT_PADDING, paddingTop: 8, paddingBottom: 24 },
  empty: { textAlign: 'center', marginTop: 24, color: '#8888AA' },
});

export default PartsScreen;
