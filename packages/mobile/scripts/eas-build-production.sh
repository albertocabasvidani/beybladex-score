#!/bin/bash
export MSYS_NO_PATHCONV=1
export EAS_NO_VCS=1
cd "C:/projects/beybladex/packages/mobile"
npx eas-cli build --platform android --profile production --non-interactive 2>&1
