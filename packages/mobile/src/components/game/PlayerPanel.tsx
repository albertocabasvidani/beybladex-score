import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { isDefaultPlayerName, type PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';
import { ScoreDisplay } from './ScoreDisplay';
import { FinishButton } from './FinishButton';
import { FoulCounter } from './FoulCounter';
import { STATS_ENABLED } from '../../config/featureFlags';
import { BeyRow } from '../../features/stats/components/BeyRow';

interface Props {
  playerId: PlayerId;
}

export function PlayerPanel({ playerId }: Props) {
  const { t } = useTranslation();
  const player = useGameStore((state) => state[playerId]);
  const setPlayerNameValue = useGameStore((state) => state.setPlayerNameValue);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);

  // Nome default (sentinella) -> mostra il nome localizzato finché l'utente non lo cambia
  const isDefault = isDefaultPlayerName(player.name, playerId);
  const displayName = isDefault ? t(`player.${playerId}`) : player.name;

  const handleNamePress = () => {
    setEditName(isDefault ? '' : player.name);
    setEditing(true);
  };

  const handleNameSubmit = () => {
    const trimmed = editName.trim();
    if (trimmed) {
      setPlayerNameValue(playerId, trimmed);
    }
    setEditing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 4,
        paddingVertical: 2,
      }}
    >
      {/* Player Name - tap to edit */}
      {editing ? (
        <TextInput
          value={editName}
          onChangeText={setEditName}
          onBlur={handleNameSubmit}
          onSubmitEditing={handleNameSubmit}
          placeholder={t(`player.${playerId}`)}
          placeholderTextColor="#64748b"
          autoFocus
          selectTextOnFocus
          maxLength={20}
          style={{
            color: '#fbbf24',
            fontSize: 18,
            fontWeight: '800',
            textAlign: 'center',
            paddingVertical: 2,
            borderBottomWidth: 2,
            borderBottomColor: '#fbbf24',
          }}
        />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 6,
            paddingVertical: 2,
          }}
        >
          <Pressable onPress={handleNamePress}>
            <Text
              allowFontScaling={false}
              style={{
                color: '#e2e8f0',
                fontSize: 18,
                fontWeight: '800',
                textAlign: 'center',
              }}
            >
              {displayName}
            </Text>
          </Pressable>
          {STATS_ENABLED && (
            <>
              <Text allowFontScaling={false} style={{ color: '#475569', fontSize: 14 }}>
                ·
              </Text>
              <BeyRow playerId={playerId} />
            </>
          )}
        </View>
      )}

      {/* Foul counter */}
      <FoulCounter playerId={playerId} />

      {/* Layout: [Spin/Burst] - SCORE - [Over/Xtreme] */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: 6,
          paddingBottom: 2,
        }}
      >
        {/* Left buttons */}
        <View style={{ flex: 2, gap: 4 }}>
          <FinishButton playerId={playerId} finishType="spin" />
          <FinishButton playerId={playerId} finishType="burst" />
        </View>

        {/* Center score */}
        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
          <ScoreDisplay playerId={playerId} />
        </View>

        {/* Right buttons */}
        <View style={{ flex: 2, gap: 4 }}>
          <FinishButton playerId={playerId} finishType="over" />
          <FinishButton playerId={playerId} finishType="xtreme" />
        </View>
      </View>
    </View>
  );
}
