import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock } from '@stellarlibs/utils';

import destroyExecutor from './executor';
import { createCommand } from '../../common/executor';
import { normalizeArguments, normalizeOptions } from './executor';

describe('Destroy Executor', () => {
   let context: ExecutorContext;
   const projectName = 'test-app';

   beforeAll(() => {
      context = ExecutionContextMock({
         executor: 'destroy',
         projectName: projectName,
         plugin: '@stellarlibs/nx-cdk',
      });
   });

   describe('Execute Destroy', () => {
      afterEach(() => jest.clearAllMocks());

      beforeAll(() => {
         jest.spyOn(logger, 'debug');
         jest.spyOn(childProcess, 'execSync');
      });

      it('run destroy', () => {
         const argOpt = {
            all: true,
            quiet: true,
            exclusively: true,
            noPreviousParameters: true,
            stack: 'MockStack',
            app: 'bin/index.ts',
            tag: ['mockTag-1', 'mockTag-2'],
            parameter: ['param1=value1', 'param2=value2'],
         };

         const args = normalizeArguments(argOpt);
         const command = createCommand('destroy', {
            args,
            projectRoot: 'myproject',
            projectName: 'mock-project-name',
         });

         expect(command.includes(`destroy ${argOpt.stack}`)).toBeTruthy();
         expect(command.includes(`--all`)).toBeTruthy();
         expect(command.includes(`--app ${argOpt.app}`)).toBeTruthy();
         expect(command.includes(`--exclusively`)).toBeTruthy();
         expect(command.includes(`--quiet`)).toBeTruthy();

         argOpt.tag.forEach((tg) => {
            expect(command.includes(`--tags ${tg}`)).toBeTruthy();
         });
         argOpt.parameter.forEach((param) => {
            expect(command.includes(`--parameters ${param}`)).toBeTruthy();
         });
      });

      it('run destroy executor command', async () => {
         const execution = await destroyExecutor({}, context);

         const options = normalizeOptions({}, context);
         const command = createCommand('destroy', options);

         expect(childProcess.execSync).toHaveBeenCalledTimes(1);
         expect(command).toBe(execution.command[1]);
      });
   });
});
