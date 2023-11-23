import { type Tree, readProjectConfiguration } from '@nx/devkit';

import {
  ProjectType,
  removeTsConfigPath,
  removeDirectoryRecursively,
} from '@aws-nx/utils';
import { RemoveGeneratorSchema } from './schema';

export default async function removeGenerator(
  tree: Tree,
  options: RemoveGeneratorSchema
) {
  const config = readProjectConfiguration(tree, options.name);

  if (config.projectType === ProjectType.Library) {
    removeTsConfigPath(tree, options.name);
  }

  removeDirectoryRecursively(tree, config.root);
}
