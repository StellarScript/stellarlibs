import * as childProcess from 'child_process';
import { ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock } from '@stellarlibs/utils';

import listExecutor from './executor';
import { createCommand } from '../../common/executor';

describe('ListAll Executor', () => {
   let context: ExecutorContext;
   const projectName = 'test-app';

   beforeAll(() => {
      context = ExecutionContextMock({
         executor: 'list',
         projectName: projectName,
         plugin: '@stellarlibs/nx-cdk',
      });
   });

   describe('Execute List', () => {
      afterEach(() => jest.clearAllMocks());

      beforeAll(() => {
         jest.spyOn(logger, 'debug');
         jest.spyOn(childProcess, 'execSync');
      });

      it('run list', async () => {
         const execution = await listExecutor({}, context);

         const command = createCommand('list', {
            projectRoot: `apps/${projectName}`,
            projectName: 'mock-project-name',
            args: [],
         });

         expect(command).toBe(execution?.command[1]);
         expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      });
   });
});
