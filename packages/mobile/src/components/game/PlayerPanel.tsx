import { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import type { PlayerId } from '@beybladex/shared';
import { useGameStore } from '../../store/game-store';
import { ScoreDisplay } from './ScoreDisplay';
import { FinishButton } from './FinishButton';

interface Props {
  playerId: PlayerId;
}

export function PlayerPanel({ playerId }: Props) {
  const player = useGameStore((state) => state[playerId]);
  const setPlayerNameValue = useGameStore((state) => state.setPlayerNameValue);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(player.name);

  const handleNamePress = () => {
    setEditName(player.name);
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
        <Pressable onPress={handleNamePress}>
          <Text
            style={{
              color: '#e2e8f0',
              fontSize: 18,
              fontWeight: '800',
              textAlign: 'center',
              paddingVertical: 2,
            }}
          >
            {player.name}
          </Text>
        </Pressable>
      )}

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
