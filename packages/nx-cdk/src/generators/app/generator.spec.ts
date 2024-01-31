import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import applicationGenerator from './generator';
import { AppGeneratorSchema } from './schema';

describe('Application Generator', () => {
  let tree: Tree;
  const options: AppGeneratorSchema = { name: 'testapp' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('generate application', async () => {
    await applicationGenerator(tree, options);
    const config = await readProjectConfiguration(tree, options.name);
    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
  });

  it('generate application with directory argument', async () => {
    const directory = 'dir';
    const _options = { ...options, directory };

    await applicationGenerator(tree, _options);
    const config = await readProjectConfiguration(tree, _options.name);
    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
  });
});
