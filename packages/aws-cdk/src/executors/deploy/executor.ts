import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, ArgumentMap } from '@aws-nx/utils';

import { DeployExecutorSchema } from './schema';
import { createCommand, requireApproval } from '../../util/executor';

export function normalizeArguments(
  schema: DeployExecutorSchema
): Record<string, string> {
  const argsMap = new ArgumentMap<Record<string, string>>();

  const approval = requireApproval(schema.approval);
  const stack = Array.isArray(schema.stack)
    ? schema.stack.join(' ')
    : schema.stack;

  argsMap.register('_', stack);
  argsMap.register('require-approval', approval);

  return argsMap.toJson();
}

export default async function runExecutor(
  schema: DeployExecutorSchema,
  context: ExecutorContext
) {
  const args = normalizeArguments(schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('deploy', options);
  return await runCommand(command, context.root);
}
