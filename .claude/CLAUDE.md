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

### Web
```bash
cd packages/web
npm run dev
# Apri http://localhost:5173
```

### Mobile - Test Locale
```bash
cd packages/mobile
expo start
# Scansiona QR con Expo Go
```

### Mobile - Test Autonomo (Appetize.io)

**Setup una tantum**:
1. Account Expo: `npx eas-cli login`
2. Account Appetize.io: https://appetize.io/ (free: 100 min/mese)
3. API Token: Dashboard → Settings → API Token

**Workflow test pre-commit**:
```bash
cd packages/mobile

# 1. Build APK (5-10 min)
npx eas-cli build --platform android --profile preview

# 2. Download APK
curl -L -o beybladex-mobile.apk "{LINK_DA_OUTPUT_BUILD}"

# 3. Upload su Appetize.io
# Opzione A: Manuale via https://appetize.io/upload
# Opzione B: API
curl https://api.appetize.io/v1/apps \
  -u {API_TOKEN}: \
  -F file=@beybladex-mobile.apk \
  -F platform=android

# 4. Test automatico via browser
# Claude Code apre https://appetize.io/app/{publicKey}
# Usa chrome-devtools MCP per tap e screenshot
```

**Documentazione completa**: `packages/mobile/docs/testing-setup.md`

**Limiti Appetize.io free**:
- 100 min/mese (~33 test da 3 min)
- Per test frequenti: emulatore locale o Expo Go

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
