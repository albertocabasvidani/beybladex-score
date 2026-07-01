#!/bin/bash
# ============================================================================
# FAST incremental APK build for Beyblade X Score (monorepo)
# ============================================================================
# Differenze rispetto a full-build-apk.sh (che e' una build PULITA):
#   - NIENTE `expo prebuild --clean`  -> usa prebuild incrementale: rigenera
#     icone/manifest ma NON cancella android/ -> riusa il C++ nativo gia'
#     compilato (.cxx) e gli output Gradle -> build in minuti, non ~13 min.
#   - NIENTE `./gradlew --stop`       -> tiene caldo il daemon.
#   - NIENTE `yarn install`           -> salta (usa --deps per forzarlo se
#     hai cambiato le dipendenze).
#   - Gradle con `--build-cache`.
#
# QUANDO USARLA:
#   - Modifiche a JS/TS, icone, asset, stringhe, config app.json.
#   USA INVECE la build pulita (full-build-apk.sh) se:
#   - hai aggiornato dipendenze native / Expo SDK
#   - la build incrementale da' errori strani (stato sporco) -> full = reset.
#
# USAGE:
#   bash packages/mobile/scripts/build-apk-fast.sh --emulator   # x86_64 (emulatore)
#   bash packages/mobile/scripts/build-apk-fast.sh --device     # arm64-v8a (telefono)
#   bash packages/mobile/scripts/build-apk-fast.sh --device --deps   # + yarn install
#   bash packages/mobile/scripts/build-apk-fast.sh --device --beta   # feature avanzate ON (test su device)
#
# NOTA --beta: accende le feature nascoste (combo builder + statistiche) via
#   EXPO_PUBLIC_FEATURES_ON=1 anche in una build release/APK, come fa full-build-aab.sh --beta.
#   Serve per testare Analitiche/Builder su telefono senza passare dal Play Store.
#   L'APK e' firmato con la upload key (non con l'app-signing di Google): se sul device c'e'
#   gia' la versione dal Play Store, disinstallarla prima (adb uninstall) o l'install fallisce.
#
# OUTPUT:
#   C:/projects/beybladex/packages/mobile/beybladex-mobile.apk
# ============================================================================
set -e

export BUILD_FOR_EMULATOR=0
RUN_DEPS=0
BETA=0
for arg in "$@"; do
    case "$arg" in
        --emulator) export BUILD_FOR_EMULATOR=1 ;;
        --device)   export BUILD_FOR_EMULATOR=0 ;;
        --deps)     RUN_DEPS=1 ;;
        --beta)     BETA=1 ;;
    esac
done

if [ "$BETA" = "1" ]; then
    export EXPO_PUBLIC_FEATURES_ON=1
    export METRO_RESET_CACHE=1
    echo "  >>> BUILD BETA: feature avanzate ON (combo builder + statistiche)"
else
    unset EXPO_PUBLIC_FEATURES_ON || true
fi

export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="C:/Users/cinqu/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

SRC="c:/claude-code/Personale/app segnapunti beybladex"
BUILD="C:/projects/beybladex"
BUILD_PROJECT="$BUILD/packages/mobile"
BUILD_ANDROID="$BUILD_PROJECT/android"
BUILD_SCRIPTS="$BUILD_PROJECT/scripts"

echo "============================================"
echo "  Beyblade X Score - FAST APK Build"
echo "  (emulator=$BUILD_FOR_EMULATOR, deps=$RUN_DEPS)"
echo "============================================"

# Se android/ non esiste, non si puo' fare incrementale -> usa la build pulita.
if [ ! -d "$BUILD_ANDROID" ]; then
    echo "  [!] android/ assente: serve una build pulita."
    echo "      Lancia: bash packages/mobile/scripts/full-build-apk.sh --emulator"
    exit 1
fi

# ---- STEP 1: Sync source ----
echo "=== STEP 1: Sync source files ==="
cp -r "$SRC/packages/mobile/src/"* "$BUILD/packages/mobile/src/"
cp -r "$SRC/packages/mobile/assets/"* "$BUILD/packages/mobile/assets/"
cp -r "$SRC/packages/mobile/scripts/"* "$BUILD/packages/mobile/scripts/"
cp -r "$SRC/packages/shared/src/"* "$BUILD/packages/shared/src/"
cp "$SRC/packages/mobile/app.json" "$BUILD/packages/mobile/app.json"
cp "$SRC/packages/mobile/package.json" "$BUILD/packages/mobile/package.json"
cp "$SRC/packages/shared/package.json" "$BUILD/packages/shared/package.json"
echo "  [OK] Source synced"

# ---- STEP 2: Dependencies (solo se richiesto) ----
if [ "$RUN_DEPS" = "1" ]; then
    echo "=== STEP 2: yarn install ==="
    cd "$BUILD"
    yarn install --frozen-lockfile 2>/dev/null || yarn install
    echo "  [OK] Dependencies installed"
else
    echo "=== STEP 2: yarn install SKIPPED (usa --deps per forzare) ==="
fi

# ---- STEP 3: Expo prebuild INCREMENTALE (no --clean) ----
echo "=== STEP 3: Expo prebuild (incrementale, no --clean) ==="
cd "$BUILD_PROJECT"
yarn expo prebuild --platform android
echo "  [OK] Prebuild incrementale"

# ---- STEP 4: Patch build.gradle + gradle.properties ----
echo "=== STEP 4: Patch build config ==="
bash "$BUILD_SCRIPTS/patch-build-gradle.sh"

# ---- STEP 5: Gradle assembleRelease (build cache ON, daemon caldo) ----
echo "=== STEP 5: Gradle assembleRelease (incrementale) ==="
cd "$BUILD_ANDROID"
./gradlew assembleRelease --console=plain --build-cache -x lintVitalAnalyzeRelease -x lintVitalRelease

# ---- Result ----
APK_PATH="$BUILD_ANDROID/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    cp "$APK_PATH" "$BUILD_PROJECT/beybladex-mobile.apk"
    echo "============================================"
    echo "  FAST BUILD OK!"
    echo "  APK: $BUILD_PROJECT/beybladex-mobile.apk"
    echo "============================================"
else
    echo "  BUILD FAILED - APK non trovato"
    exit 1
fi
