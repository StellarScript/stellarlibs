import { ExecutorContext } from '@nx/devkit';
import { pick, runCommand, sanitizeObject, toArray } from '@stellarlibs/utils';

import { BootstrapExecutorSchema } from './schema';
import { createCommand } from '../../common/executor';

export interface Arguments {
  tags?: string[];
  profile?: string;
  qualifier?: string;
  trust?: boolean;
  'bootstrap-kms-key-id'?: string;
  'bootstrap-bucket-name'?: string;
  'termination-protection'?: boolean;
  'cloudformation-execution-policies'?: string;
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
  const command = createCommand('bootstrap', options);
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
    args,
    projectName,
    projectRoot,
  };
}

export function normalizeArguments(options: BootstrapExecutorSchema) {
  return sanitizeObject({
    tags: toArray(options.tag),
    'bootstrap-bucket-name': options.bucketName,
    'bootstrap-kms-key-id': options.kmsKeyId,
    'cloudformation-execution-policies': options.executionPolicy,
    'termination-protection': options.terminationProtection,
    ...pick(options, ['profile', 'qualifier', 'trust']),
  });
}
