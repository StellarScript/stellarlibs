import { jestInitGenerator } from '@nx/jest';
import type { Tree, GeneratorCallback } from '@nx/devkit';

import {
  addProjectConfiguration,
  addDependenciesToPackageJson,
} from '@nx/devkit';

import {
  toArray,
  ProjectType,
  classInstance,
  addProjectFiles,
  updateLintConfig,
  lintingGenerator,
  updateConfiguration,
  workspaceDirectory,
} from '@aws-nx/utils';

import {
  CDK_VERSION,
  TSJEST_VERSION,
  CONSTRUCTS_VERSION,
  SOURCE_MAP_VERSION,
} from '../../util/constants';
import { GeneratorSchema } from './schema';
import { GeneratorOptions } from './options';
import { createConfiguration } from './config';

export interface NormalizedOptions {
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
 * @param options
 * @description Linting configuration
 * @returns
 */
export async function lintingConfiguration(
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
export async function JestConfiguration(
  tree: Tree,
  options: NormalizedOptions & { filePath?: string }
): Promise<GeneratorCallback | undefined> {
  if (!options.unitTest) {
    return;
  }
  const jestTask = await jestInitGenerator(tree, {
    js: false,
    compiler: 'tsc',
    babelJest: false,
    skipPackageJson: false,
    testEnvironment: 'node',
  });
  if (options.filePath) {
    addProjectFiles(tree, options.filePath, options);
  }
  return jestTask;
}

/**
 *
 * @param tree
 * @param options
 * @description Creates the project configuration for the application
 */
export function projectConfiguration(
  tree: Tree,
  fileDir: string,
  projectType: ProjectType,
  options: NormalizedOptions
): void {
  const config = createConfiguration(projectType, options);
  addProjectConfiguration(tree, options.projectName, config);

  updateConfiguration(tree, options.projectName, (workspace) => {
    workspace.tags = options.tags;
    return workspace;
  });
  addProjectFiles(tree, fileDir, options);
}

/**
 *
 * @param tree
 * @description Adds the dependencies to the package.json
 * @returns
 */
export function addDependencies(tree: Tree): GeneratorCallback {
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
export async function normalizeOptions<T extends GeneratorSchema>(
  tree: Tree,
  projectType: ProjectType,
  schema: T
): Promise<NormalizedOptions> {
  const options = await classInstance(GeneratorOptions, schema);

  const workspaceDir = workspaceDirectory(tree, projectType);
  const projectRoot = `${workspaceDir}/${options.directory}`;

  return {
    ...options,
    projectRoot,
    tags: toArray(schema.tag),
  };
}
