import { AwsCli, Commands } from '@aws-nx/utils';

interface EcrCredentials {
  region: string;
  accountId: string;
}

interface CreateCommand {
  args: { tag: string };
  root: string;
  projectName: string;
}

export function createCommand(command: string, options: CreateCommand) {
  const creds = getCredentials();

  const commands = new Commands();
  commands.add('docker');
  commands.add(command);
  commands.add(
    `${creds.accountId}.dkr.ecr.${creds.region}.amazonaws.com/${options.projectName}:${options.args.tag}`
  );
  return commands.command;
}

export function createAuthCommand() {
  AwsCli.verifyCli();
  const creds = getCredentials();

  const commands = new Commands();
  commands.add('aws');
  commands.add('ecr');
  commands.add('get-login-password');
  commands.add('--region');
  commands.add(creds.region);
  commands.add('|');
  commands.add('docker');
  commands.add('login');
  commands.add('--username');
  commands.add('AWS');
  commands.add('--password-stdin');
  commands.add(`${creds.accountId}.dkr.ecr.${creds.region}.amazonaws.com`);
  return commands.command;
}

function getCredentials(): EcrCredentials {
  const creds = {
    accountId: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
  };

  if (!creds.accountId) {
    throw new Error('AWS_ACCOUNT_ID environmental variable is not set');
  }
  if (!creds.region) {
    throw new Error(
      'AWS_REGION or AWS_DEFAULT_REGION environmental variable is not set'
    );
  }
  return creds;
}
