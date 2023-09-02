import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MyLogger } from 'src/logger/logger.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, MyLogger],
})
export class AlbumModule {}
