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
import { addIgnoreFileName, getProjectDir, ProjectType, tsConfigGenerator } from '@stellarlibs/utils';
import { dependencies, devDependencies } from './dependencies';
import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { lintProjectGenerator } from '@nx/eslint';

interface NormalizedSchema {
   projectRoot: string;
   projectSource: string;
   workspaceRoot: string;
   projectName: string;
   serviceName: string;
   testRunner: 'jest' | 'none' | 'vitest';
}

export default async function appGenerator(tree: Tree, schema: AppGeneratorSchema) {
   const options = normalizeOptions(tree, schema);
   configurationGenerator(tree, options);
   projectGenerator(tree, options);

   await lintingGenerator(tree, options);
   tsConfigGenerator(tree, options);

   await addDependenciesToPackageJson(tree, dependencies, devDependencies)();
   await installPackagesTask(tree, true);
}

/**
 *
 * @param tree
 * @param options
 */
function configurationGenerator(tree: Tree, options: NormalizedSchema) {
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
async function lintingGenerator(tree: Tree, options: NormalizedSchema) {
   const lintTask = await lintProjectGenerator(tree, {
      project: options.projectName,
      tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.*?.json')],
      eslintFilePatterns: [`${options.projectRoot}/**/*.ts`],
      skipFormat: false,
      setParserOptionsProject: true,
   });
   await lintTask();
}

/**
 *
 * @param tree
 * @param options
 */
function projectGenerator(tree: Tree, options: NormalizedSchema) {
   addIgnoreFileName(tree, '# Serverless', ['.serverless']);
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
      testRunner: schema.test || 'none',
   };
}
