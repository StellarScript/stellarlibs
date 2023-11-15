import type { Linter } from '@nx/linter';

export interface GeneratorOptions {
  projectName: string;
  projectRoot: string;
  linter?: Linter;
}
