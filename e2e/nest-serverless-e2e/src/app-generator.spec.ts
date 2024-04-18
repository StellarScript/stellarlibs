import { ensureNxProject } from '@nx/plugin/testing';

describe('"@stellarlibs/nest-serverless" Generators', () => {
   beforeAll(async () => {
      await ensureNxProject('@stellarlibs/utils', 'dist/libs/nest-serverless');
      await ensureNxProject('@stellarlibs/nest-serverless', 'dist/packages/nest-serverless');
   });

   describe('Generate Application', () => {
      it('generate application with duplicate name (error)', async () => {
         expect(true).toBeTruthy();
      });
   });
});
