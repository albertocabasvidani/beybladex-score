#!/bin/bash
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
OUT="c:/claude-code/Personale/app segnapunti beybladex"

echo "=== Test Beyblade X Score - Victory Test ==="

echo "[1] Reset app..."
$ADB shell am force-stop com.beybladex.score
sleep 1
$ADB shell am start -n com.beybladex.score/.MainActivity
sleep 4

echo "[2] Screenshot iniziale (0-0)..."
$ADB exec-out screencap -p > "$OUT/test-01-start.png"

# SPIN P1 coordinate verificate: (300, 370) funziona sempre
echo "[3] 7x SPIN P1 per vittoria..."
for i in 1 2 3 4 5 6 7; do
  echo "  SPIN $i..."
  $ADB shell input tap 300 370
  sleep 2
done

echo "[4] Screenshot vittoria..."
sleep 2
$ADB exec-out screencap -p > "$OUT/test-02-victory.png"

echo "=== Test completato ==="
