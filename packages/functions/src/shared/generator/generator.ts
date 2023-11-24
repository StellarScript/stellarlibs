import * as path from 'path';
import {
  formatFiles,
  joinPathFragments,
  addProjectConfiguration,
} from '@nx/devkit';
import { type Tree, type GeneratorCallback } from '@nx/devkit';

import {
  toArray,
  ProjectType,
  addProjectFiles,
  GeneratorTasks,
  lintingGenerator,
  updateLintConfig,
  workspaceDirectory,
  updateConfiguration,
  classInstance,
} from '@aws-nx/utils';
import { jestInitGenerator } from '@nx/jest';
import { GeneratorAppSchema } from './schema';
import { createConfiguration } from './config';
import { GeneratorArguments } from './arguments';

interface NormalizedOptions {
  name: string;
  root: string;
  projectName: string;
  projectRoot: string;
  tags: string[];
  bundle: boolean;
  unitTest: boolean;
  linting: boolean;
}

export async function generatePackage<T extends GeneratorAppSchema>(
  tree: Tree,
  schema: T,
  projectType: ProjectType
): Promise<GeneratorCallback> {
  const tasks = new GeneratorTasks();

  const options = await normalizeOptions(tree, schema, projectType);
  const config = createConfiguration(projectType, {
    projectRoot: options.projectRoot,
    tags: options.tags,
  });

  addProjectFiles(tree, path.join(__dirname, 'files', 'app'), {
    projectRoot: options.projectRoot,
    projectName: options.projectName,
  });
  addProjectFiles(tree, path.join(__dirname, 'files', 'src'), {
    projectRoot: joinPathFragments(options.projectRoot, 'src'),
    projectName: options.projectName,
  });
  addProjectConfiguration(tree, options.name, config);
  updateProjectConfiguration(tree, options);

  // Jest
  const jestTask = await JestConfiguration(tree, options);
  tasks.register(jestTask);

  // Eslint
  const lintTask = await lintingConfiguration(tree, options);
  tasks.register(lintTask);

  await formatFiles(tree);
  return tasks.runInSerial();
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
    js: false,
    compiler: 'tsc',
    babelJest: false,
    skipPackageJson: false,
    testEnvironment: 'node',
  });
  return jestTask;
}

/**
 *
 * @param tree
 * @param options
 * @description Linting configuration
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
 */
function updateProjectConfiguration(tree: Tree, options: NormalizedOptions) {
  updateConfiguration(tree, options.projectName, (workspace) => {
    workspace.targets.build.executor = '@nx/esbuild:esbuild';
    workspace.tags = options.tags;
    workspace.targets.build.options = {
      additionalEntryPoints: [],
      bundle: options.bundle,
      thirdParty: options.bundle,
      outputPath: `dist/${options.projectRoot}`,
      main: `${options.projectRoot}/src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
    };
    return workspace;
  });
}

async function normalizeOptions(
  tree: Tree,
  schema: GeneratorAppSchema,
  projectType: ProjectType
): Promise<NormalizedOptions> {
  const options = await classInstance(GeneratorArguments, schema);

  const workspaceDir = workspaceDirectory(tree, projectType);
  const projectRoot = `${workspaceDir}/${options.directory}`;
  const root = joinPathFragments(projectRoot, 'src', options.name);

  return {
    ...options,
    root,
    projectRoot,
    bundle: schema.bundle,
    tags: toArray(schema.tag),
  };
}
