/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { execFileSync } from 'child_process';

export default async () => {
  // local registry target to run
  const localRegistryTarget = '@stellar-libs/source:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });

  const nx = require.resolve('nx');
  execFileSync(nx, ['run-many', '--targets', 'publish', '--ver', version()], {
    env: process.env,
    stdio: 'inherit',
  });
};

function version() {
  const randomNum = () => Math.floor(Math.random() * 10);
  return `${randomNum()}.${randomNum()}.${randomNum()}`;
}
