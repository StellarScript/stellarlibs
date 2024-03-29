import * as path from 'path';
import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';

describe('"@stellarlibs/nx-cdk" Library Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
      await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
   });

   describe('Generate Library', () => {
      it('generate library with duplicate name (error)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner none`);

         expect(() => checkFilesExist(path.join(pluginName))).not.toThrow();
         expect(async () => {
            return await runNxCommandAsync(
               `generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner none`
            );
         }).rejects.toThrow();
      }, 100000);

      it('generate library', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner none`);

         expect(() => {
            checkFilesExist(path.join(pluginName));
            checkFilesExist(path.join(pluginName, 'src', 'construct.ts'));
            checkFilesExist(path.join(pluginName, 'tsconfig.json'));
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
   });

   describe('Generate Library Test Runner', () => {
      it('generate library with none test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner none`);
         expect(() => {
            checkFilesExist(path.join('jest.config.ts'));
            checkFilesExist(path.join('tsconfig.spec.json'));
         }).toThrow();
      }, 100000);

      it('generate library with jest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner jest`);

         expect(() => {
            checkFilesExist(path.join(pluginName));
            checkFilesExist(path.join(pluginName, 'jest.config.ts'));
            checkFilesExist(path.join(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);

      it('generate library with vitest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:lib ${pluginName} --testRunner vitest`);
         expect(() => {
            checkFilesExist(path.join(pluginName));
            checkFilesExist(path.join(pluginName, 'vitest.config.ts'));
            checkFilesExist(path.join(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);
   });
});
