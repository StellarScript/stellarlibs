import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import applicationGenerator from './generator';
import { AppGeneratorSchema } from './schema';

describe('App Generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('generate application', async () => {
    const options: AppGeneratorSchema = {
      name: 'testapp',
    };
    await applicationGenerator(tree, options);
    const config = await readProjectConfiguration(tree, options.name);

    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
  });

  it('option directory', async () => {
    const appName = 'testxx';
    const directory = 'dir';

    await applicationGenerator(tree, { name: appName, directory });
    const config = await readProjectConfiguration(tree, appName);

    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
    expect(tree.exists(`${directory}/${appName}`)).toBeTruthy();
  });
});
