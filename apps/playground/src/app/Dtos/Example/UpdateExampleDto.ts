import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateExampleDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  public name!: string;
}
