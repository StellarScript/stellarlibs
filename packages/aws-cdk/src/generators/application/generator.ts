import { type Tree } from '@nx/devkit';
import { ProjectType } from '@aws-nx/utils';

import generator from '../shared/generator';
import { ApplicationGeneratorSchema } from './schema';

export default async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  return await generator<ApplicationGeneratorSchema>(
    tree,
    schema,
    ProjectType.Application
  );
}
