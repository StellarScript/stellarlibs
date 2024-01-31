import { Tree } from '@nx/devkit';
import { AppGeneratorSchema } from './schema';

export default async function appGenerator(tree: Tree, options: AppGeneratorSchema) {
  normailzeOptions(tree);
}

export function normailzeOptions(schema: Tree) {
  console.log('------', schema);
}
