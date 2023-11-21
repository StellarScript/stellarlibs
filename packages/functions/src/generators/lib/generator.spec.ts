import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import libraryGenerator from './generator';
import { LibGeneratorSchema } from './schema';

describe('App Generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('Generate Lib', () => {
    it('thorw error if duplicate lib', async () => {
      const options: LibGeneratorSchema = {
        name: 'testlib',
      };
      await libraryGenerator(tree, options);
      expect(() => libraryGenerator(tree, options)).rejects.toThrow();
    });

    it('generate library', async () => {
      const options: LibGeneratorSchema = {
        name: 'testlib',
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

  describe('Generate Lib with Arguments', () => {
    it('bundle argument', async () => {
      const options = { name: 'testapp', bundle: true };
      await libraryGenerator(tree, options);

      const config = readProjectConfiguration(tree, options.name);
      expect(config.targets['build'].options.bundle).toBeTruthy();
    });

    it('tags argument', async () => {
      const options = { name: 'testapp', tag: 'test-tag' };
      await libraryGenerator(tree, options);

      const config = readProjectConfiguration(tree, options.name);
      expect(config.tags.includes(options.tag)).toBeTruthy();
    });
  });
});
