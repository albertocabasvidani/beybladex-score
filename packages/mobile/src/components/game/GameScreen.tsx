import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerPanel } from './PlayerPanel';
import { CountdownButton } from './CountdownButton';
import { VictoryOverlay } from './VictoryOverlay';
import { SideSwitchReminder } from './SideSwitchReminder';
import { AnimationOverlay } from '../animations';
import { SettingsModal } from '../modals/SettingsModal';
import { CreditsModal } from '../modals/CreditsModal';
import { GuideModal } from '../modals/GuideModal';
import { ReleaseNoteModal } from '../modals/ReleaseNoteModal';
import { ReviewPromptModal } from '../modals/ReviewPromptModal';
import { useGameStore } from '../../store/game-store';
import { useReviewStore } from '../../store/review-store';
import { logger } from '../../utils/logger';

export function GameScreen() {
  const { undo, reset, canUndo } = useGameStore();
  const winner = useGameStore((state) => state.winner);
  const winScore = useGameStore((state) => state.winScore);
  const currentAnimation = useGameStore((state) => state.currentAnimation);
  const clearAnimation = useGameStore((state) => state.clearAnimation);
  const isSwapped = useGameStore((state) => state.isSwapped);
  const swapSides = useGameStore((state) => state.swapSides);
  const totalLanci = useGameStore((state) => state.history.filter((h) => h.type === 'score').length);
  const reminderEnabled = useGameStore((state) => state.sideSwitchReminderEnabled);
  const setSideSwitchReminderEnabled = useGameStore((state) => state.setSideSwitchReminderEnabled);
  const canUndoValue = canUndo();

  const leftPlayer = isSwapped ? 'player2' : 'player1';
  const rightPlayer = isSwapped ? 'player1' : 'player2';

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [releaseNoteOpen, setReleaseNoteOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);

  // Invito recensione dopo N partite completate (al passaggio winner null -> set)
  const incrementGamesCompleted = useReviewStore((state) => state.incrementGamesCompleted);
  const prevWinnerRef = useRef(winner);
  useEffect(() => {
    const prev = prevWinnerRef.current;
    prevWinnerRef.current = winner;
    if (!prev && winner) {
      incrementGamesCompleted();
      if (useReviewStore.getState().shouldShowReviewPrompt()) {
        const timer = setTimeout(() => setReviewOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [winner, incrementGamesCompleted]);

  // Promemoria "Avete cambiato lato?" ogni 3 lanci, mostrato a fine animazione dei punti
  const prevAnimationRef = useRef(currentAnimation);
  const lastReminderRound = useRef(0);

  useEffect(() => {
    const prev = prevAnimationRef.current;
    prevAnimationRef.current = currentAnimation;

    // Agisci solo alla transizione "animazione finita": non-null -> null
    if (!(prev && !currentAnimation)) return;
    if (winner) return;                                   // ha vinto qualcuno: parte la VictoryOverlay
    if (!reminderEnabled) return;                         // disattivato dall'utente
    if (totalLanci === 0 || totalLanci % 3 !== 0) return; // solo 3, 6, 9...
    if (lastReminderRound.current === totalLanci) return; // già mostrato per questa soglia

    lastReminderRound.current = totalLanci;
    setReminderVisible(true);
  }, [currentAnimation, winner, reminderEnabled, totalLanci]);

  // Reset della soglia su undo sotto soglia o reset partita (permette la ricomparsa)
  useEffect(() => {
    if (totalLanci < lastReminderRound.current) {
      lastReminderRound.current = 0;
    }
  }, [totalLanci]);

  // Chiudi subito il banner se inizia un nuovo lancio o appare la schermata vittoria
  useEffect(() => {
    if ((currentAnimation || winner) && reminderVisible) {
      setReminderVisible(false);
    }
  }, [currentAnimation, winner, reminderVisible]);

  // First launch → guide. Existing user without release-note flag → release note.
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem('hasSeenGuide').then((guideValue) => {
      if (!isMounted) return;
      if (!guideValue) {
        setGuideOpen(true);
        AsyncStorage.setItem('hasSeenGuide', 'true');
        AsyncStorage.setItem('hasSeenReleaseNote_v18', 'true');
        return;
      }
      AsyncStorage.getItem('hasSeenReleaseNote_v18').then((noteValue) => {
        if (!isMounted) return;
        if (!noteValue) {
          setReleaseNoteOpen(true);
          AsyncStorage.setItem('hasSeenReleaseNote_v18', 'true');
        }
      });
    });
    return () => { isMounted = false; };
  }, []);

  // Android back button: close modals or do nothing (never exit app)
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (reminderVisible) { setReminderVisible(false); return true; }
      if (reviewOpen) { setReviewOpen(false); return true; }
      if (creditsOpen) { setCreditsOpen(false); return true; }
      if (guideOpen) { setGuideOpen(false); return true; }
      if (settingsOpen) { setSettingsOpen(false); return true; }
      if (releaseNoteOpen) { setReleaseNoteOpen(false); return true; }
      return true; // Block back when no modal open (don't exit app)
    });
    return () => sub.remove();
  }, [settingsOpen, creditsOpen, guideOpen, releaseNoteOpen, reviewOpen, reminderVisible]);

  // Safety valve: force-clear stuck animations after 6 seconds
  useEffect(() => {
    if (!currentAnimation) return;
    const timer = setTimeout(() => {
      logger.error('Animation STUCK - force clearing after 6s', {
        type: currentAnimation.type,
        playerId: currentAnimation.playerId,
      });
      clearAnimation();
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentAnimation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Main content - two player panels side by side */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}
      >
        {/* Left player */}
        <View style={{ flex: 1 }}>
          <PlayerPanel playerId={leftPlayer} />
        </View>

        {/* Divider with swap button */}
        <View style={{ width: 48, alignItems: 'center' }}>
          {/* Swap button */}
          <TouchableOpacity
            onPress={swapSides}
            style={{
              paddingVertical: 2,
            }}
          >
            <Text allowFontScaling={false} style={{ color: '#64748b', fontSize: 28 }}>⇄</Text>
          </TouchableOpacity>
          {/* Divider line */}
          <View style={{ width: 1, flex: 1, backgroundColor: '#334155' }} />
        </View>

        {/* Right player */}
        <View style={{ flex: 1 }}>
          <PlayerPanel playerId={rightPlayer} />
        </View>
      </View>

      {/* Bottom bar - mirroring top layout for alignment */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 6,
          paddingHorizontal: 12,
        }}
      >
        {/* Left half: trophy */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {/* Trophy + win score */}
          <TouchableOpacity
            onPress={() => setSettingsOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingVertical: 6,
              paddingHorizontal: 10,
              backgroundColor: '#334155',
              borderRadius: 8,
            }}
          >
            <Text allowFontScaling={false} style={{ fontSize: 16 }}>🏆</Text>
            <Text allowFontScaling={false} style={{ color: '#fbbf24', fontSize: 16, fontWeight: '800' }}>
              {winScore}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Center: countdown */}
        <CountdownButton />

        {/* Right half: undo + reset + info */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
          {/* Undo */}
          <TouchableOpacity
            onPress={undo}
            disabled={!canUndoValue}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 14,
              backgroundColor: canUndoValue ? '#334155' : '#1e293b',
              borderRadius: 8,
              opacity: canUndoValue ? 1 : 0.4,
            }}
          >
            <Text allowFontScaling={false} style={{ color: '#e2e8f0', fontSize: 14 }}>↩</Text>
            <Text allowFontScaling={false} style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>Undo</Text>
          </TouchableOpacity>

          {/* Reset */}
          <TouchableOpacity
            onPress={reset}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 14,
              backgroundColor: 'rgba(127, 29, 29, 0.5)',
              borderRadius: 8,
            }}
          >
            <Text allowFontScaling={false} style={{ color: '#fecaca', fontSize: 14 }}>↻</Text>
            <Text allowFontScaling={false} style={{ color: '#fecaca', fontSize: 13, fontWeight: '600' }}>Reset</Text>
          </TouchableOpacity>

          {/* Info */}
          <TouchableOpacity
            onPress={() => setGuideOpen(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: '#334155',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text allowFontScaling={false} style={{ color: '#94a3b8', fontSize: 18, fontWeight: '700' }}>i</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modals */}
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <GuideModal
        visible={guideOpen}
        onClose={() => setGuideOpen(false)}
        onOpenCredits={() => {
          setGuideOpen(false);
          setCreditsOpen(true);
        }}
      />
      <CreditsModal visible={creditsOpen} onClose={() => setCreditsOpen(false)} />
      <ReleaseNoteModal visible={releaseNoteOpen} onClose={() => setReleaseNoteOpen(false)} />
      <ReviewPromptModal visible={reviewOpen} onClose={() => setReviewOpen(false)} />

      {/* Animation Overlay */}
      {currentAnimation && (
        <AnimationOverlay
          animation={currentAnimation}
          onComplete={clearAnimation}
        />
      )}

      {/* Side-switch reminder - banner non bloccante ogni 3 lanci */}
      {reminderVisible && (
        <SideSwitchReminder
          onDismiss={() => setReminderVisible(false)}
          onDisable={() => {
            setSideSwitchReminderEnabled(false);
            setReminderVisible(false);
          }}
        />
      )}

      {/* Victory Overlay - only after animation completes */}
      {winner && !currentAnimation && <VictoryOverlay winnerId={winner} />}
    </View>
  );
}
