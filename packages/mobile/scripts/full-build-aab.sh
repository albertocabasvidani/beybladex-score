#!/bin/bash
# ============================================================================
# Full AAB build pipeline for Beyblade X Score (monorepo)
# ============================================================================
#
# Same as full-build-apk.sh but builds AAB for Play Store:
#   - ALL architectures (armeabi-v7a, arm64-v8a, x86, x86_64)
#   - bundleRelease instead of assembleRelease
#   - Release signing with upload.keystore
#
# USAGE:
#   bash packages/mobile/scripts/full-build-aab.sh
#
# OUTPUT:
#   C:/projects/beybladex/packages/mobile/beybladex-mobile.aab
# ============================================================================
set -e

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
echo "  Beyblade X Score - Full AAB Build"
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

# ---- STEP 1: Copy ALL source files ----
echo ""
echo "=== STEP 1: Copy source files ==="

# Core source files
cp "$SRC/packages/mobile/src/App.tsx" "$BUILD/packages/mobile/src/App.tsx"
cp "$SRC/packages/mobile/src/store/game-store.ts" "$BUILD/packages/mobile/src/store/game-store.ts"

# Game components
for f in GameScreen.tsx ScoreDisplay.tsx VictoryOverlay.tsx PlayerPanel.tsx FinishButton.tsx FoulCounter.tsx; do
    if [ -f "$SRC/packages/mobile/src/components/game/$f" ]; then
        cp "$SRC/packages/mobile/src/components/game/$f" "$BUILD/packages/mobile/src/components/game/$f"
    fi
done

# UI components
for f in RotateDeviceScreen.tsx; do
    if [ -f "$SRC/packages/mobile/src/components/ui/$f" ]; then
        cp "$SRC/packages/mobile/src/components/ui/$f" "$BUILD/packages/mobile/src/components/ui/$f"
    fi
done

# Modals
for f in SettingsModal.tsx CreditsModal.tsx GuideModal.tsx; do
    if [ -f "$SRC/packages/mobile/src/components/modals/$f" ]; then
        cp "$SRC/packages/mobile/src/components/modals/$f" "$BUILD/packages/mobile/src/components/modals/$f"
    fi
done

# Config files
cp "$SRC/packages/mobile/app.json" "$BUILD/packages/mobile/app.json"
cp "$SRC/packages/mobile/package.json" "$BUILD/packages/mobile/package.json"

# Scripts
for f in patch-build-gradle.sh build-apk.sh build-aab.sh metro-bundle.js full-build-apk.sh full-build-aab.sh; do
    if [ -f "$SRC/packages/mobile/scripts/$f" ]; then
        cp "$SRC/packages/mobile/scripts/$f" "$BUILD/packages/mobile/scripts/$f"
    fi
done

echo "  [OK] Source files copied"

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

# ---- STEP 4: Patch build.gradle (WITHOUT architecture restriction for AAB) ----
echo ""
echo "=== STEP 4: Patch build config ==="
# Run patch script from BUILD dir (not source dir)
bash "$BUILD_SCRIPTS/patch-build-gradle.sh"

# Override: restore ALL architectures for AAB (Play Store needs all)
GRADLE_PROPS="$BUILD_ANDROID/gradle.properties"
if [ -f "$GRADLE_PROPS" ]; then
    sed -i 's/reactNativeArchitectures=arm64-v8a/reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64/' "$GRADLE_PROPS"
    echo "  [OK] Restored ALL architectures for AAB"
fi

# ---- STEP 5: Gradle bundleRelease ----
echo ""
echo "=== STEP 5: Gradle bundleRelease ==="
cd "$BUILD_ANDROID"
./gradlew bundleRelease --console=plain --no-build-cache -x lintVitalAnalyzeRelease -x lintVitalRelease

# ---- Result ----
echo ""
AAB_PATH="$BUILD_ANDROID/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    echo "============================================"
    echo "  BUILD OK!"
    echo "============================================"
    cp "$AAB_PATH" "$BUILD_PROJECT/beybladex-mobile.aab"
    echo "AAB: $BUILD_PROJECT/beybladex-mobile.aab"
    ls -lh "$BUILD_PROJECT/beybladex-mobile.aab"
else
    echo "============================================"
    echo "  BUILD FAILED - AAB non trovato"
    echo "============================================"
    exit 1
fi
