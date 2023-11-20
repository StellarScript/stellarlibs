import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import functionGenerator from './generator';
import { FunctionGeneratorSchema } from './schema';

describe('function generator', () => {
  let tree: Tree;
  const options: FunctionGeneratorSchema = { name: 'test', project: '' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await functionGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
