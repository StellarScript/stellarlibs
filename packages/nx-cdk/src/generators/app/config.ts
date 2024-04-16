import { ProjectConfiguration, joinPathFragments } from '@nx/devkit';
import { ProjectType, testCommands, TestRunnerType } from '@stellarlibs/utils';

interface ConfigOptions {
   projectRoot: string;
   projectName: string;
   test: TestRunnerType;
   tags: string[];
}

const applicationTargets = {
   deploy: {
      executor: '@stellarlibs/nx-cdk:deploy',
      options: {},
   },
   destroy: {
      executor: '@stellarlibs/nx-cdk:destroy',
      options: {},
   },
   bootstrap: {
      executor: '@stellarlibs/nx-cdk:bootstrap',
      options: {},
   },
   synth: {
      executor: '@stellarlibs/nx-cdk:synth',
      options: {},
   },
   synthesize: {
      executor: '@stellarlibs/nx-cdk:synth',
      options: {},
   },
   'list-all': {
      executor: '@stellarlibs/nx-cdk:list-all',
      options: {},
   },
};

export const createConfiguration = (
   projectType: ProjectType,
   options: ConfigOptions
): ProjectConfiguration => {
   const targets = () => {
      if (projectType === ProjectType.Application) {
         return applicationTargets;
      }
      return {};
   };

   return {
      name: options.projectName,
      root: options.projectRoot,
      projectType: projectType,
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: {
         ...targets(),
         test: testCommands(options),
         lint: {
            executor: '@nx/eslint:lint',
            outputs: ['{options.outputFile}'],
            options: {
               lintFilePatterns: [`${options.projectRoot}/**/*.ts`],
            },
         },
      },
      tags: options.tags,
   };
};
