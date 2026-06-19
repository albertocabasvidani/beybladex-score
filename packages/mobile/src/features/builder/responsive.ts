import { Dimensions } from 'react-native';

// Padding orizzontali del builder (portrait). Valori da bbxdeckbuild/utils/responsive.
export const LIST_PADDING = 12;
export const CONTENT_PADDING = 16;

/** Larghezza schermo al mount. I componenti che la usano sono portrait-locked. */
export const SCREEN_WIDTH = Dimensions.get('window').width;
