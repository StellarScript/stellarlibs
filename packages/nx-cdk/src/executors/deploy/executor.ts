import { ExecutorContext } from '@nx/devkit';
import { excludeCopy, runCommand, sanitizeObject } from '@stellarlibs/utils';

import { DeployExecutorSchema } from './schema';
import {
  commonExecutorSchema,
  commonStackExecutorSchema,
  createCommand,
} from '../../common/executor';

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

export function normalizeArguments(schema: DeployExecutorSchema) {
  const commonArgs = commonExecutorSchema<DeployExecutorSchema>(schema);
  const commonStackArgs = commonStackExecutorSchema<DeployExecutorSchema>(schema);

  const restArgs = excludeCopy(schema, [
    'noRollback',
    'outputFile',
    'changeSetName',
    'ignoreNoStacks',
    'hotswapFallback',
    ...commonArgs.exclude,
    ...commonStackArgs.exclude,
  ]);

  return sanitizeObject({
    ...restArgs,
    ...commonArgs.args,
    ...commonStackArgs.args,
    'no-rollback': schema.noRollback,
    'outputs-file': schema.outputFile,
    'change-set-name': schema.changeSetName,
    'ignore-no-stacks': schema.ignoreNoStacks,
    'hotswap-fallback': schema.hotswapFallback,
  });
}
