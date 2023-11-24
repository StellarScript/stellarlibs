import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratorArguments {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'name' })
  @Transform(({ obj }) => obj['name'] || obj['project'])
  projectName: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'function' })
  @Transform(({ value }) => value?.replace(new RegExp('/', 'g'), '-'))
  functionName?: string;
}
