import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { toArray } from '@aws-nx/utils';

export class FunctionsGeneratorArguments {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => !!obj['bundle'])
  bundle: boolean;

  @IsOptional()
  @IsString({ each: true })
  @Expose({ name: 'tag' })
  @Transform(({ obj }) => toArray(obj['tag']))
  tags: string[];
}
