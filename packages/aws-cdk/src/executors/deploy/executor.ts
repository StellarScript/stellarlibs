import { ExecutorContext } from '@nx/devkit';
import {
  toArray,
  runCommand,
  normalizeOptions,
  ArgumentMap,
} from '@aws-nx/utils';

import { DeployExecutorSchema } from './schema';
import { createCommand, requireApproval } from '../../util/executor';

/**
 *
 * @param schema
 * @param context
 * @description Main executor for the deploy executor
 * @returns
 */
export default async function runExecutor(
  schema: DeployExecutorSchema,
  context: ExecutorContext
) {
  const args = normalizeArguments(schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('deploy', options);
  return await runCommand(command, context.root);
}

/**
 *
 * @param schema
 * @description Normalizes the arguments passed to the deploy command
 * @returns
 */
export function normalizeArguments(
  schema: DeployExecutorSchema
): Record<string, string> {
  const argsMap = new ArgumentMap<Record<string, string>>();

  const approval = requireApproval(schema.approval);
  const stack = toArray(schema.stack).join(' ');

  argsMap.register('_', stack);
  argsMap.register('require-approval', approval);
  return argsMap.toJson();
}
