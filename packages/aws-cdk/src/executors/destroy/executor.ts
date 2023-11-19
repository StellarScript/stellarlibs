import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, classInstance } from '@aws-nx/utils';

import { DestroyArguments } from './arguments.ts';
import { DestroyExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

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
  const args = await classInstance(DestroyArguments, schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('destroy', options);
  return await runCommand(command, context.root);
}
