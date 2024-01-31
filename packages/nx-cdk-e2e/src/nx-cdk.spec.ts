import * as path from 'path';
import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';

describe('"@stellarlibs/nx-cdk" Generators', () => {
  beforeAll(async () => {
    await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
    await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
  });

  describe('Application Generator', () => {
    it('generate application with duplicate name (error)', async () => {
      const pluginName = uniq('aws-cdk');
      await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName}`);
      expect(() => checkFilesExist(path.join(pluginName)));
      expect(async () => {
        return await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName}`);
      }).rejects.toThrow();
    }, 100000);
  });
});
