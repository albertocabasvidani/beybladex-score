import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../../store/game-store';
import { useBeySelectorStore } from '../beySelectorStore';
import { beyChips } from '../bey';

/**
 * Riga Bey sotto/accanto al nome giocatore nello scoreboard. Stato vuoto: pill "+ Aggiungi Bey".
 * Bey assegnata: chip per pezzo (tap = cambia quel pezzo al volo) + "⋯" (apre lo scaffale per
 * ripescare/comporre/rimuovere). Solo testo, niente icone decorative (vedi mockup design).
 */
export function BeyRow({ playerId }: { playerId: PlayerId }) {
  const { t } = useTranslation();
  const bey = useGameStore((s) => (playerId === 'player1' ? s.player1Bey : s.player2Bey));
  const openSheet = useBeySelectorStore((s) => s.openSheet);
  const openSwap = useBeySelectorStore((s) => s.openSwap);

  if (!bey) {
    return (
      <Pressable
        onPress={() => openSheet(playerId)}
        hitSlop={8}
        style={styles.addPill}
        accessibilityRole="button"
        accessibilityLabel={t('stats.bey.add')}
      >
        <Text allowFontScaling={false} style={styles.addText}>
          + {t('stats.bey.add')}
        </Text>
      </Pressable>
    );
  }

  const chips = beyChips(bey);

  return (
    <View style={styles.row}>
      {bey.freeform || chips.length === 0 ? (
        <Pressable onPress={() => openSheet(playerId)} hitSlop={6}>
          <Text allowFontScaling={false} style={[styles.chip, styles.chipBlade]} numberOfLines={1}>
            {bey.name}
          </Text>
        </Pressable>
      ) : (
        chips.map((c, i) => (
          <Pressable key={c.category} onPress={() => openSwap(playerId, c.category)} hitSlop={6}>
            <Text
              allowFontScaling={false}
              style={[styles.chip, i === 0 && styles.chipBlade]}
              numberOfLines={1}
            >
              {c.name}
            </Text>
          </Pressable>
        ))
      )}
      {bey.variant ? (
        <Text allowFontScaling={false} style={styles.variant}>
          ★
        </Text>
      ) : null}
      <Pressable
        onPress={() => openSheet(playerId)}
        hitSlop={10}
        style={styles.more}
        accessibilityRole="button"
        accessibilityLabel={t('stats.bey.change')}
      >
        <Text allowFontScaling={false} style={styles.moreText}>
          ⋯
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 5 },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51,65,85,0.6)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#475569',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  addText: { color: '#94a3b8', fontSize: 14, fontWeight: '700' },
  chip: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    color: '#cbd5e1',
    overflow: 'hidden',
  },
  chipBlade: { color: '#fbbf24', borderColor: '#475569' },
  variant: { fontSize: 14, color: '#fb923c', fontWeight: '800', marginLeft: 1 },
  more: { paddingHorizontal: 6, paddingVertical: 2 },
  moreText: { color: '#64748b', fontSize: 20, fontWeight: '900', lineHeight: 20 },
});
