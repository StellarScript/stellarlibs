import type { ProjectConfiguration } from '@nx/devkit';

interface ConfigOptions {
  tags: string[];
  projectRoot: string;
}

export const createConfiguration = (
  options: ConfigOptions
): ProjectConfiguration => ({
  root: options.projectRoot,
  projectType: 'application',
  sourceRoot: `${options.projectRoot}/src`,
  targets: {
    deploy: {
      executor: '@aws-nx/aws-cdk:deploy',
      options: {},
    },
    destroy: {
      executor: '@aws-nx/aws-cdk:destroy',
      options: {},
    },
    bootstrap: {
      executor: '@aws-nx/aws-cdk:bootstrap',
      options: {},
    },
    synth: {
      executor: '@aws-nx/aws-cdk:synth',
      options: {},
    },
  },
  tags: options.tags,
});
