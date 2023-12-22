import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class TagArguments {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'tag' })
  tag: string;
}
