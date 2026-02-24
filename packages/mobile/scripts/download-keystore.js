const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Use Expo GraphQL API to download the upload keystore
const PROJECT_ID = 'bda50771-3cf2-4465-96a9-e342d89dbeb3';

async function main() {
  // Get the session token from eas-cli
  const tokenPath = path.join(process.env.USERPROFILE || process.env.HOME, '.expo', 'state.json');

  if (!fs.existsSync(tokenPath)) {
    console.error('Not logged in to Expo. Run: npx eas-cli login');
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  const token = state.auth?.sessionSecret;

  if (!token) {
    console.error('No session token found. Run: npx eas-cli login');
    process.exit(1);
  }

  console.log('Querying Expo API for Android credentials...');

  // GraphQL query to get the keystore
  const query = `
    query GetAndroidKeystoreForProject($appId: String!) {
      app {
        byId(appId: $appId) {
          id
          androidAppCredentials {
            androidAppBuildCredentialsList {
              androidKeystore {
                id
                keystore
                keystorePassword
                keyAlias
                keyPassword
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://api.expo.dev/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'expo-session': token,
    },
    body: JSON.stringify({
      query,
      variables: { appId: PROJECT_ID },
    }),
  });

  const data = await response.json();

  if (data.errors) {
    console.error('GraphQL errors:', JSON.stringify(data.errors, null, 2));
    process.exit(1);
  }

  const creds = data.data?.app?.byId?.androidAppCredentials;
  if (!creds || creds.length === 0) {
    console.error('No Android credentials found for this project');
    process.exit(1);
  }

  const buildCreds = creds[0]?.androidAppBuildCredentialsList;
  if (!buildCreds || buildCreds.length === 0) {
    console.error('No build credentials found');
    process.exit(1);
  }

  const keystore = buildCreds[0]?.androidKeystore;
  if (!keystore || !keystore.keystore) {
    console.error('No keystore found in credentials');
    process.exit(1);
  }

  // Decode base64 keystore and save
  const keystoreBuffer = Buffer.from(keystore.keystore, 'base64');
  const outputPath = path.join(__dirname, '..', 'android', 'app', 'upload.keystore');

  fs.writeFileSync(outputPath, keystoreBuffer);

  console.log(`Keystore saved to: ${outputPath}`);
  console.log(`Password: ${keystore.keystorePassword}`);
  console.log(`Key alias: ${keystore.keyAlias}`);
  console.log(`Key password: ${keystore.keyPassword}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
