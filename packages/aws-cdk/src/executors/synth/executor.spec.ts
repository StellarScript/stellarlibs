import * as path from 'path';
import * as childProcess from 'child_process';

import { logger } from '@nx/devkit';
import type { ExecutorContext } from '@nx/devkit';
import { normalizeOptions, ExecutionContextMock } from '@aws-nx/utils';

import { createCommand } from '../../util/executor';
import synthExecutor, { normalizeArguments } from './executor';

describe('Synth Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  afterEach(() => jest.clearAllMocks());

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'synth',
      projectName: projectName,
      plugin: '@aws-nx/aws-cdk',
    });

    jest.spyOn(logger, 'debug');
    jest.spyOn(childProcess, 'execSync');
  });

  it('run synth executor command', async () => {
    const execution = await synthExecutor({}, context);
    const defaultArgs = { output: path.resolve('dist') };

    const options = normalizeOptions(defaultArgs, context);
    const command = createCommand('synth', options);

    expect(childProcess.execSync).toHaveBeenCalledTimes(1);
    expect(command).toBe(execution.command[1]);
  });

  it('single stack stack argument', () => {
    const stack = 'stackOne';
    const args = normalizeArguments({ stack });
    const options = normalizeOptions(args, context);

    const command = createCommand('synth', options);
    expect(command).toContain(`synth ${stack}`);
  });

  it('multiple stack argument', () => {
    const mulipleStack = ['stackOne', 'stackTwo'];
    const args = normalizeArguments({ stack: mulipleStack });
    const options = normalizeOptions(args, context);

    const command = createCommand('synth', options);
    expect(command).toContain(`synth ${mulipleStack.join(' ')}`);
  });

  it('output argument', () => {
    const output = 'output-path';
    const args = normalizeArguments({ output });
    const options = normalizeOptions(args, context);

    const command = createCommand('synth', options);
    expect(command).toContain(`--output ${output}`);
  });

  it('quiet argument', () => {
    const quiet = true;
    const args = normalizeArguments({ quiet });
    const options = normalizeOptions(args, context);

    const command = createCommand('synth', options);
    expect(command).toContain(`--quiet ${quiet}`);
  });
});
