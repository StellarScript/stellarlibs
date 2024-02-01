import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock } from '@stellarlibs/utils';

import { createCommand } from '../../common/executor';
import synthExecutor, { normalizeArguments, normalizeOptions } from './executor';

describe('Bootstrap Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'bootstrap',
      projectName: projectName,
      plugin: '@stellarlibs/nx-cdk',
    });
  });

  describe('Execute Bootstrap', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('bootstrap arguments', async () => {
      const args = normalizeArguments({
        profile: 'mock-profile',
        qualifier: 'mock-qualifier',
        bucketName: 'mock-bucket-name',
        executionPolicy: 'mock-execution-policy',
        tag: ['mock-tag'],
        trust: true,
        terminationProtection: true,
        kmsKeyId: 'mock-kms-key-id',
      });

      const command = createCommand('bootstrap', {
        args,
        projectRoot: 'myproject',
        projectName: 'mock-project-name',
      });
      for (const arg in args) {
        expect(command.includes(`--${arg}`)).toBeTruthy();
      }
    });

    it('run bootstrap executor command', async () => {
      const execution = await synthExecutor({}, context);

      const options = normalizeOptions({}, context);
      const command = createCommand('bootstrap', options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });
});
