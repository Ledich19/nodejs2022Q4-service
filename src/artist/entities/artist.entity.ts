import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class Artist {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
