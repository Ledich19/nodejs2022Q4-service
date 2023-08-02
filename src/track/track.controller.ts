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
} from '@nestjs/common';

import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Track } from './entities/track.entity';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [Track],
  })
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Album ID (UUID)',
  })
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Gets single track by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    const track = this.trackService.findOne(id);
    return track;
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Album ID (UUID)',
  })
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiResponse({
    status: 200,
    description: 'The track has been updated.',
    type: Track,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    description: 'Album ID (UUID)',
  })
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from library',
  })
  @ApiResponse({ status: 204, description: 'Deleted successfully' })
  @ApiResponse({
    status: 400,
    description: 'Bad request. trackId is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.trackService.remove(id);
    return;
  }
}
