import { ExecutorContext } from '@nx/devkit';
import { BootstrapExecutorSchema } from './schema';

interface NormalizeOptions {}

export default async function runExecutor(
  options: BootstrapExecutorSchema,
  context: ExecutorContext
) {
  normalizeOptions(options, context);
  return {
    success: true,
  };
}

export function normalizeOptions(options: BootstrapExecutorSchema, context: ExecutorContext) {
  console.log('-----', context);
  console.log('-----', options);
}
