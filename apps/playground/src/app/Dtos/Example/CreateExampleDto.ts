import { IsString } from 'class-validator';

export class CreateExampleDto {
  @IsString()
  name!: string;
}
