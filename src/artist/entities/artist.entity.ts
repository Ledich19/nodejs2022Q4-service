import { IsNotEmpty, IsString, IsBoolean, IsUUID } from 'class-validator';

export class Artist {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
