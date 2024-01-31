import type { Tree } from '@nx/devkit';
import { ProjectType } from '@stellar-libs/utils';

import { LibGeneratorSchema } from './schema';
import { generatePackage } from '../../shared/generator/generator';

export default async function libGenerator(
  tree: Tree,
  schema: LibGeneratorSchema
) {
  await generatePackage(tree, schema, ProjectType.Library);
}
