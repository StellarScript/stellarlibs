import { Tree, readProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import { configureGenerator } from './generator';
import { ConfigureGeneratorSchema } from './schema';

function createAppWorkspace(config: { name: string; projectType: string }) {
  const tree = createTreeWithEmptyWorkspace();
  tree.write(
    'project.json',
    JSON.stringify({
      name: config.name,
      projectType: config.projectType || 'application',
      targets: {},
    })
  );
  return tree;
}

describe('Configure Generator', () => {
  let tree: Tree;
  const options: ConfigureGeneratorSchema = { name: 'test' };

  beforeAll(() => {
    tree = createAppWorkspace({
      name: options.name,
      projectType: 'application',
    });
  });

  it('configure application', async () => {
    const config_before = readProjectConfiguration(tree, options.name);
    expect(Object.keys(config_before.targets)).toHaveLength(0);

    await configureGenerator(tree, options);
    const config_after = readProjectConfiguration(tree, options.name);
    expect(Object.keys(config_after.targets)).toEqual([
      'auth',
      'tag',
      'push',
      'docker-build',
    ]);
  }, 100000);

  it('validate dockerfile created', async () => {
    expect(tree.exists('Dockerfile')).toBeTruthy();
  });
});
