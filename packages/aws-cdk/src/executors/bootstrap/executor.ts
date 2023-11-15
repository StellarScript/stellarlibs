import { BootstrapExecutorSchema } from './schema';

export default async function runExecutor(options: BootstrapExecutorSchema) {
  console.log('Executor ran for Bootstrap', options);
  return {
    success: true,
  };
}
