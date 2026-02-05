import { useWindowDimensions } from 'react-native';

/**
 * Hook per ottenere dimensioni responsive basate sul viewport landscape.
 * Target devices: 360x780 (small), 390x844 (medium), 412x915 (large)
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // In landscape, width diventa l'altezza del device in portrait
  const effectiveWidth = isLandscape ? height : width;

  // Breakpoints basati su altezza device in portrait
  const breakpoint =
    effectiveWidth <= 360 ? 'small' : effectiveWidth <= 390 ? 'medium' : 'large';

  const spacing = {
    small: { gap: 8, padding: 12, buttonHeight: 60 },
    medium: { gap: 12, padding: 16, buttonHeight: 70 },
    large: { gap: 16, padding: 20, buttonHeight: 80 },
  }[breakpoint];

  return {
    isLandscape,
    breakpoint,
    ...spacing,
  };
}
