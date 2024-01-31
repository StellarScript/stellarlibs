import { cleanLocalLibs, ensureNxLocalLibs } from '@stellarlibs/utils';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nx/plugin/testing';
import path = require('path');

describe('"@stellarlibs/nx-cdk" Generators', () => {
  beforeAll(() => {
    ensureNxLocalLibs();
    ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
  });

  afterAll(() => {
    cleanLocalLibs();
  });

  describe('Application Generator', () => {
    it('generate application with duplicate name (error)', async () => {
      const pluginName = uniq('nx-cdk');
      await runNxCommandAsync(`generate @stellarlibs/nx-cdk:application ${pluginName}`);

      expect(() => checkFilesExist(path.join(pluginName)));
      expect(async () => {
        return await runNxCommandAsync(`generate @stellarlibs/nx-cdk:application ${pluginName}`);
      }).rejects.toThrow();
    }, 100000);
  });
});
