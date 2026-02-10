@echo off
cd /d "%~dp0..\android"
call gradlew.bat assembleRelease
echo APK built at: app\build\outputs\apk\release\app-release.apk
