import {
  Tree,
  updateJson,
  GeneratorCallback,
  joinPathFragments,
  getWorkspaceLayout,
  addProjectConfiguration,
  addDependenciesToPackageJson,
} from '@nx/devkit';
import {
  toArray,
  Nullable,
  TestRunner,
  GeneratorTasks,
  addProjectFiles,
  addIgnoreFileName,
  updateConfiguration,
} from '@stellar-libs/utils';
import { jestInitGenerator } from '@nx/jest';
import { lintProjectGenerator } from '@nx/eslint';

import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { dependencies } from './dependencies';

interface NormalizedSchema extends AppGeneratorSchema {
  tags: string[];
  projectRoot: string;
  projectSource: string;
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
  const tasks = new GeneratorTasks();

  const options = normailzeOptions(tree, schema);
  const appFilesDir = joinPathFragments(__dirname, 'files', 'app');
  const testFilesDir = joinPathFragments(__dirname, 'files', 'unitTest');

  generateProject(tree, appFilesDir, options);

  const lintTask = await generateLintConfig(tree, options);
  tasks.register(lintTask);

  const unitTest = await generateTest(tree, testFilesDir, options);
  if (unitTest) {
    tasks.register(unitTest);
  }

  addIgnoreFileName(tree, '# AWS CDK', ['cdk.out']);
  tasks.register(addDependenciesToPackageJson(tree, dependencies, {}));
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
async function generateLintConfig(tree: Tree, options: NormalizedSchema) {
  const lintTask = await lintProjectGenerator(tree, {
    project: options.name,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.*?.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.ts`],
    skipFormat: false,
    setParserOptionsProject: true,
  });
  const configPath = joinPathFragments(options.projectRoot, '.eslintrc.json');
  updateJson(tree, configPath, (json) => {
    json.plugins = json?.plugins || [];
    const plugins: string[] = json.plugins;

    const hasCdkPlugin = plugins.findIndex((row) => row === 'cdk') >= 0;
    if (!hasCdkPlugin) {
      plugins.push('cdk');
    }
    return json;
  });
  return lintTask;
}

/**
 *
 * @param tree
 * @param filePath
 * @param options
 * @returns
 */
async function generateTest(
  tree: Tree,
  filePath: string,
  options: NormalizedSchema
): Promise<Nullable<GeneratorCallback>> {
  if (options.testRunner === TestRunner.None) {
    return null;
  }
  const jestTask = await jestInitGenerator(tree, {
    js: false,
    compiler: 'tsc',
    babelJest: false,
    skipPackageJson: false,
    testEnvironment: 'node',
  });
  addProjectFiles(tree, filePath, {
    projectName: options.name,
    projectRoot: options.projectRoot,
  });
  return jestTask;
}

/**
 *
 * @param tree
 * @param filePath
 * @param options
 */
function generateProject(tree: Tree, filePath: string, options: NormalizedSchema): void {
  const config = createConfiguration(options);
  addProjectConfiguration(tree, options.name, config);

  updateConfiguration(tree, options.name, (workspace) => {
    workspace.tags = options.tags;
    return workspace;
  });

  addProjectFiles(tree, filePath, {
    projectName: options.name,
    projectRoot: options.projectRoot,
  });
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
export function normailzeOptions(tree: Tree, options: AppGeneratorSchema): NormalizedSchema {
  const { appsDir } = getWorkspaceLayout(tree);
  const workspaceDir = options.directory || appsDir;

  const projectRoot = joinPathFragments(workspaceDir, options.name);
  const projectSource = joinPathFragments(projectRoot, 'src');

  return {
    projectRoot,
    projectSource,
    name: options.name,
    testRunner: options.testRunner,
    tags: toArray(options.tags),
  };
}
