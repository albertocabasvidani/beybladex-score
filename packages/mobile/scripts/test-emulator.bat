@echo off
SET ADB=C:\Users\cinqu\AppData\Local\Android\Sdk\platform-tools\adb.exe
SET OUT=c:\claude-code\Personale\app segnapunti beybladex

echo === Test Beyblade X Score ===

echo [1] Reset app...
%ADB% shell am force-stop com.beybladex.score
timeout /t 1 /nobreak >nul
%ADB% shell am start -n com.beybladex.score/.MainActivity
timeout /t 3 /nobreak >nul

echo [2] Screenshot iniziale...
%ADB% exec-out screencap -p > "%OUT%\test-01-start.png"

echo [3] Tap SPIN P1 (x=300, y=370)...
%ADB% shell input tap 300 370
timeout /t 2 /nobreak >nul
%ADB% exec-out screencap -p > "%OUT%\test-02-spin.png"

echo [4] Tap BURST P1 (x=300, y=530)...
%ADB% shell input tap 300 530
timeout /t 2 /nobreak >nul
%ADB% exec-out screencap -p > "%OUT%\test-03-burst.png"

echo [5] Tap OVER P1 (x=700, y=370)...
%ADB% shell input tap 700 370
timeout /t 3 /nobreak >nul
%ADB% exec-out screencap -p > "%OUT%\test-04-over.png"

echo [6] Tap XTREME P1 (x=700, y=530)...
%ADB% shell input tap 700 530
timeout /t 2 /nobreak >nul
%ADB% exec-out screencap -p > "%OUT%\test-05-xtreme.png"

echo [7] Ancora XTREME P1 per vittoria...
%ADB% shell input tap 700 530
timeout /t 3 /nobreak >nul
%ADB% exec-out screencap -p > "%OUT%\test-06-victory.png"

echo === Test completato ===
echo Screenshots salvati in %OUT%\test-*.png
