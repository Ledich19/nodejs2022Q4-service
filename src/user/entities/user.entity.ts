import { IsNotEmpty, IsString } from 'class-validator';

export class User {
  @IsNotEmpty()
  @IsString()
  login: string;

  version: number;

  createdAt: number;

  updatedAt: number;
}
