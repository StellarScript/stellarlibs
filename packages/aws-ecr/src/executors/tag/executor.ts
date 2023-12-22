import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';
import { classInstance, runCommand } from '@aws-nx/utils';

import { TagArguments } from './arguments';
import { TagExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

export default async function runExecutor(
  schema: TagExecutorSchema,
  context: ExecutorContext
) {
  const args = await classInstance(TagArguments, schema);
  const options = await normalizeOptions(args, context);

  const command = createCommand(`tag ${options.projectName}`, options);
  return await runCommand(command, context.root);
}

export function normalizeOptions(
  parsedArgs: TagArguments,
  context: ExecutorContext
) {
  const cxtOpts = context?.workspace?.projects[
    context.projectName!
  ] as ProjectConfiguration;

  return {
    args: parsedArgs,
    root: cxtOpts.root,
    projectName: context.projectName || '',
  };
}
