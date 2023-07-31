import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class Track {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  artistId: string | null;

  @IsOptional()
  @IsString()
  albumId: string | null;

  @IsNumber()
  duration: number;
}
