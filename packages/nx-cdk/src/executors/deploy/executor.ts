import { ExecutorContext } from '@nx/devkit';
import { exclude, runCommand, sanitizeObject, toArray } from '@stellarlibs/utils';

import { DeployExecutorSchema } from './schema';
import { createCommand } from '../../common/executor';

export interface NormalizedArguments {
  _: string[];
  all?: boolean;
  app?: string;
  force?: boolean;
  progress?: string;
  method?: string;
  hotswap?: string;
  tags: string[];
  parameters: string[];
  'no-rollback': boolean;
  'outputs-file': string;
  'change-set-name': string;
  'ignore-no-stacks': boolean;
  'hotswap-fallback': string;
}

export interface NormalizedOptions {
  projectName;
  projectRoot;
  args: NormalizedArguments;
}

export default async function runExecutor(schema: DeployExecutorSchema, context: ExecutorContext) {
  const options = normalizeOptions(schema, context);
  const command = createCommand('deploy', options);
  return runCommand(command, context.root);
}

export function normalizeOptions(options: DeployExecutorSchema, context: ExecutorContext) {
  const projectName = context.projectName;
  const projectRoot = context.workspace.projects[projectName].root;
  const args = normalizeArguments(options);
  return {
    args,
    projectName,
    projectRoot,
  };
}

export function normalizeArguments(options: DeployExecutorSchema) {
  return sanitizeObject({
    _: toArray(options.stack),
    tags: toArray(options.tag),
    parameters: toArray(options.parameter),
    'no-rollback': options.noRollback,
    'outputs-file': options.outputFile,
    'change-set-name': options.changeSetName,
    'ignore-no-stacks': options.ignoreNoStacks,
    'hotswap-fallback': options.hotswapFallback,

    ...exclude(options, [
      'tag',
      'stack',
      'parameter',
      'noRollback',
      'outputFile',
      'changeSetName',
      'ignoreNoStacks',
      'hotswapFallback',
    ]),
  });
}
