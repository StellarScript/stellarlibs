import { addDependenciesToPackageJson, joinPathFragments, offsetFromRoot, Tree } from '@nx/devkit';
import { TestRunner } from './constants';
import { TestRunnerType } from './types';
import { GeneratorTasks } from './generator';

type Options = {
   testRunner: TestRunnerType;
   projectRoot: string;
   projectName: string;
};

export function testGenerator(tree: Tree, options: Options, tasks: GeneratorTasks) {
   const offset = offsetFromRoot(options.projectRoot);

   if (options.testRunner === TestRunner.None) {
      return;
   }

   if (options.testRunner === TestRunner.Jest) {
      tree.write(
         joinPathFragments(options.projectRoot, 'jest.config.ts'),
         JSON.stringify(jestConfig(offset, options.projectName))
      );
      tasks.register(addDependenciesToPackageJson(tree, {}, jestDependencies));
   }

   if (options.testRunner === TestRunner.Vitest) {
      tree.write(joinPathFragments(options.projectRoot, 'vitest.config.ts'), vitestConfig());
      tasks.register(addDependenciesToPackageJson(tree, {}, viteDependencies));
   }
}

export function testCommands(options: Options) {
   if (options.testRunner === TestRunner.None) {
      return null;
   }
   if (options.testRunner === TestRunner.Jest) {
      return {
         executor: '@nx/jest:jest',
         outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
         options: {
            jestConfig: joinPathFragments(options.projectRoot, 'jest.config.ts'),
            passWithNoTests: true,
         },
      };
   }
   if (options.testRunner === TestRunner.Vitest) {
      return {
         executor: '@nx/vite:test',
         outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
         options: {
            config: joinPathFragments(options.projectRoot, 'vitest.config.ts'),
         },
      };
   }
   return null;
}

/**
 *
 * Test Templates
 */
function jestConfig(offsetFromRoot: string, displayName: string) {
   return {
      displayName: displayName,
      preset: `${offsetFromRoot}jest.preset.js`,
      transform: {
         '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
      },
      moduleFileExtensions: ['ts', 'js', 'html'],
      coverageDirectory: `${offsetFromRoot}coverage/packages/nest-serverless`,
   };
}

function vitestConfig() {
   return `
    import tsconfigPaths from 'vite-tsconfig-paths';
    import { defineConfig } from 'vitest/config';
    import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

    export default defineConfig({
    plugins: [
        nxViteTsPaths(),
        tsconfigPaths(),
    ],
    test: {
        globals: true,

        environment: 'node',
        reporters: ['default'],
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist'],
        mockReset: true,
        clearMocks: true,
    },
    });
   `;
}

export const viteDependencies = {
   vitest: '^1.5.0',
   '@vitest/coverage-v8': '^1.5.0',
   'vite-tsconfig-paths': '^4.3.2',
   'vitest-mock-extended': '^1.3.1',
};

export const jestDependencies = {
   jest: '^29.4.1',
   '@nx/jest': '18.0.4',
   '@types/jest': '^29.4.0',
   'jest-environment-jsdom': '^29.4.1',
};
