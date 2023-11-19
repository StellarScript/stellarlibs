import { IsOptional, IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { toArray } from '@aws-nx/utils';

export enum CommandMap {
  stack = '_',
  approval = 'require-approval',
}

export class DeployOptions {
  @IsOptional()
  @IsString({ each: true })
  @Expose({ name: 'stack' })
  @Transform(({ obj }) => toArray(obj['stack']))
  ['_']?: string[];

  @IsOptional()
  @Expose({ name: 'approval' })
  @IsString({ message: 'approval must be a boolean' })
  @Transform(({ obj }) => {
    if (typeof obj['approval'] === 'boolean')
      return obj['approval'] ? 'always' : 'never';
    return obj['approval'];
  })
  ['require-approval']?: string;
}
