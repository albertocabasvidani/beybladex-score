import { PlayerPanel, GameControls } from "./components/game";
import { AnimationOverlay } from "./components/animations";
import { VictoryOverlay } from "./components/modals";
import { RotateDeviceOverlay } from "./components/layout";
import { useGameStore } from "./store/game-store";

function App() {
  const currentAnimation = useGameStore((state) => state.currentAnimation);
  const clearAnimation = useGameStore((state) => state.clearAnimation);

  return (
    <div className="min-h-screen min-h-dvh bg-slate-900 flex flex-col overflow-hidden">
      <main className="flex-1 flex flex-row justify-center items-stretch overflow-hidden">
        {/* Player 1 */}
        <div className="flex-1 flex items-center justify-center">
          <PlayerPanel playerId="player1" />
        </div>

        {/* Player 2 */}
        <div className="flex-1 flex items-center justify-center">
          <PlayerPanel playerId="player2" />
        </div>
      </main>

      <GameControls />

      {/* Animation Overlay */}
      {currentAnimation && (
        <AnimationOverlay
          animation={currentAnimation}
          onComplete={clearAnimation}
        />
      )}

      {/* Victory Overlay */}
      <VictoryOverlay />

      {/* Rotate Device Overlay (portrait mode) */}
      <RotateDeviceOverlay />
    </div>
  );
}

export default App;
