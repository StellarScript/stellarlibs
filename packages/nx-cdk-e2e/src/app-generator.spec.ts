import * as path from 'path';
import {
  uniq,
  listFiles,
  checkFilesExist,
  ensureNxProject,
  runNxCommandAsync,
} from '@nx/plugin/testing';

describe('@stellarlibs/nx-cdk" Generators', () => {
  beforeEach(async () => {
    await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
    await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
  });

  describe('Generate Application', () => {
    it('generate application with duplicate name (error)', async () => {
      const pluginName = uniq('aws-cdk');
      await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);

      expect(() => checkFilesExist(path.join(pluginName))).not.toThrow();
    }, 100000);
  });
});
