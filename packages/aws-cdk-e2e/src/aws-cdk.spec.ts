import * as path from 'path';
import {
  uniq,
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
} from '@nx/plugin/testing';
import { ensureNxLocalLibs, cleanLocalLibs } from './utils';

describe('"@aws-nx/aws-cdk" Application Generator', () => {
  beforeAll(() => {
    ensureNxLocalLibs();
    ensureNxProject('@aws-nx/aws-cdk', 'dist/packages/aws-cdk');
  });

  afterAll(() => {
    cleanLocalLibs();
  });

  it('@aws-nx/aws-cdk application generator', async () => {
    const pluginName = uniq('aws-cdk');
    await runNxCommandAsync(
      `generate @aws-nx/aws-cdk:application ${pluginName}`
    );

    expect(() => {
      // check generated application directory
      checkFilesExist(path.join(pluginName));
      // Check generated config files
      checkFilesExist(path.join(pluginName, 'cdk.json'));
      checkFilesExist(path.join(pluginName, 'tsconfig.json'));
      checkFilesExist(path.join(pluginName, 'tsconfig.app.json'));
      checkFilesExist(path.join(pluginName, 'jest.config.js'));
      // Check generated source files
      checkFilesExist(path.join(pluginName, 'src', 'bin/index.ts'));
      checkFilesExist(path.join(pluginName, 'src', 'stack/app.ts'));
    }).not.toThrow();
  }, 100000);
});
