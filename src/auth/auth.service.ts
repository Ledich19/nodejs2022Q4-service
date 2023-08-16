import { Injectable, ForbiddenException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import * as dotenv from 'dotenv';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
dotenv.config();

@Injectable()
export class AuthService {
  salt = parseInt(process.env.CRYPT_SALT);
  constructor(private prisma: PrismaService) {}

  async signup(authDto: AuthDto) {
    const passwordHash = await hash(authDto.password, this.salt);

    const user = await this.prisma.user.create({
      data: {
        login: authDto.login,
        passwordHash,
      },
      select: {
        id: true,
        login: true,
        createdAt: true,
      },
    });
    return {
      ...user,
    };
  }
  async login(loginDto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        login: loginDto.login,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const isCompare = await compare(loginDto.password, user.passwordHash);
    if (!isCompare) throw new ForbiddenException('Credentials incorrect');

    delete user.passwordHash;
    return user;
  }
}
