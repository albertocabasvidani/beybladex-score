import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getComboStatMax } from '@beybladex/shared';
import { RadarChart, GradientButton, type RadarDataSet } from '../components';
import {
  useDeckStore,
  useComboStore,
  validateNoDuplicateParts,
  type SavedCombo,
  type SavedDeck,
} from '../stores';
import { palette } from '../theme';
import { CONTENT_PADDING } from '../responsive';

const DATASET_COLORS = ['#FF3A4F', '#3ABFFF', '#2EE6A8'];
const DECK_SIZE = 3;

function comboHasStats(c: SavedCombo): boolean {
  return c.stats.atk > 0 || c.stats.def > 0 || c.stats.sta > 0;
}

function deckDatasets(combos: SavedCombo[]): RadarDataSet[] {
  return combos
    .filter(comboHasStats)
    .map((c, i) => ({ stats: c.stats, color: DATASET_COLORS[i % DATASET_COLORS.length], opacity: 0.25 }));
}

export function DecksScreen() {
  const { t } = useTranslation();
  const kindLabel = (kind: 'blade' | 'ratchet' | 'bit') => t(`builder.category.${kind}`);
  const decks = useDeckStore((s) => s.decks);
  const saveDeck = useDeckStore((s) => s.saveDeck);
  const updateDeck = useDeckStore((s) => s.updateDeck);
  const deleteDeck = useDeckStore((s) => s.deleteDeck);
  const combos = useComboStore((s) => s.combos);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedCombos = selectedIds
    .map((id) => combos.find((c) => c.id === id))
    .filter((c): c is SavedCombo => !!c);
  const liveError = validateNoDuplicateParts(selectedCombos);

  const toggleCombo = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= DECK_SIZE) return prev;
      return [...prev, id];
    });
  };

  const resetForm = () => {
    setSelectedIds([]);
    setName('');
    setEditingId(null);
  };

  const onSave = () => {
    if (selectedCombos.length !== DECK_SIZE) return;
    const finalName = name.trim() || t('builder.deck.defaultName', { n: decks.length + 1 });
    const error = editingId
      ? updateDeck(editingId, finalName, selectedCombos)
      : saveDeck(finalName, selectedCombos);
    if (error) {
      Alert.alert(
        t('builder.deck.duplicateTitle'),
        t('builder.deck.duplicateMsg', { kind: kindLabel(error.kind), name: error.name })
      );
      return;
    }
    resetForm();
  };

  const onEdit = (deck: SavedDeck) => {
    setSelectedIds(deck.combos.map((c) => c.id));
    setName(deck.name);
    setEditingId(deck.id);
  };

  const onDelete = (deck: SavedDeck) => {
    Alert.alert(t('builder.deck.deleteTitle'), t('builder.deck.deleteMsg', { name: deck.name }), [
      { text: t('builder.common.cancel'), style: 'cancel' },
      {
        text: t('builder.common.delete'),
        style: 'destructive',
        onPress: () => {
          if (editingId === deck.id) resetForm();
          deleteDeck(deck.id);
        },
      },
    ]);
  };

  const datasets = deckDatasets(selectedCombos);

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.sectionTitle}>{t('builder.deck.new', { count: selectedCombos.length, size: DECK_SIZE })}</Text>
      <Text style={styles.hint}>{t('builder.deck.wboHint')}</Text>

      {combos.length === 0 ? (
        <Text style={styles.empty}>{t('builder.deck.needCombos')}</Text>
      ) : (
        combos.map((combo) => {
          const active = selectedIds.includes(combo.id);
          const disabled = !active && selectedIds.length >= DECK_SIZE;
          return (
            <Pressable
              key={combo.id}
              onPress={() => toggleCombo(combo.id)}
              disabled={disabled}
              style={[styles.comboRow, active && styles.comboRowActive, disabled && styles.comboRowDisabled]}
            >
              <Text style={[styles.checkbox, active && styles.checkboxActive]}>{active ? '☑' : '☐'}</Text>
              <View style={styles.comboInfo}>
                <Text style={styles.comboName} numberOfLines={1}>
                  {combo.name}
                </Text>
                <Text style={styles.comboParts} numberOfLines={1}>
                  {combo.blade.name} · {combo.ratchet.name} · {combo.bit.name}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}

      {selectedCombos.length > 0 && (
        <View style={styles.radarBox}>
          {datasets.length > 0 ? (
            <RadarChart datasets={datasets} size={220} maxPerAxis={getComboStatMax()} />
          ) : (
            <Text style={styles.noRadarText}>{t('builder.deck.noRadar')}</Text>
          )}
        </View>
      )}

      {liveError && selectedCombos.length > 1 && (
        <Text style={styles.errorText}>
          ⚠ {t('builder.deck.duplicateInline', { kind: kindLabel(liveError.kind), name: liveError.name })}
        </Text>
      )}

      <TextInput
        placeholder={t('builder.deck.namePlaceholder')}
        value={name}
        onChangeText={setName}
        style={styles.nameInput}
        placeholderTextColor="#8888AA"
      />
      <View style={styles.actions}>
        <GradientButton
          label={editingId ? t('builder.deck.update') : t('builder.deck.save')}
          icon="💾"
          onPress={onSave}
          disabled={selectedCombos.length !== DECK_SIZE || !!liveError}
        />
        {(selectedIds.length > 0 || editingId) && (
          <Pressable style={styles.clearBtn} onPress={resetForm}>
            <Text style={styles.clearBtnText}>{t('builder.common.clear')}</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionTitle}>{t('builder.deck.saved', { count: decks.length })}</Text>
      {decks.length === 0 ? (
        <Text style={styles.empty}>{t('builder.deck.empty')}</Text>
      ) : (
        decks.map((deck) => (
          <View key={deck.id} style={styles.deckRow}>
            <Pressable style={styles.comboInfo} onPress={() => onEdit(deck)}>
              <Text style={styles.comboName} numberOfLines={1}>
                {deck.name}
              </Text>
              <Text style={styles.comboParts} numberOfLines={2}>
                {deck.combos.map((c) => c.name).join(' • ')}
              </Text>
            </Pressable>
            <Pressable onPress={() => onDelete(deck)} hitSlop={10} style={styles.deleteBtn}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: CONTENT_PADDING, paddingBottom: 32 },
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '800', marginBottom: 4, marginTop: 8 },
  hint: { color: '#8888AA', fontSize: 12, marginBottom: 10 },
  empty: { color: '#8888AA', textAlign: 'center', marginVertical: 12 },
  comboRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#161628',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF08',
  },
  comboRowActive: { borderColor: '#FF3A4F' },
  comboRowDisabled: { opacity: 0.4 },
  checkbox: { color: '#8888AA', fontSize: 20 },
  checkboxActive: { color: '#FF3A4F' },
  comboInfo: { flex: 1 },
  comboName: { color: palette.text, fontSize: 16, fontWeight: '700' },
  comboParts: { color: '#8888AA', fontSize: 13, marginTop: 2 },
  radarBox: { alignItems: 'center', justifyContent: 'center', marginVertical: 12, minHeight: 220 },
  noRadarText: { color: '#8888AA', fontSize: 14, fontStyle: 'italic' },
  errorText: { color: '#FF6B6B', fontSize: 13, marginBottom: 8, fontWeight: '600' },
  nameInput: {
    backgroundColor: '#1E1E38',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: palette.text,
    fontSize: 16,
    marginBottom: 12,
  },
  actions: { flexDirection: 'row', alignItems: 'stretch', gap: 8, marginBottom: 20 },
  clearBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#1E1E38',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF18',
  },
  clearBtnText: { color: '#8888AA', fontWeight: '700' },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161628',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF08',
  },
  deleteBtn: { paddingHorizontal: 8 },
  deleteIcon: { fontSize: 18 },
});

export default DecksScreen;
