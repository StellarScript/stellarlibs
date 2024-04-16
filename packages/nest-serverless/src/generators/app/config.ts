import { joinPathFragments } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

type Options = {
   projectRoot: string;
   projectName: string;
   tags: string[];
};

export function createConfiguration(options: Options) {
   return {
      root: options.projectRoot,
      projectType: ProjectType.Application,
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: generateTargets(options),
      tags: options.tags,
   };
}

function generateTargets(options: Options) {
   return {
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
}
