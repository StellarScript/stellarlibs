import { ExecutorContext } from '@nx/devkit';
import { runCommand } from '@aws-nx/utils';

import { AuthExecutorSchema } from './schema';
import { createAuthCommand } from '../../util/executor';

export default async function runExecutor(
  _schema: AuthExecutorSchema,
  context: ExecutorContext
) {
  const command = createAuthCommand();
  return await runCommand(command, context.root);
}
