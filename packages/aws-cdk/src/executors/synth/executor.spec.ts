import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';

import {
  classInstance,
  normalizeOptions,
  ExecutionContextMock,
} from '@stellar-libs/utils';

import synthExecutor from './executor';
import { SynthArguments } from './arguments';
import { createCommand } from '../../util/executor';

const normalizeArguments = async (args: object) => {
  return await classInstance(SynthArguments, args);
};

describe('Synth Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  describe('Execute Synth', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      context = ExecutionContextMock({
        executor: 'synth',
        projectName: projectName,
        plugin: '@stellar-libs/aws-cdk',
      });

      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run synth executor command', async () => {
      const execution = await synthExecutor({}, context);
      const options = normalizeOptions({}, context);
      const command = createCommand('synth', options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });

  describe('Stack Argument', () => {
    it('stack invalid argument', async () => {
      const stack = false;
      expect(() => normalizeArguments({ stack })).rejects.toThrow();
    });

    it('single stack stack argument', async () => {
      const stack = 'stackOne';
      const args = await normalizeArguments({ stack });
      const options = normalizeOptions(args, context);

      const command = createCommand('synth', options);
      expect(command).toContain(`synth ${stack}`);
    });

    it('multiple stack argument', async () => {
      const mulipleStack = ['stackOne', 'stackTwo'];
      const args = await normalizeArguments({ stack: mulipleStack });
      const options = normalizeOptions(args, context);

      const command = createCommand('synth', options);
      expect(command).toContain(`synth ${mulipleStack.reverse().join(' ')}`);
    });
  });

  describe('Output Argument', () => {
    it('output invalid argument', async () => {
      const output = false;
      expect(() => normalizeArguments({ output })).rejects.toThrow();
    });

    it('output argument', async () => {
      const output = 'output-path';
      const args = await normalizeArguments({ output });
      const options = normalizeOptions(args, context);

      const command = createCommand('synth', options);
      expect(command).toContain(`synth --output ${output}`);
    });
  });

  describe('quite argument', () => {
    it('quiet invalid argument', async () => {
      const quiet = 'invalid';
      expect(() => normalizeArguments({ quiet })).rejects.toThrow();
    });

    it('quiet argument', async () => {
      const quiet = true;
      const args = await normalizeArguments({ quiet });
      const options = normalizeOptions(args, context);

      const command = createCommand('synth', options);
      expect(command).toContain(`synth --quiet ${quiet}`);
    });
  });
});
