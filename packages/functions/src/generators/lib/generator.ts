import type { Tree } from '@nx/devkit';
import { LibGeneratorSchema } from './schema';
import { ProjectType } from '../shared/config';
import functionsGenerator from '../shared/generator';

export default async function libGenerator(
  tree: Tree,
  schema: LibGeneratorSchema
) {
  await functionsGenerator(tree, schema, ProjectType.Application);
}
