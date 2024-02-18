import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { removeGenerator } from './generator';
import { RemoveGeneratorSchema } from './schema';

describe('remove generator', () => {
   let tree: Tree;
   const options: RemoveGeneratorSchema = { name: 'test' };

   beforeEach(() => {
      tree = createTreeWithEmptyWorkspace();
   });

   it('should run successfully', async () => {
      await removeGenerator(tree, options);
      const config = readProjectConfiguration(tree, 'test');
      expect(config).toBeDefined();
   });
});
