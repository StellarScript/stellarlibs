import { addDependenciesToPackageJson, joinPathFragments, offsetFromRoot, Tree } from '@nx/devkit';

type Options = {
   testRunner: 'jest' | 'none' | 'vitest';
   projectRoot: string;
   projectName: string;
};

export function testGenerator(tree: Tree, options: Options) {
   const offset = offsetFromRoot(options.projectRoot);

   if (options.testRunner === 'none') {
      return;
   }

   if (options.testRunner === 'jest') {
      tree.write(
         joinPathFragments(options.projectRoot, 'jest.config.ts'),
         JSON.stringify(jestConfig(offset, options.projectName))
      );
      addDependenciesToPackageJson(tree, {}, jestDependencies);
   }

   if (options.testRunner === 'vitest') {
      tree.write(joinPathFragments(options.projectRoot, 'vite.config.ts'), vitestConfig());
      addDependenciesToPackageJson(tree, {}, viteDependencies);
   }
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
