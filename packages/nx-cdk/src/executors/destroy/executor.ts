import { ExecutorContext } from '@nx/devkit';
import { excludeCopy, runCommand, sanitizeObjectCopy } from '@stellarlibs/utils';
import { createCommand, commonStackExecutorSchema } from '../../common/executor';
import { DestroyExecutorSchema } from './schema';

export default async function runExecutor(schema: DestroyExecutorSchema, context: ExecutorContext) {
   const options = normalizeOptions(schema, context);
   const command = createCommand('destroy', options);
   return runCommand(command, context.root);
}

export function normalizeArguments(schema: DestroyExecutorSchema) {
   const commonStackArgs = commonStackExecutorSchema(schema);
   const restArgs = excludeCopy(schema, [...commonStackArgs.exclude]);

   return sanitizeObjectCopy({
      ...restArgs,
      ...commonStackArgs.args,
   });
}

export function normalizeOptions(options: DestroyExecutorSchema, context: ExecutorContext) {
   const projectName = context.projectName;
   const projectRoot = context.workspace.projects[projectName].root;
   const args = normalizeArguments(options);
   return {
      args,
      projectName,
      projectRoot,
   };
}
