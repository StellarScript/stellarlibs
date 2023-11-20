import type { Tree } from '@nx/devkit';
import { AppGeneratorSchema } from './schema';
import { ProjectType } from '../shared/config';
import functionsGenerator from '../shared/generator';

export default async function appGenerator(
  tree: Tree,
  schema: AppGeneratorSchema
) {
  await functionsGenerator(tree, schema, ProjectType.Application);
}
