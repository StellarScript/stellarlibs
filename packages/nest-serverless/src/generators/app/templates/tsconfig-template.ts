export function baseTsConfig(offsetFromRoot: string) {
   return {
      extends: `${offsetFromRoot}tsconfig.base.json`,
      files: [],
      include: [],
      references: [
         {
            path: './tsconfig.app.json',
         },
      ],
   };
}

export function appTsConfig(offsetFromRoot: string) {
   return {
      extends: './tsconfig.json',
      compilerOptions: {
         outDir: `${offsetFromRoot}dist/out-tsc`,
         target: 'ES2022',
         module: 'CommonJS',
         esModuleInterop: true,
         skipLibCheck: true,
      },
      exclude: ['./serverless.ts', 'node_modules'],
      include: ['**/*.ts'],
   };
}

export function specTsConfig(offsetFromRoot: string) {
   return {
      extends: './tsconfig.json',
      compilerOptions: {
         outDir: `${offsetFromRoot}dist/out-tsc`,
         module: 'commonjs',
         types: ['jest', 'node'],
      },
      include: ['jest.config.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts', 'src/**/*.d.ts'],
   };
}
