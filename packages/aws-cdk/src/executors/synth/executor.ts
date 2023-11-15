import * as path from 'path';
import { ExecutorContext } from '@nx/devkit';
import { runCommand, normalizeOptions, ArgumentMap } from '@aws-nx/utils';

import { SynthExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

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

export default async function runExecutor(
  schema: SynthExecutorSchema,
  context: ExecutorContext
) {
  const args = normalizeArguments(schema);
  const options = normalizeOptions(args, context);

  const command = createCommand('synth', options);
  return await runCommand(command, context.root);
}
