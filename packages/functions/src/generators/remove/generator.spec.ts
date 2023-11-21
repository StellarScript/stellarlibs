import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import removeGenerator from './generator';
import libraryGenerator from '../lib/generator';
import applicationGenerator from '../app/generator';
import functionGenerator from '../function/generator';

describe('Remove Generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('Remove App/Lib', () => {
    it('throw error remove nonexistent app', async () => {
      const options = {
        name: 'testapp',
      };
      expect(() => removeGenerator(tree, options)).rejects.toThrow();
    });

    it('remove app', async () => {
      const options = {
        name: 'testapp',
      };
      await applicationGenerator(tree, options);

      const config = await readProjectConfiguration(tree, options.name);
      expect(tree.exists(config.sourceRoot)).toBeTruthy();

      await removeGenerator(tree, options);
      expect(tree.exists(config.sourceRoot)).toBeFalsy();
    });

    it('remove lib', async () => {
      const options = {
        name: 'testlib',
      };
      await libraryGenerator(tree, options);

      const config = await readProjectConfiguration(tree, options.name);
      expect(tree.exists(config.sourceRoot)).toBeTruthy();

      await removeGenerator(tree, options);
      expect(tree.exists(config.sourceRoot)).toBeFalsy();
    });
  });

  describe('Remove Function', () => {
    it('remove nonexistent function', async () => {
      const options = {
        project: 'testlib',
        functionName: 'testfunc',
      };

      await applicationGenerator(tree, {
        name: options.project,
      });
      const config = await readProjectConfiguration(tree, options.project);

      expect(tree.exists(config.sourceRoot)).toBeTruthy();
      expect(() =>
        removeGenerator(tree, {
          project: options.project,
          function: 'none-existing',
        })
      ).rejects.toThrow();
    });

    it('remove function within project', async () => {
      const options = {
        project: 'testlib',
        functionName: 'testfunc',
      };

      await applicationGenerator(tree, {
        name: options.project,
      });

      await functionGenerator(tree, {
        name: options.functionName,
        project: options.project,
      });

      const config = await readProjectConfiguration(tree, options.project);

      // App and function should exist
      expect(tree.exists(config.sourceRoot)).toBeTruthy();
      expect(
        tree.exists(`${config.sourceRoot}/${options.functionName}`)
      ).toBeTruthy();

      // Remove function
      await removeGenerator(tree, {
        project: options.project,
        function: options.functionName,
      });

      // Project should exist, but function should not
      expect(tree.exists(config.sourceRoot)).toBeTruthy();
      expect(
        tree.exists(`${config.sourceRoot}/${options.functionName}`)
      ).toBeFalsy();
    });
  });
});
