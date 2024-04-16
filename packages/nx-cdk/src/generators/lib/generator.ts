import type { Tree } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

import { LibGeneratorSchema } from './schema';
import { generateApplication } from '../app/generator';

export async function libGenerator(tree: Tree, options: LibGeneratorSchema) {
   return await generateApplication(tree, ProjectType.Library, options);
}

export default libGenerator;
