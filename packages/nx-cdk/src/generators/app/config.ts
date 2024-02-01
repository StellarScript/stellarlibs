import { ProjectConfiguration, joinPathFragments } from '@nx/devkit';
import { ProjectType } from '@stellarlibs/utils';

interface ConfigOptions {
  tags: string[];
  projectRoot: string;
}

export const createConfiguration = (options: ConfigOptions): ProjectConfiguration => ({
  root: options.projectRoot,
  projectType: ProjectType.Application,
  sourceRoot: joinPathFragments(options.projectRoot, 'src'),
  targets: {
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
    test: {
      executor: '@nx/jest:jest',
      outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
      options: {
        jestConfig: `${options.projectRoot}/jest.config.ts`,
      },
    },
    'list-stacks': {
      executor: '@stellarlibs/nx-cdk:list-stacks',
      options: {},
    },
    lint: {
      executor: '@nx/eslint:lint',
      outputs: ['{options.outputFile}'],
      options: {
        lintFilePatterns: [`${options.projectRoot}/**/*.ts`],
      },
    },
  },
  tags: options.tags,
});
