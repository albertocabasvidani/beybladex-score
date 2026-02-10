#!/bin/bash
# Pull app logs from device filesystem
ADB="C:/Users/cinqu/AppData/Local/Android/Sdk/platform-tools/adb.exe"
DEV="-s LCL0218330001329"
PKG="com.beybladex.score"
DEST="c:/claude-code/Personale/app segnapunti beybladex"

echo "=== Pull App Logs ==="

# Try to list and pull log files using run-as
echo "Listing app files..."
MSYS_NO_PATHCONV=1 "$ADB" $DEV shell run-as $PKG ls -la files/logs/ 2>&1
echo ""

echo "Pulling current.jsonl..."
MSYS_NO_PATHCONV=1 "$ADB" $DEV shell run-as $PKG cat files/logs/current.jsonl 2>&1 > "$DEST/app-logs-current.jsonl"
echo "Saved to app-logs-current.jsonl ($(wc -c < "$DEST/app-logs-current.jsonl") bytes)"

echo ""
echo "Checking for rotated logs..."
MSYS_NO_PATHCONV=1 "$ADB" $DEV shell run-as $PKG ls files/logs/ 2>&1

echo ""
echo "=== Also trying broader logcat ==="
# Capture ALL logcat without filter to find any crash
MSYS_NO_PATHCONV=1 "$ADB" $DEV logcat -d -t 200 > "$DEST/test-logcat-full.txt"
echo "Full logcat saved (last 200 entries)"

echo ""
echo "=== Done ==="
