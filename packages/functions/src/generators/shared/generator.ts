import { Tree } from '@nx/devkit';
import { GeneratorSchema } from './schema';

export default function functionsGenerator(
  tree: Tree,
  schema: GeneratorSchema,
  projectType: any
) {
  const options = normalizeOptions(tree, schema, projectType);
  await createApplication(tree, options, projectType);
}
