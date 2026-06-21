import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { PartCategory, PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../../store/game-store';
import {
  comboComplete,
  getComboLine,
  ratchetIsIncluded,
  type SelectedParts,
} from '../../builder/stores/builderStore';
import { useBeySelectorStore } from '../beySelectorStore';
import type { AssignedBey } from '../bey';

/** Pezzi della composizione rapida (caso BX standard); il ratchet sparisce se il bit lo ingloba. */
function composeSlots(draft: SelectedParts): PartCategory[] {
  const slots: PartCategory[] = ['blade'];
  if (!ratchetIsIncluded(draft)) slots.push('ratchet');
  slots.push('bit');
  return slots;
}

function composedBey(draft: SelectedParts): AssignedBey {
  const lamaName = draft.blade?.name ?? draft.mainBlade?.name ?? 'Bey';
  return {
    comboId: null,
    name: lamaName,
    line: getComboLine(draft),
    parts: { ...draft },
    variant: false,
  };
}

/** Modale "Componi nuova Bey": 3 pezzi grandi tappabili, ognuno apre il picker ricco. */
export function ComposeModal({ playerId }: { playerId: PlayerId }) {
  const { t } = useTranslation();
  const draft = useBeySelectorStore((s) => s.composeDraft);
  const openComposePicker = useBeySelectorStore((s) => s.openComposePicker);
  const close = useBeySelectorStore((s) => s.close);
  const assignBey = useGameStore((s) => s.assignBey);

  const slots = composeSlots(draft);
  const complete = comboComplete(draft);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>{t('stats.bey.composeTitle')}</Text>
        <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel={t('builder.common.close')}>
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.parts}>
        {slots.map((cat) => (
          <Pressable key={cat} style={styles.part} onPress={() => openComposePicker(cat)}>
            <Text style={styles.partKey}>{t(`builder.category.${cat}`)}</Text>
            <Text style={styles.partValue} numberOfLines={2}>
              {draft[cat]?.name ?? '—'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.confirm, !complete && styles.confirmDisabled]}
        disabled={!complete}
        onPress={() => {
          assignBey(playerId, composedBey(draft));
          close();
        }}
      >
        <Text style={[styles.confirmText, !complete && styles.confirmTextDisabled]}>
          {t('stats.bey.confirm')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 4 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 15, fontWeight: '800', color: '#e2e8f0' },
  close: { color: '#94a3b8', fontSize: 20, fontWeight: '700', paddingHorizontal: 6 },
  parts: { flexDirection: 'row', gap: 10 },
  part: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  partKey: { fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 },
  partValue: { fontSize: 14, fontWeight: '800', color: '#fbbf24', marginTop: 4, textAlign: 'center' },
  confirm: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  confirmDisabled: { backgroundColor: '#334155' },
  confirmText: { color: '#0f172a', fontWeight: '800', fontSize: 15 },
  confirmTextDisabled: { color: '#64748b' },
});
