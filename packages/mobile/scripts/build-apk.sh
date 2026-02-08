#!/bin/bash
# Local APK build script for Beyblade X Score
# Requires: Android Studio (JDK), Android SDK, expo prebuild done
#
# Usage:
#   1. Clone repo to a path WITHOUT spaces (e.g., C:\projects\beybladex)
#   2. yarn install && cd packages/mobile && yarn expo prebuild --platform android
#   3. bash packages/mobile/scripts/build-apk.sh

export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="C:/Users/cinqu/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

# Resolve project dir relative to this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"

echo "=== Building APK (arm64 only, custom Metro bundler) ==="
echo "Project: $PROJECT_DIR"
cd "$ANDROID_DIR"
./gradlew assembleRelease --no-build-cache -x lintVitalAnalyzeRelease -x lintVitalRelease

APK_PATH="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "BUILD OK! APK: $APK_PATH"
    cp "$APK_PATH" "$PROJECT_DIR/beybladex-mobile.apk"
    echo "Copied to: $PROJECT_DIR/beybladex-mobile.apk"
else
    echo "BUILD FAILED - APK non trovato"
fi
