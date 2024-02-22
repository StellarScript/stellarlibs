import { ExecutorContext } from '@nx/devkit';
import { runCommand } from '@stellarlibs/utils';

import { ListAllExecutorSchema } from './schema';
import { createCommand } from '../../common/executor';

export default async function runExecutor(_options: ListAllExecutorSchema, context: ExecutorContext) {
   const _context = normalizeContext(context);
   const command = createCommand('list', _context);
   return runCommand(command, context.root);
}

function normalizeContext(context: ExecutorContext) {
   const projectName = context.projectName;
   const projectRoot = context.workspace.projects[projectName].root;
   return {
      projectName,
      projectRoot,
      args: [],
   };
}
