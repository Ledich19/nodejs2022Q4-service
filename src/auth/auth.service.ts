import { Injectable, ForbiddenException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import * as dotenv from 'dotenv';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
dotenv.config();

@Injectable()
export class AuthService {
  salt = parseInt(process.env.CRYPT_SALT);
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async getJwtAccessToken(sub: UUID, username: string) {
    const payload = { sub, username };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    return {
      accessToken,
    };
  }

  public async getJwtRefreshToken(sub: UUID, username: string) {
    const payload = { sub, username };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });
    return {
      refreshToken,
    };
  }

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
    const user = await this.prisma.user.findFirst({
      where: {
        login: loginDto.login,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const isCompare = await compare(loginDto.password, user.passwordHash);
    if (!isCompare) throw new ForbiddenException('Credentials incorrect');

    return {
      access_token: await this.signToken(user.id, user.login),
      //refresh_token: await this.jwtService.signAsync(payload),
    };
  }
  async signToken(
    id: string,
    login: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: id, login };
    console.log(
      'JWT',
      process.env.JWT_SECRET_KEY,
      process.env.TOKEN_EXPIRE_TIME,
    );
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    return {
      access_token: token,
    };
  }
}
