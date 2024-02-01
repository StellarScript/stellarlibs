import { ExecutorContext } from '@nx/devkit';
import { excludeCopy, runCommand, sanitizeObjectCopy } from '@stellarlibs/utils';
import {
  createCommand,
  commonExecutorSchema,
  commonStackExecutorSchema,
} from '../../common/executor';
import { SynthExecutorSchema } from './schema';

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

export function normalizeArguments(schema: SynthExecutorSchema): NormalizedArguments {
  const commonArgs = commonExecutorSchema(schema);
  const commonStackArgs = commonStackExecutorSchema(schema);
  const restArgs = excludeCopy(schema, [...commonArgs.exclude, ...commonStackArgs.exclude]);

  return sanitizeObjectCopy({
    ...restArgs,
    ...commonArgs.args,
    ...commonStackArgs.args,
  });
}
