#!/bin/bash
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
MSYS_NO_PATHCONV=1 "$ADB" exec-out screencap -p > C:/Users/cinqu/AppData/Local/Temp/beybladex-screen.png
echo "Screenshot saved"
