import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import applicationGenerator from './generator';
import { ApplicationGeneratorSchema } from './schema';

describe('Application Generator', () => {
  let tree: Tree;
  const options: ApplicationGeneratorSchema = { name: 'testapp' };

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
    const _projectName = `${_options.directory}-${_options.name}`;

    await applicationGenerator(tree, _options);
    const config = await readProjectConfiguration(tree, _projectName);
    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
  });
});
