import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { JwtStrategy } from 'src/strategies/jwt-strategy';
import { MyLogger } from 'src/logger/logger.service';
dotenv.config();

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MyLogger],
})
export class AuthModule {}
