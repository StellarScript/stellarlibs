import { Transform, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { toArray } from '@stellar-libs/utils';

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

  @IsOptional()
  @Expose({ name: 'executionPolicy' })
  @IsString({ message: 'executionPolicy name must be a string' })
  ['cloudformation-execution-policies']?: string;

  @IsOptional()
  @Expose({ name: 'tag' })
  @IsString({ each: true, message: 'tags must be a string' })
  @Transform(({ value, obj }) => value && toArray(obj['tag']))
  ['tags']?: string[];

  @IsOptional()
  @IsBoolean({ message: 'trust must be a boolean' })
  ['trust']?: boolean;

  @IsOptional()
  @Expose({ name: 'terminationProtection' })
  @IsBoolean({ message: 'terminationProtection must be a boolean' })
  ['termination-protection']?: boolean;

  @IsOptional()
  @Expose({ name: 'kmsKeyId' })
  @IsString({ message: 'kmsKeyId must be a string' })
  ['bootstrap-kms-key-id']?: string;
}
