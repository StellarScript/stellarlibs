import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';
import { joinPathFragments } from '@nx/devkit';

describe('"@stellarlibs/nx-cdk" Library Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
      await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
   });

   describe('Generate Library', () => {
      it('generate library with duplicate name (error)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --test none`);

         expect(() => checkFilesExist(joinPathFragments(pluginName))).not.toThrow();
         expect(async () => {
            return await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --test none`);
         }).rejects.toThrow();
      }, 100000);

      it('generate library', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --test none`);

         expect(() => {
            checkFilesExist(joinPathFragments(pluginName));
            checkFilesExist(joinPathFragments(pluginName, 'src', 'construct.ts'));
            checkFilesExist(joinPathFragments(pluginName, 'tsconfig.json'));
         }).not.toThrow();
      }, 100000);

      it('generate library with custom directory', async () => {
         const pluginName = uniq('aws-cdk');
         const pluginDirectory = uniq('subdir');

         await runNxCommandAsync(
            `generate @stellarlibs/nx-cdk:lib ${pluginName} --directory ${pluginDirectory} --test none`
         );
         expect(() => checkFilesExist(joinPathFragments(pluginDirectory, pluginName))).not.toThrow();
      }, 100000);
   });

   describe('Generate Library Test Runner', () => {
      it('generate library with none test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --test none`);
         expect(() => {
            checkFilesExist(joinPathFragments('jest.config.ts'));
            checkFilesExist(joinPathFragments('tsconfig.spec.json'));
         }).toThrow();
      }, 100000);

      it('generate library with jest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --test jest`);

         expect(() => {
            checkFilesExist(joinPathFragments(pluginName));
            checkFilesExist(joinPathFragments(pluginName, 'jest.config.ts'));
            checkFilesExist(joinPathFragments(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);

      it('generate library with vitest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --test vitest`);
         expect(() => {
            checkFilesExist(joinPathFragments(pluginName));
            checkFilesExist(joinPathFragments(pluginName, 'vitest.config.ts'));
            checkFilesExist(joinPathFragments(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);
   });
});
