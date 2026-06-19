import { useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  getBlades,
  getRatchets,
  getBits,
  getCxParts,
  type AnyPart,
} from '@beybladex/shared';
import { CollectionGridItem, FilterChipRow, type FilterOption } from '../components';
import { useCollectionStore, type BrowseCategory } from '../stores';
import { CONTENT_PADDING } from '../responsive';

function browseParts(category: BrowseCategory): AnyPart[] {
  switch (category) {
    case 'blade':
      return getBlades();
    case 'ratchet':
      return getRatchets();
    case 'bit':
      return getBits();
    case 'cx': {
      const cx = getCxParts();
      return [...cx.mainBlades, ...cx.lockChips, ...cx.assistBlades, ...cx.overBlades];
    }
  }
}

function partType(p: AnyPart): string | undefined {
  return (p as { type?: string }).type;
}

export function CollectionScreen() {
  const { t } = useTranslation();
  const [category, setCategory] = useState<BrowseCategory>('blade');
  const ownedIds = useCollectionStore((s) => s.ownedIds);
  const toggleOwned = useCollectionStore((s) => s.toggleOwned);

  const categoryOptions: FilterOption[] = [
    { value: 'blade', label: t('builder.category.blade') },
    { value: 'ratchet', label: t('builder.category.ratchet') },
    { value: 'bit', label: t('builder.category.bit') },
    { value: 'cx', label: t('builder.category.cx') },
  ];

  const parts = useMemo(() => browseParts(category), [category]);
  const ownedInCategory = parts.filter((p) => ownedIds.has(p.id)).length;

  return (
    <View style={styles.root}>
      <FilterChipRow options={categoryOptions} selected={category} onSelect={(v) => setCategory(v as BrowseCategory)} />
      <Text style={styles.counter}>{t('builder.collection.counter', { owned: ownedInCategory, total: parts.length })}</Text>
      <FlatList
        data={parts}
        key={category}
        keyExtractor={(p) => p.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CollectionGridItem
            name={item.name}
            type={partType(item)}
            isOwned={ownedIds.has(item.id)}
            onToggle={() => toggleOwned(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 4 },
  counter: { color: '#8888AA', fontSize: 13, fontWeight: '700', paddingHorizontal: CONTENT_PADDING, paddingVertical: 6 },
  list: { paddingHorizontal: CONTENT_PADDING - 6, paddingBottom: 24 },
  row: { gap: 4 },
});

export default CollectionScreen;
