import { ProjectType } from '@stellar-libs/utils';
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
      executor: '@stellar-libs/function:build',
      options: {
        additionalEntryPoints: [],
      },
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
  functions: [],
});
