import { IsOptional, IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { toArray } from '@aws-nx/utils';

export enum CommandMap {
  profile = '_',
  qualifier = 'qualifier',
  bucketName = 'bootstrap-bucket-name',
}

export class BootstrapOptions {
  @IsOptional()
  @IsString({ each: true })
  @Expose({ name: 'profile' })
  @Transform(({ obj }) => toArray(obj['profile']))
  ['_']?: string[];

  @IsOptional()
  @Expose({ name: 'bucketName' })
  @IsString({ message: 'bucket name must be a string' })
  ['bootstrap-bucket-name']?: string;

  @IsOptional()
  @IsString({ message: 'qualifier name must be a string' })
  ['qualifier']?: string;
}
