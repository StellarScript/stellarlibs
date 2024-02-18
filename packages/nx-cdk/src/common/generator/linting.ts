import type { Tree } from '@nx/devkit';

import {
   updateJson,
   joinPathFragments,
   installPackagesTask,
   addDependenciesToPackageJson,
} from '@nx/devkit';

import { lintProjectGenerator } from '@nx/eslint';
import { GeneratorTasks } from '@stellarlibs/utils';

interface LintOptions {
   projectRoot: string;
   name: string;
   lintDependencies: Record<string, string>;
}

/**
 *
 * @param tree
 * @param options
 * @returns
 */
export async function lintConfigGenerator(tree: Tree, options: LintOptions) {
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
   tasks.register(addDependenciesToPackageJson(tree, {}, options.lintDependencies));
   await installPackagesTask(tree);
   return await tasks.runInSerial();
}
