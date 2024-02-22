import { execSync } from 'child_process';

const LARGE_BUFFER = 1024 * 1000000;

export function createArguments(args: object): string {
   const commands: string[] = [];

   const registerArgs = (key: string, value: string) => {
      if (!value) {
         return;
      }
      if (key === '_') {
         commands.unshift(`${value}`);
      } else {
         commands.push(`--${key} ${value}`);
      }
   };
   for (const arg in args) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const parsedArg = args[arg];
      if (Array.isArray(parsedArg)) {
         parsedArg.forEach((value) => {
            registerArgs(arg, value);
         });
      } else {
         registerArgs(arg, parsedArg);
      }
   }
   return commands.join(' ');
}

/**
 * @description A set of commands & arguments
 */
export class Commands extends Set {
   public set(command: string) {
      this.add(command);
   }

   get command(): string {
      const command = Array.from(this).join(' ');
      this.clear();
      return command;
   }
}

/**
 *
 * @param command
 * @param cwd
 * @description Runs a shell command
 * @returns
 */
export function runCommand(command: string, cwd: string): { success: boolean; command?: string } {
   try {
      execSync(command, {
         cwd: cwd,
         env: process.env,
         maxBuffer: LARGE_BUFFER,
         stdio: ['inherit', process.stdin, process.stderr, process.stdout],
      });
      return { success: true };
   } catch (error) {
      return {
         success: false,
         command: (error as { spawnargs: string })['spawnargs'],
      };
   }
}
