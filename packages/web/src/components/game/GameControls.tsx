import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/game-store';
import ResetConfirmModal from '../modals/ResetConfirmModal';
import SettingsModal from '../modals/SettingsModal';
import CreditsModal from '../modals/CreditsModal';

export default function GameControls() {
  const { t } = useTranslation();
  const undo = useGameStore((state) => state.undo);
  const canUndoFn = useGameStore((state) => state.canUndo);
  const canUndo = canUndoFn();
  const winScore = useGameStore((state) => state.winScore);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-3 py-3 landscape:pt-1 landscape:pb-2">
        {/* Trofeo a sinistra (visibile solo in landscape) */}
        <div className="hidden landscape:flex items-center -mt-4" title={t('game.winScore', { score: winScore })}>
          <svg
            className="w-10 h-10"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8h32v4c0 12-6 22-16 26-10-4-16-14-16-26V8z"
              fill="url(#trophyGradientCtrl)"
              stroke="#fcd34d"
              strokeWidth="2"
            />
            <path
              d="M16 12H10c-2 0-4 2-4 4v4c0 4 3 8 8 8h2"
              stroke="#fcd34d"
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M48 12h6c2 0 4 2 4 4v4c0 4-3 8-8 8h-2"
              stroke="#fcd34d"
              strokeWidth="3"
              fill="none"
            />
            <path d="M24 38h16v4H24z" fill="#fcd34d" />
            <path
              d="M20 42h24v4c0 2-2 4-4 4H24c-2 0-4-2-4-4v-4z"
              fill="url(#trophyGradientCtrl)"
              stroke="#fcd34d"
              strokeWidth="1"
            />
            <text
              x="32"
              y="28"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#7c2d12"
              fontSize="20"
              fontWeight="900"
              fontFamily="system-ui, sans-serif"
            >
              {winScore}
            </text>
            <defs>
              <linearGradient id="trophyGradientCtrl" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Spacer per portrait */}
        <div className="landscape:hidden flex-1" />

        {/* Pulsanti centrali */}
        <div className="flex items-center gap-3">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-slate-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            {t('buttons.undo')}
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-900/50 hover:bg-red-800/50 rounded-lg text-red-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t('buttons.reset')}
          </button>
        </div>

        {/* Info e Impostazioni a destra */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCredits(true)}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors"
            aria-label="Credits"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors"
            aria-label={t('settings.title')}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <CreditsModal
        isOpen={showCredits}
        onClose={() => setShowCredits(false)}
      />
    </>
  );
}
