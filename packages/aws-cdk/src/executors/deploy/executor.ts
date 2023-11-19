import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, classInstance } from '@aws-nx/utils';

import { DeployOptions } from './options';
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
  const args = classInstance(DeployOptions, schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('deploy', options);
  return await runCommand(command, context.root);
}
