import { ProjectConfiguration, joinPathFragments } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

interface ConfigOptions {
   tags: string[];
   projectRoot: string;
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
   'list-stacks': {
      executor: 'nx:run-commands',
      options: {
         command: 'npx cdk list',
      },
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
      root: options.projectRoot,
      projectType: projectType,
      sourceRoot: joinPathFragments(options.projectRoot, 'src'),
      targets: {
         ...targets(),
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
