export interface AppGeneratorSchema {
   name: string;
   project: string;
   test: 'jest' | 'none' | 'vitest';
}
