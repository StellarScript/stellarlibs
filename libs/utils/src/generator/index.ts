import {
  names,
  updateJson,
  generateFiles,
  offsetFromRoot,
  joinPathFragments,
} from '@nx/devkit';
import type { Tree, GeneratorCallback } from '@nx/devkit';
import { lintProjectGenerator } from '@nx/linter';
import type { GeneratorOptions } from './types';

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

export function addProjectFiles(
  tree: Tree,
  options: GeneratorOptions,
  filePath: string
): void {
  generateFiles(tree, filePath, options.projectRoot, {
    ...options,
    ...names(options.projectName),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  });
}

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
