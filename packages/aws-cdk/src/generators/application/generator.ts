import { type Tree } from '@nx/devkit';

import generator from '../shared/generator';
import { ProjectType } from '../../util/enums';
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
