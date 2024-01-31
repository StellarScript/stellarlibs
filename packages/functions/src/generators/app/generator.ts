import type { Tree } from '@nx/devkit';
import { ProjectType } from '@stellar-libs/utils';
import { AppGeneratorSchema } from './schema';
import { generatePackage } from '../../shared/generator/generator';

export default async function appGenerator(
  tree: Tree,
  schema: AppGeneratorSchema
) {
  await generatePackage(tree, schema, ProjectType.Application);
}
