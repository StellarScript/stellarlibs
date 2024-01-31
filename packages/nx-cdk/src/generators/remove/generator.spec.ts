import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

describe('remove generator', () => {
  beforeEach(() => {
    createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    expect(1).toBeDefined();
  });
});
