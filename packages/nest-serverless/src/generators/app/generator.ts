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
import { addIgnoreFileName, getProjectDir, ProjectType } from '@stellarlibs/utils';
import { dependencies, devDependencies } from './dependencies';
import { AppGeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { lintProjectGenerator } from '@nx/eslint';
import path = require('path');
import { appTsConfig, baseTsConfig, specTsConfig } from './templates/tsconfig-template';

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
 *
 */
function tsConfigGenerator(tree: Tree, options: NormalizedSchema) {
   const offset = offsetFromRoot(options.projectRoot);

   const baseConfig = baseTsConfig(offset);
   if (options.testRunner !== 'none')
      baseConfig.references = [...baseConfig.references, { path: './tsconfig.spec.json' }];
   tree.write(path.join(options.projectRoot, 'tsconfig.json'), JSON.stringify(baseConfig));

   const appConfig = appTsConfig(offset);
   if (options.testRunner !== 'none')
      appConfig.exclude = [...appConfig.exclude, 'src/**/*.spec.ts', 'src/**/*.test.ts'];
   tree.write(path.join(options.projectRoot, 'tsconfig.app.json'), JSON.stringify(appConfig));

   if (options.testRunner !== 'none') {
      const specConfig = specTsConfig(offset);
      tree.write(path.join(options.projectRoot, 'tsconfig.app.json'), JSON.stringify(specConfig));
   }
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
      testRunner: schema.test,
   };
}
