import { Transform, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { toArray } from '@aws-nx/utils';

export class BootstrapArguments {
  @IsOptional()
  @Expose({ name: 'profile' })
  @IsString({ each: true, message: 'profile must be a string' })
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
