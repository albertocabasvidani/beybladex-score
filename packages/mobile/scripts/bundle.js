const Metro = require('metro');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(projectRoot, '../..');

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

  const bundleOutput = path.resolve(projectRoot, 'android/app/src/main/assets/index.android.bundle');

  console.log('Project root:', projectRoot);
  console.log('Bundle output:', bundleOutput);
  console.log('Bundling...');

  // Use absolute path for entry to avoid monorepo root resolution
  const entryFile = path.resolve(projectRoot, 'index.ts');
  console.log('Entry file:', entryFile);

  await Metro.runBuild(config, {
    entry: entryFile,
    platform: 'android',
    minify: true,
    dev: false,
    sourceMap: false,
    out: bundleOutput,
  });

  console.log('Bundle created OK!');
}

bundle().catch(err => {
  console.error('Bundle failed:', err.message);
  process.exit(1);
});
