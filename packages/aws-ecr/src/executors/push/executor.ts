import { ExecutorContext, ProjectConfiguration } from '@nx/devkit';
import { classInstance, runCommand } from '@aws-nx/utils';

import { PushArguments } from './arguments';
import { PushExecutorSchema } from './schema';
import { createCommand } from '../../util/executor';

export default async function runExecutor(
  schema: PushExecutorSchema,
  context: ExecutorContext
) {
  const args = await classInstance(PushArguments, schema);
  const options = await normalizeOptions(args, context);

  const command = createCommand(`push`, options);
  return await runCommand(command, context.root);
}

export async function normalizeOptions(
  parsedArgs: PushArguments,
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
