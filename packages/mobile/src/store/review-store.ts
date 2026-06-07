import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asyncStorage } from './async-storage';

// Numero di partite completate dopo cui invitare l'utente a lasciare una recensione
export const REVIEW_PROMPT_THRESHOLD = 10;

interface ReviewStore {
  gamesCompleted: number;
  reviewPromptShown: boolean;
  incrementGamesCompleted: () => void;
  markReviewPromptShown: () => void;
  /** true quando va mostrato l'invito alla recensione (soglia raggiunta e mai mostrato) */
  shouldShowReviewPrompt: () => boolean;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      gamesCompleted: 0,
      reviewPromptShown: false,

      incrementGamesCompleted: () =>
        set((state) => ({ gamesCompleted: state.gamesCompleted + 1 })),

      markReviewPromptShown: () => set({ reviewPromptShown: true }),

      shouldShowReviewPrompt: () => {
        const { gamesCompleted, reviewPromptShown } = get();
        return !reviewPromptShown && gamesCompleted >= REVIEW_PROMPT_THRESHOLD;
      },
    }),
    {
      name: 'review-store',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (state) => ({
        gamesCompleted: state.gamesCompleted,
        reviewPromptShown: state.reviewPromptShown,
      }),
    },
  ),
);
