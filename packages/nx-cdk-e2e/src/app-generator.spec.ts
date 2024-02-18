import * as path from 'path';
import { uniq, checkFilesExist, ensureNxProject, runNxCommandAsync } from '@nx/plugin/testing';

describe('"@stellarlibs/nx-cdk" Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nx-cdk');
      await ensureNxProject('@stellarlibs/nx-cdk', 'dist/packages/nx-cdk');
   });

   describe('Generate Application', () => {
      it('generate application with duplicate name (error)', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);

         expect(() => checkFilesExist(path.join(pluginName))).not.toThrow();
         expect(() => {
            return runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);
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

   describe('Generate Application Test Runner', () => {
      it('generate application with none test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner none`);
         expect(() => checkFilesExist(path.join('tsconfig.spec.json'))).toThrow();
         expect(() => checkFilesExist(path.join('jest.config.ts'))).toThrow();
      }, 100000);

      it('generate application with jest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner jest`);

         expect(() => {
            checkFilesExist(path.join(pluginName));
            checkFilesExist(path.join(pluginName, 'jest.config.ts'));
            checkFilesExist(path.join(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);

      it('generate application with vitest test runner', async () => {
         const pluginName = uniq('aws-cdk');
         await runNxCommandAsync(`generate @stellarlibs/nx-cdk:app ${pluginName} --testRunner vitest`);
         expect(() => {
            checkFilesExist(path.join(pluginName));
            checkFilesExist(path.join(pluginName, 'vitest.config.ts'));
            checkFilesExist(path.join(pluginName, 'tsconfig.spec.json'));
         }).not.toThrow();
      }, 100000);
   });
});
