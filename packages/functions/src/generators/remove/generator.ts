import { type Tree, joinPathFragments } from '@nx/devkit';
import {
  classInstance,
  readConfiguration,
  updateConfiguration,
  removeDirectoryRecursively,
} from '@aws-nx/utils';

import { RemoveGeneratorSchema } from './schema';
import { GeneratorArguments } from './arguments';
import { ProjectConfiguration as ProjectConfig } from '../../shared/generator/schema';

interface NormalizedOptions {
  root: string;
  projectName: string;
  projectRoot: string;
  functionName?: string;
}

export default async function removeGenerator(
  tree: Tree,
  schema: RemoveGeneratorSchema
) {
  if (!schema.name && !schema.project) {
    throw new Error('You must specify a project name');
  }

  const options = await normalizeOptions(tree, schema);

  if (!options.functionName) {
    removeDirectoryRecursively(tree, options.root);
    return;
  }

  if (options.functionName) {
    const functionPath = joinPathFragments(
      options.projectRoot,
      options.functionName
    );
    if (!tree.exists(functionPath)) {
      throw new Error(`Function ${options.functionName} does not exist`);
    }
    removeDirectoryRecursively(tree, functionPath);
    updateProjectConfiguration(tree, options);
    return;
  }
}

function updateProjectConfiguration(tree: Tree, options: NormalizedOptions) {
  updateConfiguration<ProjectConfig>(tree, options.projectName, (config) => {
    config.functions = config.functions.filter((funcs) => {
      if (
        funcs.name !== options.functionName &&
        funcs.project === options.projectName
      ) {
        return true;
      }
    });
    config.targets.build.options.additionalEntryPoints =
      config.targets.build.options.additionalEntryPoints.filter((entry) => {
        const filesPath = joinPathFragments(
          options.projectRoot,
          options.functionName,
          'index.ts'
        );
        if (entry !== filesPath) {
          return true;
        }
      });
    return config;
  });
}

async function normalizeOptions(
  tree: Tree,
  schema: RemoveGeneratorSchema
): Promise<NormalizedOptions> {
  const options = await classInstance(GeneratorArguments, schema);
  const { root, sourceRoot } = readConfiguration<ProjectConfig>(
    tree,
    options.projectName
  );
  return {
    ...options,
    root,
    projectRoot: sourceRoot,
  };
}
