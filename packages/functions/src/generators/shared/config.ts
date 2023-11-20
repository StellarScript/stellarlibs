import type { ProjectConfiguration } from '@nx/devkit';
import { ProjectType } from '@aws-nx/utils';

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
    build: {
      executor: '@aws-nx/function:build',
      options: {},
    },
  },
  tags: options.tags,
});
