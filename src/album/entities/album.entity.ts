import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class Album {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  artistId: string | null;
}
