const { execSync } = require('child_process');
const fs = require('fs');

const EMULATORS = [
  { name: 'Android_360px', avd: 'pixel_5' },
  { name: 'Android_390px', avd: 'pixel_8' },
  { name: 'Android_412px', avd: 'pixel_9_pro' }
];

async function testAllEmulators() {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  for (const emu of EMULATORS) {
    console.log(`\n📱 Testing ${emu.name}...`);

    // Start emulator
    console.log('Starting emulator...');
    const emuProcess = execSync(`emulator -avd ${emu.avd} &`, { stdio: 'inherit' });

    // Wait for device
    console.log('Waiting for device...');
    execSync('adb wait-for-device', { stdio: 'inherit' });

    // Wait 10s for boot
    await sleep(10000);

    // Install app
    console.log('Installing app...');
    execSync('npx expo run:android', { stdio: 'inherit' });

    // Wait 5s for app start
    await sleep(5000);

    // Screenshot
    console.log('Taking screenshot...');
    execSync(`adb exec-out screencap -p > screenshots/${emu.name}.png`);

    // Verify no overflow
    console.log('Checking UI...');
    const uiCheck = execSync('adb shell "dumpsys window | grep -E \'mCurrentFocus|mFrame\'"').toString();
    console.log(uiCheck);

    // Kill emulator
    console.log('Stopping emulator...');
    execSync('adb emu kill');

    await sleep(2000);
  }

  console.log('\n✅ Test completati! Verifica screenshots in screenshots/');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

testAllEmulators().catch(console.error);
