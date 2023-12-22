import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock, classInstance } from '@aws-nx/utils';

import { TagExecutorSchema } from './schema';
import { TagArguments } from './arguments';
import executor, { normalizeOptions } from './executor';
import { createCommand } from '../../util/executor';

const options: TagExecutorSchema = {
  name: 'test-app',
  tag: 'latest',
};

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
      executor: 'tag',
      projectName: projectName,
      plugin: '@aws-nx/aws-ecr',
    });
  });

  describe('Tag Executor Fail', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run tag executor without envs', () => {
      expect(async () => await executor(options, context)).rejects.toThrow(
        'AWS_ACCOUNT_ID environmental variable is not set'
      );
    });
  });

  describe('Tag Executor', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      setupEnvs();
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run tag executor (success)', async () => {
      const execution = await executor(options, context);

      const args = await classInstance(TagArguments, options);
      const _options = await normalizeOptions(args, context);
      const command = createCommand(`tag ${options.name}`, _options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });
});
