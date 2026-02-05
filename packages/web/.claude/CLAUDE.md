# Web Package

## Testing Chrome DevTools OBBLIGATORIO
Prima di commit, testare su 4 risoluzioni:
- 800x360 (Android mid-range)
- 812x375 (iPhone 11-15)
- 844x390 (iPhone Pro)
- 915x412 (Android flagship)

### Procedura Test
1. `npm run dev`
2. Aprire Chrome DevTools MCP
3. Emulare ogni risoluzione in landscape
4. Verificare:
   - NO overflow orizzontale/verticale
   - Tutti gli elementi visibili nel viewport
   - Pulsanti touch-friendly (minimo 44x44px)
5. Screenshot per verifica

## Import da Shared
```typescript
import { FINISH_SCORES, scorePoint } from '@beybladex/shared';
```

## Scripts
```bash
npm run dev      # Dev server (localhost:5173)
npm run build    # Build production
npm run deploy   # Deploy GitHub Pages
```

## Deploy
```bash
npm run build
npm run deploy  # GitHub Pages
```

## Regole Layout
- **Target viewport**: 780x360px (P20 Pro landscape)
- **Layout**: solo landscape, portrait mostra "Ruota dispositivo"
- **Pulsanti**: minimo 44x44px (standard Apple/Google)
- **NO overflow**: tutto deve essere visibile senza scroll

## File Critici
- `src/store/game-store.ts` - importa game logic da shared
- `src/components/game/FinishButton.tsx` - usa FINISH_INFO
- `src/components/game/ScoreDisplay.tsx` - usa types
- `src/i18n/config.ts` - importa translations da shared
