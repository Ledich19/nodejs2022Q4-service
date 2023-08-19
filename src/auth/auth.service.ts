import {
  Injectable,
  ForbiddenException,
  UseInterceptors,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import * as dotenv from 'dotenv';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
import { RefreshDto } from './dto/refresh.dto';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { log } from 'console';
import { MyLogger } from 'src/logger/logger.service';
import { LoggingInterceptor } from 'src/logger/logger.interceptor';
dotenv.config();

@Injectable()
export class AuthService {
  salt = parseInt(process.env.CRYPT_SALT);
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService, // private usersService: UserService,
  ) {}

  async getJwtAccessToke(id: string, login: string): Promise<string> {
    const payload = { sub: id, login };
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    return token;
  }

  public async getJwtRefreshToken(id: string, login: string): Promise<string> {
    const payload = { sub: id, login };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
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

    return {
      accessToken: await this.getJwtAccessToke(user.id, user.login),
      refreshToken: await this.getJwtRefreshToken(user.id, user.login),
    };
  }
  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    try {
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      return {
        accessToken: await this.getJwtAccessToke(
          decodedToken.id,
          decodedToken.login,
        ),
        refreshToken: await this.getJwtRefreshToken(
          decodedToken.id,
          decodedToken.login,
        ),
      };
    } catch (error) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }
}
