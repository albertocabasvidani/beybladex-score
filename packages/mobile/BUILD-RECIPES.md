# Build Recipes — Beyblade Score (mobile)

Ricette pronte per i tre scenari. Tutti gli script stanno in `packages/mobile/scripts/`.
Output APK: `C:/projects/beybladex/packages/mobile/beybladex-mobile.apk`
Output AAB: `C:/projects/beybladex/packages/mobile/beybladex-mobile.aab`

> Le build girano nella **build dir senza spazi** `C:\projects\beybladex` (la source dir ha spazi e fa fallire Gradle). Gli script sincronizzano i sorgenti automaticamente.

---

## 1) Emulatore — iterazione rapida (DEFAULT per il test)

```bash
bash packages/mobile/scripts/build-apk-fast.sh --emulator
adb -e install -r "C:/projects/beybladex/packages/mobile/beybladex-mobile.apk"
```

- **Incrementale** (no `--clean`): riusa il C++ nativo già compilato → minuti, non ~13 min.
- ABI **x86_64** (gira sull'emulatore, NON sul telefono arm64).
- Modifiche a JS/TS, **icone**, asset, `app.json` → questa.

Se hai cambiato **dipendenze**: aggiungi `--deps`. Se l'incrementale dà errori strani → build pulita:
```bash
bash packages/mobile/scripts/full-build-apk.sh --emulator   # reset completo
```

## 2) Dispositivo fisico (arm64)

```bash
bash packages/mobile/scripts/build-apk-fast.sh --device
adb -s <SERIAL> install -r "C:/projects/beybladex/packages/mobile/beybladex-mobile.apk"
```

- ABI **arm64-v8a** (telefoni reali). `adb devices` per il SERIAL (autorizza il debug USB sul telefono).
- Pulita: `bash packages/mobile/scripts/full-build-apk.sh`

## 3) Play Store (AAB)

```bash
# 1. bump versionCode in packages/mobile/app.json (es. 11 -> 12)
bash packages/mobile/scripts/full-build-aab.sh
# 2. upload C:/projects/beybladex/packages/mobile/beybladex-mobile.aab in Play Console -> Produzione
```

- **Sempre pulita** (release riproducibile), **tutte le ABI** (armeabi-v7a, arm64-v8a, x86, x86_64), firma con `upload.keystore` (riscaricata da EAS se assente).
- `versionCode` va sempre bumpato (anche dopo "Discard draft": Play lo brucia comunque).

---

## Ottimizzazioni attive (perché le build sono più veloci)

Applicate in `scripts/patch-build-gradle.sh` (riapplicate a ogni build, sopravvivono al prebuild) e negli script:

- **Build cache Gradle** attiva (`--build-cache`; prima era `--no-build-cache`).
- `org.gradle.caching=true`, `org.gradle.parallel=true`, `org.gradle.daemon=true`, `org.gradle.configureondemand=true`, `org.gradle.vfs.watch=true`, `kotlin.incremental=true`.
- Heap daemon a **4 GB** (`-Xmx4096m`, era 2 GB) + `UseParallelGC`.
- Script **fast** = niente `--clean`, niente stop del daemon, niente `yarn install`.

**NON** abilitato: `org.gradle.configuration-cache` (incompatibile col React Native Gradle plugin).

### Possibili miglioramenti futuri
- **ccache** per la compilazione C++ NDK (non installato ora): cache degli oggetti C++ tra build pulite. Installarlo e configurarlo abbatterebbe il costo delle build `--clean`.
- La GPU **non** accelera le build (compilazione = CPU/I/O bound); serve solo all'emulatore a runtime.
