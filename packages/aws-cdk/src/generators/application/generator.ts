import * as path from 'path';
import { type Tree, type GeneratorCallback, formatFiles } from '@nx/devkit';
import {
  ProjectType,
  GeneratorTasks,
  addIgnoreFileName,
} from '@stellar-libs/utils';

import {
  addDependencies,
  normalizeOptions,
  JestConfiguration,
  lintingConfiguration,
  projectConfiguration,
} from '../shared/generator';
import { ApplicationGeneratorSchema } from './schema';

/**
 *
 * @param tree
 * @param schema
 * @description Main generator for the application generator
 */
export default async function libraryGenerator<
  T extends ApplicationGeneratorSchema
>(tree: Tree, schema: T): Promise<GeneratorCallback> {
  const projectType = ProjectType.Application;
  const tasks = new GeneratorTasks();

  const options = await normalizeOptions(tree, projectType, schema);
  const appFilesDir = path.join(__dirname, 'files', 'app');
  projectConfiguration(tree, appFilesDir, projectType, options);

  // Jest
  const filePath = path.join(__dirname, 'files/unitTest');
  const jestTask = await JestConfiguration(tree, { ...options, filePath });
  tasks.register(jestTask);

  // Eslint
  const lintTask = await lintingConfiguration(tree, options);
  tasks.register(lintTask);

  // Gitignore
  addIgnoreFileName(tree, '# AWS CDK', ['cdk.out']);
  tasks.register(addDependencies(tree));

  await formatFiles(tree);
  return tasks.runInSerial();
}
