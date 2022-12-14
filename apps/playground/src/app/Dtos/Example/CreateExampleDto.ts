import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExampleDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name!: string;
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  age?: string;
}
