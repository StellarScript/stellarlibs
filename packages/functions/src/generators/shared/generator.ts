import * as path from 'path';
import {
  Tree,
  names,
  addProjectConfiguration,
  joinPathFragments,
} from '@nx/devkit';

import {
  ProjectType,
  appDirectory,
  classInstance,
  addProjectFiles,
  updateProjectConfig,
} from '@aws-nx/utils';

import { GeneratorSchema } from './schema';
import { createConfiguration } from './config';
import { FunctionsGeneratorArguments } from './arguments';

interface NormalizedArguments {
  tags: string[];
  bundle: boolean;
}

interface NormalizeOptions {
  name: string;
  root: string;
  project: string;
  projectRoot: string;
  projectName: string;
  args: NormalizedArguments;
}

export async function createFunction<T extends GeneratorSchema>(
  tree: Tree,
  schema: T
): Promise<void> {}

export async function createApplication<T extends GeneratorSchema>(
  tree: Tree,
  schema: T,
  projectType: ProjectType
): Promise<void> {
  const options = await normalizeOptions(tree, schema, projectType);

  const config = createConfiguration(projectType, {
    projectRoot: options.projectRoot,
    tags: options.args.tags,
  });
  addProjectFiles(tree, joinPathFragments(__dirname, 'files', 'src'), {
    projectRoot: joinPathFragments(options.projectRoot, 'src'),
    projectName: options.projectName,
  });

  createLibConfiguration(tree, options);
  addProjectConfiguration(tree, options.projectName, config);
  addProjectFiles(tree, path.join(__dirname, 'files', 'app'), options);
}

/**
 *
 * @param tree
 * @param options
 */
function createLibConfiguration(tree: Tree, options: NormalizeOptions): void {
  updateProjectConfig(tree, options.projectName, (workspace) => {
    workspace.targets.build.executor = '@nx/esbuild:esbuild';
    workspace.targets.build.options = {
      additionalEntryPoints: [],
      bundle: options.args.bundle,
      thirdParty: options.args.bundle,
      outputPath: `dist/${options.projectRoot}`,
      main: `${options.projectRoot}/src/index.ts`,
      tsConfig: `${options.projectRoot}/tsconfig.lib.json`,
    };
    return workspace;
  });
}

async function normalizeOptions(
  tree: Tree,
  schema: GeneratorSchema,
  projectType: ProjectType
): Promise<NormalizeOptions> {
  const name = names(schema.name).fileName;
  const appdir = appDirectory(tree, projectType);
  const projectName = schema.project.replace(new RegExp('/', 'g'), '-');

  const project = joinPathFragments(projectName, name);
  const projectRoot = joinPathFragments(appdir, projectName);
  const root = joinPathFragments(projectRoot, 'src', name);

  const args = await classInstance<NormalizedArguments>(
    FunctionsGeneratorArguments,
    schema
  );
  return {
    name,
    root,
    args,
    project,
    projectRoot,
    projectName,
  };
}
