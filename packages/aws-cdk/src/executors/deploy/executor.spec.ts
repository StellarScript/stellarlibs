import * as childProcess from 'child_process';

import { logger } from '@nx/devkit';
import type { ExecutorContext } from '@nx/devkit';
import { normalizeOptions, ExecutionContextMock } from '@aws-nx/utils';

import { createCommand } from '../../util/executor';
import deployExecutor, { normalizeArguments } from './executor';

describe('deploy Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

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

  it('single stack argument', () => {
    const stack = 'stackOne';
    const args = normalizeArguments({ stack });
    const options = normalizeOptions(args, context);

    const command = createCommand('deploy', options);
    expect(command).toContain(`deploy ${stack}`);
  });

  it('multiple stack argument', () => {
    const mulipleStack = ['stackOne', 'stackTwo'];
    const args = normalizeArguments({ stack: mulipleStack });
    const options = normalizeOptions(args, context);

    const command = createCommand('deploy', options);
    expect(command).toContain(`deploy ${mulipleStack.join(' ')}`);
  });

  it('require approval argument', () => {
    const args = normalizeArguments({ approval: true });
    const options = normalizeOptions(args, context);

    const command = createCommand('deploy', options);
    expect(command).toContain(`--require-approval always`);
  });
});
