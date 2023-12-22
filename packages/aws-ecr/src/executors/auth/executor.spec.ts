import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock } from '@aws-nx/utils';
import * as childProcess from 'child_process';

import authExecutor from './executor';
import { createAuthCommand } from '../../util/executor';

const setupEnvs = () => {
  process.env = Object.assign(process.env, {
    AWS_REGION: 'us-east-1',
    AWS_ACCOUNT_ID: '123456789012',
  });
};

describe('Auth Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'auth',
      projectName: projectName,
      plugin: '@aws-nx/aws-ecr',
    });
  });

  describe('Execute Auth Fail', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run auth executor without envs (error)', async () => {
      expect(async () => await authExecutor({}, context)).rejects.toThrow(
        'AWS_ACCOUNT_ID environmental variable is not set'
      );
    });
  });

  describe('Execute Auth', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      setupEnvs();
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run auth executor command', async () => {
      const execution = await authExecutor({}, context);
      const command = createAuthCommand();
      expect(command).toBe(execution.command[1]);
    });
  });
});
