import { joinPathFragments, ProjectConfiguration } from '@nx/devkit';
import { ProjectType, testCommands, TestRunnerType } from '@stellarlibs/utils';

type Options = {
   projectRoot: string;
   projectName: string;
   test: TestRunnerType;
   tags: string[];
};

export function createConfiguration(options: Options) {
   return {
      root: options.projectRoot,
      name: options.projectName,
      projectType: ProjectType.Application,
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: generateTargets(options),
      tags: options.tags,
   };
}

function generateTargets(options: Options) {
   const config: ProjectConfiguration['targets'] = {
      build: {
         executor: '@nx/esbuild:esbuild',
         outputs: ['{options.outputPath}'],
         defaultConfiguration: 'production',
         options: {
            platform: 'node',
            outputPath: joinPathFragments('dist', 'apps', options.projectName),
            format: ['cjs'],
            bundle: false,
            main: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
            tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
            assets: [joinPathFragments(options.projectRoot, 'src', 'assets')],
            generatePackageJson: true,
            esbuildOptions: {
               sourcemap: true,
               outExtension: {
                  '.js': '.js',
               },
            },
         },
         configurations: {
            development: {},
            production: {
               esbuildOptions: {
                  sourcemap: false,
                  outExtension: {
                     '.js': '.js',
                  },
               },
            },
         },
      },
   };

   if (options.test !== 'none') {
      config.test = testCommands(options);
   }

   return config;
}
