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
      const argOpt = {
        trust: true,
        showTemplate: true,
        noPreviousParameters: true,
        terminationProtection: true,
        tag: ['mock-tag'],
        profile: 'mock-profile',
        kmsKeyId: 'mock-kms-key-id',
        qualifier: 'mock-qualifier',
        bucketName: 'mock-bucket-name',
        executionPolicy: 'mock-execution-policy',
      };

      const args = normalizeArguments(argOpt);
      const command = createCommand('bootstrap', {
        args,
        projectRoot: 'myproject',
        projectName: 'mock-project-name',
      });

      expect(command.includes(`--trust ${argOpt.trust}`)).toBeTruthy();
      expect(command.includes(`--profile ${argOpt.profile}`)).toBeTruthy();
      expect(command.includes(`--qualifier ${argOpt.qualifier}`)).toBeTruthy();
      expect(command.includes(`--show-template ${argOpt.showTemplate}`)).toBeTruthy();
      expect(command.includes(`--bootstrap-bucket-name ${argOpt.bucketName}`)).toBeTruthy();
      expect(command.includes(`--bootstrap-kms-key-id ${argOpt.kmsKeyId}`)).toBeTruthy();
      argOpt.tag.forEach((t) => expect(command.includes(`--tags ${t}`)).toBeTruthy());
      expect(
        command.includes(`--no-previous-parameters ${argOpt.noPreviousParameters}`)
      ).toBeTruthy();

      expect(
        command.includes(`--termination-protection ${argOpt.terminationProtection}`)
      ).toBeTruthy();

      expect(
        command.includes(`--cloudformation-execution-policies ${argOpt.executionPolicy}`)
      ).toBeTruthy();
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
