import { joinPathFragments, ProjectConfiguration } from '@nx/devkit';
import { Commands, ProjectType, testCommands, TestRunnerType } from '@stellarlibs/utils';

type Options = {
   projectRoot: string;
   tags?: string[];
   projectSource: string;
   serviceName: string;
   projectName: string;
   testRunner: TestRunnerType;
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
   const config: ProjectConfiguration['targets'] = {
      build: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: command('package', { verboase: true }),
         },
      },
      deploy: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: command('deploy', { verboase: true }),
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
   };

   if (options.testRunner !== 'none') {
      (config.targets as ProjectConfiguration['targets']).test = testCommands(options);
   }

   return config;
}

function command(cmd: string, options: CommandOptions = {}) {
   const commands = new Commands();
   commands.add('sls').add(cmd);

   if (options?.verboase) {
      commands.add('--verbose');
   }
   return commands.command;
}
