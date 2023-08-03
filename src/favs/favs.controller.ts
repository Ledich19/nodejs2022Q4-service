import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Fav } from './entities/fav.entity';

@ApiTags('Favs')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Gets all favorites movies, tracks and books',
  })
  @ApiResponse({ status: 200, description: 'Successful operation', type: Fav })
  async findAll() {
    return await this.favsService.findAll();
  }

  @Post('track/:id')
  @ApiOperation({ summary: 'Add track to the favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({ status: 422, description: "Track with id doesn't exist." })
  async createTrack(@Param('id', ParseUUIDPipe) id: string) {
    return await this.favsService.create('tracks', id);
  }

  @Delete('track/:id')
  @ApiOperation({ summary: 'Delete track from favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({ status: 400, description: 'TrackId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    await this.favsService.remove('tracks', id);
    return;
  }

  @Post('album/:id')
  @ApiOperation({ summary: 'Add album to the favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({ status: 422, description: "Album with id doesn't exist." })
  async createAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return await this.favsService.create('albums', id);
  }

  @Delete('album/:id')
  @ApiOperation({ summary: 'Delete album from favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({ status: 400, description: 'AlbumId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Album was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    await this.favsService.remove('albums', id);
    return;
  }

  @Post('artist/:id')
  @ApiOperation({ summary: 'Add artist to the favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Added successfully' })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({ status: 422, description: "Artist with id doesn't exist." })
  async createArtist(@Param('id', ParseUUIDPipe) id: string) {
    return await this.favsService.create('artists', id);
  }

  @Delete('artist/:id')
  @ApiOperation({ summary: 'Delete artist from favorites' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({ status: 400, description: 'ArtistId is invalid (not uuid)' })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    await this.favsService.remove('artists', id);
    return;
  }
}
