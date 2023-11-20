import type { Tree } from '@nx/devkit';
import { ProjectType } from '@aws-nx/utils';

import { LibGeneratorSchema } from './schema';
import functionsGenerator from '../shared/generator';

export default async function libGenerator(
  tree: Tree,
  schema: LibGeneratorSchema
) {
  await functionsGenerator(tree, schema, ProjectType.Library);
}
