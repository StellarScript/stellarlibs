import * as childProcess from 'child_process';

import { logger } from '@nx/devkit';
import { normalizeOptions, ExecutionContextMock } from '@aws-nx/utils';
import type { ExecutorContext } from '@nx/devkit';

import { createCommand } from '../../util/executor';
import destroyExecutor, { normalizeArguments } from './executor';

describe('destroy Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

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

  it('single stack stack argument', () => {
    const stack = 'stackOne';
    const args = normalizeArguments({ stack });
    const options = normalizeOptions(args, context);

    const command = createCommand('destroy', options);
    expect(command).toContain(`destroy ${stack}`);
  });

  it('multiple stack argument', () => {
    const mulipleStack = ['stackOne', 'stackTwo'];
    const args = normalizeArguments({ stack: mulipleStack });
    const options = normalizeOptions(args, context);

    const command = createCommand('destroy', options);
    expect(command).toContain(`destroy ${mulipleStack.join(' ')}`);
  });

  it('require approval argument', () => {
    const args = normalizeArguments({ approval: true });
    const options = normalizeOptions(args, context);

    const command = createCommand('deploy', options);
    expect(command).toContain(`--require-approval always`);
  });
});
