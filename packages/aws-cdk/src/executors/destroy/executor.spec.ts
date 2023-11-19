import * as childProcess from 'child_process';

import { logger } from '@nx/devkit';
import type { ExecutorContext } from '@nx/devkit';
import {
  classInstance,
  normalizeOptions,
  ExecutionContextMock,
} from '@aws-nx/utils';

import destroyExecutor from './executor';
import { DestroyOptions } from './options';
import { createCommand } from '../../util/executor';

const normalizeArguments = async (args: object) => {
  return await classInstance(DestroyOptions, args);
};

describe('destroy Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  describe('Execute Destroy', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      context = ExecutionContextMock({
        executor: 'destroy',
        projectName: projectName,
        plugin: '@aws-nx/aws-cdk',
      });

      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run destroy executor command', async () => {
      const execution = await destroyExecutor({}, context);

      const options = normalizeOptions({}, context);
      const command = createCommand('destroy', options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });

  describe('stack argument', () => {
    it('single stack stack argument', async () => {
      const stack = 'stackOne';
      const args = await normalizeArguments({ stack });
      const options = normalizeOptions(args, context);

      const command = createCommand('destroy', options);
      expect(command).toContain(`destroy ${stack}`);
    });

    it('multiple stack argument', async () => {
      const mulipleStack = ['stackOne', 'stackTwo'];
      const args = await normalizeArguments({ stack: mulipleStack });
      const options = normalizeOptions(args, context);

      const command = createCommand('destroy', options);
      expect(command).toContain(`destroy ${mulipleStack.reverse().join(' ')}`);
    });
  });

  describe('require-approval argument', () => {
    it('require approval argument', async () => {
      const args = await normalizeArguments({ approval: true });
      const options = normalizeOptions(args, context);

      const command = createCommand('deploy', options);
      expect(command).toContain(`--require-approval always`);
    });
  });
});
