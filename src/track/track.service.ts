import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { trackDb } from 'src/data/db';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    const id = uuidv4();
    return trackDb.insert(id, {
      ...createTrackDto,
      id,
    });
  }

  findAll() {
    return trackDb.showAll();
  }

  findOne(id: string) {
    const track = trackDb.get(id);

    if (!track) {
      throw new NotFoundException('Track was not found.');
    }
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = trackDb.get(id);
    if (!track) {
      throw new NotFoundException('Track was not found.');
    }
    return trackDb.insert(id, { ...track, ...updateTrackDto });
  }

  remove(id: string) {
    const trackForDelete = trackDb.get(id);
    if (!trackForDelete) {
      throw new NotFoundException('Track was not found.');
    }
    return trackDb.delete(id);
  }
}
