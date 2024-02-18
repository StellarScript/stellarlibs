import type { Tree } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

import { LibGeneratorSchema } from './schema';
import { generateApplication } from '../app/generator';

export async function libGenerator(tree: Tree, options: LibGeneratorSchema) {
   return await generateApplication(tree, options, ProjectType.Library);
}

export default libGenerator;
