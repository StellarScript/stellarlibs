import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PushArguments {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'tag' })
  tag: string;
}
