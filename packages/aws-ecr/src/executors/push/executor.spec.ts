import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock, classInstance } from '@aws-nx/utils';

import { PushExecutorSchema } from './schema';
import { PushArguments } from './arguments';
import executor, { normalizeOptions } from './executor';
import { createCommand } from '../../util/executor';

const options: PushExecutorSchema = {
  name: 'test-app',
  tag: 'latest',
};

const setupEnvs = () => {
  process.env = Object.assign(process.env, {
    AWS_REGION: 'us-east-1',
    AWS_ACCOUNT_ID: '123456789012',
  });
};

describe('Push Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'push',
      projectName: projectName,
      plugin: '@aws-nx/aws-ecr',
    });
  });

  describe('Push Executor Fail', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run push executor without envs', () => {
      expect(async () => await executor(options, context)).rejects.toThrow(
        'AWS_ACCOUNT_ID environmental variable is not set'
      );
    });
  });

  describe('Push Executor', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      setupEnvs();
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('push tag executor (success)', async () => {
      const execution = await executor(options, context);

      const args = await classInstance(PushArguments, options);
      const _options = await normalizeOptions(args, context);
      const command = createCommand(`push`, _options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });
});
