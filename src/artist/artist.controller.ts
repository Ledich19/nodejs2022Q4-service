import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Artist } from './entities/artist.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({ summary: 'Add new artist', description: 'Add new artist' })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [Artist],
  })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Artist ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const artist = this.artistService.findOne(id);
    return artist;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update artist information by UUID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Artist ID (UUID)',
  })
  @ApiResponse({
    status: 200,
    description: 'The artist has been updated.',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const userUpdated = this.artistService.update(id, updateArtistDto);
    return userUpdated;
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete artist',
    description: 'Delete artist from library',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Artist ID (UUID)',
  })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.artistService.remove(id);
    return;
  }
}
