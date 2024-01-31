import { ExecutorContext } from '@nx/devkit';
import {
  runCommand,
  normalizeOptions,
  classInstance,
} from '@stellar-libs/utils';

import { BootstrapArguments } from './arguments.ts';
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
  const args = await classInstance(BootstrapArguments, schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('bootstrap', options);
  return await runCommand(command, context.root);
}
