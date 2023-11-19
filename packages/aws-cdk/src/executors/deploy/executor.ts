import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, classInstance } from '@aws-nx/utils';

import { DeployArguments } from './arguments.ts';
import { DeployExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

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
  const args = classInstance(DeployArguments, schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('deploy', options);
  return await runCommand(command, context.root);
}
