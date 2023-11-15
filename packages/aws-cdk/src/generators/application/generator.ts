import * as path from 'path';
import { jestInitGenerator } from '@nx/jest';
import type { Tree, GeneratorCallback } from '@nx/devkit';

import {
  names,
  formatFiles,
  runTasksInSerial,
  getWorkspaceLayout,
  addProjectConfiguration,
  readProjectConfiguration,
  updateProjectConfiguration,
  addDependenciesToPackageJson,
} from '@nx/devkit';

import {
  addProjectFiles,
  updateLintConfig,
  lintingGenerator,
  addIgnoreFileName,
} from '@aws-nx/utils';

import {
  CDK_VERSION,
  TSJEST_VERSION,
  CONSTRUCTS_VERSION,
  SOURCE_MAP_VERSION,
} from '../../util/constants';
import { createConfiguration } from './config';
import { ApplicationGeneratorSchema } from './schema';

export function normalizeOptions(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const name = names(schema.name).fileName;
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const linting = schema.linting === undefined ?? true;
  const unitTest = schema.jest === undefined ?? true;

  const createTag = () => {
    if (!schema.tag) return [];
    if (Array.isArray(schema.tag)) return schema.tag;
    else return [schema.tag];
  };
  return {
    name,
    linting,
    unitTest,
    projectName,
    projectRoot,
    tags: createTag(),
  };
}

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

export async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const tasks: GeneratorCallback[] = [];

  const options = normalizeOptions(tree, schema);
  const config = createConfiguration(options);
  addProjectConfiguration(tree, options.projectName, config);

  const workspace = readProjectConfiguration(tree, options.projectName);
  updateProjectConfiguration(tree, options.projectName, workspace);
  addProjectFiles(tree, options, path.join(__dirname, 'files'));

  if (options.linting) {
    const lintTask = await lintingGenerator(tree, options);
    tasks.push(lintTask);
    updateLintConfig(tree, options);
  }

  if (options.unitTest) {
    const jestTask = await jestInitGenerator(tree, {
      js: true,
      compiler: 'tsc',
      babelJest: false,
      skipPackageJson: false,
      testEnvironment: 'node',
    });
    tasks.push(jestTask);
    addProjectFiles(tree, options, path.join(__dirname, 'unitTest'));
  }

  addIgnoreFileName(tree, '# AWS CDK', ['cdk.out']);
  tasks.push(addDependencies(tree));

  await formatFiles(tree);
  return runTasksInSerial(...tasks);
}

export default applicationGenerator;
