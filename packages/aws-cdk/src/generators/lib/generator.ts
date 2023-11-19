import { type Tree } from '@nx/devkit';

import { LibGeneratorSchema } from './schema';
import { ProjectType } from '../../util/enums';
import generator from '../shared/generator';

export default async function applicationGenerator(
  tree: Tree,
  schema: LibGeneratorSchema
) {
  return await generator<LibGeneratorSchema>(tree, schema, ProjectType.Library);
}
