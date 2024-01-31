import { ExecutorContext } from '@nx/devkit';
import { runCommand, sanitizeObject, toArray } from '@stellarlibs/utils';

import { createCommand } from '../../common';
import { BootstrapExecutorSchema } from './schema';

export interface Arguments {
  tags: string[];
  profile: string;
  qualifier: string;
  trust: boolean;
  'bootstrap-kms-key-id': string;
  'bootstrap-bucket-name': string;
  'termination-protection': boolean;
  'cloudformation-execution-policies': string;
}

interface NormalizeOptions {
  projectName: string;
  projectRoot: string;
  args: Arguments;
}

export default async function runExecutor(
  schema: BootstrapExecutorSchema,
  context: ExecutorContext
) {
  const options = normalizeOptions(schema, context);

  const command = createCommand('bootstrap', {
    args: options.args,
    projectRoot: options.projectRoot,
    projectName: options.projectName,
  });

  return await runCommand(command, context.root);
}

export function normalizeOptions(
  options: BootstrapExecutorSchema,
  context: ExecutorContext
): NormalizeOptions {
  const projectName = context.projectName;
  const projectRoot = context.workspace.projects[projectName].root;
  const args = normalizeArguments(options);

  return {
    projectName,
    projectRoot,
    args: sanitizeObject(args),
  };
}

export function normalizeArguments(options: BootstrapExecutorSchema) {
  return {
    tags: toArray(options.tag),
    profile: options.profile,
    qualifier: options.qualifier,
    trust: options.trust,
    'bootstrap-bucket-name': options.bucketName,
    'bootstrap-kms-key-id': options.kmsKeyId,
    'cloudformation-execution-policies': options.executionPolicy,
    'termination-protection': options.terminationProtection,
  };
}
