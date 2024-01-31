import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { toArray } from '@stellar-libs/utils';

export class DestroyArguments {
  @IsOptional()
  @IsString({ each: true })
  @Expose({ name: 'stack' })
  @Transform(({ obj }) => toArray(obj['stack']))
  ['_']?: string[];

  @Expose({ name: 'approval' })
  @IsOptional()
  @IsString({ message: 'approval must be a boolean' })
  @Transform(({ obj }) => {
    if (typeof obj['approval'] === 'boolean')
      return obj['approval'] ? 'always' : 'never';
    return obj['approval'];
  })
  @IsIn(['always', 'never'])
  ['require-approval']?: 'always' | 'never';

  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'all' })
  ['all']?: boolean;
}
