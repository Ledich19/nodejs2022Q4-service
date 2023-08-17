import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import * as dotenv from 'dotenv';
import { PrismaService } from 'src/prisma/prisma.service';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: { sub: string; login: string }) {
    console.log('payload:::', { payload });
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // const isCompare = await compare(loginDto.password, user.passwordHash);
    // if (!isCompare) throw new ForbiddenException('Credentials incorrect');
    delete user.passwordHash;
    return user;
  }
  // async validate(username: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(username, password);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   return user;
  // }
}
