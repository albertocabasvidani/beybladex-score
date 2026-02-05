/**
 * Share utilities for Beyblade X Score Tracker
 * Pure TypeScript - no React/DOM dependencies for mobile reuse
 */

/**
 * Generates the text to share for a match result
 */
export function generateShareText(
  winnerName: string,
  loserName: string,
  winnerScore: number,
  loserScore: number
): string {
  return `BEYBLADE X MATCH

${winnerName} vs ${loserName}
Vincitore: ${winnerName}
Punteggio: ${winnerScore} - ${loserScore}

#BeybladeX #BeybladeXScore`;
}
