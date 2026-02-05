import { useState, useRef, useEffect } from "react";
import type { PlayerId } from "@beybladex/shared";
import { useGameStore } from "../../store/game-store";

interface NameInputProps {
  playerId: PlayerId;
}

export default function NameInput({ playerId }: NameInputProps) {
  const player = useGameStore((state) => state[playerId]);
  const setName = useGameStore((state) => state.setName);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(player.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setName(playerId, editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(player.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full max-w-[220px] px-3 py-1 text-center text-xl font-medium bg-slate-700 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        maxLength={20}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setEditValue(player.name);
        setIsEditing(true);
      }}
      className="px-3 py-1 text-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
    >
      {player.name}
    </button>
  );
}
