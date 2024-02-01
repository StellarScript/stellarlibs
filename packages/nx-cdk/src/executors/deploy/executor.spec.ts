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
      const all = true;
      const force = true;
      const noRollback = true;
      const ignoreNoStacks = true;

      const progress = 'events';
      const method = 'change-set';
      const app = 'bin/index.ts';
      const outputFile = 'output.json';
      const tags = ['mockTag-1', 'mockTag-2'];
      const stack = ['MockStack', 'MockStack2'];

      const changeSetName = 'mystack-changeset';
      const parameters = ['param1=value1', 'param2=value2'];

      const hotswap = stack[0];
      const hotswapFallback = stack[0];

      const args = normalizeArguments({
        all,
        app,
        stack,
        force,
        method,
        hotswap,
        tag: tags,
        progress,
        outputFile,
        noRollback,
        changeSetName,
        ignoreNoStacks,
        hotswapFallback,
        parameter: parameters,
      });

      const command = createCommand('deploy', {
        args,
        projectRoot: 'myproject',
        projectName: 'mock-project-name',
      });

      expect(command.includes(`--deploy ${stack[0]} ${stack[1]}`));
      expect(command.includes(`--app ${app}`));
      expect(command.includes(`--all`));
      expect(command.includes(`--force`));
      expect(command.includes(`--method ${method}`));
      expect(command.includes(`--progress ${progress}`));
      expect(command.includes(`--output-file ${outputFile}`));
      expect(command.includes(`--no-rollback`));
      expect(command.includes(`--change-set-name ${changeSetName}`));
      expect(command.includes(`--ignore-no-stacks`));
      expect(command.includes(`--hotswap ${hotswap}`));
      expect(command.includes(`--hotswap-fallback ${hotswapFallback}`));
      tags.forEach((tag) => expect(command.includes(`--tag ${tag}`)));
      parameters.forEach((parameter) => expect(command.includes(`--parameter ${parameter}`)));
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
