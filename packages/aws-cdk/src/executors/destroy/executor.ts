import { ExecutorContext } from '@nx/devkit';
import {
  toArray,
  runCommand,
  normalizeOptions,
  ArgumentMap,
} from '@aws-nx/utils';

import { DestroyExecutorSchema } from './schema';
import { createCommand, requireApproval } from '../../util/executor';

/**
 *
 * @param schema
 * @param context
 * @description Main executor for the destroy executor
 * @returns
 */
export default async function runExecutor(
  schema: DestroyExecutorSchema,
  context: ExecutorContext
) {
  const args = normalizeArguments(schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('destroy', options);
  return await runCommand(command, context.root);
}

/**
 *
 * @param schema
 * @description Normalizes the arguments passed to the destroy command
 * @returns
 */
export function normalizeArguments(
  schema: DestroyExecutorSchema
): Record<string, string> {
  const argsMap = new ArgumentMap<Record<string, string>>();

  const approval = requireApproval(schema.approval);
  const stack = toArray(schema.stack).join(' ');

  argsMap.register('_', stack);
  argsMap.register('require-approval', approval);

  return argsMap.toJson();
}
