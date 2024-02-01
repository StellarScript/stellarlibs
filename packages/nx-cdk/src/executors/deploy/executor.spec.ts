import * as childProcess from 'child_process';
import { type ExecutorContext, logger } from '@nx/devkit';
import { ExecutionContextMock } from '@stellarlibs/utils';

import { createCommand } from '../../common/executor';
import { normalizeArguments } from '../deploy/executor';
import deployExecutor, { normalizeOptions } from './executor';

describe('Deploy Executor', () => {
  let context: ExecutorContext;
  const projectName = 'test-app';

  beforeAll(() => {
    context = ExecutionContextMock({
      executor: 'deploy',
      projectName: projectName,
      plugin: '@stellarlibs/nx-cdk',
    });
  });

  describe('Execute deploy', () => {
    afterEach(() => jest.clearAllMocks());

    beforeAll(() => {
      jest.spyOn(logger, 'debug');
      jest.spyOn(childProcess, 'execSync');
    });

    it('run deploy', () => {
      const argOpt = {
        all: true,
        force: true,
        noRollback: true,
        ignoreNoStacks: true,
        noPreviousParameters: true,
        progress: 'events',
        method: 'change-set',
        app: 'bin/index.ts',
        outputFile: 'output.json',
        tag: ['mockTag-1', 'mockTag-2'],
        stack: ['MockStack', 'MockStack2'],
        changeSetName: 'mystack-changeset',
        parameter: ['param1:value1', 'param2:value2'],
        hotswap: 'MockStack',
        hotswapFallback: 'MockStack',
      };

      const args = normalizeArguments(argOpt);

      const command = createCommand('deploy', {
        args,
        projectRoot: 'myproject',
        projectName: 'mock-project-name',
      });

      expect(command.includes(`--deploy ${argOpt.stack[0]} ${argOpt.stack[1]}`));
      expect(command.includes(`--app ${argOpt.app}`));
      expect(command.includes(`--all`));
      expect(command.includes(`--force`));
      expect(command.includes(`--method ${argOpt.method}`));
      expect(command.includes(`--progress ${argOpt.progress}`));
      expect(command.includes(`--output-file ${argOpt.outputFile}`));
      expect(command.includes(`--no-rollback`));
      expect(command.includes(`--change-set-name ${argOpt.changeSetName}`));
      expect(command.includes(`--ignore-no-stacks`));
      expect(command.includes(`--hotswap ${argOpt.hotswap}`));
      expect(command.includes(`--hotswap-fallback ${argOpt.hotswapFallback}`));
      argOpt.tag.forEach((tag) => expect(command.includes(`--tag ${tag}`)));
      argOpt.parameter.forEach((parameter) => expect(command.includes(`--parameter ${parameter}`)));

      expect(
        command.includes(`--no-previous-parameters ${argOpt.noPreviousParameters}`)
      ).toBeTruthy();
    });
  });

  it('run deploy executor command', async () => {
    const execution = await deployExecutor({}, context);

    const options = normalizeOptions({}, context);
    const command = createCommand('deploy', options);

    expect(childProcess.execSync).toHaveBeenCalledTimes(1);
    expect(command).toBe(execution.command[1]);
  });
});
