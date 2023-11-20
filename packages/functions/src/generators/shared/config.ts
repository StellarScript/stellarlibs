import type { ProjectConfiguration } from '@nx/devkit';

interface ConfigOptions {
  tags: string[];
  projectRoot: string;
}

export enum ProjectType {
  Application = 'application',
  Library = 'library',
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
