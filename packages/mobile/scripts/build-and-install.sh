#!/bin/bash
set -e
export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
export ANDROID_HOME="C:/Users/cinqu/AppData/Local/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
ADB="$ANDROID_HOME/platform-tools/adb.exe"
PROJECT_ROOT="C:/projects/beybladex"

echo "=== BUILD START $(date) ==="

# Build APK
cd "$PROJECT_ROOT/packages/mobile/android"
./gradlew assembleRelease --console=plain 2>&1

echo ""
echo "=== BUILD DONE $(date) ==="

# Find APK
APK=$(find "$PROJECT_ROOT/packages/mobile/android" -name "*.apk" -path "*/release/*" -type f 2>/dev/null | head -1)
echo "APK: $APK"

if [ -z "$APK" ]; then
  echo "ERROR: APK not found!"
  echo "=== FAILED ==="
  exit 1
fi

# Install on device
echo ""
echo "=== INSTALLING ON DEVICE ==="
"$ADB" install -r "$APK" 2>&1

echo ""
echo "=== LAUNCHING APP ==="
MSYS_NO_PATHCONV=1 "$ADB" shell monkey -p com.beybladex.score -c android.intent.category.LAUNCHER 1

echo "=== ALL DONE $(date) ==="
