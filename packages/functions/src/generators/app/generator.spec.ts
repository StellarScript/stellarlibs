import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import applicationGenerator from './generator';
import { AppGeneratorSchema } from './schema';

describe('App Generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('Generate App', () => {
    it('thorw error if duplicate app', async () => {
      const options: AppGeneratorSchema = {
        name: 'testapp',
      };
      await applicationGenerator(tree, options);
      expect(() => applicationGenerator(tree, options)).rejects.toThrow();
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

    it('generate app in directory directory', async () => {
      const appName = 'testxx';
      const directory = 'dir';

      await applicationGenerator(tree, { name: appName, directory });
      const config = await readProjectConfiguration(tree, appName);

      expect(config).toBeDefined();
      expect(tree.exists(config.sourceRoot)).toBeTruthy();
      expect(tree.exists(config.sourceRoot)).toBeTruthy();
    });
  });

  describe('Generate App with Arguments', () => {
    it('bundle argument', async () => {
      const options = { name: 'testapp', bundle: true };
      await applicationGenerator(tree, options);

      const config = readProjectConfiguration(tree, options.name);
      expect(config.targets['build'].options.bundle).toBeTruthy();
    });

    it('tags argument', async () => {
      const options = { name: 'testapp', tag: 'test-tag' };
      await applicationGenerator(tree, options);

      const config = readProjectConfiguration(tree, options.name);
      expect(config.tags.includes(options.tag)).toBeTruthy();
    });
  });
});
