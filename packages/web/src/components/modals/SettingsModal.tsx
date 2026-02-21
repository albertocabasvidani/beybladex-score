import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore, type Language } from '../../store/settings-store';
import { useGameStore } from '../../store/game-store';
import { MIN_WIN_SCORE, MAX_WIN_SCORE, MIN_MAX_FOULS, MAX_MAX_FOULS } from '@beybladex/shared';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, setDefaultWinScore } = useSettingsStore();
  const { winScore, setWinScoreValue, maxFouls, setMaxFoulsValue } = useGameStore();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleWinScoreChange = (value: number) => {
    setDefaultWinScore(value);
    setWinScoreValue(value);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {t('settings.title')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Language */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('settings.language')}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange('it')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    language === 'it'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Italiano
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Win Score */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('settings.winScore')}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={MIN_WIN_SCORE}
                  max={MAX_WIN_SCORE}
                  value={winScore}
                  onChange={(e) => handleWinScoreChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <span className="w-8 text-center text-xl font-bold text-white">
                  {winScore}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {MIN_WIN_SCORE} - {MAX_WIN_SCORE}
              </p>
            </div>

            {/* Foul Limit */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('settings.maxFouls')}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={MIN_MAX_FOULS}
                  max={MAX_MAX_FOULS}
                  value={maxFouls}
                  onChange={(e) => setMaxFoulsValue(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <span className={`w-8 text-center text-xl font-bold ${maxFouls === 0 ? 'text-slate-500' : 'text-white'}`}>
                  {maxFouls === 0 ? 'OFF' : maxFouls}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                OFF - {MAX_MAX_FOULS}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
