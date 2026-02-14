import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
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
  const canUndoValue = canUndo();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Show guide on first launch
  useEffect(() => {
    AsyncStorage.getItem('hasSeenGuide').then((value) => {
      if (!value) {
        setGuideOpen(true);
        AsyncStorage.setItem('hasSeenGuide', 'true');
      }
    });
  }, []);

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
        {/* Player 1 */}
        <View style={{ flex: 1 }}>
          <PlayerPanel playerId="player1" />
        </View>

        {/* Divider */}
        <View style={{ width: 24, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 1, flex: 1, backgroundColor: '#334155', marginVertical: 8 }} />
        </View>

        {/* Player 2 */}
        <View style={{ flex: 1 }}>
          <PlayerPanel playerId="player2" />
        </View>
      </View>

      {/* Bottom bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 6,
          paddingHorizontal: 12,
        }}
      >
        {/* Left: Trophy + win score */}
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
          <Text style={{ fontSize: 16 }}>🏆</Text>
          <Text style={{ color: '#fbbf24', fontSize: 16, fontWeight: '800' }}>
            {winScore}
          </Text>
        </TouchableOpacity>

        {/* Center: Undo + Reset */}
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
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
            <Text style={{ color: '#e2e8f0', fontSize: 14 }}>↩</Text>
            <Text style={{ color: '#e2e8f0', fontSize: 13, fontWeight: '600' }}>Undo</Text>
          </TouchableOpacity>

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
            <Text style={{ color: '#fecaca', fontSize: 14 }}>↻</Text>
            <Text style={{ color: '#fecaca', fontSize: 13, fontWeight: '600' }}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Right: Info */}
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
          <Text style={{ color: '#94a3b8', fontSize: 18, fontWeight: '700' }}>i</Text>
        </TouchableOpacity>
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
