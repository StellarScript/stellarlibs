import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock, classInstance } from '@aws-nx/utils';
import * as childProcess from 'child_process';

import { BuildArguments } from './arguments';
import { BuildExecutorSchema } from './schema';
import buildExecutor, { normalizeOptions } from './executor';
import { creaetBuildCommand } from '../../util/executor';

const options: BuildExecutorSchema = {
  name: 'test-app',
  tag: 'latest',
};

describe('Build Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'ecr-build',
      projectName: projectName,
      plugin: '@aws-nx/aws-ecr',
    });
  });

  describe('Execute Auth', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run build executor without', async () => {
      const execution = await buildExecutor(options, context);

      const args = await classInstance(BuildArguments, options);
      const _options = normalizeOptions(args, context);

      const command = creaetBuildCommand(_options);
      expect(command).toBe(execution.command[1]);
    });
  });
});
