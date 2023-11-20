import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import removeGenerator from './generator';
import { RemoveGeneratorSchema } from './schema';
import applicationGenerator from '../application/generator';

describe('remove generator', () => {
  let tree: Tree;
  const options: RemoveGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('remove none existing application', async () => {
    expect(() => removeGenerator(tree, options)).rejects.toThrow();
  });

  it('remove application', async () => {
    await applicationGenerator(tree, options);
    const config = await readProjectConfiguration(tree, options.name);
    expect(tree.exists(config.sourceRoot)).toBeTruthy();

    await removeGenerator(tree, options);
    expect(tree.exists(config.sourceRoot)).toBeFalsy();
  });
});
