import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

describe('app generator', () => {
   beforeEach(() => {
      createTreeWithEmptyWorkspace();
   });

   it('should run successfully', async () => {
      expect(1).toBe(1);
   });
});
