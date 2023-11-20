import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import libraryGenerator from './generator';
import { LibGeneratorSchema } from './schema';

describe('App Generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('generate library', async () => {
    const options: LibGeneratorSchema = {
      name: 'testapp',
    };
    await libraryGenerator(tree, options);
    const config = await readProjectConfiguration(tree, options.name);

    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
  });

  it('option directory', async () => {
    const appName = 'testxx';
    const directory = 'dir';

    await libraryGenerator(tree, { name: appName, directory });
    const config = await readProjectConfiguration(tree, appName);

    expect(config).toBeDefined();
    expect(tree.exists(config.sourceRoot)).toBeTruthy();
    expect(tree.exists(`${directory}/${appName}`)).toBeTruthy();
  });
});
