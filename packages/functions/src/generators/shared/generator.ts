import * as path from 'path';
import {
  type Tree,
  updateJson,
  formatFiles,
  joinPathFragments,
  addProjectConfiguration,
  names,
} from '@nx/devkit';
import {
  type ProjectType,
  appDirectory,
  addProjectFiles,
  updateProjectConfig,
  classInstance,
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

export default async function functionsGenerator(
  tree: Tree,
  schema: GeneratorSchema,
  projectType: ProjectType
): Promise<void> {
  const options = await normalizeOptions(tree, schema, projectType);
  await createApplication(tree, options, projectType);

  if (tree.exists(options.root)) {
    throw new Error(`${options.name} already exists`);
  }

  addProjectFiles(tree, joinPathFragments(__dirname, 'files', 'lib'), {
    projectName: options.projectName,
    projectRoot: options.root,
  });

  addProjectFiles(tree, joinPathFragments(__dirname, 'files', 'src'), {
    projectName: options.projectName,
    projectRoot: joinPathFragments(options.projectRoot, 'src'),
  });

  updateLibConfiguration(tree, options);
  await formatFiles(tree);
}

async function createApplication(
  tree: Tree,
  options: NormalizeOptions,
  projectType: ProjectType
): Promise<void> {
  if (tree.exists(options.projectRoot)) {
    return;
  }
  const config = createConfiguration(projectType, {
    tags: options.args.tags,
    projectRoot: options.projectRoot,
  });
  addProjectConfiguration(tree, options.projectName, config);

  createLibConfiguration(tree, options);
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

/**
 *
 * @param tree
 * @param options
 */
export function updateLibConfiguration(
  tree: Tree,
  options: NormalizeOptions
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

  // update serverless
  const serverlessPath = joinPathFragments(
    options.projectRoot,
    'serverless.json'
  );
  updateJson(tree, serverlessPath, (config) => {
    config.handlers.push({
      name: options.name,
      root: options.root,
    });
    return config;
  });

  // update project config
  updateProjectConfig(tree, options.projectName, (workspace) => {
    workspace.targets.build.options.additionalEntryPoints.push(
      joinPathFragments(options.root, 'index.ts')
    );
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
