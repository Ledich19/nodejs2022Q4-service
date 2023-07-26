import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { artistDb } from 'src/data/db';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  create(CreateArtistDto: CreateArtistDto) {
    const id = uuidv4();
    console.log('CreateArtistDto-2', CreateArtistDto);
    return artistDb.insert(id, {
      ...CreateArtistDto,
      id,
    });
  }

  findAll() {
    return artistDb.showAll();
  }

  findOne(id: string) {
    const user = artistDb.get(id);
    if (!user) {
      new NotFoundException('Artist not found');
    }
    return user;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = artistDb.get(id);
    if (!artist) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return artistDb.insert(id, { ...artist, ...updateArtistDto });
  }

  remove(id: string) {
    const deletedArtist = artistDb.get(id);
    if (!deletedArtist) {
      throw new NotFoundException('User not found');
    }
    return artistDb.delete(id);
  }
}
