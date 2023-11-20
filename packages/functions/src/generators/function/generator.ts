import { Tree, names, readProjectConfiguration } from '@nx/devkit';
import { FunctionGeneratorSchema } from './schema';

export default async function functionGenerator(
  tree: Tree,
  schema: FunctionGeneratorSchema
) {
  const options = normalizeOptions(tree, schema);
  console.log('-----options', options);
}

function normalizeOptions(tree: Tree, schema: FunctionGeneratorSchema) {
  const config = readProjectConfiguration(tree, schema.project);

  const root = config.root;
  const projectRoot = config.sourceRoot;
  const name = names(schema.name).fileName;

  return {
    name,
    root,
    projectRoot,
  };
}
