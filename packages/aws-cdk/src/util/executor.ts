import { createCommand as _createCommand } from '@aws-nx/utils';

interface CreateCommand {
  args: object;
  root: string;
  projectName: string;
}

export function createCommand(command: string, options: CreateCommand): string {
  return _createCommand(command, {
    ...options,
    entry: `${options.root}/src/bin/index.ts`,
    library: 'node_modules/aws-cdk/bin/cdk.js',
  });
}

export function requireApproval(approval: string | boolean): string {
  if (typeof approval === 'boolean') {
    return approval ? 'always' : 'never';
  }
  return approval;
}
