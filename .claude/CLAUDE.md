# Beyblade X Score Monorepo

## Struttura
- `packages/shared`: Core game logic (pure TypeScript)
- `packages/web`: React web app (Vite + Tailwind)
- `packages/mobile`: React Native app (Expo + NativeWind)

## Working Directory
- **Web**: `cd packages/web`
- **Mobile**: `cd packages/mobile`
- **Shared**: modifiche shared richiedono test in web E mobile

## Testing
- Web: `cd packages/web && npm run dev`
- Mobile: `cd packages/mobile && expo start`
- Mobile test 3 risoluzioni: `node scripts/test-emulators.js`

## Convention Commits
- `feat(web):` - nuova feature web
- `feat(mobile):` - nuova feature mobile
- `feat(shared):` - nuova feature shared
- `fix(web):` - bugfix web
- `fix(mobile):` - bugfix mobile
- `chore(mobile):` - manutenzione mobile
- `docs:` - documentazione

## Scripts Root
```bash
yarn web:dev        # Dev server web
yarn mobile:start   # Metro bundler mobile
yarn mobile:test    # Test 3 risoluzioni
yarn type-check     # TypeScript check
```

## Import da Shared
```typescript
// Web e Mobile
import { FINISH_SCORES, scorePoint, MatchState } from '@beybladex/shared';
```

## Deploy
- **Web**: `cd packages/web && npm run deploy` (GitHub Pages)
- **Mobile**: `cd packages/mobile && eas build --platform android --profile production` (Play Store)

## Regole Monorepo
- SEMPRE testare modifiche a `shared` sia in web che in mobile
- SEMPRE usare `yarn install` dalla root (NON npm install nei singoli package)
- Per modifiche solo web: lavorare in `packages/web`
- Per modifiche solo mobile: lavorare in `packages/mobile`
- Per modifiche logica di gioco: modificare `shared`, poi adattare UI in web e mobile
