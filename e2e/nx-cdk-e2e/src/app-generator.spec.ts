import * as path from 'path';
import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';

describe('@stellarlibs/nx-cdk" Generators', () => {
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

    it('generate application', async () => {
      const pluginName = uniq('aws-cdk');
      await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName}`);
      expect(() => {
        // check generated application directory
        checkFilesExist(path.join(pluginName));
        // Check generated config files
        checkFilesExist(path.join(pluginName, 'cdk.json'));
        checkFilesExist(path.join(pluginName, 'tsconfig.json'));
        checkFilesExist(path.join(pluginName, 'tsconfig.app.json'));
        checkFilesExist(path.join(pluginName, 'jest.config.ts'));
        // Check generated source files
        checkFilesExist(path.join(pluginName, 'src', 'bin/index.ts'));
        checkFilesExist(path.join(pluginName, 'src', 'stack/app.ts'));
      }).not.toThrow();
    }, 100000);

    it('generate application with custom directory', async () => {
      const pluginName = uniq('aws-cdk');
      const pluginDirectory = uniq('subdir');

      await runNxCommandAsync(
        `generate @stellarlibs/nx-cdk:app ${pluginName} --directory ${pluginDirectory}`
      );
      expect(() => checkFilesExist(path.join(pluginDirectory, pluginName))).not.toThrow();
    }, 100000);

    it('generate application with no jest unit test (test dir should not exist)', async () => {
      const pluginName = uniq('aws-cdk');
      await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --jest false`);
      expect(() => checkFilesExist(path.join(pluginName, 'src/test'))).toThrow();
    }, 100000);
  });
});
