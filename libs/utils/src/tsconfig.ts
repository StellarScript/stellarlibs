import * as path from 'path';
import { offsetFromRoot, Tree } from '@nx/devkit';
import { TestRunnerType } from './types';

type Options = {
   projectRoot: string;
   baseConfigName?: string;
   test?: TestRunnerType;
};

export function tsConfigGenerator(tree: Tree, options: Options) {
   const offset = offsetFromRoot(options.projectRoot);
   baseConfigGenerator(tree, offset, options);
   appTsConfigGenerator(tree, offset, options);
   specTsConfigGenerator(tree, offset, options);
}

/**
 *
 * @param tree
 * @param offset
 * @param options
 */
export function baseConfigGenerator(tree: Tree, offset: string, options: Options) {
   const baseConfig = baseTsConfigTemplate(offset, options.baseConfigName);

   if (options.test !== 'none') {
      baseConfig.references = [...baseConfig.references, { path: './tsconfig.spec.json' }];
   }
   tree.write(path.join(options.projectRoot, 'tsconfig.json'), JSON.stringify(baseConfig));
}

/**
 *
 * @param tree
 * @param offset
 * @param options
 */
export function appTsConfigGenerator(tree: Tree, offset: string, options: Options) {
   const appConfig = appTsConfigTemplate(offset);

   if (options.test !== 'none') {
      appConfig.exclude = [...appConfig.exclude, 'src/**/*.spec.ts', 'src/**/*.test.ts'];
   }
   tree.write(path.join(options.projectRoot, 'tsconfig.app.json'), JSON.stringify(appConfig));
}

/**
 *
 * @param tree
 * @param offset
 * @param options
 */
export function specTsConfigGenerator(tree: Tree, offset: string, options: Options) {
   if (options.test !== 'none') {
      const specConfig = specTsConfigTemplate(offset);

      specConfig.include = [...specConfig.include, `${options.test}.config.ts`];
      if (options.test) specConfig.compilerOptions.types.push(options.test);

      tree.write(path.join(options.projectRoot, 'tsconfig.spec.json'), JSON.stringify(specConfig));
   }
}

/**
 *
 * Ts Config Templates
 */
function baseTsConfigTemplate(offsetFromRoot: string, baseConfigName?: string) {
   const _baseConfigName = baseConfigName || 'tsconfig.base.json';
   return {
      extends: `${offsetFromRoot}${_baseConfigName}`,
      files: [],
      include: [],
      references: [
         {
            path: './tsconfig.app.json',
         },
      ],
   };
}

function appTsConfigTemplate(offsetFromRoot: string) {
   return {
      extends: './tsconfig.json',
      compilerOptions: {
         outDir: `${offsetFromRoot}dist/out-tsc`,
         target: 'ES2022',
         module: 'CommonJS',
         esModuleInterop: true,
         skipLibCheck: true,
      },
      exclude: ['node_modules'],
      include: ['**/*.ts'],
   };
}

function specTsConfigTemplate(offsetFromRoot: string) {
   return {
      extends: './tsconfig.json',
      compilerOptions: {
         outDir: `${offsetFromRoot}dist/out-tsc`,
         module: 'commonjs',
         types: ['node'],
      },
      include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/*.d.ts'],
   };
}
