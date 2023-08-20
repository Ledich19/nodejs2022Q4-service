import { Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { MyLogger } from 'src/logger/logger.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService, MyLogger],
})
export class FavsModule {}
