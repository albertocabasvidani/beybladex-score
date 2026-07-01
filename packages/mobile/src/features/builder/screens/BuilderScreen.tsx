import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getComboStatMax } from '@beybladex/shared';
import { RadarChart, GradientButton, PartPicker, type PickerCategory } from '../components';
import {
  useBuilderStore,
  toSelectedPart,
  useComboStore,
  comboPartsLabel,
  computeSlots,
  comboComplete,
  getComboLine,
  SLOT_ORDER,
  type SavedCombo,
} from '../stores';
import { palette } from '../theme';
import { CONTENT_PADDING } from '../responsive';
import { useHasFullAccess } from '../../../store/access-store';
import { usePaywallStore } from '../../../store/paywall-store';
import { FREE_COMBO_LIMIT } from '../../../config/monetization';

function Slot({
  label,
  value,
  placeholder,
  enabled,
  disabledHint,
  isEmpty,
  onPress,
  onClear,
}: {
  label: string;
  value: string;
  placeholder: string;
  enabled: boolean;
  disabledHint?: string;
  isEmpty: boolean;
  onPress: () => void;
  onClear?: () => void;
}) {
  if (!enabled) {
    return (
      <View style={[styles.slot, styles.slotDisabled]}>
        <Text style={[styles.slotLabel, styles.slotLabelDisabled]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={styles.slotDisabledHint} numberOfLines={1}>
          {disabledHint ?? '—'}
        </Text>
      </View>
    );
  }
  return (
    <Pressable style={styles.slot} onPress={onPress} accessibilityRole="button">
      <Text style={styles.slotLabel} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.slotValue, isEmpty && styles.slotPlaceholder]} numberOfLines={1}>
        {isEmpty ? placeholder : value}
      </Text>
      {onClear && !isEmpty ? (
        <Pressable onPress={onClear} hitSlop={10} style={styles.slotClear} accessibilityRole="button">
          <Text style={styles.slotClearText}>✕</Text>
        </Pressable>
      ) : (
        <Text style={styles.slotChevron}>›</Text>
      )}
    </Pressable>
  );
}

export function BuilderScreen() {
  const { t } = useTranslation();
  const parts = useBuilderStore((s) => s.parts);
  const recent = useBuilderStore((s) => s.recent);
  const setPart = useBuilderStore((s) => s.setPart);
  const clearPart = useBuilderStore((s) => s.clearPart);
  const loadCombo = useBuilderStore((s) => s.loadCombo);
  const getComboStats = useBuilderStore((s) => s.getComboStats);
  const hasAnyStats = useBuilderStore((s) => s.hasAnyStats);
  const clearAll = useBuilderStore((s) => s.clearAll);

  const combos = useComboStore((s) => s.combos);
  const saveCombo = useComboStore((s) => s.saveCombo);
  const updateCombo = useComboStore((s) => s.updateCombo);
  const deleteCombo = useComboStore((s) => s.deleteCombo);

  const fullAccess = useHasFullAccess();
  const showPaywall = usePaywallStore((s) => s.show);
  const comboLimitReached = !fullAccess && combos.length >= FREE_COMBO_LIMIT;

  const [picker, setPicker] = useState<PickerCategory | null>(null);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const slots = computeSlots(parts);
  const complete = comboComplete(parts);
  const stats = getComboStats();
  const showRadar = hasAnyStats();
  const line = getComboLine(parts);

  const recentIds = picker ? (recent[picker]?.map((p) => p.id) ?? []) : [];

  const onPicked = (category: PickerCategory) => (part: Parameters<typeof toSelectedPart>[0]) => {
    setPart(category, toSelectedPart(part));
  };

  const resetForm = () => {
    clearAll();
    setName('');
    setEditingId(null);
  };

  const onSave = () => {
    if (!complete) return;
    const defaultName = SLOT_ORDER.map((c) => parts[c]?.name)
      .filter(Boolean)
      .join(' ');
    const finalName = name.trim() || defaultName;
    if (editingId) {
      updateCombo(editingId, finalName, line, parts);
      resetForm();
      return;
    }
    // Gate morbido: modificare le combo esistenti è sempre libero; oltre il limite free il
    // salvataggio di una NUOVA combo apre il paywall (la consultazione parti/radar resta gratis).
    if (comboLimitReached) {
      showPaywall('combo');
      return;
    }
    saveCombo(finalName, line, parts);
    resetForm();
  };

  const onEdit = (combo: SavedCombo) => {
    loadCombo(combo.parts);
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
        {slots.map((slot) => {
          const part = parts[slot.category];
          const label = t(`builder.category.${slot.category}`);
          const optional = slot.category === 'overBlade';
          const disabledHint =
            slot.reason === 'integratedRatchet' ? t('builder.slotDisabled.integratedRatchet') : undefined;
          return (
            <Slot
              key={slot.category}
              label={label}
              value={part?.name ?? ''}
              isEmpty={!part}
              enabled={slot.enabled}
              disabledHint={disabledHint}
              placeholder={
                optional
                  ? t('builder.combo.optional')
                  : t('builder.combo.selectSlot', { slot: label.toLowerCase() })
              }
              onPress={() => setPicker(slot.category)}
              onClear={optional ? () => clearPart(slot.category) : undefined}
            />
          );
        })}
      </View>

      <View style={styles.radarBox}>
        {showRadar ? (
          <RadarChart stats={stats} size={220} maxPerAxis={getComboStatMax(line)} />
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
      {comboLimitReached ? (
        <Pressable onPress={() => showPaywall('combo')} style={styles.limitHint} accessibilityRole="button">
          <Text style={styles.limitHintText}>🔒 {t('builder.combo.limitReached', { limit: FREE_COMBO_LIMIT })}</Text>
        </Pressable>
      ) : null}
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
                {comboPartsLabel(combo)}
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
                key={picker}
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
  slotDisabled: { opacity: 0.4, backgroundColor: '#12121F' },
  slotLabel: { color: '#8888AA', fontSize: 13, fontWeight: '700', width: 92 },
  slotLabelDisabled: { color: '#66667A' },
  slotValue: { color: palette.text, fontSize: 17, fontWeight: '600', flex: 1 },
  slotPlaceholder: { color: '#8888AA', fontWeight: '400' },
  slotDisabledHint: { color: '#66667A', fontSize: 13, fontStyle: 'italic', flex: 1 },
  slotChevron: { color: '#8888AA', fontSize: 22, fontWeight: '700' },
  slotClear: { paddingHorizontal: 4 },
  slotClearText: { color: '#8888AA', fontSize: 16, fontWeight: '700' },
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
  limitHint: {
    backgroundColor: '#1c1810',
    borderColor: '#F5C451',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  limitHintText: { color: '#F5C451', fontSize: 12, fontWeight: '700', textAlign: 'center' },
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
