import { execSync } from 'child_process';
import { logger } from '@nx/devkit';

export function ensureNxLocalLibs(): void {
  try {
    execSync('mkdir -p node_modules/@stellar-libs/utils');
    execSync('cp -r ./dist/libs/utils/**/* node_modules/@stellar-libs/utils');
  } catch (error) {
    logger.error(error);
  }
}

export function cleanLocalLibs(): void {
  try {
    execSync(`rm -r node_modules/@stellar-libs/utils`);
  } catch (error) {
    logger.error(error);
  }
}
