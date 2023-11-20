import { ProjectConfiguration as ProjectConfig } from '@nx/devkit';

export interface GeneratorAppSchema {
  name: string;
  bundle?: boolean;
  directory?: string;
  tag?: string | string[];
}

export interface ProjectConfiguration extends ProjectConfig {
  functions: {
    name: string;
    root: string;
    project: string;
  }[];
  targets: {
    build: {
      executor: string;
      options: {
        additionalEntryPoints: string[];
      };
    };
  };
}
