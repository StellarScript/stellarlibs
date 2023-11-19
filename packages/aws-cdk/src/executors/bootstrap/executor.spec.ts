import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import {
  classInstance,
  normalizeOptions,
  ExecutionContextMock,
} from '@aws-nx/utils';

import synthExecutor from './executor';
import { BootstrapArguments } from './arguments.ts';
import { createCommand } from '../../util/executor';

const normalizeArguments = async (args: object) => {
  return await classInstance(BootstrapArguments, args);
};

describe('Bootstrap Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'bootstrap',
      projectName: projectName,
      plugin: '@aws-nx/aws-cdk',
    });
  });

  describe('Execute Bootstrap', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
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
  });

  describe('Profile Argument', () => {
    it('invalid profile argument', async () => {
      const invalidProfile = true;
      expect(() =>
        normalizeArguments({ profile: invalidProfile })
      ).rejects.toThrow();
    });

    it('single profile argument', async () => {
      const profile = 'profileOne';
      const args = await normalizeArguments({ profile });
      const options = normalizeOptions(args, context);

      const command = createCommand('bootstrap', options);
      expect(command).toContain(`bootstrap ${profile}`);
    });

    it('multiple profiles argument', async () => {
      const mulipleProfiles = ['profileOne', 'profileTwo'];
      const args = await normalizeArguments({ profile: mulipleProfiles });
      const options = normalizeOptions(args, context);

      const command = createCommand('bootstrap', options);
      expect(command).toContain(
        `bootstrap ${mulipleProfiles.reverse().join(' ')}`
      );
    });
  });

  describe('Qualifiers Argument', () => {
    it('invalid qualifier argument', async () => {
      const qualifier = true;
      expect(() => normalizeArguments({ qualifier })).rejects.toThrow(
        'qualifier name must be a string'
      );
    });

    it('qualifier argument', async () => {
      const qualifier = 'qualifierOne';
      const args = await normalizeArguments({ qualifier });
      const options = normalizeOptions(args, context);

      const command = createCommand('bootstrap', options);
      expect(command).toContain(`bootstrap --qualifier ${qualifier}`);
    });
  });

  describe('bucketName Argument', () => {
    it('invalid bucketName argument', async () => {
      const bucketName = true;
      expect(() => normalizeArguments({ bucketName })).rejects.toThrow(
        'bucket name must be a string'
      );
    });

    it('bucketName argument', async () => {
      const bucketName = 'bucketName';
      const args = await normalizeArguments({ bucketName });
      const options = normalizeOptions(args, context);

      const command = createCommand('bootstrap', options);
      expect(command).toContain(
        `bootstrap --bootstrap-bucket-name ${bucketName}`
      );
    });
  });
});
