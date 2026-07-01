import { create } from 'zustand';

export interface NewPart {
  id: string;
  name: string;
}

/**
 * Stato UI dell'aggiornamento parti a runtime. Volutamente **transiente** (niente persist): il
 * dataset vive su FileSystem e i metadati del diff (seenPartIds/lastFetchTs) sono persistiti a mano
 * in `services/parts-remote.ts` via AsyncStorage con letture awaited — così si evita la race con la
 * reidratazione asincrona del middleware persist di Zustand all'avvio.
 */
interface PartsStore {
  /** 'idle' finché l'idratazione della cache non è completa; poi 'ready' (sblocca i tab combo). */
  status: 'idle' | 'ready';
  /** Parti comparse rispetto all'ultimo dataset visto dall'utente — da annunciare nella modale. */
  newParts: NewPart[];
  setReady: (newParts: NewPart[]) => void;
  clearNewParts: () => void;
}

export const usePartsStore = create<PartsStore>((set) => ({
  status: 'idle',
  newParts: [],
  setReady: (newParts) => set({ status: 'ready', newParts }),
  clearNewParts: () => set({ newParts: [] }),
}));
