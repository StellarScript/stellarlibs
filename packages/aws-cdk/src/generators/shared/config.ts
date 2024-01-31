import type { ProjectConfiguration, ProjectType } from '@nx/devkit';

interface ConfigOptions {
  tags: string[];
  projectRoot: string;
}

export const createConfiguration = (
  projectType: ProjectType,
  options: ConfigOptions
): ProjectConfiguration => ({
  root: options.projectRoot,
  projectType: projectType,
  sourceRoot: `${options.projectRoot}/src`,
  targets: {
    deploy: {
      executor: '@stellar-libs/aws-cdk:deploy',
      options: {},
    },
    destroy: {
      executor: '@stellar-libs/aws-cdk:destroy',
      options: {},
    },
    bootstrap: {
      executor: '@stellar-libs/aws-cdk:bootstrap',
      options: {},
    },
    synth: {
      executor: '@stellar-libs/aws-cdk:synth',
      options: {},
    },
    test: {
      executor: '@nx/jest:jest',
      outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
      options: {
        jestConfig: `${options.projectRoot}/jest.config.ts`,
      },
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
