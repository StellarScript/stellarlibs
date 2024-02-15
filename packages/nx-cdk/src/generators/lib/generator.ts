import { Tree } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

import appGenerator from '../app/generator';
import { LibGeneratorSchema } from './schema';

export async function libGenerator(tree: Tree, options: LibGeneratorSchema) {
  return await appGenerator(tree, options, ProjectType.Library);
}

export default libGenerator;
