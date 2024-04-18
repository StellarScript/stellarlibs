import { joinPathFragments } from '@nx/devkit';
import { checkFilesExist, ensureNxProject, runNxCommandAsync, uniq } from '@nx/plugin/testing';

describe('"@stellarlibs/nest-serverless" Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nest-serverless');
      await ensureNxProject('@stellarlibs/nest-serverless', 'dist/packages/nest-serverless');
   });

   describe('Generate Application', () => {
      it('generate application with duplicate name (error)', async () => {
         const pluginName = uniq('nest-serverles');
         const projectName = uniq('serverless');
         await runNxCommandAsync(
            `generate @stellarlibs/nest-serverless:app ${pluginName} --project ${projectName} --test none`
         );

         expect(() => checkFilesExist(joinPathFragments(projectName))).not.toThrow();
         expect(async () => {
            return await runNxCommandAsync(
               `generate @stellarlibs/nest-serverless:app ${pluginName} --project ${projectName} --test none`
            );
         }).rejects.toThrow();
      }, 100000);
   });
});
