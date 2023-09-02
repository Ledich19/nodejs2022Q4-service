import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { MyLogger } from 'src/logger/logger.service';

@Module({
  controllers: [TrackController],
  providers: [TrackService, MyLogger],
})
export class TrackModule {}
