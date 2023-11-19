import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, classInstance } from '@aws-nx/utils';

import { SynthOptions } from './options';
import { SynthExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

/**
 *
 * @param schema
 * @param context
 * @description Main executor for the synth executor
 * @returns
 */
export default async function runExecutor(
  schema: SynthExecutorSchema,
  context: ExecutorContext
) {
  const args = classInstance(SynthOptions, schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('synth', options);
  return await runCommand(command, context.root);
}
