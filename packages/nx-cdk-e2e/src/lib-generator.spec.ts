import * as path from 'path';
import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';

describe('@stellarlibs/nx-cdk" Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
      await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
   });

   describe('Library Generator', () => {
      it('generate library with duplicate name (error)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner none`);

         expect(() => checkFilesExist(path.join(pluginName)));
         expect(async () => {
            return await runNxCommandAsync(
               `generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`
            );
         }).rejects.toThrow();
      }, 100000);

      it('generate library', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner none`);
         expect(() => {
            // check generated library directory
            checkFilesExist(path.join(pluginName));
            // Check generated config files
            checkFilesExist(path.join(pluginName, 'tsconfig.json'));
            checkFilesExist(path.join(pluginName, 'tsconfig.app.json'));

            checkFilesExist(path.join(pluginName, 'jest.config.ts'));
            checkFilesExist(path.join(pluginName, 'src', 'construct.ts'));
            expect(() => checkFilesExist(path.join(pluginName, 'cdk.json'))).toThrow();
         }).not.toThrow();
      }, 100000);

      it('generate library with custom directory', async () => {
         const pluginName = uniq('aws-cdk');
         const pluginDirectory = uniq('subdir');

         await runNxCommandAsync(
            `generate @stellarlibs/nx-cdk:lib ${pluginName} --directory ${pluginDirectory} --testRunner none`
         );
         expect(() => checkFilesExist(path.join(pluginDirectory, pluginName))).not.toThrow();
      }, 100000);

      it('generate lib with no jest unit test (test dir should not exist)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);
         expect(() => checkFilesExist(path.join(pluginName, 'test'))).toThrow();
      }, 100000);

      it('generate lib with jest unit test (test dir should not exist)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner jest`);
         expect(() => checkFilesExist(path.join(pluginName, 'test'))).not.toThrow();
      }, 100000);
   });
});
