import { AuthExecutorSchema } from './schema';

export default async function runExecutor(options: AuthExecutorSchema) {
  console.log('Executor ran for Auth', options);
  return {
    success: true,
  };
}
