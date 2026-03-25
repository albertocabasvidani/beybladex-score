#!/bin/bash
# ============================================================================
# Full APK build pipeline for Beyblade X Score (monorepo)
# ============================================================================
#
# This script handles the ENTIRE pipeline from source to APK:
#   1. Stop any running Gradle daemons (prevent lock conflicts)
#   2. Copy source files from dev dir → build dir
#   3. Install dependencies (yarn)
#   4. Expo prebuild (regenerates android/)
#   5. Patch build.gradle + gradle.properties (monorepo fixes)
#   6. Gradle assembleRelease
#
# WHY THIS EXISTS:
#   - Dev dir has spaces in path ("app segnapunti beybladex") → Gradle fails
#   - Expo prebuild --clean WIPES custom build.gradle changes every time
#   - Must patch: cliFile (metro-bundle.js), signingConfigs, architectures
#
# USAGE:
#   bash packages/mobile/scripts/full-build-apk.sh              # arm64-v8a only (device/Play Store)
#   bash packages/mobile/scripts/full-build-apk.sh --emulator   # arm64-v8a + x86_64 (emulatore)
#
# OUTPUT:
#   C:/projects/beybladex/packages/mobile/beybladex-mobile.apk
# ============================================================================
set -e

# Parse --emulator flag
export BUILD_FOR_EMULATOR=0
for arg in "$@"; do
    if [ "$arg" = "--emulator" ]; then
        BUILD_FOR_EMULATOR=1
    fi
done

export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="C:/Users/cinqu/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

SRC="c:/claude-code/Personale/app segnapunti beybladex"
BUILD="C:/projects/beybladex"

# IMPORTANT: All build paths must use BUILD dir (no spaces in path)
# SCRIPT_DIR from $0 may point to source dir which has spaces → Gradle fails
BUILD_PROJECT="$BUILD/packages/mobile"
BUILD_ANDROID="$BUILD_PROJECT/android"
BUILD_SCRIPTS="$BUILD_PROJECT/scripts"

echo "============================================"
echo "  Beyblade X Score - Full APK Build"
echo "============================================"
echo ""

# ---- STEP 0: Stop Gradle daemons to prevent lock conflicts ----
echo "=== STEP 0: Stop Gradle daemons ==="
if [ -f "$BUILD_ANDROID/gradlew" ]; then
    cd "$BUILD_ANDROID"
    ./gradlew --stop 2>/dev/null || true
    echo "  [OK] Daemons stopped"
else
    echo "  [SKIP] No gradlew yet (first build)"
fi

# ---- STEP 1: Sync ALL source files (entire directories) ----
echo ""
echo "=== STEP 1: Sync source files ==="

# Sync entire directories — no more per-file lists to maintain
cp -r "$SRC/packages/mobile/src/"* "$BUILD/packages/mobile/src/"
cp -r "$SRC/packages/mobile/assets/"* "$BUILD/packages/mobile/assets/"
cp -r "$SRC/packages/mobile/scripts/"* "$BUILD/packages/mobile/scripts/"
cp -r "$SRC/packages/shared/src/"* "$BUILD/packages/shared/src/"

# Config files
cp "$SRC/packages/mobile/app.json" "$BUILD/packages/mobile/app.json"
cp "$SRC/packages/mobile/package.json" "$BUILD/packages/mobile/package.json"
cp "$SRC/packages/shared/package.json" "$BUILD/packages/shared/package.json"

echo "  [OK] Source files synced"

# ---- STEP 2: Install dependencies ----
echo ""
echo "=== STEP 2: Install dependencies ==="
cd "$BUILD"
yarn install --frozen-lockfile 2>/dev/null || yarn install
echo "  [OK] Dependencies installed"

# ---- STEP 3: Expo prebuild ----
echo ""
echo "=== STEP 3: Expo prebuild ==="
cd "$BUILD_PROJECT"
yarn expo prebuild --platform android --clean
echo "  [OK] Prebuild complete"

# ---- STEP 4: Patch build.gradle + gradle.properties ----
echo ""
echo "=== STEP 4: Patch build config ==="
# Run patch script from BUILD dir (not source dir)
bash "$BUILD_SCRIPTS/patch-build-gradle.sh"

# ---- STEP 5: Gradle build ----
echo ""
echo "=== STEP 5: Gradle assembleRelease ==="
cd "$BUILD_ANDROID"
./gradlew assembleRelease --console=plain --no-build-cache -x lintVitalAnalyzeRelease -x lintVitalRelease

# ---- Result ----
echo ""
APK_PATH="$BUILD_ANDROID/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo "============================================"
    echo "  BUILD OK!"
    echo "============================================"
    cp "$APK_PATH" "$BUILD_PROJECT/beybladex-mobile.apk"
    echo "APK: $BUILD_PROJECT/beybladex-mobile.apk"
else
    echo "============================================"
    echo "  BUILD FAILED - APK non trovato"
    echo "============================================"
    exit 1
fi
