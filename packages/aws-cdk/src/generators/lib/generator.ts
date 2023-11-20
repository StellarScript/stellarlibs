import { type Tree } from '@nx/devkit';
import { ProjectType } from '@aws-nx/utils';

import generator from '../shared/generator';
import { LibGeneratorSchema } from './schema';

export default async function applicationGenerator(
  tree: Tree,
  schema: LibGeneratorSchema
) {
  return await generator<LibGeneratorSchema>(tree, schema, ProjectType.Library);
}
