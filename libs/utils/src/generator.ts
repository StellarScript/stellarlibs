import {
   Tree,
   names,
   readJson,
   updateJson,
   generateFiles,
   offsetFromRoot,
   GeneratorCallback,
   runTasksInSerial,
   joinPathFragments,
   ProjectConfiguration,
   readProjectConfiguration,
   updateProjectConfiguration,
} from '@nx/devkit';
import type { Linter } from '@nx/linter';

export interface GeneratorOptions {
   projectName: string;
   projectRoot: string;
   linter?: Linter;
   testRunner?: string;
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
      testRunner: options.testRunner ?? '',
      template: '',
   });
}

export class GeneratorTasks extends Set<GeneratorCallback> {
   public register(task: GeneratorCallback | undefined): void {
      if (!task) return;
      this.add(task);
   }

   public async runInSerial(): Promise<void> {
      const tasks = await runTasksInSerial(...Array.from(this));
      await tasks();
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

/**
 *
 * @param tree
 * @param projectName
 * @description Remove library path from tsconfig.base.json
 */
export function removeTsConfigPath(tree: Tree, projectName: string): void {
   try {
      const workspaceName = readJson(tree, 'package.json').name.split('/')[0];
      const key = `${workspaceName}/${projectName}/*`;

      updateJson(tree, 'tsconfig.base.json', (json) => {
         delete json.compilerOptions.paths[key];
         return json;
      });
   } catch (e) {
      return;
   }
}
