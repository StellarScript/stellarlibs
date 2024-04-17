import { joinPathFragments, ProjectConfiguration } from '@nx/devkit';
import { ProjectType, testCommands, TestRunnerType } from '@stellarlibs/utils';

type Options = {
   projectRoot: string;
   projectName: string;
   projectSourceName: string;
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
         executor: '@nx/webpack:webpack',
         outputs: ['{options.outputPath}'],
         defaultConfiguration: 'development',
         options: {
            target: 'node',
            compiler: 'tsc',
            outputFileName: 'main.js',
            generatePackageJson: true,
            main: joinPathFragments(options.projectRoot, 'src', 'main.ts'),
            tsConfig: joinPathFragments(options.projectRoot, 'tsconfig.app.json'),
            webpackConfig: joinPathFragments(options.projectRoot, 'webpack.config.ts'),
            outputPath: joinPathFragments('dist', options.projectSourceName, options.projectName),
         },
      },
   };

   if (options.test !== 'none') {
      config.test = testCommands(options);
   }

   return config;
}
