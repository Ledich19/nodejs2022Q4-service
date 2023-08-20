import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.jwrAccess'),
    });
  }
  async validate(payload: { sub: string; login: string }) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    delete user.passwordHash;
    return user;
  }
}
