import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Album } from './entities/album.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new album',
    description: 'Add new album information',
  })
  @ApiResponse({ status: 201, description: 'Album is created', type: Album })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [Album],
  })
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Gets single album by id',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Album ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: Album,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Album was not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Album ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The album has been updated.',
    type: Album,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Album was not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Album ID (UUID)',
  })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. albumId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Album was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.albumService.remove(id);
    return;
  }
}
