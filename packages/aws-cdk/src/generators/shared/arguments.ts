import { names } from '@nx/devkit';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GeneratorArguments {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'name' })
  @Transform(({ value }) => names(value.toLowerCase()).fileName)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'projectName' })
  @Transform(({ value, obj }) => {
    const dir = value ? `${names(value).fileName}/${obj['name']}` : obj['name'];
    return dir.replace(new RegExp('/', 'g'), '-');
  })
  projectName: string;

  @IsString()
  @IsOptional()
  @Expose({ name: 'directory' })
  @Transform(({ value, obj }) => {
    return value ? `${names(value).fileName}/${obj['name']}` : obj['name'];
  })
  directory?: string;

  @IsBoolean()
  @Expose({ name: 'linting' })
  @Transform(({ value }) => value === undefined ?? true)
  linting: boolean;

  @IsBoolean()
  @Expose({ name: 'jest' })
  @Transform(({ value }) => value === undefined ?? true)
  unitTest: boolean;
}
