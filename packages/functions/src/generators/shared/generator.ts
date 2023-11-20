import * as path from 'path';
import {
  type Tree,
  names,
  joinPathFragments,
  addProjectConfiguration,
} from '@nx/devkit';

import {
  ProjectType,
  appDirectory,
  classInstance,
  addProjectFiles,
  updateConfiguration,
} from '@aws-nx/utils';

import { GeneratorAppSchema } from './schema';
import { createConfiguration } from './config';
import { FunctionsGeneratorArguments } from './arguments';

interface NormalizedArguments {
  tags: string[];
  bundle: boolean;
}

interface NormalizeOptions {
  name: string;
  root: string;
  projectName: string;
  projectRoot: string;
  args: NormalizedArguments;
}

export async function createApplication<T extends GeneratorAppSchema>(
  tree: Tree,
  schema: T,
  projectType: ProjectType
): Promise<void> {
  const options = await normalizeOptions(tree, schema, projectType);

  const config = createConfiguration(projectType, {
    projectRoot: options.projectRoot,
    tags: options.args.tags,
  });

  addProjectFiles(tree, path.join(__dirname, 'files', 'app'), {
    projectRoot: options.projectRoot,
    projectName: options.projectName,
  });
  addProjectFiles(tree, path.join(__dirname, 'files', 'src'), {
    projectRoot: joinPathFragments(options.projectRoot, 'src'),
    projectName: options.projectName,
  });
  addProjectConfiguration(tree, options.name, config);
  createLibConfiguration(tree, options);
}

/**
 *
 * @param tree
 * @param options
 */
function createLibConfiguration(tree: Tree, options: NormalizeOptions): void {
  updateConfiguration(tree, options.projectName, (workspace) => {
    workspace.targets.build.executor = '@nx/esbuild:esbuild';
    workspace.tags = options.args.tags;
    workspace.targets.build.options = {
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
  schema: GeneratorAppSchema,
  projectType: ProjectType
): Promise<NormalizeOptions> {
  const name = names(schema.name).fileName;
  const projectDirectory = schema.directory
    ? `${names(schema.directory).fileName}/${name}`
    : name;

  const projectRoot = `${appDirectory(tree, projectType)}/${projectDirectory}`;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const root = joinPathFragments(projectRoot, 'src', name);

  const args = await classInstance<NormalizedArguments>(
    FunctionsGeneratorArguments,
    schema
  );
  return {
    name,
    root,
    args,
    projectName,
    projectRoot,
  };
}
