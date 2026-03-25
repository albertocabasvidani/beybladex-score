# Build Guide - Beyblade X Score Mobile

## Architettura Build

Il progetto usa un sistema a **due directory**:

| Directory | Path | Uso |
|-----------|------|-----|
| **Source** (dev) | `c:\claude-code\Personale\app segnapunti beybladex` | Codice sorgente, git |
| **Build** | `C:\projects\beybladex` | Compilazione Gradle (path senza spazi) |

Gradle non supporta path con spazi. Gli script `full-build-*.sh` gestiscono automaticamente la copia source → build.

**TUTTE le modifiche ai sorgenti vanno nella SOURCE dir** — gli script copiano intere directory (`cp -r`):
- `packages/mobile/src/`, `assets/`, `scripts/`
- `packages/shared/src/`
- Config: `app.json`, `package.json` (mobile + shared)

---

## 1. Build APK per Emulatore

**Quando**: Test su emulatore Android.
**Signing**: Debug (non va su Play Store).

**IMPORTANTE — Architettura**: La build standard produce APK solo `arm64-v8a`, che **CRASHA sull'emulatore x86_64** con `SoLoaderDSONotFoundError: libreactnative.so`. Usare il flag `--emulator` per includere x86_64 automaticamente.

### Procedura

```bash
# Emulatore (arm64-v8a + x86_64, ~4-5 min)
bash packages/mobile/scripts/full-build-apk.sh --emulator

# Device fisico o test generico (arm64-v8a only, ~3 min)
bash packages/mobile/scripts/full-build-apk.sh
```

**Output**: `C:\projects\beybladex\packages\mobile\beybladex-mobile.apk`
**Tempo**: ~4-5 min con 2 architetture

### Test su emulatore

Vedi **`EMULATOR-GUIDE.md`** per avvio emulatore, attesa boot e troubleshooting.

Procedura rapida (tutti i comandi in script `.sh`):
```bash
# 1. Avvia emulatore (run_in_background, NO & nel comando)
C:/Users/cinqu/AppData/Local/Android/Sdk/emulator/emulator.exe \
  -avd beybladex_test -no-audio -no-boot-anim -gpu host -no-snapshot-load

# 2. Attendi boot completo (sys.boot_completed == 1)
# 3. Forza landscape:
#    adb shell settings put system accelerometer_rotation 0
#    adb shell settings put system user_rotation 1
# 4. adb install -r beybladex-mobile.apk
# 5. adb shell monkey -p com.beybladex.score -c android.intent.category.LAUNCHER 1
# 6. adb exec-out screencap -p > screenshot.png
```

### Test su smartphone fisico

```bash
# Verifica device collegato
adb devices

# Installa (sostituisci SERIAL con l'ID del device)
adb -s SERIAL install -r "C:/projects/beybladex/packages/mobile/beybladex-mobile.apk"
```

---

## 2. Build AAB per Play Store

**Quando**: Release su Google Play Store.
**Architettura**: Solo arm64-v8a (il default del patch).
**Signing**: Release con upload.keystore.

### Prerequisiti

**upload.keystore** deve essere in `android/app/upload.keystore`.
- Scaricata da EAS API GraphQL (`download-keystore.js`)
- `expo prebuild --clean` la CANCELLA → `full-build-aab.sh` la ri-scarica automaticamente
- SHA1 atteso: `5A:CE:58:70:FB:33:76:93:69:71:E5:99:63:D9:6A:91:55:56:1E:D5`
- MAI usare `signingConfigs.debug` per release Play Store

### Build

```bash
bash packages/mobile/scripts/full-build-aab.sh
```

**Output**: `C:\projects\beybladex\packages\mobile\beybladex-mobile.aab`

### Upload Play Store

1. Google Play Console → Beyblade Score → **Production** → Create new release
2. Upload AAB (`beybladex-mobile.aab`)
3. Compilare release notes e pubblicare

**REGOLA**: SEMPRE track **Production** (MAI Closed testing/Alpha).

---

## 3. Checklist Pre-Release (OBBLIGATORIA prima di buildare AAB)

- [ ] Nome app in `app.json` → corrisponde al titolo sullo store listing?
- [ ] Icona `icon.png` e `adaptive-icon.png` → corrisponde all'icona dello store listing?
- [ ] `versionCode` in `packages/mobile/app.json` → incrementato? (non serve toccare `build.gradle`, expo prebuild lo genera)
- [ ] Store listing (titolo, descrizione, screenshot) → aggiornati se necessario?
- [ ] Nessuna modifica pending ai sorgenti che non è stata inclusa nella build?
- [ ] Build AAB con `full-build-aab.sh` (usa sempre arm64-v8a, non serve `--emulator`)?

### Icona App
- L'icona launcher DEVE corrispondere all'icona dello store listing
- MAI lasciare placeholder Expo — causa rejection "Misleading Claims"

---

## Problemi noti e soluzioni

### expo prebuild sovrascrive build.gradle

`expo prebuild --clean` rigenera android/ da zero e DISTRUGGE le customizzazioni:
1. **cliFile**: sovrascrive con `@expo/cli` → deve essere `metro-bundle.js` (bundler monorepo)
2. **signingConfigs**: rimuove `release` con upload keystore → serve per Play Store
3. **gradle.properties**: resetta architetture a tutte → deve essere solo `arm64-v8a`

Lo script `patch-build-gradle.sh` corregge tutti e 3 automaticamente.
**REGOLA**: MAI usare `build-apk.sh` dopo `expo prebuild --clean` senza prima eseguire `patch-build-gradle.sh`.

### "Unable to resolve module" durante la build

**Causa**: Gradle/Metro sta risolvendo i moduli dal path source (con spazi) invece del build dir.
**Soluzione**: Gli script `full-build-*.sh` usano `BUILD_*` vars, non `SCRIPT_DIR`.

### "upload.keystore not found, keeping debug signing"

**Causa**: La keystore non è nella directory android/app/ del build dir.
**Effetto**: APK firmato con debug key (OK per test, rifiutato da Play Store).
**Soluzione**: `full-build-aab.sh` la scarica automaticamente (step 3.5).

### Gradle daemon conflicts

**Sintomo**: "Could not create service of type" o lock file errors.
**Soluzione**: Gli script fanno `gradlew --stop` come step 0.

### SoLoaderDSONotFoundError sull'emulatore

**Causa**: APK compilata solo arm64-v8a, emulatore è x86_64.
**Soluzione**: Compilare con `arm64-v8a,x86_64` (vedi sezione 1).

---

## Script disponibili

| Script | Cosa fa |
|--------|---------|
| `full-build-apk.sh` | Pipeline completo → APK (test) |
| `full-build-aab.sh` | Pipeline completo → AAB (Play Store) |
| `build-apk.sh` | Solo Gradle assembleRelease (android/ deve esistere) |
| `build-aab.sh` | Solo Gradle bundleRelease (android/ deve esistere) |
| `patch-build-gradle.sh` | Patch build.gradle dopo prebuild |
| `metro-bundle.js` | Bundler JS custom per monorepo |
