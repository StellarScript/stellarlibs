import type { Tree } from '@nx/devkit';
import { ProjectType } from '@aws-nx/utils';
import { AppGeneratorSchema } from './schema';
import { createApplication } from '../shared/generator';

export default async function appGenerator(
  tree: Tree,
  schema: AppGeneratorSchema
) {
  await createApplication(tree, schema, ProjectType.Application);
}
