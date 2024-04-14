import { joinPathFragments } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

type Options = {
   projectRoot: string;
   tags?: string[];
   projectSource: string;
   serviceName: string;
   projectName: string;
};

export function createConfiguration(options: Options) {
   return {
      root: options.projectRoot,
      projectType: ProjectType.Application,
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: targets(options),
      tags: options.tags || [],
   };
}

function targets(options: Options) {
   return {
      build: {
         executor: '@nrwl/workspace:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: 'sls package',
         },
      },
      serve: {
         executor: '@nrwl/workspace:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: 'sls offline start',
         },
      },
      deploy: {
         executor: '@nrwl/workspace:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: 'sls deploy --verbose',
         },
         dependsOn: [
            {
               target: 'deploy',
               projects: 'dependencies',
            },
         ],
      },
      remove: {
         executor: '@nrwl/workspace:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: 'sls remove',
         },
      },
      lint: {
         executor: '@nrwl/linter:eslint',
         options: {
            lintFilePatterns: [joinPathFragments(options.projectRoot, '**/*.ts')],
         },
      },
      test: {
         executor: '@nrwl/jest:jest',
         outputs: [joinPathFragments('coverage', options.projectName, options.serviceName)],
         options: {
            jestConfig: joinPathFragments(options.projectRoot, 'jest.config.js'),
            passWithNoTests: true,
         },
      },
   };
}
