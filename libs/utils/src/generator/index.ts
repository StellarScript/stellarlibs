import {
  names,
  updateJson,
  generateFiles,
  offsetFromRoot,
  joinPathFragments,
  runTasksInSerial,
  ProjectConfiguration,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nx/devkit';
import type { Tree, GeneratorCallback } from '@nx/devkit';
import { lintProjectGenerator } from '@nx/linter';
import type { GeneratorOptions } from './types';

/**
 *
 * @param tree
 * @param comment
 * @param fileNames
 * @description Adds a file to the .gitignore file
 * @returns
 */
export function addIgnoreFileName(
  tree: Tree,
  comment: string,
  fileNames: string[]
): void {
  const exists = tree.exists('.gitignore');
  if (!exists) {
    return;
  }
  const ignores = (tree.read('.gitignore') || []).toString().split('\n');

  for (const fileName of fileNames) {
    if (!ignores.includes(fileName)) {
      ignores.push(comment, fileName, '');
    }
    tree.write('./.gitignore', ignores.join('\n'));
  }
}

/**
 *
 * @param tree
 * @param options
 * @description Updates the lint configuration file
 */
export function updateLintConfig(tree: Tree, options: GeneratorOptions): void {
  updateJson(tree, `${options.projectRoot}/.eslintrc.json`, (json) => {
    json.plugins = json?.plugins || [];
    const plugins: string[] = json.plugins;

    const hasCdkPlugin = plugins.findIndex((row) => row === 'cdk') >= 0;
    if (!hasCdkPlugin) {
      plugins.push('cdk');
    }
    return json;
  });
}

/**
 *
 * @param tree
 * @param options
 * @param filePath
 * @description Adds the project files to the project
 */
export function addProjectFiles(
  tree: Tree,
  filePath: string,
  options: GeneratorOptions
): void {
  generateFiles(tree, filePath, options.projectRoot, {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  });
}

/**
 *
 * @param tree
 * @param options
 * @description Generate linting files
 * @returns
 */
export async function lintingGenerator(
  tree: Tree,
  options: GeneratorOptions
): Promise<GeneratorCallback> {
  return await lintProjectGenerator(tree, {
    linter: options.linter,
    project: options.projectName,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.*?.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.ts`],
    skipFormat: false,
    setParserOptionsProject: true,
  });
}

/**
 *
 * @param tree
 * @param dirPath
 * @description Removes files and directories recursively
 */
export function removeDirectoryRecursively(tree: Tree, dirPath: string): void {
  const list = tree.exists(dirPath) ? tree.children(dirPath) : [];

  for (const fileName of list) {
    const filePath = joinPathFragments(dirPath, fileName);
    const isFile = tree.isFile(filePath);

    if (isFile) {
      tree.delete(filePath);
    } else {
      removeDirectoryRecursively(tree, filePath);
    }
  }
}

export class GeneratorTasks extends Set<GeneratorCallback> {
  public register(task: GeneratorCallback | undefined): void {
    if (!task) return;
    this.add(task);
  }

  public async runInSerial(): Promise<GeneratorCallback> {
    return runTasksInSerial(...Array.from(this));
  }
}

export function updateProjectConfig(
  tree: Tree,
  projectName: string,
  updater: (x: ProjectConfiguration) => ProjectConfiguration
): void {
  const workspace = readProjectConfiguration(tree, projectName);
  const updatedWorkspace = updater(workspace);
  updateProjectConfiguration(tree, projectName, updatedWorkspace);
}
