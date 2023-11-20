import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import functionGenerator from './generator';
import { FunctionGeneratorSchema } from './schema';
import { createApplication } from '../../shared/generator/generator';
import { ProjectType } from '@aws-nx/utils';

describe('function generator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should throw error when project is not defined', async () => {
    const options: FunctionGeneratorSchema = {
      name: 'functionone',
      project: 'projectone',
    };
    expect(() => functionGenerator(tree, options)).rejects.toThrow();
  });

  it('should run successfully', async () => {
    const projectName = 'projectone';
    const functionName = 'functionone';

    await createApplication(
      tree,
      { name: projectName },
      ProjectType.Application
    );

    await functionGenerator(tree, {
      name: functionName,
      project: projectName,
    });

    const config = await readProjectConfiguration(tree, projectName);
    expect(config).toBeDefined();
  });
});
