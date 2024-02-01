import { ExecutorContext } from '@nx/devkit';
import { excludeCopy, runCommand, sanitizeObjectCopy } from '@stellarlibs/utils';
import { commonExecutorSchema, createCommand } from '../../common/executor';
import { BootstrapExecutorSchema } from './schema';

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

export function normalizeArguments(schema: BootstrapExecutorSchema) {
  const commonArgs = commonExecutorSchema<BootstrapExecutorSchema>(schema);

  const restArgs = excludeCopy(schema, [
    'bucketName',
    'kmsKeyId',
    'executionPolicy',
    'terminationProtection',
    ...commonArgs.exclude,
  ]);

  return sanitizeObjectCopy({
    ...restArgs,
    ...commonArgs.args,
    'bootstrap-bucket-name': schema.bucketName,
    'bootstrap-kms-key-id': schema.kmsKeyId,
    'termination-protection': schema.terminationProtection,
    'cloudformation-execution-policies': schema.executionPolicy,
  });
}
