import type { ExecutorContext } from '@nx/devkit';

export interface ExecutorOptions {
  projectName: string;
  plugin: string;
  executor: string;
  root?: string;
}

export function ExecutionContextMock(
  options: ExecutorOptions,
  workspaceVersion = 2
): ExecutorContext {
  return {
    projectName: options.projectName,
    root: options.root || '/root',
    cwd: options.root || '/root',
    workspace: {
      version: workspaceVersion,
      projects: {
        [options.projectName]: {
          root: `apps/${options.projectName}`,
          targets: {
            test: {
              executor: `${options.plugin}:${options.executor}`,
            },
          },
        },
      },
    },
    target: {
      executor: `${options.plugin}:${options.executor}`,
    },
    isVerbose: true,
  };
}
