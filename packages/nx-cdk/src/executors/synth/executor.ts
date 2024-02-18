import { SynthExecutorSchema } from './schema';

export default async function runExecutor(options: SynthExecutorSchema) {
   console.log('Executor ran for Synth', options);
   return {
      success: true,
   };
}
