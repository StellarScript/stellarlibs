import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class BuildArguments {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'tag' })
  tag: string;

  @IsString()
  @IsOptional()
  @Expose({ name: 'env' })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  env?: string[];
}
