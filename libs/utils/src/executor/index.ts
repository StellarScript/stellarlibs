import { execSync } from 'child_process';

import { detectPackageManager } from '@nx/devkit';
import type { ExecutorContext, ProjectConfiguration } from '@nx/devkit';

import { Commands, createArguments } from '../helper';

const LARGE_BUFFER = 1024 * 1000000;

interface NormalizedOptions {
  args: object;
  root: string;
  projectName: string;
  sourceRoot?: string;
}

interface CreateCommand {
  args: object;
  root: string;
  projectName: string;
  entry: string;
  library: string;
}

export async function runCommand(
  command: string,
  cwd: string
): Promise<{ success: boolean; command?: string }> {
  try {
    await execSync(command, {
      cwd: cwd,
      maxBuffer: LARGE_BUFFER,
      stdio: ['inherit', process.stdin, process.stderr],
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      command: (error as { spawnargs: string })['spawnargs'],
    };
  }
}

export function normalizeOptions(
  parsedArgs: object,
  context: ExecutorContext
): NormalizedOptions {
  const cxtOpts = context?.workspace?.projects[
    context.projectName!
  ] as ProjectConfiguration;

  return {
    args: parsedArgs,
    root: cxtOpts.root,
    projectName: context.projectName || '',
    sourceRoot: cxtOpts.sourceRoot,
  };
}

export function createCommand(command: string, options: CreateCommand): string {
  const argvs = createArguments(options.args);
  const packageManager = detectPackageManager();
  const packageManagerExecutor =
    packageManager === 'npm' ? 'npx' : packageManager;

  const commands = new Commands();

  commands.add(packageManagerExecutor);
  commands.add('ts-node --require');
  commands.add('tsconfig-paths/register --project');
  commands.add(`${options.root}/tsconfig.app.json`);
  commands.add(options.entry);

  const generatePath = commands.command;

  commands.add('node --require');
  commands.add('ts-node/register');
  commands.add(`${options.library} -a`);
  commands.add(`"${generatePath}"`);
  commands.add(command);
  commands.add(argvs);
  //

  // const projectPath = options.root;
  // const generatePath = `"${packageManagerExecutor} ts-node --require tsconfig-paths/register --project ${projectPath}/tsconfig.app.json ${projectPath}/src/bin/index.ts"`;
  // return `node --require ts-node/register node_modules/aws-cdk/bin/cdk.js -a ${generatePath} ${command} ${argvs}`;
  return commands.command;
}
