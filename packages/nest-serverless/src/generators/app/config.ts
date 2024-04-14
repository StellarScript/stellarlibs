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
         executor: '@nx/webpack:webpack',
         outputs: ['{options.outputPath}'],
         defaultConfiguration: 'development',
         options: {
            target: 'node',
            compiler: 'tsc',
            generatePackageJson: true,
            outputPath: 'dist/packages/testapp/myapp',
            main: 'packages/testapp/myapp/src/main.ts',
            tsConfig: 'packages/testapp/myapp/tsconfig.app.json',
            webpackConfig: 'packages/testapp/myapp/webpack.config.js',
         },
      },
      package: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: 'sls package',
         },
      },
      serve: {
         executor: 'nx:run-commands',
         options: {
            cwd: options.projectRoot,
            color: true,
            command: 'sls offline start',
         },
      },
      deploy: {
         executor: 'nx:run-commands',
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
         executor: 'nx:run-commands',
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
