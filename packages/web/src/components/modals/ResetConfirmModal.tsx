import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/game-store';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetConfirmModal({ isOpen, onClose }: ResetConfirmModalProps) {
  const { t } = useTranslation();
  const reset = useGameStore((state) => state.reset);

  const handleConfirm = () => {
    reset();
    onClose();
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
            <h2 className="text-xl font-bold text-white mb-4">
              {t('buttons.reset')}
            </h2>
            <p className="text-slate-300 mb-6">
              {t('confirm.reset')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors"
              >
                {t('confirm.no')}
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 rounded-lg text-white font-medium transition-colors"
              >
                {t('confirm.yes')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
