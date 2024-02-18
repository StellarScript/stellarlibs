import * as path from 'path';
import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';

describe('"@stellarlibs/nx-cdk" Remove Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
      await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
   });

   describe('Remove Generator', () => {
      const pluginName = uniq('aws-cdk-remove');

      it('remove none existing application (error)', async () => {
         const command = () => runNxCommandAsync(`generate @stellarlibs/nx-cdk:remove ${pluginName}`);
         expect(command).rejects.toThrow();
      }, 120000);

      it('generate application', async () => {
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);
         expect(() => checkFilesExist(pluginName)).not.toThrow();
      }, 120000);

      it('remove application', async () => {
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:remove ${pluginName}`);
         expect(() => checkFilesExist(path.join(pluginName, 'cdk.json'))).toThrow();
      }, 120000);
   });
});
