import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { RadarChart, GradientButton, PartPicker, type PickerCategory } from '../components';
import {
  useBuilderStore,
  toSelectedPart,
  useComboStore,
  type SelectedPart,
  type SavedCombo,
} from '../stores';
import { palette, STAT_MAX_COMBO } from '../theme';
import { CONTENT_PADDING } from '../responsive';

function Slot({
  label,
  placeholder,
  part,
  onPress,
}: {
  label: string;
  placeholder: string;
  part: SelectedPart | null;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.slot} onPress={onPress} accessibilityRole="button">
      <Text style={styles.slotLabel}>{label}</Text>
      <Text style={[styles.slotValue, !part && styles.slotPlaceholder]} numberOfLines={1}>
        {part ? part.name : placeholder}
      </Text>
      <Text style={styles.slotChevron}>›</Text>
    </Pressable>
  );
}

export function BuilderScreen() {
  const { t } = useTranslation();
  const {
    selectedBlade,
    selectedRatchet,
    selectedBit,
    setBlade,
    setRatchet,
    setBit,
    loadCombo,
    getComboStats,
    hasAnyStats,
    clearAll,
    recentBlades,
    recentRatchets,
    recentBits,
  } = useBuilderStore();
  const combos = useComboStore((s) => s.combos);
  const saveCombo = useComboStore((s) => s.saveCombo);
  const updateCombo = useComboStore((s) => s.updateCombo);
  const deleteCombo = useComboStore((s) => s.deleteCombo);

  const [picker, setPicker] = useState<PickerCategory | null>(null);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const complete = !!(selectedBlade && selectedRatchet && selectedBit);
  const stats = getComboStats();
  const showRadar = hasAnyStats();

  const recentIds =
    picker === 'blade'
      ? recentBlades.map((p) => p.id)
      : picker === 'ratchet'
        ? recentRatchets.map((p) => p.id)
        : picker === 'bit'
          ? recentBits.map((p) => p.id)
          : [];

  const onPicked = (category: PickerCategory) => (part: Parameters<typeof toSelectedPart>[0]) => {
    const sp = toSelectedPart(part);
    if (category === 'blade') setBlade(sp);
    else if (category === 'ratchet') setRatchet(sp);
    else setBit(sp);
  };

  const resetForm = () => {
    clearAll();
    setName('');
    setEditingId(null);
  };

  const slotLabel: Record<PickerCategory, string> = {
    blade: t('builder.category.blade'),
    ratchet: t('builder.category.ratchet'),
    bit: t('builder.category.bit'),
  };

  const onSave = () => {
    if (!selectedBlade || !selectedRatchet || !selectedBit) return;
    const finalName = name.trim() || `${selectedBlade.name} ${selectedRatchet.name} ${selectedBit.name}`;
    if (editingId) updateCombo(editingId, finalName, selectedBlade, selectedRatchet, selectedBit);
    else saveCombo(finalName, selectedBlade, selectedRatchet, selectedBit);
    resetForm();
  };

  const onEdit = (combo: SavedCombo) => {
    loadCombo(combo.blade, combo.ratchet, combo.bit);
    setName(combo.name);
    setEditingId(combo.id);
  };

  const onDelete = (combo: SavedCombo) => {
    Alert.alert(t('builder.combo.deleteTitle'), t('builder.combo.deleteMsg', { name: combo.name }), [
      { text: t('builder.common.cancel'), style: 'cancel' },
      {
        text: t('builder.common.delete'),
        style: 'destructive',
        onPress: () => {
          if (editingId === combo.id) resetForm();
          deleteCombo(combo.id);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.slots}>
        <Slot
          label={slotLabel.blade}
          placeholder={t('builder.combo.selectSlot', { slot: slotLabel.blade.toLowerCase() })}
          part={selectedBlade}
          onPress={() => setPicker('blade')}
        />
        <Slot
          label={slotLabel.ratchet}
          placeholder={t('builder.combo.selectSlot', { slot: slotLabel.ratchet.toLowerCase() })}
          part={selectedRatchet}
          onPress={() => setPicker('ratchet')}
        />
        <Slot
          label={slotLabel.bit}
          placeholder={t('builder.combo.selectSlot', { slot: slotLabel.bit.toLowerCase() })}
          part={selectedBit}
          onPress={() => setPicker('bit')}
        />
      </View>

      <View style={styles.radarBox}>
        {showRadar ? (
          <RadarChart stats={stats} size={220} maxValue={STAT_MAX_COMBO} />
        ) : (
          <View style={styles.noRadar}>
            <Text style={styles.noRadarIcon}>📊</Text>
            <Text style={styles.noRadarText}>{t('builder.combo.noRadar')}</Text>
            <Text style={styles.noRadarHint}>{t('builder.combo.noRadarHint')}</Text>
          </View>
        )}
      </View>

      <TextInput
        placeholder={t('builder.combo.namePlaceholder')}
        value={name}
        onChangeText={setName}
        style={styles.nameInput}
        placeholderTextColor="#8888AA"
      />

      <View style={styles.actions}>
        <GradientButton
          label={editingId ? t('builder.combo.update') : t('builder.combo.save')}
          icon="💾"
          onPress={onSave}
          disabled={!complete}
        />
        {(complete || editingId) && (
          <Pressable style={styles.clearBtn} onPress={resetForm}>
            <Text style={styles.clearBtnText}>{t('builder.common.clear')}</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.sectionTitle}>{t('builder.combo.saved', { count: combos.length })}</Text>
      {combos.length === 0 ? (
        <Text style={styles.empty}>{t('builder.combo.empty')}</Text>
      ) : (
        combos.map((combo) => (
          <View key={combo.id} style={styles.comboRow}>
            <Pressable style={styles.comboInfo} onPress={() => onEdit(combo)}>
              <Text style={styles.comboName} numberOfLines={1}>
                {combo.name}
              </Text>
              <Text style={styles.comboParts} numberOfLines={1}>
                {combo.blade.name} · {combo.ratchet.name} · {combo.bit.name}
              </Text>
            </Pressable>
            <Pressable onPress={() => onDelete(combo)} hitSlop={10} style={styles.deleteBtn}>
              <Text style={styles.deleteIcon}>🗑️</Text>
            </Pressable>
          </View>
        ))
      )}

      <Modal visible={picker !== null} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.backdrop} onPress={() => setPicker(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {picker && (
              <PartPicker
                category={picker}
                recentIds={recentIds}
                onSelect={onPicked(picker)}
                onClose={() => setPicker(null)}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: CONTENT_PADDING, paddingBottom: 32 },
  slots: { gap: 8 },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161628',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
  },
  slotLabel: { color: '#8888AA', fontSize: 13, fontWeight: '700', width: 70 },
  slotValue: { color: palette.text, fontSize: 17, fontWeight: '600', flex: 1 },
  slotPlaceholder: { color: '#8888AA', fontWeight: '400' },
  slotChevron: { color: '#8888AA', fontSize: 22, fontWeight: '700' },
  radarBox: { alignItems: 'center', justifyContent: 'center', marginVertical: 16, minHeight: 220 },
  noRadar: { alignItems: 'center', paddingHorizontal: 24 },
  noRadarIcon: { fontSize: 40, marginBottom: 8 },
  noRadarText: { color: palette.text, fontSize: 16, fontWeight: '700' },
  noRadarHint: { color: '#8888AA', fontSize: 13, textAlign: 'center', marginTop: 4 },
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
  sectionTitle: { color: palette.text, fontSize: 16, fontWeight: '800', marginBottom: 8 },
  empty: { color: '#8888AA', textAlign: 'center', marginTop: 8 },
  comboRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161628',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF08',
  },
  comboInfo: { flex: 1 },
  comboName: { color: palette.text, fontSize: 16, fontWeight: '700' },
  comboParts: { color: '#8888AA', fontSize: 13, marginTop: 2 },
  deleteBtn: { paddingHorizontal: 8 },
  deleteIcon: { fontSize: 18 },
  backdrop: { flex: 1, backgroundColor: '#00000099', justifyContent: 'flex-end' },
  sheet: { backgroundColor: palette.bg, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 8 },
});

export default BuilderScreen;
