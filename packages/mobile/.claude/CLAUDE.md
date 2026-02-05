# Mobile Package

## Testing OBBLIGATORIO Emulatori
Prima di commit: `node scripts/test-emulators.js`

Verifica screenshots:
- NO overflow orizzontale/verticale
- Pulsanti > 44x44px touch target
- Testo leggibile

### Target Devices
| Risoluzione | Viewport Landscape | Dispositivi |
|-------------|-------------------|-------------|
| **360px** | 800x360 | Android mid-range (50%+ traffico) |
| **390px** | 844x390 | iPhone 12-14 Pro equivalente |
| **412px** | 915x412 | Pixel 9, Galaxy S25 |

## Responsive Hook
```typescript
const { isSmall, isMedium, isLarge, scale } = useResponsive();
```

## Import da Shared
```typescript
import { FINISH_SCORES, MatchState, scorePoint } from '@beybladex/shared';
```

## Scripts
```bash
expo start           # Metro bundler
expo start --android # Avvia su emulatore Android
node scripts/test-emulators.js  # Test automatico 3 risoluzioni
```

## Build Play Store
```bash
eas build --platform android --profile production  # Build AAB
eas submit --platform android                       # Submit a Play Store
```

## Configurazione
- **app.json**: Expo config (package ID, versioning, icone)
- **eas.json**: EAS Build config (production, preview, development)
- **metro.config.js**: Monorepo support (watchFolders, nodeModulesPaths)
- **tailwind.config.js**: NativeWind config (colori, spacing)

## Regole Layout
- **Orientation**: SOLO landscape (portrait mostra "Ruota dispositivo")
- **Pulsanti**: minimo 44x44px touch target
- **NO overflow**: tutto deve essere visibile senza scroll
- **Responsive**: usare useResponsive() hook per adattare sizing

## File Critici
- `src/store/game-store.ts` - Zustand + shared imports
- `src/hooks/useResponsive.ts` - Responsive logic per 360/390/412px
- `src/i18n/config.ts` - importa translations da shared
- `scripts/test-emulators.js` - Test automatico risoluzioni
