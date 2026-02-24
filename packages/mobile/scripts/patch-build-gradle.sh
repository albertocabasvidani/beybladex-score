#!/bin/bash
# Patches build.gradle and gradle.properties after expo prebuild --clean
# Fixes:
#   1) cliFile → custom metro-bundle.js (monorepo bundler)
#   2) signingConfigs → upload keystore for Play Store
#   3) gradle.properties → arm64-v8a only (faster APK build)
#
# This script is IDEMPOTENT - safe to run multiple times.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GRADLE_FILE="$SCRIPT_DIR/../android/app/build.gradle"
GRADLE_PROPS="$SCRIPT_DIR/../android/gradle.properties"

if [ ! -f "$GRADLE_FILE" ]; then
    echo "ERROR: build.gradle not found at $GRADLE_FILE"
    exit 1
fi

echo "=== Patching build.gradle ==="

# 1. Replace Expo CLI bundler with custom metro-bundle.js
if grep -q '@expo/cli' "$GRADLE_FILE"; then
    sed -i 's|.*cliFile = new File.*@expo/cli.*|    // Use custom Metro bundler for monorepo\n    cliFile = file("../../scripts/metro-bundle.js")|' "$GRADLE_FILE"
    echo "  [OK] cliFile → metro-bundle.js"
else
    echo "  [SKIP] cliFile already patched"
fi

# 2. Add release signingConfig with upload keystore (if not present)
if ! grep -q 'upload.keystore' "$GRADLE_FILE"; then
    sed -i '/signingConfigs {/,/}/ {
        /debug {/,/}/ {
            /}/a\
        release {\
            storeFile file("upload.keystore")\
            storePassword "ef7c0f4131a3b915d09c839ebc2bbe6f"\
            keyAlias "a16449744129cc886ed0e016387e022d"\
            keyPassword "5edec2072fbfa7997c27c33a643e2d42"\
        }
        }
    }' "$GRADLE_FILE"
    echo "  [OK] Added signingConfigs.release with upload keystore"
else
    echo "  [SKIP] upload.keystore already configured"
fi

# 3. Point release buildType to signingConfigs.release (if upload.keystore exists)
if [ -f "$SCRIPT_DIR/../android/app/upload.keystore" ]; then
    if grep -q 'release {' "$GRADLE_FILE" && grep -q 'signingConfig signingConfigs.debug' "$GRADLE_FILE"; then
        sed -i '/buildTypes {/,/^    }/ {
            /release {/,/}/ {
                s/signingConfig signingConfigs.debug/signingConfig signingConfigs.release/
            }
        }' "$GRADLE_FILE"
        echo "  [OK] release buildType → signingConfigs.release"
    fi
else
    echo "  [INFO] upload.keystore not found, keeping debug signing (OK for APK test)"
fi

# 4. Fix gradle.properties: arm64-v8a only for APK builds
if [ -f "$GRADLE_PROPS" ] && grep -q 'reactNativeArchitectures=armeabi-v7a' "$GRADLE_PROPS"; then
    sed -i 's/reactNativeArchitectures=.*/reactNativeArchitectures=arm64-v8a/' "$GRADLE_PROPS"
    echo "  [OK] gradle.properties → arm64-v8a only"
else
    echo "  [SKIP] gradle.properties already arm64-v8a"
fi

echo "=== Patch complete ==="
