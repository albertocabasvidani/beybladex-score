#!/bin/bash
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
SCREENSHOT_DIR="c:/claude-code/Personale/app segnapunti beybladex"

# Dismiss any dialog by pressing back
MSYS_NO_PATHCONV=1 "$ADB" shell input keyevent 4
sleep 1

# Tap "Wait" button if dialog is still showing (roughly center-bottom of dialog)
MSYS_NO_PATHCONV=1 "$ADB" shell input tap 780 468
sleep 2

# Take screenshot
MSYS_NO_PATHCONV=1 "$ADB" exec-out screencap -p > "$SCREENSHOT_DIR/test-layout.png"
echo "Screenshot saved"
