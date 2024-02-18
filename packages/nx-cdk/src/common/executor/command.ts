import { detectPackageManager } from '@nx/devkit';
import { createArguments, Commands } from '@stellarlibs/utils';

interface CreateCommand {
   args: object;
   projectRoot: string;
   projectName: string;
}

export function createCommand(command: string, options: CreateCommand): string {
   const entry = `${options.projectRoot}/src/bin/index.ts`;
   const library = 'node_modules/aws-cdk/bin/cdk.js';

   const argvs = createArguments(options.args);
   const packageManager = detectPackageManager();
   const packageManagerExecutor = packageManager === 'npm' ? 'npx' : packageManager;

   const commands = new Commands();

   commands.add(packageManagerExecutor);
   commands.add('ts-node --require');
   commands.add('tsconfig-paths/register --project');
   commands.add(`${options.projectRoot}/tsconfig.app.json`);
   commands.add(entry);

   const generatePath = commands.command;

   commands.add('node --require');
   commands.add('ts-node/register');
   commands.add(`${library} -a`);
   commands.add(`"${generatePath}"`);
   commands.add(command);
   commands.add(argvs);

   return commands.command;
}
