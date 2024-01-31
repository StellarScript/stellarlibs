import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { toArray } from '@stellar-libs/utils';

export class SynthArguments {
  @IsOptional()
  @IsString({ each: true })
  @Expose({ name: 'stack' })
  @Transform(({ obj }) => toArray(obj['stack']))
  _?: string[];

  @IsOptional()
  @IsString({ message: 'output must be a string' })
  output?: string;

  @IsOptional()
  @IsBoolean({ message: 'quiet options must be true or false' })
  quiet?: boolean;
}
