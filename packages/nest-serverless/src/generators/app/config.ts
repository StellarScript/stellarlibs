import * as path from 'path';
import { joinPathFragments } from '@nx/devkit';
import { Commands, ProjectType } from '@stellarlibs/utils';

type Options = {
   projectRoot: string;
   tags?: string[];
   projectSource: string;
   serviceName: string;
   projectName: string;
};

type CommandOptions = {
   verboase?: boolean;
   packageName?: string;
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
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: command('package', { packageName: options.projectName }),
         },
      },
      deploy: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: command('deploy', { packageName: options.projectName }),
         },
         dependsOn: [
            'build',
            {
               target: 'deploy',
               projects: 'dependencies',
            },
         ],
      },
      remove: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: command('remove', { verboase: true }),
         },
      },
      serve: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: command('offline start'),
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

function command(cmd: string, options: CommandOptions = {}) {
   const baseOutDir = path.resolve(path.join('dist', 'serverless'));
   const outDir = path.join(baseOutDir, options.packageName || '');

   const commands = new Commands();
   commands.add('sls').add(cmd);

   if (options?.verboase) {
      commands.add('--verbose');
   }

   if (options.packageName && options.packageName.length) {
      commands.add('--package').add(outDir);
   }
   return commands.command;
}
