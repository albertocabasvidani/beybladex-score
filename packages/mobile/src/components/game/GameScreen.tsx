import { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerPanel } from './PlayerPanel';
import { VictoryOverlay } from './VictoryOverlay';
import { AnimationOverlay } from '../animations';
import { SettingsModal } from '../modals/SettingsModal';
import { CreditsModal } from '../modals/CreditsModal';
import { GuideModal } from '../modals/GuideModal';
import { useGameStore } from '../../store/game-store';
import { logger } from '../../utils/logger';

export function GameScreen() {
  const { undo, reset, canUndo } = useGameStore();
  const winner = useGameStore((state) => state.winner);
  const winScore = useGameStore((state) => state.winScore);
  const currentAnimation = useGameStore((state) => state.currentAnimation);
  const clearAnimation = useGameStore((state) => state.clearAnimation);
  const isSwapped = useGameStore((state) => state.isSwapped);
  const swapSides = useGameStore((state) => state.swapSides);
  const canUndoValue = canUndo();

  const leftPlayer = isSwapped ? 'player2' : 'player1';
  const rightPlayer = isSwapped ? 'player1' : 'player2';

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Show guide on first launch
  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem('hasSeenGuide').then((value) => {
      if (isMounted && !value) {
        setGuideOpen(true);
        AsyncStorage.setItem('hasSeenGuide', 'true');
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Android back button: close modals or do nothing (never exit app)
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (creditsOpen) { setCreditsOpen(false); return true; }
      if (guideOpen) { setGuideOpen(false); return true; }
      if (settingsOpen) { setSettingsOpen(false); return true; }
      return true; // Block back when no modal open (don't exit app)
    });
    return () => sub.remove();
  }, [settingsOpen, creditsOpen, guideOpen]);

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
        {/* Left half */}
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

          <View style={{ flex: 1 }} />

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
        </View>

        {/* Center spacer - matches divider width */}
        <View style={{ width: 48 }} />

        {/* Right half */}
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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

          <View style={{ flex: 1 }} />

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

      {/* Animation Overlay */}
      {currentAnimation && (
        <AnimationOverlay
          animation={currentAnimation}
          onComplete={clearAnimation}
        />
      )}

      {/* Victory Overlay - only after animation completes */}
      {winner && !currentAnimation && <VictoryOverlay winnerId={winner} />}
    </View>
  );
}
