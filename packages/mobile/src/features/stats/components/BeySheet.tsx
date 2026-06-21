import { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isDefaultPlayerName, type PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../../store/game-store';
import { useComboStore, comboPartsLabel } from '../../builder/stores/comboStore';
import { useUiStore } from '../../../store/uiStore';
import { useBeySelectorStore } from '../beySelectorStore';
import { beyFromSavedCombo, beyFreeform } from '../bey';

/** Contenuto del bottom sheet "scegli o crea Bey": scaffale (dal builder) + componi + nome libero. */
export function BeySheet({ playerId }: { playerId: PlayerId }) {
  const { t } = useTranslation();
  const combos = useComboStore((s) => s.combos);
  const playerName = useGameStore((s) => s[playerId].name);
  const currentBey = useGameStore((s) => (playerId === 'player1' ? s.player1Bey : s.player2Bey));
  const assignBey = useGameStore((s) => s.assignBey);
  const clearBey = useGameStore((s) => s.clearBey);
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  const openCompose = useBeySelectorStore((s) => s.openCompose);
  const close = useBeySelectorStore((s) => s.close);
  const [freeform, setFreeform] = useState('');

  const displayName = isDefaultPlayerName(playerName, playerId) ? t(`player.${playerId}`) : playerName;

  const submitFreeform = () => {
    const v = freeform.trim();
    if (!v) return;
    assignBey(playerId, beyFreeform(v));
    close();
  };

  return (
    <View>
      <View style={styles.head}>
        <Text style={styles.title}>
          {t('stats.bey.sheetTitle', { name: displayName })}
        </Text>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('builder.common.close')}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <Text style={styles.subhead}>{t('stats.bey.yourBeys')}</Text>
      {combos.length === 0 ? (
        <View style={styles.emptyShelf}>
          <Text style={styles.emptyText}>{t('stats.bey.noSavedCombos')}</Text>
          <View style={styles.emptyActions}>
            <Pressable style={[styles.card, styles.cardNew, styles.cardNewInline]} onPress={() => openCompose(playerId)}>
              <Text style={styles.plus}>+</Text>
              <Text style={styles.cardNewLabel}>{t('stats.bey.composeNew')}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                close();
                setActiveTab('builder');
              }}
              style={styles.linkBtn}
            >
              <Text style={styles.linkText}>{t('stats.bey.openBuilder')}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelf}>
          {combos.map((c) => (
            <Pressable
              key={c.id}
              style={styles.card}
              onPress={() => {
                assignBey(playerId, beyFromSavedCombo(c));
                close();
              }}
            >
              <Text style={styles.cardName} numberOfLines={1}>
                {c.name}
              </Text>
              <Text style={styles.cardParts} numberOfLines={2}>
                {comboPartsLabel(c)}
              </Text>
            </Pressable>
          ))}
          <Pressable style={[styles.card, styles.cardNew]} onPress={() => openCompose(playerId)}>
            <Text style={styles.plus}>+</Text>
            <Text style={styles.cardNewLabel}>{t('stats.bey.composeNew')}</Text>
          </Pressable>
        </ScrollView>
      )}

      <Text style={styles.subhead}>{t('stats.bey.freeformHint')}</Text>
      <View style={styles.freeformRow}>
        <TextInput
          value={freeform}
          onChangeText={setFreeform}
          placeholder={t('stats.bey.freeformPlaceholder')}
          placeholderTextColor="#64748b"
          maxLength={24}
          style={styles.freeformInput}
          onSubmitEditing={submitFreeform}
          returnKeyType="done"
        />
        <Pressable style={styles.okBtn} onPress={submitFreeform}>
          <Text style={styles.okText}>OK</Text>
        </Pressable>
      </View>

      {currentBey ? (
        <Pressable
          style={styles.removeBtn}
          onPress={() => {
            clearBey(playerId);
            close();
          }}
        >
          <Text style={styles.removeText}>{t('stats.bey.remove')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '800', color: '#e2e8f0', flexShrink: 1 },
  close: { color: '#94a3b8', fontSize: 20, fontWeight: '700', paddingHorizontal: 6 },
  subhead: {
    fontSize: 11,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  shelf: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  card: {
    width: 130,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 10,
  },
  cardName: { fontSize: 13, fontWeight: '800', color: '#fbbf24', textAlign: 'center' },
  cardParts: { fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 3 },
  cardNew: {
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
  },
  plus: { fontSize: 24, color: '#94a3b8' },
  cardNewLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginTop: 2, textAlign: 'center' },
  cardNewInline: { height: 64 },
  emptyShelf: { paddingVertical: 4 },
  emptyText: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  emptyActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  linkBtn: { alignSelf: 'center' },
  linkText: { color: '#fbbf24', fontSize: 13, fontWeight: '800', textDecorationLine: 'underline' },
  freeformRow: { flexDirection: 'row', gap: 8 },
  freeformInput: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  okBtn: { backgroundColor: '#fbbf24', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  okText: { color: '#0f172a', fontWeight: '800', fontSize: 14 },
  removeBtn: { marginTop: 14, alignSelf: 'center' },
  removeText: { color: '#f87171', fontSize: 13, fontWeight: '700' },
});
