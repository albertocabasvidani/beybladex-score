#!/bin/bash
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
APK="C:/projects/beybladex/packages/mobile/android/app/build/outputs/apk/release/app-release.apk"

echo "=== Uninstalling old version ==="
MSYS_NO_PATHCONV=1 "$ADB" uninstall com.beybladex.score 2>&1

echo ""
echo "=== Installing new version ==="
"$ADB" install "$APK" 2>&1

echo ""
echo "=== Launching app ==="
MSYS_NO_PATHCONV=1 "$ADB" shell monkey -p com.beybladex.score -c android.intent.category.LAUNCHER 1

echo "=== DONE ==="
