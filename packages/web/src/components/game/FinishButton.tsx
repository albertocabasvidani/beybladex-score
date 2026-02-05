import type { PlayerId, FinishType } from "@beybladex/shared";
import { FINISH_SCORES } from "@beybladex/shared";
import { useGameStore } from "../../store/game-store";

interface FinishButtonProps {
  playerId: PlayerId;
  finishType: FinishType;
}

// Stile manga vibrante per ogni tipo di finish
const MANGA_STYLES: Record<
  FinishType,
  {
    gradient: string;
    shadow: string;
    border: string;
    glow: string;
    label: string;
  }
> = {
  spin: {
    gradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)",
    shadow: "0 6px 0 #14532d, 0 8px 20px rgba(34, 197, 94, 0.5)",
    border: "3px solid #4ade80",
    glow: "0 0 20px rgba(34, 197, 94, 0.6)",
    label: "SPIN",
  },
  burst: {
    gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
    shadow: "0 6px 0 #7f1d1d, 0 8px 20px rgba(239, 68, 68, 0.5)",
    border: "3px solid #f87171",
    glow: "0 0 20px rgba(239, 68, 68, 0.6)",
    label: "BURST",
  },
  over: {
    gradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
    shadow: "0 6px 0 #1e3a8a, 0 8px 20px rgba(59, 130, 246, 0.5)",
    border: "3px solid #60a5fa",
    glow: "0 0 20px rgba(59, 130, 246, 0.6)",
    label: "OVER",
  },
  xtreme: {
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
    shadow: "0 6px 0 #7c2d12, 0 8px 20px rgba(249, 115, 22, 0.5)",
    border: "3px solid #fb923c",
    glow: "0 0 20px rgba(249, 115, 22, 0.6)",
    label: "XTREME",
  },
};

export default function FinishButton({
  playerId,
  finishType,
}: FinishButtonProps) {
  const score = useGameStore((state) => state.score);
  const winner = useGameStore((state) => state.winner);

  const points = FINISH_SCORES[finishType];
  const style = MANGA_STYLES[finishType];

  const handleScore = () => {
    if (winner) return;
    score(playerId, finishType);
  };

  return (
    <button
      onClick={handleScore}
      disabled={winner !== null}
      className="
        relative flex flex-col items-center justify-center
        py-3 px-5 min-w-[130px] min-h-[90px]
        rounded-xl font-black text-white uppercase
        transition-all duration-150
        active:scale-95 active:translate-y-1
        disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale
        hover:brightness-110
      "
      style={{
        background: style.gradient,
        boxShadow: winner ? "none" : style.shadow,
        border: style.border,
        textShadow:
          "2px 2px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.1)",
      }}
    >
      {/* Effetto glow di sfondo */}
      <div
        className="absolute inset-0 rounded-lg opacity-50 blur-sm -z-10"
        style={{ background: style.gradient }}
      />

      {/* Label tipo finish */}
      <span
        className="text-base tracking-widest font-extrabold"
        style={{
          textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
          letterSpacing: "0.15em",
        }}
      >
        {style.label}
      </span>

      {/* Punteggio grande */}
      <span
        className="text-5xl font-black leading-none"
        style={{
          textShadow:
            "3px 3px 0 rgba(0,0,0,0.4), -1px -1px 0 rgba(255,255,255,0.2)",
          WebkitTextStroke: "1px rgba(0,0,0,0.2)",
        }}
      >
        +{points}
      </span>

      {/* Linea decorativa stile manga */}
      <div
        className="absolute bottom-1 left-2 right-2 h-0.5 rounded-full opacity-40"
        style={{
          background: "linear-gradient(90deg, transparent, white, transparent)",
        }}
      />
    </button>
  );
}
