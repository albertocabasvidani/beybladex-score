# Screenshot di marketing Play Store

Screenshot 1920×1080 (16:9) con caption "story-flow" su sfondo brand, usati sulla
scheda Play Store. Generati il 14/06/2026.

## File

- `en-1.png … en-5.png` — set inglese (Default store listing, mondo)
- `it-1.png … it-5.png` — set italiano (traduzione it-IT, Italia)
- `source/` — screenshot grezzi catturati dall'emulatore (2400×1080), input del compositore
- `compose-store-screenshots.js` — compositore (Puppeteer)

## Story-flow (stesso ordine EN/IT)

1. **Match in corso** — "The scoreboard for real Beyblade X battles" / "Il tabellone per le vere battle Beyblade X"
2. **4 finish** — "All 4 finish types, built in" / "Tutti e 4 i finish, integrati"
3. **Vittoria** — "Celebrate every win" / "Festeggia ogni vittoria"
4. **Impostazioni** — "Set your own win score" / "Imposta il punteggio vittoria"
5. **Guida** — "Easy for every blader" / "Facile per ogni blader"

## Rigenerare

```bash
node compose-store-screenshots.js en
node compose-store-screenshots.js it
```

Richiede `puppeteer-core` globale e Chrome di sistema. Le caption sono nel file JS (oggetto `SETS`).

## Note

- Gli screenshot grezzi sono catturati con l'app in **inglese** (l'emulatore AVD è Android 11
  e `expo-localization` non rileva il cambio locale via adb). Per il set IT le **caption** sono
  in italiano; le label dell'app nello screenshot restano in EN (coerente con lo standard
  precedente della scheda, che usava già screenshot in EN anche per IT). Per screenshot con UI
  app in italiano servirebbe un emulatore Android 13+ (per-app locale) o cambio lingua manuale.
- Crop nav bar: la sorgente è 2400×1080 ma l'area app usabile è 2274px; il compositore taglia
  i 126px della barra di navigazione a destra.
