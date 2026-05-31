#!/usr/bin/env node

const { mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readPackageVersion(path) {
  return readJson(path).version ?? null;
}

const root = process.cwd();
const outputDir = join(root, 'artifacts');
const outputPath = join(outputDir, 'compatibility-matrix.json');

const serverCapabilitiesSource = readFileSync(
  join(root, 'packages/happy-server/sources/app/api/routes/versionRoutes.ts'),
  'utf8'
);

const cliMinimum = serverCapabilitiesSource.match(/cli:\s*"([^"]+)"/)?.[1] ?? null;
const appRuntimeMinimum = serverCapabilitiesSource.match(/appRuntime:\s*"([^"]+)"/)?.[1] ?? null;
const modelCatalogVersion = serverCapabilitiesSource.includes('getModelCatalog()') ? 2 : null;

const evidence = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  packages: {
    app: readPackageVersion(join(root, 'packages/happy-app/package.json')),
    cli: readPackageVersion(join(root, 'packages/happy-cli/package.json')),
    server: readPackageVersion(join(root, 'packages/happy-server/package.json')),
    wire: readPackageVersion(join(root, 'packages/happy-wire/package.json')),
  },
  declaredCompatibilityFloor: {
    cli: cliMinimum,
    appRuntime: appRuntimeMinimum,
    modelCatalogVersion,
  },
  routineChecks: [
    'happy-app sources/sync/apiCapabilities.test.ts',
    'happy-server sources/app/api/routes/versionRoutes.test.ts',
    'happy-cli src/api/apiSession.test.ts',
    'happy-cli src/api/apiMachine.test.ts',
  ],
  requiredCapabilities: [
    'messages.v3Post',
    'messages.backwardPagination',
    'messages.idempotentLocalId',
    'features.serverIssuedAuthNonces',
    'modelCatalog.version>=2',
  ],
};

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
