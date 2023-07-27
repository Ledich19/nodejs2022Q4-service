import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { CreateFavDto } from './dto/create-fav.dto';
import { UpdateFavDto } from './dto/update-fav.dto';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    console.log('allll;;;;;;;;;', this.favsService.findAll());

    return this.favsService.findAll();
  }

  @Post('track/:id')
  createTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.create('tracks', id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    this.favsService.remove('tracks', id);
    return;
  }

  @Post('album/:id')
  createAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.create('albums', id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    this.favsService.remove('albums', id);
    return;
  }

  @Post('artist/:id')
  createArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.create('artists', id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    this.favsService.remove('artists', id);
    return;
  }
}
