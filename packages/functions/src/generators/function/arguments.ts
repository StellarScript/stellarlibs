import { names } from '@nx/devkit';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeneratorArguments {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'name' })
  @Transform(({ value }) => names(value.toLowerCase()).fileName)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'project' })
  @Transform(({ value }) => value.replace(new RegExp('/', 'g'), '-'))
  projectName: string;
}
