import {
  Tree,
  names,
  generateFiles,
  ProjectConfiguration,
  readProjectConfiguration,
  updateProjectConfiguration,
  offsetFromRoot,
  GeneratorCallback,
  runTasksInSerial,
} from '@nx/devkit';
import type { Linter } from '@nx/linter';

export interface GeneratorOptions {
  projectName: string;
  projectRoot: string;
  linter?: Linter;
}

/**
 *
 * @param tree
 * @param projectName
 * @param updater
 */
export function updateConfiguration<T>(
  tree: Tree,
  projectName: string,
  updater: (x: T & ProjectConfiguration) => T & ProjectConfiguration
): void {
  const workspace = readConfiguration<T>(tree, projectName);
  const updatedWorkspace = updater(workspace);
  updateProjectConfiguration(tree, projectName, updatedWorkspace);
}

/**
 *
 * @param tree
 * @param projectName
 * @returns
 */
export function readConfiguration<T>(tree: Tree, projectName: string): T & ProjectConfiguration {
  return readProjectConfiguration(tree, projectName) as T & ProjectConfiguration;
}

/**
 *
 * @param tree
 * @param filePath
 * @param options
 */
export function addProjectFiles(tree: Tree, filePath: string, options: GeneratorOptions): void {
  generateFiles(tree, filePath, options.projectRoot, {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  });
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

export function addIgnoreFileName(tree: Tree, comment: string, fileNames: string[]): void {
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
