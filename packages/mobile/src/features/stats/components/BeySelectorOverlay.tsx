import { useEffect, useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import type { AnyPart } from '@beybladex/shared';
import { useGameStore } from '../../../store/game-store';
import { useBuilderStore } from '../../builder/stores/builderStore';
import { useComboStore } from '../../builder/stores/comboStore';
import { PartPicker } from '../../builder/components/PartPicker';
import { toSelectedPart } from '../../builder/stores/slots';
import { useBeySelectorStore } from '../beySelectorStore';
import { BeySheet } from './BeySheet';
import { ComposeModal } from './ComposeModal';

/**
 * Overlay full-screen del selettore Bey, montato una sola volta in GameScreen (così copre entrambi
 * i pannelli landscape). Pilotato da beySelectorStore: sheet (scaffale) / compose / picker + toast
 * "variante attiva". Usa View assolute (come VictoryOverlay), non Modal, per non perturbare
 * l'orientamento landscape su Android.
 */
export function BeySelectorOverlay() {
  const { t } = useTranslation();
  const view = useBeySelectorStore((s) => s.view);
  const playerId = useBeySelectorStore((s) => s.playerId);
  const pickerCategory = useBeySelectorStore((s) => s.pickerCategory);
  const pickerMode = useBeySelectorStore((s) => s.pickerMode);
  const toastPlayerId = useBeySelectorStore((s) => s.toastPlayerId);
  const setComposePart = useBeySelectorStore((s) => s.setComposePart);
  const backToCompose = useBeySelectorStore((s) => s.backToCompose);
  const close = useBeySelectorStore((s) => s.close);
  const showToast = useBeySelectorStore((s) => s.showToast);
  const hideToast = useBeySelectorStore((s) => s.hideToast);

  const swapBeyPart = useGameStore((s) => s.swapBeyPart);
  const assignBey = useGameStore((s) => s.assignBey);
  const toastBey = useGameStore((s) =>
    toastPlayerId === 'player1' ? s.player1Bey : toastPlayerId === 'player2' ? s.player2Bey : null
  );
  // NB: selezionare il riferimento stabile dallo store (mai un nuovo array nel selettore, sennò
  // getSnapshot cambia a ogni render → "Maximum update depth exceeded"). Derivare gli id con useMemo.
  const recentParts = useBuilderStore((s) => (pickerCategory ? s.recent[pickerCategory] : undefined));
  const recentIds = useMemo(() => (recentParts ?? []).map((p) => p.id), [recentParts]);
  const saveCombo = useComboStore((s) => s.saveCombo);

  // Auto-dismiss del toast variante dopo 4s.
  useEffect(() => {
    if (!toastPlayerId) return;
    const timer = setTimeout(hideToast, 4000);
    return () => clearTimeout(timer);
  }, [toastPlayerId, hideToast]);

  const handleSelect = (part: AnyPart) => {
    const sp = toSelectedPart(part);
    if (pickerMode === 'swap' && playerId && pickerCategory) {
      swapBeyPart(playerId, pickerCategory, sp);
      showToast(playerId);
    } else if (pickerMode === 'compose' && pickerCategory) {
      setComposePart(pickerCategory, sp);
    }
  };

  const handlePickerClose = () => {
    if (pickerMode === 'compose') backToCompose();
    else close();
  };

  if (!view && !toastPlayerId) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {view ? (
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(120)} style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel={t('builder.common.close')} />

          {view === 'sheet' && playerId ? (
            <Animated.View entering={SlideInDown.duration(220)} style={styles.sheet}>
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <BeySheet playerId={playerId} />
              </ScrollView>
            </Animated.View>
          ) : null}

          {view === 'compose' && playerId ? (
            <View style={styles.centerWrap} pointerEvents="box-none">
              <Animated.View entering={FadeIn.duration(150)} style={styles.modalCard}>
                <ComposeModal playerId={playerId} />
              </Animated.View>
            </View>
          ) : null}

          {view === 'picker' && pickerCategory ? (
            <View style={styles.centerWrap} pointerEvents="box-none">
              <Animated.View entering={FadeIn.duration(150)} style={styles.pickerCard}>
                <PartPicker
                  category={pickerCategory}
                  onSelect={handleSelect}
                  onClose={handlePickerClose}
                  recentIds={recentIds}
                />
              </Animated.View>
            </View>
          ) : null}
        </Animated.View>
      ) : null}

      {toastPlayerId && toastBey ? (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.toast} pointerEvents="box-none">
          <Text style={styles.toastText}>★ {t('stats.bey.variantActive')}</Text>
          <Pressable
            style={styles.toastBtn}
            onPress={() => {
              saveCombo(toastBey.name, toastBey.line, toastBey.parts);
              if (playerId) assignBey(playerId, { ...toastBey, variant: false });
              else if (toastPlayerId) assignBey(toastPlayerId, { ...toastBey, variant: false });
              hideToast();
            }}
          >
            <Text style={styles.toastBtnText}>{t('stats.bey.keepInShelf')}</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end', zIndex: 300 },
  sheet: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    maxHeight: '94%',
  },
  centerWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: {
    width: 480,
    maxWidth: '94%',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
  },
  pickerCard: { width: 760, maxWidth: '96%' },
  toast: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#fb923c',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    zIndex: 320,
  },
  toastText: { color: '#fed7aa', fontSize: 12, fontWeight: '700' },
  toastBtn: { backgroundColor: '#fb923c', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 12 },
  toastBtnText: { color: '#0f172a', fontSize: 11, fontWeight: '800' },
});
