import { ExecutorContext } from '@nx/devkit';
import { exclude, runCommand, sanitizeObject, toArray } from '@stellarlibs/utils';

import { SynthExecutorSchema } from './schema';
import { createCommand } from '../../common/executor';

export interface NormalizedArguments {
  _: string[];
  app?: string;
  tags: string[];
  all?: boolean;
  quiet?: boolean;
  parameters?: string[];
  exclusively?: boolean;
}

export interface NormalizedOptions {
  projectName;
  projectRoot;
  args: NormalizedArguments;
}

export default async function runExecutor(schema: SynthExecutorSchema, context: ExecutorContext) {
  const options = normalizeOptions(schema, context);
  const command = createCommand('synth', options);
  return runCommand(command, context.root);
}

export function normalizeOptions(options: SynthExecutorSchema, context: ExecutorContext) {
  const projectName = context.projectName;
  const projectRoot = context.workspace.projects[projectName].root;
  const args = normalizeArguments(options);
  return {
    args,
    projectName,
    projectRoot,
  };
}

export function normalizeArguments(options: SynthExecutorSchema): NormalizedArguments {
  return sanitizeObject({
    _: toArray(options.stack),
    tags: toArray(options.tag),
    parameters: toArray(options.parameter),
    ...exclude(options, ['stack', 'parameter', 'tag']),
  });
}
