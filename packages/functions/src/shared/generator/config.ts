import { ProjectType } from '@aws-nx/utils';
import type { ProjectConfiguration } from './schema';

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
      options: {
        additionalEntryPoints: [],
      },
    },
  },
  tags: options.tags,
  functions: [],
});
