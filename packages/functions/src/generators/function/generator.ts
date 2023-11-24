import {
  Tree,
  updateJson,
  formatFiles,
  joinPathFragments,
  readProjectConfiguration,
} from '@nx/devkit';
import {
  ProjectType,
  workspaceDirectory,
  addProjectFiles,
  readConfiguration,
  updateConfiguration,
  classInstance,
} from '@aws-nx/utils';

import { FunctionGeneratorSchema } from './schema';
import { GeneratorArguments } from './arguments';
import { ProjectConfiguration as ProjectConfig } from '../../shared/generator/schema';

interface NormalizedOptions {
  name: string;
  root: string;
  projectName: string;
  projectRoot: string;
}

export default async function functionGenerator(
  tree: Tree,
  schema: FunctionGeneratorSchema
) {
  const options = await normalizeOptions(tree, schema);
  generatorValidation(tree, options);

  addProjectFiles(tree, joinPathFragments(__dirname, 'files'), {
    projectName: options.projectName,
    projectRoot: options.root,
  });
  updateLibConfiguration(tree, options);
  await formatFiles(tree);
}

/**
 *
 * @param tree
 * @param options
 */
function generatorValidation(tree: Tree, options: NormalizedOptions): void {
  if (!tree.exists(options.projectRoot)) {
    throw new Error(`Project ${options.projectName} does not exist`);
  }

  const config = readConfiguration<ProjectConfig>(tree, options.projectName);
  const exists = !!config.functions.find((x) => {
    if (x.name === options.name && x.project === options.projectName) {
      return true;
    }
  });
  if (exists) {
    throw new Error(`Function with name ${options.name} already exists`);
  }
}

/**
 *
 * @param tree
 * @param options
 */
export function updateLibConfiguration(
  tree: Tree,
  options: NormalizedOptions
): void {
  // update tsconfig
  const tsConfigPath = joinPathFragments(
    options.projectRoot,
    'tsconfig.lib.json'
  );
  updateJson(tree, tsConfigPath, (config) => {
    config.include.push(`./${options.name}/**/*`);
    return config;
  });

  // update project config
  updateConfiguration<ProjectConfig>(tree, options.projectName, (workspace) => {
    workspace.targets.build.options.additionalEntryPoints.push(
      joinPathFragments(options.root, 'index.ts')
    );
    workspace.functions.push({
      name: options.name,
      root: options.projectRoot,
      project: options.projectName,
    });
    return workspace;
  });
}

async function normalizeOptions(
  tree: Tree,
  schema: FunctionGeneratorSchema
): Promise<NormalizedOptions> {
  const options = await classInstance(GeneratorArguments, schema);
  const config = readProjectConfiguration(tree, schema.project);

  const projectType = config.projectType as ProjectType;
  const appdir = workspaceDirectory(tree, projectType);

  const projectRoot = joinPathFragments(appdir, options.projectName);
  const root = joinPathFragments(projectRoot, 'src', options.name);

  return {
    root,
    projectRoot,
    ...options,
  };
}
