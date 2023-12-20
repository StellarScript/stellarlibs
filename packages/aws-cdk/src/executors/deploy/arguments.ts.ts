import { Transform, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { toArray } from '@aws-nx/utils';

export class DeployArguments {
  @IsOptional()
  @Expose({ name: 'stack' })
  @IsString({ each: true, message: 'stack must be a string' })
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

  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'all' })
  ['all']?: boolean;
}
