import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, classInstance } from '@aws-nx/utils';

import { BootstrapOptions } from './options';
import { BootstrapExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

/**
 *
 * @param schema
 * @param context
 * @description Main executor for the bootstrap executor
 * @returns
 */
export default async function runExecutor(
  schema: BootstrapExecutorSchema,
  context: ExecutorContext
) {
  const args = await classInstance(BootstrapOptions, schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('bootstrap', options);
  return await runCommand(command, context.root);
}
