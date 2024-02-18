import * as path from 'path';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nx/plugin/testing';

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
         expect(async () => {
            return await runNxCommandAsync(
               `generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`
            );
         }).rejects.toThrow();
      }, 100000);

      it('generate application', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);

         expect(() => {
            // check generated application directory
            checkFilesExist(path.join(pluginName));
            checkFilesExist(path.join(pluginName, 'cdk.json'));
            checkFilesExist(path.join(pluginName, 'tsconfig.json'));
            // Check generated source files
            checkFilesExist(path.join(pluginName, 'src', 'bin/index.ts'));
            checkFilesExist(path.join(pluginName, 'src', 'stack/app.ts'));
         }).not.toThrow();
      }, 100000);

      it('generate application with custom directory', async () => {
         const pluginName = uniq('aws-cdk');
         const pluginDirectory = uniq('subdir');

         await runNxCommandAsync(
            `generate @stellarlibs/nx-cdk:app ${pluginName} --directory ${pluginDirectory} --testRunner none`
         );
         expect(() => checkFilesExist(path.join(pluginDirectory, pluginName))).not.toThrow();
      }, 100000);
   });
});
