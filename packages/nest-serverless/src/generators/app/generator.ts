import {
   Tree,
   updateJson,
   generateFiles,
   offsetFromRoot,
   joinPathFragments,
   installPackagesTask,
   addProjectConfiguration,
   addDependenciesToPackageJson,
} from '@nx/devkit';
import { GeneratorTasks, getProjectDir, ProjectType } from '@stellarlibs/utils';
import { dependencies, devDependencies } from './dependencies';
import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';

interface NormalizedSchema {
   projectRoot: string;
   projectSource: string;
   workspaceRoot: string;
   projectName: string;
   serviceName: string;
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
   const tasks = new GeneratorTasks();

   const options = normalizeOptions(tree, schema);
   generateConfiguration(tree, options);
   generateProject(tree, options);

   await installDependencies(tree, tasks);
   await tasks.runInSerial();
}

/**
 *
 * @param tree
 * @param options
 */
function generateConfiguration(tree: Tree, options: NormalizedSchema) {
   const config = createConfiguration(options);
   addProjectConfiguration(tree, options.projectName, config);
   updateJson(tree, 'tsconfig.base.json', (json) => {
      json.compilerOptions.module = 'CommonJS';
      return json;
   });
}

/**
 *
 * @param tree
 * @param options
 */
function generateProject(tree: Tree, options: NormalizedSchema) {
   generateFiles(tree, joinPathFragments(__dirname, 'files', 'root'), options.workspaceRoot, {
      offsetFromRoot: offsetFromRoot(options.workspaceRoot),
      template: '',
   });
   generateFiles(tree, joinPathFragments(__dirname, 'files', 'project'), options.projectRoot, {
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      projectRoot: options.projectRoot,
      projectName: options.projectName,
      serviceName: options.serviceName,
      projectSource: options.projectSource,
      template: '',
   });
}

/**
 *
 * @param tree
 * @param tasks
 */
async function installDependencies(tree: Tree, tasks: GeneratorTasks) {
   tasks.register(addDependenciesToPackageJson(tree, dependencies, devDependencies));
   await installPackagesTask(tree);
}

/**
 *
 * @param tree
 * @param schema
 * @returns
 */
function normalizeOptions(tree: Tree, schema: AppGeneratorSchema): NormalizedSchema {
   const projDir = getProjectDir(tree, ProjectType.Application);
   const workspaceDir = joinPathFragments(projDir, schema.project);

   const workspaceRoot = '.';
   const projectRoot = joinPathFragments(workspaceDir, schema.name);
   const projectSource = joinPathFragments(projectRoot);

   return {
      projectRoot,
      projectSource,
      workspaceRoot,
      projectName: schema.name,
      serviceName: schema.project,
   };
}
