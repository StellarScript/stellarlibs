import * as childProcess from 'child_process';

import { logger } from '@nx/devkit';
import type { ExecutorContext } from '@nx/devkit';
import {
  classInstance,
  normalizeOptions,
  ExecutionContextMock,
} from '@aws-nx/utils';

import deployExecutor from './executor';
import { CommandMap, DeployOptions } from './options';
import { createCommand } from '../../util/executor';

const normalizeArguments = async (args: object) => {
  return await classInstance(DeployOptions, args);
};

describe('deploy Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  describe('Execute deploy', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      context = ExecutionContextMock({
        executor: 'deploy',
        projectName: projectName,
        plugin: '@aws-nx/aws-cdk',
      });

      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run deploy executor command', async () => {
      const execution = await deployExecutor({}, context);

      const options = normalizeOptions({}, context);
      const command = createCommand('deploy', options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });

  describe('Stack Argument', () => {
    it('single stack argument', async () => {
      const stack = 'stackOne';
      const args = await normalizeArguments({ stack });
      const options = normalizeOptions(args, context);

      const command = createCommand('deploy', options);
      expect(command).toContain(`deploy ${stack}`);
    });

    it('multiple stack argument', async () => {
      const mulipleStack = ['stackOne', 'stackTwo'];
      const args = await normalizeArguments({ stack: mulipleStack });
      const options = normalizeOptions(args, context);

      const command = createCommand('deploy', options);
      expect(command).toContain(`deploy ${mulipleStack.reverse().join(' ')}`);
    });
  });

  describe('Require Approval Argument', () => {
    it('require approval argument', async () => {
      const approval = true;
      const args = await normalizeArguments({ approval });
      const options = normalizeOptions(args, context);

      const command = createCommand('deploy', options);
      expect(command).toContain(`deploy --${CommandMap.approval} always`);
    });

    it('require approval argument', async () => {
      const approval = false;
      const args = await normalizeArguments({ approval });
      const options = normalizeOptions(args, context);

      const command = createCommand('deploy', options);
      expect(command).toContain(`deploy --${CommandMap.approval} never`);
    });
  });
});
