import type { GeneratorCallback, Tree } from '@nx/devkit';

import {
   Nullable,
   TestRunner,
   GeneratorTasks,
   addProjectFiles,
   updateConfiguration,
} from '@stellarlibs/utils';

import { initGenerator } from '@nx/vite';
import { jestInitGenerator } from '@nx/jest';
import { addDependenciesToPackageJson, installPackagesTask } from '@nx/devkit';

interface TestGeneratorOptions {
   name: string;
   projectRoot: string;
   testRunner: TestRunner;
   dependencies: Record<string, string>;
}

/**
 *
 * @param tree
 * @param filePath
 * @param options
 * @returns
 */
export async function testConfigGenerator(
   tree: Tree,
   filePath: string,
   options: TestGeneratorOptions
): Promise<Nullable<GeneratorCallback>> {
   if (options.testRunner === TestRunner.None) {
      return null;
   }

   const tasks = new GeneratorTasks();
   addProjectFiles(tree, filePath, {
      projectName: options.name,
      projectRoot: options.projectRoot,
      testRunner: options.testRunner,
   });

   if (options.testRunner === TestRunner.Jest) {
      tasks.register(addDependenciesToPackageJson(tree, {}, options.dependencies));
      tasks.register(await jestConfigGenerator(tree, options));
   }

   if (options.testRunner === TestRunner.Vitest) {
      tasks.register(await addDependenciesToPackageJson(tree, {}, options.dependencies));
      tasks.register(await vitestConfigGenerator(tree, options));
   }

   await installPackagesTask(tree);
   return await tasks.runInSerial();
}

async function vitestConfigGenerator(tree: Tree, options: TestGeneratorOptions) {
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

async function jestConfigGenerator(tree: Tree, options: TestGeneratorOptions) {
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
