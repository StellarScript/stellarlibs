import {
   Tree,
   updateJson,
   formatFiles,
   generateFiles,
   offsetFromRoot,
   joinPathFragments,
   addProjectConfiguration,
   addDependenciesToPackageJson,
   installPackagesTask,
} from '@nx/devkit';
import {
   toArray,
   getProjectDir,
   ProjectType,
   TestRunnerType,
   GeneratorTasks,
   baseConfigGenerator,
   appTsConfigGenerator,
   specTsConfigGenerator,
   testGenerator,
} from '@stellarlibs/utils';
import { lintProjectGenerator } from '@nx/eslint';
import { createConfiguration } from './config';
import { AppGeneratorSchema } from './schema';
import { dependencies, devDependencies } from './dependencies';

interface NormalizedSchema {
   projectRoot: string;
   projectSource: string;
   projectName: string;
   projectSourceName: string;
   test: TestRunnerType;
   tags: string[];
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
   const tasks = new GeneratorTasks();

   const options = normalizeOptions(tree, schema);
   generateProjectSourceConfig(tree, options);
   generateProjectConfig(tree, options);
   generateApplication(tree, options);
   tsConfigGenerator(tree, options);

   tasks.register(await testGenerator(tree, options));
   tasks.register(await generateLinting(tree, options));

   tasks.register(await addDependenciesToPackageJson(tree, dependencies, devDependencies));
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
      tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.app.json')],
      eslintFilePatterns: [`${options.projectRoot}/**/*.ts`],
      skipFormat: false,
      setParserOptionsProject: true,
   });
}

/**
 *
 * @param tree
 * @param options
 */
function tsConfigGenerator(tree: Tree, options: NormalizedSchema) {
   const offset = '../../';
   baseConfigGenerator(tree, offset, { ...options, baseConfigName: 'tsconfig.json' });
   appTsConfigGenerator(tree, offset, options);
   specTsConfigGenerator(tree, offset, options);

   //  reference app tsconfig from root tsconfig
   updateJson(tree, joinPathFragments(options.projectSource, 'tsconfig.json'), (json) => {
      json.references.push({
         path: './' + joinPathFragments('apps', options.projectName, 'tsconfig.app.json'),
      });
      return json;
   });
}

/**
 *
 * @param tree
 * @param options
 */
function generateApplication(tree: Tree, options: NormalizedSchema) {
   const filesPath = joinPathFragments(__dirname, 'files', 'project');
   generateFiles(tree, filesPath, options.projectRoot, {
      projectName: options.projectName,
      projectRoot: options.projectRoot,
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: '',
   });
}

/**
 *
 * @param tree
 * @param options
 */
function generateProjectConfig(tree: Tree, options: NormalizedSchema) {
   const config = createConfiguration(options);
   addProjectConfiguration(tree, options.projectName, config);
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
function generateProjectSourceConfig(tree: Tree, options: NormalizedSchema) {
   const rootProjectExists = tree.exists(joinPathFragments(options.projectSource, 'tsconfig.json'));
   const rootProjectFilePath = joinPathFragments(options.projectSource, 'project.json');

   if (rootProjectExists) {
      updateJson(tree, rootProjectFilePath, (json) => {
         json.projects.push({
            name: options.projectName,
            root: options.projectRoot,
         });
         return json;
      });
      return;
   }

   const filesPath = joinPathFragments(__dirname, 'files', 'root');
   generateFiles(tree, filesPath, options.projectSource, {
      projectName: options.projectName,
      projectRoot: options.projectRoot,
      offsetFromRoot: offsetFromRoot(options.projectSource),
      template: '',
   });

   const rootProjectConfig = {
      root: options.projectSource,
      name: options.projectSourceName,
      projectType: ProjectType.Application,
      sourceRoot: options.projectSource,
      projects: [
         {
            name: options.projectName,
            root: options.projectRoot,
         },
      ],
      tags: options.tags,
   };
   addProjectConfiguration(tree, options.projectName, rootProjectConfig);
}

/**
 *
 * @param tree
 * @param schema
 * @returns
 */
function normalizeOptions(tree: Tree, options: AppGeneratorSchema): NormalizedSchema {
   const appsDir = getProjectDir(tree, ProjectType.Application);
   const projectSource = joinPathFragments(appsDir, options.project);
   const projectRoot = joinPathFragments(projectSource, 'apps', options.name);

   return {
      projectRoot,
      projectSource,
      projectName: options.name,
      projectSourceName: options.project,
      test: options.test || 'none',
      tags: toArray(options.tag),
   };
}
