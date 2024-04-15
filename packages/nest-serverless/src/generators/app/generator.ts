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
import { addIgnoreFileName, getProjectDir, ProjectType, updateConfiguration } from '@stellarlibs/utils';
import { dependencies, devDependencies } from './dependencies';
import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { lintProjectGenerator } from '@nx/eslint';
import { jestInitGenerator } from '@nx/jest';
import { initGenerator } from '@nx/vite';
import path = require('path');

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
   await testGenerator(tree, options);

   await addDependenciesToPackageJson(tree, dependencies, devDependencies)();
   await installPackagesTask(tree, true);
}

/**
 *
 *
 */

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
      testRunner: schema.test,
   };
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
async function testGenerator(tree: Tree, options: NormalizedSchema) {
   const tsconfigAppPath = path.resolve(joinPathFragments(options.projectRoot, 'tsconfig.app.json'));
   const tsconfigBasePath = path.resolve(joinPathFragments(options.projectRoot, 'tsconfig.json'));
   if (options.testRunner === 'none') {
      return;
   }
   if (options.testRunner === 'jest') {
      await jestGenerator(tree, options);
   }
   if (options.testRunner === 'vitest') {
      await vitestGenerator(tree, options);
   }

   updateJson(tree, tsconfigAppPath, (json) => {
      json.exclude = [...json.exclude, '**/*.spec.ts', '**/*.test.ts'];
      return json;
   });
   updateJson(tree, tsconfigBasePath, (json) => {
      json.references = [...json.references, { path: './tsconfig.spec.json' }];
      return json;
   });
}

async function vitestGenerator(tree: Tree, options: NormalizedSchema) {
   const viteTask = await initGenerator(tree, {
      skipFormat: false,
      skipPackageJson: false,
      keepExistingVersions: false,
      updatePackageScripts: true,
   });

   updateConfiguration(tree, options.projectName, (workspace) => {
      workspace.targets.test = {
         executor: '@nx/vite:test',
         outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
         options: {
            config: `${options.projectRoot}/vitest.config.ts`,
         },
      };
      return workspace;
   });
   await viteTask();
}

async function jestGenerator(tree: Tree, options: NormalizedSchema) {
   const jestTask = await jestInitGenerator(tree, {
      skipFormat: false,
      skipPackageJson: false,
      keepExistingVersions: false,
      updatePackageScripts: true,
   });

   updateConfiguration(tree, options.projectName, (workspace) => {
      workspace.targets.test = {
         executor: '@nx/jest:jest',
         outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
         options: {
            jestConfig: `${options.projectRoot}/jest.config.ts`,
         },
      };
      return workspace;
   });
   await jestTask();
}
