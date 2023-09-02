import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { MyLogger } from 'src/logger/logger.service';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, MyLogger],
})
export class ArtistModule {}
