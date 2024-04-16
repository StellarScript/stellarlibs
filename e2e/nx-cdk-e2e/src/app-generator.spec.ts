import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';
import { joinPathFragments } from '@nx/devkit';

describe('"@stellarlibs/nx-cdk" Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
      await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
   });

   describe('Generate Application', () => {
      it('generate application with duplicate name (error)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --test none`);

         expect(() => checkFilesExist(joinPathFragments(pluginName))).not.toThrow();
         expect(async () => {
            return await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --test none`);
         }).rejects.toThrow();
      }, 100000);

      it('generate application', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --test none`);

         expect(() => {
            // check generated application directory
            checkFilesExist(joinPathFragments(pluginName));
            checkFilesExist(joinPathFragments(pluginName, 'cdk.json'));
            checkFilesExist(joinPathFragments(pluginName, 'tsconfig.json'));
            // Check generated source files
            checkFilesExist(joinPathFragments(pluginName, 'src', 'bin/index.ts'));
            checkFilesExist(joinPathFragments(pluginName, 'src', 'stack/app.ts'));
         }).not.toThrow();
      }, 100000);

      it('generate application with custom directory', async () => {
         const pluginName = uniq('aws-cdk');
         const pluginDirectory = uniq('subdir');

         await runNxCommandAsync(
            `generate @stellarlibs/nx-cdk:app ${pluginName} --directory ${pluginDirectory} --test none`
         );
         expect(() => checkFilesExist(joinPathFragments(pluginDirectory, pluginName))).not.toThrow();
      }, 100000);
   });

   describe('Generate Application Test Runner', () => {
      it('generate application with none test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --test none`);
         expect(() => checkFilesExist(joinPathFragments('tsconfig.spec.json'))).toThrow();
         expect(() => checkFilesExist(joinPathFragments('jest.config.ts'))).toThrow();
      }, 100000);

      it('generate application with jest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --test jest`);

         expect(() => {
            checkFilesExist(joinPathFragments(pluginName));
            checkFilesExist(joinPathFragments(pluginName, 'jest.config.ts'));
            checkFilesExist(joinPathFragments(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);

      it('generate application with vitest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --test vitest`);
         expect(() => {
            checkFilesExist(joinPathFragments(pluginName));
            checkFilesExist(joinPathFragments(pluginName, 'vitest.config.ts'));
            checkFilesExist(joinPathFragments(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);
   });
});
