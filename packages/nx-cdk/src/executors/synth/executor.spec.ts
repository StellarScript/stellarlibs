import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock } from '@stellarlibs/utils';

import synthExecutor from './executor';
import { createCommand } from '../../common/executor';
import { normalizeArguments, normalizeOptions } from '../synth/executor';

describe('Synthesize Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'synth',
      projectName: projectName,
      plugin: '@stellarlibs/nx-cdk',
    });
  });

  describe('Execute Synth', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run synth', () => {
      const stackName = 'MockStack';
      const tags = ['mockTag-1', 'mockTag-2'];
      const parameters = ['param1=value1', 'param2=value2'];
      const app = 'bin/index.ts';

      const args = normalizeArguments({
        all: true,
        quiet: true,
        exclusively: false,
        app: app,
        tag: tags,
        stack: stackName,
        parameter: parameters,
      });

      const command = createCommand('synth', {
        args,
        projectRoot: 'myproject',
        projectName: 'mock-project-name',
      });

      expect(command.includes(`synth ${stackName}`)).toBeTruthy();
      expect(command.includes(`--app ${app}`)).toBeTruthy();

      tags.forEach((tag) => {
        expect(command.includes(`--tags ${tag}`)).toBeTruthy();
      });
      parameters.forEach((param) => {
        expect(command.includes(`--parameters ${param}`)).toBeTruthy();
      });
    });

    it('run synth executor command', async () => {
      const execution = await synthExecutor({}, context);

      const options = normalizeOptions({}, context);
      const command = createCommand('synth', options);

      expect(childProcess.execSync).toHaveBeenCalledTimes(1);
      expect(command).toBe(execution.command[1]);
    });
  });
});
