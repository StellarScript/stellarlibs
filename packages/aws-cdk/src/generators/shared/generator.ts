import * as path from 'path';
import { jestInitGenerator } from '@nx/jest';
import type { Tree, GeneratorCallback } from '@nx/devkit';

import {
  names,
  formatFiles,
  addProjectConfiguration,
  addDependenciesToPackageJson,
} from '@nx/devkit';

import {
  ProjectType,
  GeneratorTasks,
  addProjectFiles,
  updateLintConfig,
  lintingGenerator,
  addIgnoreFileName,
  updateConfiguration,
  workspaceDirectory,
  toArray,
} from '@aws-nx/utils';

import {
  CDK_VERSION,
  TSJEST_VERSION,
  CONSTRUCTS_VERSION,
  SOURCE_MAP_VERSION,
} from '../../util/constants';
import { GeneratorSchema } from './schema';
import { createConfiguration } from './config';

interface NormalizedOptions {
  name: string;
  linting: boolean;
  unitTest: boolean;
  projectName: string;
  projectRoot: string;
  tags: string[];
}

/**
 *
 * @param tree
 * @param schema
 * @description Main generator for the application generator
 * @returns
 */
export default async function generate<T extends GeneratorSchema>(
  tree: Tree,
  schema: T,
  projectType: ProjectType
): Promise<GeneratorCallback> {
  const tasks = new GeneratorTasks();

  const options = normalizeOptions(tree, projectType, schema);
  projectConfiguration(tree, projectType, options);

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

/**
 *
 * @param tree
 * @param options
 * @description Linting configuration
 * @returns
 */
async function lintingConfiguration(
  tree: Tree,
  options: NormalizedOptions
): Promise<GeneratorCallback | undefined> {
  if (!options.linting) {
    return;
  }
  const lintTask = await lintingGenerator(tree, options);
  updateLintConfig(tree, options);
  return lintTask;
}

/**
 *
 * @param tree
 * @param options
 * @description  Generate jest configuration
 * @returns
 */
async function JestConfiguration(
  tree: Tree,
  options: NormalizedOptions
): Promise<GeneratorCallback | undefined> {
  if (!options.unitTest) {
    return;
  }
  const jestTask = await jestInitGenerator(tree, {
    js: true,
    compiler: 'tsc',
    babelJest: false,
    skipPackageJson: false,
    testEnvironment: 'node',
  });
  addProjectFiles(tree, path.join(__dirname, 'files/unitTest'), options);
  return jestTask;
}

/**
 *
 * @param tree
 * @param options
 * @description Creates the project configuration for the application
 */
function projectConfiguration(
  tree: Tree,
  projectType: ProjectType,
  options: NormalizedOptions
): void {
  const config = createConfiguration(projectType, options);
  addProjectConfiguration(tree, options.projectName, config);

  updateConfiguration(tree, options.projectName, (workspace) => {
    workspace.tags = options.tags;
    return workspace;
  });
  addProjectFiles(tree, path.join(__dirname, 'files/app'), options);
}

/**
 *
 * @param tree
 * @description Adds the dependencies to the package.json
 * @returns
 */
function addDependencies(tree: Tree): GeneratorCallback {
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {
    'aws-cdk': CDK_VERSION,
    'aws-cdk-lib': CDK_VERSION,
    constructs: CONSTRUCTS_VERSION,
    'source-map-support': SOURCE_MAP_VERSION,
    'ts-jest': TSJEST_VERSION,
  };
  return addDependenciesToPackageJson(tree, dependencies, devDependencies);
}

/**
 *
 * @param tree
 * @param schema
 * @description Normalizes the options for the application generator
 * @returns
 */
export function normalizeOptions<T extends GeneratorSchema>(
  tree: Tree,
  projectType: ProjectType,
  schema: T
): NormalizedOptions {
  const name = names(schema.name).fileName;
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const workspaceDir = workspaceDirectory(tree, projectType);
  const projectRoot = `${workspaceDir}/${projectDirectory}`;

  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const linting = schema.linting === undefined ?? true;
  const unitTest = schema.jest === undefined ?? true;

  return {
    name,
    linting,
    unitTest,
    projectName,
    projectRoot,
    tags: toArray(schema.tag),
  };
}
