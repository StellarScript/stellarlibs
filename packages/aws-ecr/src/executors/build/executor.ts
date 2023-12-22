import type { ExecutorContext, ProjectConfiguration } from '@nx/devkit';
import { classInstance, runCommand } from '@aws-nx/utils';

import { BuildArguments } from './arguments';
import { BuildExecutorSchema } from './schema';
import { creaetBuildCommand } from '../../util/executor';

export default async function runExecutor(
  schema: BuildExecutorSchema,
  context: ExecutorContext
) {
  const args = await classInstance(BuildArguments, schema);
  const options = normalizeOptions(args, context);

  const command = creaetBuildCommand(options);
  await runCommand(command, options.root);
}

export function normalizeOptions(
  parsedArgs: BuildArguments,
  context: ExecutorContext
) {
  const cxtOpts = context?.workspace?.projects[
    context.projectName!
  ] as ProjectConfiguration;

  const injectEnvs = context.target['docker-build']?.options.injectEnvs || [];

  return {
    args: { ...parsedArgs, injectEnvs },
    root: cxtOpts.root,
    projectName: context.projectName || '',
  };
}
