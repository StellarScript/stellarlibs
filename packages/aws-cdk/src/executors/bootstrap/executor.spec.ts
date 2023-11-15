import * as childProcess from 'child_process';

import { logger } from '@nx/devkit';
import type { ExecutorContext } from '@nx/devkit';
import { normalizeOptions, ExecutionContextMock } from '@aws-nx/utils';

import { createCommand } from '../../util/executor';
import synthExecutor, { normalizeArguments } from './executor';

describe('bootstrap Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  afterEach(() => jest.clearAllMocks());

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'bootstrap',
      projectName: projectName,
      plugin: '@aws-nx/aws-cdk',
    });

    jest.spyOn(logger, 'debug');
    jest.spyOn(childProcess, 'execSync');
  });

  it('run bootstrap executor command', async () => {
    const execution = await synthExecutor({}, context);

    const options = normalizeOptions({}, context);
    const command = createCommand('bootstrap', options);

    expect(childProcess.execSync).toHaveBeenCalledTimes(1);
    expect(command).toBe(execution.command[1]);
  });

  it('single stack argument', () => {
    const profile = 'stackOne';
    const args = normalizeArguments({ profile });
    const options = normalizeOptions(args, context);

    const command = createCommand('bootstrap', options);
    expect(command).toContain(`bootstrap ${profile}`);
  });

  it('multiple stack argument', () => {
    const mulipleStack = ['stackOne', 'stackTwo'];
    const args = normalizeArguments({ profile: mulipleStack });
    const options = normalizeOptions(args, context);

    const command = createCommand('bootstrap', options);
    expect(command).toContain(`bootstrap ${mulipleStack.join(' ')}`);
  });
});
