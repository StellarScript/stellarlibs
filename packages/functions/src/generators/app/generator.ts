import type { Tree } from '@nx/devkit';
import { ProjectType } from '@aws-nx/utils';
import { AppGeneratorSchema } from './schema';
import functionsGenerator from '../shared/generator';

export default async function appGenerator(
  tree: Tree,
  schema: AppGeneratorSchema
) {
  await functionsGenerator(tree, schema, ProjectType.Application);
}
