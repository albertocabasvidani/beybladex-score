import { useState, useCallback, useMemo } from 'react';
import { generateShareText } from '../core/utils/share';

interface UseShareResult {
  canShare: boolean;
  shareResult: (
    winnerName: string,
    loserName: string,
    winnerScore: number,
    loserScore: number
  ) => Promise<void>;
  showCopiedToast: boolean;
}

/**
 * Hook for sharing match results
 * Uses Web Share API when available, falls back to clipboard
 */
export function useShare(): UseShareResult {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const canShare = useMemo(() => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  }, []);

  const shareResult = useCallback(
    async (
      winnerName: string,
      loserName: string,
      winnerScore: number,
      loserScore: number
    ): Promise<void> => {
      const text = generateShareText(winnerName, loserName, winnerScore, loserScore);

      if (canShare) {
        try {
          await navigator.share({
            title: 'Beyblade X Match Result',
            text,
          });
        } catch (error) {
          // User cancelled or share failed - ignore AbortError
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Share failed:', error);
          }
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(text);
          setShowCopiedToast(true);
          setTimeout(() => setShowCopiedToast(false), 2000);
        } catch (error) {
          console.error('Clipboard copy failed:', error);
        }
      }
    },
    [canShare]
  );

  return {
    canShare,
    shareResult,
    showCopiedToast,
  };
}
