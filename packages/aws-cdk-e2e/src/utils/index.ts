import { execSync } from 'child_process';

export function ensureNxLocalLibs() {
  execSync('mkdir -p node_modules/@aws-nx/utils');
  execSync('cp -r ./dist/libs/utils/**/* node_modules/@aws-nx/utils');
}

export function cleanLocalLibs() {
  execSync(`rm -r node_modules/@aws-nx/utils`);
}
