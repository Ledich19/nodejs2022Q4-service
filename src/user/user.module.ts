import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MyLogger } from 'src/logger/logger.service';

@Module({
  controllers: [UserController],
  providers: [UserService, MyLogger],
})
export class UserModule {}
