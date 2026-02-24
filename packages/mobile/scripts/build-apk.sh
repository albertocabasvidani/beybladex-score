#!/bin/bash
# ============================================================================
# Gradle-only APK build (no prebuild, no copy)
# ============================================================================
# Use this when android/ dir already exists and build.gradle is already patched.
# For a full pipeline (including prebuild + patch), use full-build-apk.sh instead.
#
# PREREQUISITE: expo prebuild + patch-build-gradle.sh must have been run already.
# ============================================================================
set -e

export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="C:/Users/cinqu/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"

# Stop any lingering Gradle daemons to prevent lock conflicts
cd "$ANDROID_DIR"
./gradlew --stop 2>/dev/null || true

echo "=== Building APK (arm64 only, custom Metro bundler) ==="
echo "Project: $PROJECT_DIR"

cd "$ANDROID_DIR"
./gradlew assembleRelease --console=plain --no-build-cache -x lintVitalAnalyzeRelease -x lintVitalRelease

APK_PATH="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "BUILD OK! APK: $APK_PATH"
    cp "$APK_PATH" "$PROJECT_DIR/beybladex-mobile.apk"
    echo "Copied to: $PROJECT_DIR/beybladex-mobile.apk"
else
    echo "BUILD FAILED - APK non trovato"
    exit 1
fi
