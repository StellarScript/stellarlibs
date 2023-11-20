import type { Tree } from '@nx/devkit';
import { readProjectConfiguration } from '@nx/devkit';
import { removeDirectoryRecursively } from '@aws-nx/utils';
import { RemoveGeneratorSchema } from './schema';

export default async function removeGenerator(
  tree: Tree,
  options: RemoveGeneratorSchema
) {
  const config = readProjectConfiguration(tree, options.name);
  removeDirectoryRecursively(tree, config.root);
}
