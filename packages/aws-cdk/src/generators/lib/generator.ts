import * as path from 'path';
import {
  type Tree,
  type GeneratorCallback,
  readJson,
  updateJson,
  formatFiles,
} from '@nx/devkit';
import { ProjectType, GeneratorTasks, addIgnoreFileName } from '@aws-nx/utils';

import {
  addDependencies,
  normalizeOptions,
  JestConfiguration,
  lintingConfiguration,
  projectConfiguration,
  NormalizedOptions,
} from '../shared/generator';
import { LibGeneratorSchema } from './schema';

/**
 *
 * @param tree
 * @param schema
 * @description Main generator for the application generator
 */
export default async function libraryGenerator<T extends LibGeneratorSchema>(
  tree: Tree,
  schema: T
): Promise<GeneratorCallback> {
  const projectType = ProjectType.Library;
  const tasks = new GeneratorTasks();

  const options = normalizeOptions(tree, projectType, schema);

  const appFilesDir = path.join(__dirname, 'files');
  projectConfiguration(tree, appFilesDir, projectType, options);
  addTsConfigPaths(tree, options);

  // Jest
  const jestTask = await JestConfiguration(tree, options);
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

function addTsConfigPaths(tree: Tree, options: NormalizedOptions): void {
  const workspaceName = readJson(tree, 'package.json').name.split('/')[0];

  const projectRoot = `${options.projectRoot}/src/*`;
  const projectTarget = `${workspaceName}/${options.projectName}/*`;
  const libPackagePath = { [`${projectTarget}`]: [`${projectRoot}`] };

  updateJson(tree, 'tsconfig.base.json', (json) => {
    json.compilerOptions.paths = {
      ...libPackagePath,
      ...json.compilerOptions.paths,
    };
    return json;
  });
}
