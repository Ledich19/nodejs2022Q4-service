import { Injectable, ForbiddenException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshDto } from './dto/refresh.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  salt = this.configService.get('auth.salt');
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getJwtAccessToke(id: string, login: string): Promise<string> {
    const payload = { sub: id, id, login };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('auth.jwrAccess'),
      expiresIn: this.configService.get('auth.jwrAccessTime'),
    });
    return token;
  }

  public async getJwtRefreshToken(id: string, login: string): Promise<string> {
    const payload = { sub: id, id, login };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('auth.jwrRefresh'),
      expiresIn: this.configService.get('auth.jwrRefreshTime'),
    });
    return refreshToken;
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
    return user;
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

    const accessToken = await this.getJwtAccessToke(user.id, user.login);
    const refreshToken = await this.getJwtRefreshToken(user.id, user.login);
    const refreshHash = await hash(refreshToken, this.salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshHash,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    try {
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('auth.jwrRefresh'),
      });
      const user = await this.prisma.user.findFirst({
        where: {
          id: decodedToken.id,
        },
      });
      const isValid = await compare(refreshToken, user.refreshHash);
      if (!isValid) {
        throw new ForbiddenException('Credentials incorrect');
      }

      const accessToken = await this.getJwtAccessToke(
        decodedToken.id,
        decodedToken.login,
      );
      const newRefreshToken = await this.getJwtRefreshToken(
        decodedToken.id,
        decodedToken.login,
      );
      const refreshHash = await hash(newRefreshToken, this.salt);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          refreshHash,
        },
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
}
