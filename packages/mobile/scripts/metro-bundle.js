/**
 * Custom Metro bundler for monorepo local builds.
 * Called by Gradle as replacement for Expo CLI's export:embed.
 *
 * Usage: node metro-bundle.js export:embed --platform android --entry-file <entry>
 *        --bundle-output <output> --assets-dest <dest> [--dev false] [--reset-cache]
 */
const Metro = require('metro');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '../..');

// Parse args from Gradle
const args = process.argv.slice(2);
let platform = 'android';
let entryFile = 'index.ts';
let bundleOutput = '';
let assetsDest = '';
let dev = false;
let sourceMapOutput = '';

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--platform': platform = args[++i]; break;
    case '--entry-file': entryFile = args[++i]; break;
    case '--bundle-output': bundleOutput = args[++i]; break;
    case '--assets-dest': assetsDest = args[++i]; break;
    case '--dev': dev = args[++i] === 'true'; break;
    case '--sourcemap-output': sourceMapOutput = args[++i]; break;
  }
}

// Make paths absolute - Gradle passes relative paths from project root (packages/mobile)
if (!path.isAbsolute(entryFile)) {
  entryFile = path.resolve(projectRoot, entryFile);
}
if (bundleOutput && !path.isAbsolute(bundleOutput)) {
  bundleOutput = path.resolve(projectRoot, bundleOutput);
}
if (assetsDest && !path.isAbsolute(assetsDest)) {
  assetsDest = path.resolve(projectRoot, assetsDest);
}
if (sourceMapOutput && !path.isAbsolute(sourceMapOutput)) {
  sourceMapOutput = path.resolve(projectRoot, sourceMapOutput);
}

// Ensure output directory exists
const fs = require('fs');
const outputDir = path.dirname(bundleOutput);
fs.mkdirSync(outputDir, { recursive: true });

async function bundle() {
  const config = await getDefaultConfig(projectRoot);

  config.projectRoot = projectRoot;
  config.watchFolders = [workspaceRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];
  config.resolver.extraNodeModules = {
    '@beybladex/shared': path.resolve(workspaceRoot, 'packages/shared/src'),
  };

  // Le build con flag inlinato a build-time (es. --beta → EXPO_PUBLIC_FEATURES_ON) devono
  // ignorare la cache transform di Metro, altrimenti il valore resta quello del run precedente.
  if (process.env.METRO_RESET_CACHE === '1') {
    config.resetCache = true;
  }

  console.log('[metro-bundle] Project root:', projectRoot);
  console.log('[metro-bundle] Entry:', entryFile);
  console.log('[metro-bundle] Output:', bundleOutput);
  console.log('[metro-bundle] Platform:', platform);
  console.log('[metro-bundle] Dev:', dev);
  console.log('[metro-bundle] EXPO_PUBLIC_FEATURES_ON:', process.env.EXPO_PUBLIC_FEATURES_ON || '(unset)');
  console.log('[metro-bundle] Reset cache:', config.resetCache === true);

  const buildOptions = {
    entry: entryFile,
    platform,
    minify: !dev,
    dev,
    sourceMap: !!sourceMapOutput,
    out: bundleOutput,
    assets: !!assetsDest,
  };
  if (sourceMapOutput) {
    buildOptions.sourceMapUrl = sourceMapOutput;
  }

  const result = await Metro.runBuild(config, buildOptions);

  // Copy assets (mp3 -> res/raw, images -> drawable-*) like RN's buildBundle does;
  // also writes keep.xml so shrinkResources doesn't strip res/raw entries.
  // The package "exports" map blocks deep subpath requires, so resolve the
  // internal file via absolute path (exports only applies to bare specifiers).
  if (assetsDest && result && result.assets) {
    const pluginDir = path.dirname(
      require.resolve('@react-native/community-cli-plugin/package.json')
    );
    const saveAssets = require(
      path.join(pluginDir, 'dist', 'commands', 'bundle', 'saveAssets')
    ).default;

    // Monorepo: metroServer.getAssets() calcola httpServerLocation rispetto alla
    // workspace root ("/assets/packages/mobile/assets/sounds"), mentre il registry
    // JS embedded nel bundle usa il projectRoot ("/assets/assets/sounds"). Il nome
    // risorsa res/raw deriva da httpServerLocation: senza riallineamento il runtime
    // cerca "assets_sounds_x" ma la risorsa si chiama "packages_mobile_assets_sounds_x"
    // (Resource not found). Normalizza al projectRoot come fa il transformer.
    const normalizedAssets = result.assets.map((asset) => {
      const dir = path.dirname(asset.files[0]);
      const rel = path.relative(projectRoot, dir).split(path.sep).join('/');
      return { ...asset, httpServerLocation: '/assets/' + rel };
    });

    await saveAssets(normalizedAssets, platform, assetsDest, undefined);
    console.log('[metro-bundle] Assets copied to:', assetsDest);
  }

  // Metro writes source map as <out>.map - rename to expected path
  const metroMapOutput = bundleOutput + '.map';
  if (sourceMapOutput && fs.existsSync(metroMapOutput)) {
    const sourceMapDir = path.dirname(sourceMapOutput);
    fs.mkdirSync(sourceMapDir, { recursive: true });
    fs.renameSync(metroMapOutput, sourceMapOutput);
    console.log('[metro-bundle] Source map moved to:', sourceMapOutput);
  }

  // Metro adds .js extension - rename to match what Gradle/Hermes expects
  const metroOutput = bundleOutput + '.js';
  if (fs.existsSync(metroOutput)) {
    fs.renameSync(metroOutput, bundleOutput);
    console.log('[metro-bundle] Renamed .js to match expected output');
  }

  console.log('[metro-bundle] Bundle created OK!');
}

bundle().catch(err => {
  console.error('[metro-bundle] Failed:', err.message);
  process.exit(1);
});
