import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';
import { ProjectType } from '@stellar-libs/utils';

import functionGenerator from './generator';
import { FunctionGeneratorSchema } from './schema';
import { generatePackage } from '../../shared/generator/generator';

describe('function generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('throw error when project does not exists', async () => {
    const options: FunctionGeneratorSchema = {
      name: 'functionone',
      project: 'projectone',
    };
    expect(() => functionGenerator(tree, options)).rejects.toThrow();
  });

  it('generate function', async () => {
    const projectName = 'projectone';
    const functionName = 'functionone';

    await generatePackage(tree, { name: projectName }, ProjectType.Application);

    await functionGenerator(tree, {
      name: functionName,
      project: projectName,
    });

    const config = await readProjectConfiguration(tree, projectName);
    expect(tree.exists(`${config.sourceRoot}/${functionName}`)).toBeTruthy();
    expect(config).toBeDefined();
  });
});
