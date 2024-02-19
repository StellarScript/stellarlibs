import {
   Tree,
   joinPathFragments,
   installPackagesTask,
   addProjectConfiguration,
   addDependenciesToPackageJson,
} from '@nx/devkit';

import {
   toArray,
   TestRunner,
   ProjectType,
   getProjectDir,
   GeneratorTasks,
   addProjectFiles,
   addIgnoreFileName,
   updateConfiguration,
} from '@stellarlibs/utils';

import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { lintConfigGenerator, testConfigGenerator } from '../../common/generator';
import { dependencies, lintDependencies, viteDependencies, jestDependencies } from './dependencies';

interface NormalizedSchema extends AppGeneratorSchema {
   tags: string[];
   projectRoot: string;
   projectSource: string;
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
   const projectType = ProjectType.Application;
   await generateApplication(tree, schema, projectType);
}

/**
 *
 * @param tree
 * @param schema
 * @param projectType
 */
export async function generateApplication(
   tree: Tree,
   schema: AppGeneratorSchema,
   projectType = ProjectType.Application
) {
   const tasks = new GeneratorTasks();

   const options = normailzeOptions(tree, projectType, schema);
   const appFilesDir = joinPathFragments(__dirname, 'files', projectType);

   generateProject(tree, appFilesDir, projectType, options);

   await lintConfigGenerator(tree, {
      projectRoot: options.projectRoot,
      name: options.name,
      lintDependencies,
   });

   const filePath = joinPathFragments(__dirname, 'files', projectType, 'testing', options.testRunner);
   const runnerDependencies = TestRunner.Vitest ? viteDependencies : jestDependencies;

   await testConfigGenerator(tree, filePath, {
      name: options.name,
      projectRoot: options.projectRoot,
      testRunner: options.testRunner,
      dependencies: runnerDependencies,
   });

   addIgnoreFileName(tree, '# AWS CDK', ['cdk.out']);
   tasks.register(addDependenciesToPackageJson(tree, dependencies, {}));

   await installPackagesTask(tree);
   await tasks.runInSerial();
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
