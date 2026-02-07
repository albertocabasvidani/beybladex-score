#!/bin/bash
EMULATOR="C:/Users/cinqu/AppData/Local/Android/Sdk/emulator/emulator.exe"
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"

# Start emulator in background
"$EMULATOR" -avd beybladex_test -no-snapshot -gpu swiftshader_indirect &
EMULATOR_PID=$!

echo "Emulator starting (PID: $EMULATOR_PID)..."

# Wait for boot
for i in $(seq 1 60); do
  BOOT=$("$ADB" shell getprop sys.boot_completed 2>/dev/null)
  if [ "$BOOT" = "1" ]; then
    echo "Emulator booted after ${i}s"
    exit 0
  fi
  sleep 2
done

echo "Timeout waiting for emulator boot"
exit 1
