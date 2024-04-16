import {
   Tree,
   formatFiles,
   joinPathFragments,
   installPackagesTask,
   addProjectConfiguration,
   addDependenciesToPackageJson,
} from '@nx/devkit';

import {
   toArray,
   ProjectType,
   testGenerator,
   TestRunnerType,
   getProjectDir,
   GeneratorTasks,
   addProjectFiles,
   updateConfiguration,
   tsConfigGenerator,
} from '@stellarlibs/utils';
import { lintProjectGenerator } from '@nx/eslint';

import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { dependencies } from './dependencies';

interface NormalizedSchema {
   projectRoot: string;
   projectSource: string;
   projectName: string;
   test: TestRunnerType;
   tags: string[];
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
   const projectType = ProjectType.Application;
   await generateApplication(tree, projectType, schema);
}

export async function generateApplication(
   tree: Tree,
   projectType: ProjectType,
   schema: AppGeneratorSchema
) {
   const tasks = new GeneratorTasks();
   const options = normailzeOptions(tree, projectType, schema);

   generateConfiguration(tree, projectType, options);
   generateProjectFiles(tree, options);
   tsConfigGenerator(tree, options);

   tasks.register(await testGenerator(tree, options));
   tasks.register(await generateLinting(tree, options));
   tasks.register(await addDependenciesToPackageJson(tree, dependencies, {}));
   tasks.register(async () => await formatFiles(tree));
   tasks.register(() => installPackagesTask(tree, true));

   tasks.runInSerial();
}

/**
 *
 * @param tree
 * @param options
 * @param tasks
 */
async function generateLinting(tree: Tree, options: NormalizedSchema) {
   return await lintProjectGenerator(tree, {
      project: options.projectName,
      rootProject: true,
      skipFormat: false,
      setParserOptionsProject: true,
      eslintFilePatterns: [`${options.projectRoot}/**/*.ts`],
      unitTestRunner: options.test === 'none' ? undefined : options.test,
      tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.app.json')],
   });
}
/**
 *
 * @param tree
 * @param options
 */
function generateProjectFiles(tree: Tree, options: NormalizedSchema) {
   const filesPath = joinPathFragments(__dirname, 'files', 'application');
   addProjectFiles(tree, filesPath, {
      projectName: options.projectName,
      projectRoot: options.projectRoot,
   });
}

/**
 *
 * @param tree
 * @param projectType
 * @param options
 */
function generateConfiguration(tree: Tree, projectType: ProjectType, options: NormalizedSchema) {
   const config = createConfiguration(projectType, options);
   addProjectConfiguration(tree, options.projectName, config);
   updateConfiguration(tree, options.projectName, (workspace) => {
      workspace.tags = options.tags;
      return workspace;
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
      projectName: options.name,
      test: options.test || 'none',
      tags: toArray(options.tags),
   };
}
