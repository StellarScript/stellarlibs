import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

describe('Application Generator', () => {
   beforeEach(() => {
      createTreeWithEmptyWorkspace();
   });

   it('should run successfully', async () => {
      expect(1).toBe(1);
   });
});
