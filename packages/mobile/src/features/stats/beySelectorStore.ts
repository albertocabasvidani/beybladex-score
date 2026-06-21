import { create } from 'zustand';
import type { PartCategory, PlayerId } from '@beybladex/shared';
import type { SelectedPart, SelectedParts } from '../builder/stores/slots';

/**
 * Stato effimero (non persistito) del selettore Bey sovrapposto allo scoreboard. Pilota un unico
 * overlay full-screen montato in GameScreen, così i pannelli landscape restano puliti. Tre viste:
 * `sheet` (scaffale + compose + nome libero), `compose` (3 pezzi), `picker` (scelta di una parte).
 */
type View = 'sheet' | 'compose' | 'picker';
type PickerMode = 'swap' | 'compose';

interface BeySelectorState {
  view: View | null;
  playerId: PlayerId | null;
  pickerCategory: PartCategory | null;
  pickerMode: PickerMode | null;
  composeDraft: SelectedParts;
  /** Giocatore per cui mostrare il toast "variante attiva" (null = nessun toast). */
  toastPlayerId: PlayerId | null;

  openSheet: (playerId: PlayerId) => void;
  openSwap: (playerId: PlayerId, category: PartCategory) => void;
  openCompose: (playerId: PlayerId) => void;
  openComposePicker: (category: PartCategory) => void;
  setComposePart: (category: PartCategory, part: SelectedPart) => void;
  backToCompose: () => void;
  close: () => void;
  showToast: (playerId: PlayerId) => void;
  hideToast: () => void;
}

export const useBeySelectorStore = create<BeySelectorState>((set) => ({
  view: null,
  playerId: null,
  pickerCategory: null,
  pickerMode: null,
  composeDraft: {},
  toastPlayerId: null,

  openSheet: (playerId) => set({ view: 'sheet', playerId }),
  openSwap: (playerId, category) =>
    set({ view: 'picker', playerId, pickerCategory: category, pickerMode: 'swap' }),
  openCompose: (playerId) => set({ view: 'compose', playerId, composeDraft: {} }),
  openComposePicker: (category) =>
    set({ view: 'picker', pickerCategory: category, pickerMode: 'compose' }),
  setComposePart: (category, part) =>
    set((s) => ({ composeDraft: { ...s.composeDraft, [category]: part } })),
  backToCompose: () => set({ view: 'compose', pickerCategory: null, pickerMode: null }),
  close: () =>
    set({ view: null, playerId: null, pickerCategory: null, pickerMode: null, composeDraft: {} }),
  showToast: (playerId) => set({ toastPlayerId: playerId }),
  hideToast: () => set({ toastPlayerId: null }),
}));
