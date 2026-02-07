#!/bin/bash
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
SCREENSHOT_DIR="c:/claude-code/Personale/app segnapunti beybladex"

# Launch app
MSYS_NO_PATHCONV=1 "$ADB" shell monkey -p com.beybladex.score -c android.intent.category.LAUNCHER 1
sleep 8

# Take screenshot
MSYS_NO_PATHCONV=1 "$ADB" exec-out screencap -p > "$SCREENSHOT_DIR/test-layout.png"
echo "Screenshot saved to test-layout.png"
