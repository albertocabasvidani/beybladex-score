#!/bin/bash
# Build AAB (Android App Bundle) locale per Play Store
# Prerequisiti: yarn install + yarn expo prebuild --platform android --clean
# Usage: bash packages/mobile/scripts/build-aab.sh
#
# Usa lo stesso flow del build-apk.sh:
# 1. Bundle JS con metro-bundle.js custom
# 2. Modifica build.gradle per usare metro-bundle.js
# 3. Gradle bundleRelease (skippa lint)

export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="C:/Users/cinqu/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"
BUILD_GRADLE="$ANDROID_DIR/app/build.gradle"

echo "=== BUILD AAB - $(date) ==="
echo "Project: $PROJECT_DIR"

# Patch build.gradle to use custom metro-bundle.js (same as build-apk.sh)
if grep -q '@expo/cli' "$BUILD_GRADLE"; then
    echo "[0/3] Patching build.gradle for monorepo bundler..."
    sed -i 's|cliFile = new File.*|cliFile = file("../../scripts/metro-bundle.js")|' "$BUILD_GRADLE"
    sed -i 's|bundleCommand = "export:embed"|bundleCommand = "bundle"|' "$BUILD_GRADLE"
fi

cd "$ANDROID_DIR"
echo "[1/3] Running Gradle bundleRelease..."
./gradlew bundleRelease --no-build-cache -x lintVitalAnalyzeRelease -x lintVitalRelease

AAB_PATH="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
if [ -f "$AAB_PATH" ]; then
    echo ""
    echo "=== AAB PRONTO ==="
    cp "$AAB_PATH" "$PROJECT_DIR/beybladex-mobile.aab"
    echo "File: $PROJECT_DIR/beybladex-mobile.aab"
    ls -lh "$PROJECT_DIR/beybladex-mobile.aab"
else
    echo "BUILD FAILED - AAB non trovato"
    exit 1
fi
