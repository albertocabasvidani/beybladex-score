# Build Guide - Beyblade X Score Mobile

## Architettura Build

Il progetto usa un sistema a **due directory**:

| Directory | Path | Uso |
|-----------|------|-----|
| **Source** (dev) | `c:\claude-code\Personale\app segnapunti beybladex` | Codice sorgente, git |
| **Build** | `C:\projects\beybladex` | Compilazione Gradle (path senza spazi) |

**Perche'**: Gradle non supporta path con spazi. La source dir ha "app segnapunti beybladex" nel path.

Gli script `full-build-*.sh` gestiscono automaticamente la copia source → build.

---

## 1. Build APK per Emulatore

**Quando**: Test rapidi su emulatore Android.
**Architettura**: Solo arm64-v8a (veloce).
**Signing**: Debug (non va su Play Store).

```bash
# Comando unico - fa tutto (copia, prebuild, patch, gradle)
bash packages/mobile/scripts/full-build-apk.sh
```

**Output**: `C:\projects\beybladex\packages\mobile\beybladex-mobile.apk`

### Test su emulatore

```bash
# 1. Avvia emulatore (se non gia' aperto)
bash packages/mobile/scripts/start-emulator.sh

# 2. Installa e testa
bash packages/mobile/scripts/install-and-test.sh
```

### Test su smartphone fisico

```bash
# Verifica device collegato
C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe devices

# Installa (sostituisci SERIAL con l'ID del device)
C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe -s SERIAL install -r "C:/projects/beybladex/packages/mobile/beybladex-mobile.apk"
```

---

## 2. Build AAB per Play Store

**Quando**: Release su Google Play Store.
**Architettura**: Tutte (armeabi-v7a, arm64-v8a, x86, x86_64).
**Signing**: Release con upload.keystore.

### Prerequisito: upload.keystore

La keystore deve essere in `C:\projects\beybladex\packages\mobile\android\app\upload.keystore`.
Se manca, scaricarla:

```bash
bash C:/projects/beybladex/download-keystore.sh
```

### Build

```bash
# Comando unico - fa tutto (copia, prebuild, patch, gradle bundleRelease)
bash packages/mobile/scripts/full-build-aab.sh
```

**Output**: `C:\projects\beybladex\packages\mobile\beybladex-mobile.aab`

**Tempo**: ~5-8 min (4 architetture).

### Upload Play Store

1. Apri [Google Play Console](https://play.google.com/console)
2. Seleziona **Beyblade X Score**
3. Vai a **Release** → **Testing** → **Closed testing (Alpha)**
4. Clicca **Create new release**
5. Upload `beybladex-mobile.aab`
6. Compila release notes
7. **Review and roll out**

---

## 3. Prima di ogni release

### Checklist

- [ ] Bump `versionCode` in `packages/mobile/app.json` (source dir)
- [ ] Bump `versionCode` in `app.json` (root, se presente)
- [ ] Commit e push su GitHub
- [ ] Build AAB con `full-build-aab.sh`
- [ ] Upload su Play Console
- [ ] Verificare su Play Console che il versionCode sia accettato

### Bump versionCode

Il `versionCode` deve essere incrementale. Play Store rifiuta AAB con versionCode <= ultimo pubblicato.

Aggiornare in **`packages/mobile/app.json`**:
```json
"android": {
  "versionCode": 7  // incrementare
}
```

Non serve toccare `build.gradle` - expo prebuild lo genera dal app.json.

---

## Problemi noti e soluzioni

### "Unable to resolve module" durante la build

**Causa**: Gradle/Metro sta risolvendo i moduli dal path source (con spazi) invece del build dir.
**Soluzione**: Gli script `full-build-*.sh` devono usare `BUILD_*` vars, non `SCRIPT_DIR`. Gia' fixato.

### "upload.keystore not found, keeping debug signing"

**Causa**: La keystore non e' nella directory android/app/ del build dir.
**Effetto**: L'APK e' firmato con debug key (OK per test, rifiutato da Play Store).
**Soluzione**: Scaricare la keystore con `download-keystore.sh` prima della build AAB.

### expo prebuild sovrascrive build.gradle

**Causa**: `expo prebuild --clean` rigenera android/ da zero.
**Soluzione**: `patch-build-gradle.sh` ri-applica le patch dopo ogni prebuild. Gli script `full-build-*.sh` lo fanno automaticamente.

### Build lenta

- Prima build: ~8-10 min (compila tutto)
- Build successive senza `--clean`: ~3-5 min (cache Gradle)
- AAB (4 architetture) sempre piu' lento di APK (1 architettura)

### Gradle daemon conflicts

**Sintomo**: "Could not create service of type" o lock file errors.
**Soluzione**: Gli script fanno `gradlew --stop` come step 0. Se persiste:
```bash
# Kill manuale
tasklist /FI "IMAGENAME eq java.exe"
taskkill /F /PID <pid>
```

---

## Script disponibili

| Script | Cosa fa |
|--------|---------|
| `full-build-apk.sh` | Pipeline completo → APK (test) |
| `full-build-aab.sh` | Pipeline completo → AAB (Play Store) |
| `build-apk.sh` | Solo Gradle assembleRelease (android/ deve esistere) |
| `build-aab.sh` | Solo Gradle bundleRelease (android/ deve esistere) |
| `patch-build-gradle.sh` | Patch build.gradle dopo prebuild |
| `start-emulator.sh` | Avvia emulatore beybladex_test |
| `install-and-test.sh` | Installa APK + screenshot |
| `metro-bundle.js` | Bundler JS custom per monorepo |
