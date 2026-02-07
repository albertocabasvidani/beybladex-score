#!/bin/bash
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
SCREENSHOT_DIR="c:/claude-code/Personale/app segnapunti beybladex"

# Get screen size
MSYS_NO_PATHCONV=1 "$ADB" shell wm size

# Tap "Wait" button - it's the lower option in the dialog
# Try with am command to dismiss ANR dialog
MSYS_NO_PATHCONV=1 "$ADB" shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS
sleep 2

# Take screenshot
MSYS_NO_PATHCONV=1 "$ADB" exec-out screencap -p > "$SCREENSHOT_DIR/test-layout.png"
echo "Screenshot saved"
