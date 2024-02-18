import {
  Tree,
  updateJson,
  GeneratorCallback,
  joinPathFragments,
  addProjectConfiguration,
  addDependenciesToPackageJson,
  installPackagesTask,
} from '@nx/devkit';
import {
  toArray,
  Nullable,
  TestRunner,
  ProjectType,
  getProjectDir,
  GeneratorTasks,
  addProjectFiles,
  addIgnoreFileName,
  updateConfiguration,
} from '@stellarlibs/utils';
import { jestInitGenerator } from '@nx/jest';
import { initGenerator } from '@nx/vite';
import { lintProjectGenerator } from '@nx/eslint';

import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import {
  dependencies,
  lintDependencies,
  viteDependencies,
  jestDependencies,
} from './dependencies';

interface NormalizedSchema extends AppGeneratorSchema {
  tags: string[];
  projectRoot: string;
  projectSource: string;
}

export default async function appGenerator(
  tree: Tree,
  schema: AppGeneratorSchema,
  projectType = ProjectType.Application
) {
  const tasks = new GeneratorTasks();

  const options = normailzeOptions(tree, projectType, schema);
  const appFilesDir = joinPathFragments(__dirname, 'files', projectType);

  generateProject(tree, appFilesDir, projectType, options);

  await lintConfigGenerator(tree, options);
  await testConfigGenerator(tree, options);

  addIgnoreFileName(tree, '# AWS CDK', ['cdk.out']);
  tasks.register(addDependenciesToPackageJson(tree, dependencies, {}));
  await installPackagesTask(tree);
  await tasks.runInSerial();
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
async function lintConfigGenerator(tree: Tree, options: NormalizedSchema) {
  const tasks = new GeneratorTasks();

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

  tasks.register(lintTask);
  tasks.register(addDependenciesToPackageJson(tree, {}, lintDependencies));
  await installPackagesTask(tree);
  return await tasks.runInSerial();
}

/**
 *
 * @param tree
 * @param filePath
 * @param options
 * @returns
 */
async function testConfigGenerator(
  tree: Tree,
  options: NormalizedSchema
): Promise<Nullable<GeneratorCallback>> {
  if (options.testRunner === TestRunner.None) {
    return null;
  }

  const tasks = new GeneratorTasks();
  const filePath = joinPathFragments(
    __dirname,
    'files/testing',
    options.testRunner
  );

  addProjectFiles(tree, filePath, {
    projectName: options.name,
    projectRoot: options.projectRoot,
    testRunner: options.testRunner,
  });

  if (options.testRunner === TestRunner.Jest) {
    tasks.register(addDependenciesToPackageJson(tree, {}, jestDependencies));
    tasks.register(await jestConfigGenerator(tree, options));
  }

  if (options.testRunner === TestRunner.Vitest) {
    tasks.register(
      await addDependenciesToPackageJson(tree, {}, viteDependencies)
    );
    tasks.register(await vitestConfigGenerator(tree, options));
  }

  await installPackagesTask(tree);
  return await tasks.runInSerial();
}

async function vitestConfigGenerator(tree: Tree, options: NormalizedSchema) {
  const viteTask = await initGenerator(tree, {
    skipFormat: false,
    skipPackageJson: false,
    keepExistingVersions: false,
    updatePackageScripts: true,
  });

  updateConfiguration(tree, options.name, (workspace) => {
    workspace.targets.test = {
      executor: '@nx/vite:test',
      outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
      options: {
        config: `${options.projectRoot}/vitest.config.ts`,
      },
    };
    return workspace;
  });
  return viteTask;
}

async function jestConfigGenerator(tree: Tree, options: NormalizedSchema) {
  const jestTask = await jestInitGenerator(tree, {
    skipFormat: false,
    skipPackageJson: false,
    keepExistingVersions: false,
    updatePackageScripts: true,
  });

  updateConfiguration(tree, options.name, (workspace) => {
    workspace.targets.test = {
      executor: '@nx/jest:jest',
      outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
      options: {
        jestConfig: `${options.projectRoot}/jest.config.ts`,
      },
    };
    return workspace;
  });
  return jestTask;
}

/**
 *
 * @param tree
 * @param filePath
 * @param options
 */
function generateProject(
  tree: Tree,
  filePath: string,
  projectType: ProjectType,
  options: NormalizedSchema
): void {
  const config = createConfiguration(projectType, options);
  addProjectConfiguration(tree, options.name, config);

  updateConfiguration(tree, options.name, (workspace) => {
    workspace.tags = options.tags;
    return workspace;
  });

  const commandFiles = joinPathFragments(filePath, 'common');
  addProjectFiles(tree, commandFiles, {
    projectName: options.name,
    projectRoot: options.projectRoot,
  });

  const specFiles = joinPathFragments(
    filePath,
    options.testRunner !== TestRunner.None ? 'withTest' : 'withoutTest'
  );
  addProjectFiles(tree, specFiles, {
    projectName: options.name,
    projectRoot: options.projectRoot,
    testRunner: options.testRunner,
  });
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
export function normailzeOptions(
  tree: Tree,
  projectType: ProjectType,
  options: AppGeneratorSchema
): NormalizedSchema {
  const dir = getProjectDir(tree, projectType);
  const workspaceDir = options.directory || dir;

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
