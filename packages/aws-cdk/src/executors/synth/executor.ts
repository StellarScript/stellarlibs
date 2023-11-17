import * as path from 'path';
import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, ArgumentMap } from '@aws-nx/utils';

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
  const args = normalizeArguments(schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('synth', options);
  return await runCommand(command, context.root);
}

/**
 *
 * @param schema
 * @description Normalizes the arguments passed to the synth command
 * @returns
 */
export function normalizeArguments(
  schema: SynthExecutorSchema
): Record<string, string> {
  const argsMap = new ArgumentMap<Record<string, string>>();

  const quite = schema.quiet;
  const output = schema.output ?? path.resolve('dist');
  const stack = Array.isArray(schema.stack)
    ? schema.stack.join(' ')
    : schema.stack;

  argsMap.register('_', stack);
  argsMap.register('output', output);
  argsMap.register('quiet', quite);
  return argsMap.toJson();
}
